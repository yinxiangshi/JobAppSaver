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

chrome.commands.onCommand.addListener(async (command) => {
    if (command === "save_job_shortcut") {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;
        const pageInfo = await extractPageInfo(tab.id);
        await saveJob(pageInfo);
        notify(`Saved: ${pageInfo.title || 'Untitled role'}`);
    }
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
                const meta = {
                    title: document.querySelector('meta[property="og:title"], meta[name="title"]')?.content || document.title,
                    url: location.href,
                    company: document.querySelector('[data-company], [itemprop="hiringOrganization"], .company, .jobs-company, .posting-company')?.textContent?.trim() || '',
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