let jobs = [];

function fmtDate(d) { 
    if (!d) return '';
    return new Date(d).toLocaleDateString();
}

async function loadJobs() {
    const data = await chrome.storage.local.get({ jobs: [] });
    jobs = data.jobs;
    return jobs;
}

function renderRows(jobsToRender) {
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = '';
    
    for (const j of jobsToRender) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="date" value="${j.dateApplied || ''}" data-id="${j.id}" data-field="dateApplied"/></td>
            <td><input value="${escapeHtml(j.title)}" data-id="${j.id}" data-field="title"/></td>
            <td><input value="${escapeHtml(j.company)}" data-id="${j.id}" data-field="company"/></td>
            <td><input value="${escapeHtml(j.location)}" data-id="${j.id}" data-field="location"/></td>
            <td>
                <select data-id="${j.id}" data-field="status" value="${j.status}">
                    ${["applied","interview","offer","rejected"].map(s => `<option ${s===j.status?'selected':''}>${s}</option>`).join('')}
                </select>
            </td>
            <td><a href="${j.sourceUrl}" target="_blank">Open</a></td>
            <td><input value="${escapeHtml(j.notes || '')}" data-id="${j.id}" data-field="notes"/></td>
            <td><button data-id="${j.id}" class="delete">🗑️</button></td>
        `;
        tbody.appendChild(tr);
    }
}

function escapeHtml(s=''){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

async function upsertField(id, field, value){
    const data = await chrome.storage.local.get({ jobs: [] });
    const jobs = data.jobs;
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) return;
    jobs[idx][field] = value;
    await chrome.storage.local.set({ jobs });
}

async function del(id){
    const data = await chrome.storage.local.get({ jobs: [] });
    const jobs = data.jobs.filter(j => j.id !== id);
    await chrome.storage.local.set({ jobs });
    await loadJobs();
    renderRows(jobs);
}

function toCsv(jobs){
    const cols = ['dateApplied','title','company','location','status','sourceUrl','notes'];
    const header = cols.join(',');
    const rows = jobs.map(j => cols.map(c => `"${(j[c]||'').toString().replace(/"/g,'""')}"`).join(','));
    return [header, ...rows].join('\n');
}

function download(filename, text){
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = filename; 
    a.click();
    URL.revokeObjectURL(url);
}

async function init(){
    await loadJobs();
    renderRows(jobs);

    document.querySelector('#table').addEventListener('change', async (e) => {
        const t = e.target;
        const id = t.getAttribute('data-id');
        const field = t.getAttribute('data-field');
        if (!id || !field) return;
        await upsertField(id, field, t.value);
    });

    document.querySelector('#table').addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete')){
            await del(e.target.getAttribute('data-id'));
        }
    });

    document.getElementById('exportCsv').addEventListener('click', async () => {
        const data = await loadJobs();
        download('jobs.csv', toCsv(data));
    });
    
    document.getElementById('exportJson').addEventListener('click', async () => {
        const data = await loadJobs();
        download('jobs.json', JSON.stringify(data, null, 2));
    });

    const search = document.getElementById('search');
    const statusFilter = document.getElementById('statusFilter');
    
    function applyFilter(){
        const q = search.value.toLowerCase();
        const s = statusFilter.value;
        const filtered = jobs.filter(j => (
            (!s || j.status === s) &&
            (j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q))
        ));
        renderRows(filtered);
    }
    
    search.addEventListener('input', applyFilter);
    statusFilter.addEventListener('change', applyFilter);
}

init();