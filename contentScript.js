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
    const title = (document.querySelector('h1, [data-qa="PostingTitle"]')?.textContent || document.title).trim();
    const company = (
    document.querySelector('[data-company], [itemprop="hiringOrganization"], .company, [data-qa="CompanyName"]')?.textContent || ''
    ).trim();
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