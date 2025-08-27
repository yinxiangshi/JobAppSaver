async function saveCurrent() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    
    try {
        const response = await chrome.runtime.sendMessage({ type: 'REQUEST_SAVE_ACTIVE_TAB' });
        if (response && response.ok) {
            document.querySelector('#saveCurrent').textContent = 'Saved!';
            setTimeout(() => {
                document.querySelector('#saveCurrent').textContent = 'Save Current Page';
            }, 2000);
        }
    } catch (error) {
        console.error('Failed to save job:', error);
        document.querySelector('#saveCurrent').textContent = 'Error!';
        setTimeout(() => {
            document.querySelector('#saveCurrent').textContent = 'Save Current Page';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveCurrent').addEventListener('click', saveCurrent);
});
