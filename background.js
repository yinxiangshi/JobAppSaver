const CTX_ID = "job-tracker-save";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CTX_ID,
        title: "Save job to tracker",
        contexts: ["page", "selection", "link"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== CTX_ID || !tab || !tab.id) return;
    const pageInfo = await extractPageInfo(tab.id);
    await saveJob(pageInfo);
    notify(`Saved: ${pageInfo.title || 'Untitled role'}`);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'SAVE_JOB_FROM_CONTENT') {
        saveJob(msg.payload).then(() => {
            notify(`Saved: ${msg.payload.title || 'Untitled role'}`);
            sendResponse({ ok: true });
        });
        return true; // async
    }
    if (msg && msg.type === 'REQUEST_SAVE_ACTIVE_TAB') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]) {
                const pageInfo = await extractPageInfo(tabs[0].id);
                await saveJob(pageInfo);
                notify(`Saved: ${pageInfo.title || 'Untitled role'}`);
            }
        });
        sendResponse({ ok: true });
        return true;
    }
    if (msg && msg.type === 'EXTRACT_AND_SAVE') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]) {
                const pageInfo = await extractPageInfo(tabs[0].id);
                await saveJob(pageInfo);
                sendResponse({ ok: true, job: pageInfo });
            }
        });
        return true;
    }
    if (msg && msg.type === 'GET_JOBS') {
        chrome.storage.local.get({ jobs: [] }, (data) => {
            sendResponse({ jobs: data.jobs });
        });
        return true;
    }
    if (msg && msg.type === 'UPSERT_JOB') {
        upsertJob(msg.payload).then(() => sendResponse({ ok: true }));
        return true;
    }
    if (msg && msg.type === 'DELETE_JOB') {
        deleteJob(msg.id).then(() => sendResponse({ ok: true }));
        return true;
    }
});

async function extractPageInfo(tabId) {
    try {
        const [{ result } = {}] = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                function findCompanyName() {
                    const strategies = [
                        () => {
                            const selectors = [
                                '[data-company]',
                                '[itemprop="hiringOrganization"]',
                                '.company',
                                '.jobs-company',
                                '.posting-company',
                                '[data-testid="company-name"]',
                                '[data-qa="CompanyName"]',
                                '.company-name',
                                '.employer-name',
                                '.hiring-company'
                            ];
                            
                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element && element.textContent?.trim()) {
                                    return element.textContent.trim();
                                }
                            }
                            return null;
                        },
                        
                        () => {
                            const title = document.title;
                            const patterns = [
                                /at\s+([^|]+?)(?:\s*[-|]|\s*$)/i,
                                /^([^|]+?)\s*[-|]\s*/i,
                                /^([^|]+?)\s*:\s*/i
                            ];
                            
                            for (const pattern of patterns) {
                                const match = title.match(pattern);
                                if (match && match[1] && match[1].length > 2) {
                                    const company = match[1].trim();
                                    if (!/job|career|position|apply|hiring/i.test(company)) {
                                        return company;
                                    }
                                }
                            }
                            return null;
                        },
                        
                        () => {
                            const hostname = location.hostname;
                            const urlPatterns = [
                                /^([^.]+)\.(?:jobs|careers|workday|greenhouse|lever)\./i,
                                /^([^.]+)\.(?:com|org|net)\./i
                            ];
                            
                            for (const pattern of urlPatterns) {
                                const match = hostname.match(pattern);
                                if (match && match[1] && match[1].length > 2) {
                                    const company = match[1].replace(/[-_]/g, ' ').trim();
                                    if (!/www|jobs|careers|workday|greenhouse|lever/i.test(company)) {
                                        return company.charAt(0).toUpperCase() + company.slice(1);
                                    }
                                }
                            }
                            return null;
                        },

                        () => {
                            const metaSelectors = [
                                'meta[property="og:site_name"]',
                                'meta[name="application-name"]',
                                'meta[name="author"]',
                                'meta[property="og:author"]'
                            ];
                            
                            for (const selector of metaSelectors) {
                                const element = document.querySelector(selector);
                                if (element?.content && element.content.trim()) {
                                    const content = element.content.trim();
                                    if (content.length > 2 && !/job|career|position/i.test(content)) {
                                        return content;
                                    }
                                }
                            }
                            return null;
                        },

                        () => {
                            const breadcrumbSelectors = [
                                '.breadcrumb',
                                '.breadcrumbs',
                                '.nav',
                                '.navigation',
                                '[role="navigation"]'
                            ];
                            
                            for (const selector of breadcrumbSelectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const text = element.textContent;

                                    const companyMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
                                    if (companyMatch && companyMatch[1] && companyMatch[1].length > 3) {
                                        return companyMatch[1].trim();
                                    }
                                }
                            }
                            return null;
                        },
                        
                        () => {
                            const logoSelectors = [
                                'img[alt*="logo"]',
                                'img[alt*="company"]',
                                'img[alt*="brand"]',
                                '.logo img',
                                '.company-logo img',
                                '.brand img'
                            ];
                            
                            for (const selector of logoSelectors) {
                                const img = document.querySelector(selector);
                                if (img && img.alt) {
                                    const altText = img.alt.trim();
                                    const companyMatch = altText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
                                    if (companyMatch && companyMatch[1] && companyMatch[1].length > 3) {
                                        return companyMatch[1].trim();
                                    }
                                }
                            }
                            return null;
                        },
                        
                        () => {
                            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                            for (const script of scripts) {
                                try {
                                    const data = JSON.parse(script.textContent);
                                    if (data.hiringOrganization && data.hiringOrganization.name) {
                                        return data.hiringOrganization.name.trim();
                                    }
                                    if (data.organization && data.organization.name) {
                                        return data.organization.name.trim();
                                    }
                                    if (data.employerName) {
                                        return data.employerName.trim();
                                    }
                                } catch (e) {
                                    continue;
                                }
                            }
                            return null;
                        },
                        
                        () => {
                            const ogSiteName = document.querySelector('meta[property="og:site_name"]');
                            if (ogSiteName?.content) {
                                const content = ogSiteName.content.trim();
                                if (content.length > 2 && !/job|career|position|apply|hiring/i.test(content)) {
                                    return content;
                                }
                            }
                            return null;
                        }
                    ];
                    
                    for (const strategy of strategies) {
                        try {
                            const company = strategy();
                            if (company && company.length > 2 && company.length < 100) {
                                return company;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    return null;
                }
                
                const meta = {
                    title: document.querySelector('meta[property="og:title"], meta[name="title"]')?.content || document.title,
                    url: location.href,
                    company: findCompanyName() || '',
                    role: document.querySelector('h1, .posting-headline, .job-title, [data-testid="job-title"]')?.textContent?.trim() || '',
                    location: document.querySelector('[data-location], .location, [itemprop="jobLocation"]')?.textContent?.trim() || '',
                    pageAppliedDate: (() => {
                        const t = Array.from(document.querySelectorAll('*')).map(el => el.textContent).join(' ');
                        const match = t.match(/(applied|submitted)\s+on\s+([A-Za-z]{3,9}\s\d{1,2},\s\d{4}|\d{4}-\d{2}-\d{2})/i);
                        return match ? match[2] : null;
                    })()
                };
                return meta;
            }
        });
        
        if (result) {
            return {
                id: crypto.randomUUID(),
                title: result.role || result.title || 'Untitled Position',
                company: result.company || 'Unknown Company',
                location: result.location || 'Unknown Location',
                sourceUrl: result.url,
                status: 'applied',
                dateApplied: result.pageAppliedDate || new Date().toISOString().slice(0, 10),
                notes: ''
            };
        }
    } catch (error) {
        console.error('Failed to extract page info:', error);
    }
    
    const tab = await chrome.tabs.get(tabId);
    return {
        id: crypto.randomUUID(),
        title: tab.title || 'Untitled Position',
        company: 'Unknown Company',
        location: 'Unknown Location',
        sourceUrl: tab.url,
        status: 'applied',
        dateApplied: new Date().toISOString().slice(0, 10),
        notes: ''
    };
}

async function saveJob(jobData) {
    const data = await chrome.storage.local.get({ jobs: [] });
    const jobs = data.jobs;
    
    const existingIndex = jobs.findIndex(job => job.sourceUrl === jobData.sourceUrl);
    
    if (existingIndex !== -1) {
        jobs[existingIndex] = { ...jobs[existingIndex], ...jobData };
    } else {
        jobs.push(jobData);
    }
    
    await chrome.storage.local.set({ jobs });
    return jobData;
}

async function upsertJob(jobData) {
    const data = await chrome.storage.local.get({ jobs: [] });
    const jobs = data.jobs;
    const idx = jobs.findIndex(j => j.id === jobData.id);
    
    if (idx === -1) {
        jobs.push(jobData);
    } else {
        jobs[idx] = jobData;
    }
    
    await chrome.storage.local.set({ jobs });
    return jobData;
}

async function deleteJob(id) {
    const data = await chrome.storage.local.get({ jobs: [] });
    const jobs = data.jobs.filter(j => j.id !== id);
    await chrome.storage.local.set({ jobs });
}

function notify(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Job Tracker',
        message: message
    });
}