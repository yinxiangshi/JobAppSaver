(function () {
    const detectors = [
    () => /lever\.co\//.test(location.hostname) || document.querySelector('[data-lever-client]'),
    () => /greenhouse\.io|boards\.greenhouse\.io/.test(location.hostname) || document.querySelector('[data-mapped]'),
    () => /workday\./.test(location.hostname) || document.querySelector('div[wd-controller]'),
    () => /ashbyhq\.com/.test(location.hostname),
    () => /myworkdayjobs\.com/.test(location.hostname),
    ];
    
    
    const isJobPage = detectors.some(fn => {
    try { return !!fn(); } catch (_) { return false; }
    });
    
    
    if (!isJobPage) return;
    
    
    const btn = document.createElement('button');
    btn.textContent = 'Save to Job Tracker';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px', right: '20px',
        zIndex: 2147483647,
        padding: '10px 14px',
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: '#3b82f6',
        color: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    });
    btn.addEventListener('click', () => {
    const payload = collectInfoFromDOM();
    chrome.runtime.sendMessage({ type: 'SAVE_JOB_FROM_CONTENT', payload });
    });
    document.documentElement.appendChild(btn);
    
    
    function collectInfoFromDOM() {
        function findCompanyName() {
            const strategies = [
                () => {
                    const selectors = [
                        '[data-company]',
                        '[itemprop="hiringOrganization"]',
                        '.company',
                        '[data-qa="CompanyName"]',
                        '.company-name',
                        '.employer-name',
                        '.hiring-company',
                        '.jobs-company',
                        '.posting-company'
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

        const title = (document.querySelector('h1, [data-qa="PostingTitle"]')?.textContent || document.title).trim();
        const company = findCompanyName() || '';
        const location = (
            document.querySelector('[data-location], .location, [itemprop="jobLocation"], [data-qa="LocationSection"]')?.textContent || ''
        ).trim();
        
        return {
            id: crypto.randomUUID(),
            title,
            company,
            location,
            sourceUrl: location.href,
            status: 'applied',
            dateApplied: new Date().toISOString().slice(0,10),
            notes: ''
        };
    }
    })();