(() => {
  const STORAGE_KEY = 'ipm-swiss-assessment-v1';
  const STATUS = ['Not assessed','Not applicable','Applicable','In progress','Implemented','Verified'];
  const WEIGHT = {'Not assessed':0,'Not applicable':null,'Applicable':0.2,'In progress':0.45,'Implemented':0.8,'Verified':1};
  let catalogue = { layers: [], templates: [] };
  let state = {
    project: { name:'', phase:'Strategy', assetType:'Building', owner:'' },
    layers: {}
  };

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#039;');

  function defaultLayerState() {
    return { status:'Not assessed', responsible:'', evidence:'', updated:'' };
  }

  function normaliseState(input) {
    const next = {
      project: {
        name: input?.project?.name || '',
        phase: input?.project?.phase || 'Strategy',
        assetType: input?.project?.assetType || 'Building',
        owner: input?.project?.owner || ''
      },
      layers: {}
    };
    catalogue.layers.forEach(layer => {
      const saved = input?.layers?.[layer.id] || {};
      next.layers[layer.id] = {
        status: STATUS.includes(saved.status) ? saved.status : 'Not assessed',
        responsible: String(saved.responsible || ''),
        evidence: String(saved.evidence || ''),
        updated: String(saved.updated || '')
      };
    });
    return next;
  }

  function loadState() {
    try { state = normaliseState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch { state = normaliseState({}); }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateScore();
  }

  function bindProjectFields() {
    const fields = [
      ['projectName','name'],
      ['projectPhase','phase'],
      ['assetType','assetType'],
      ['assessmentOwner','owner']
    ];
    fields.forEach(([id,key]) => {
      const input = $(id);
      input.value = state.project[key];
      input.addEventListener('input', () => {
        state.project[key] = input.value;
        saveState();
      });
      input.addEventListener('change', () => {
        state.project[key] = input.value;
        saveState();
      });
    });
  }

  function sourceLink(layer) {
    const external = /^https?:/.test(layer.source);
    return `<a class="source-link" href="${esc(layer.source)}"${external ? ' target="_blank" rel="noreferrer"' : ''}>Open source <span aria-hidden="true">↗</span></a>`;
  }

  function renderRows() {
    const category = $('categoryFilter').value;
    const status = $('statusFilter').value;
    const rows = catalogue.layers
      .filter(layer => !category || layer.category === category)
      .filter(layer => !status || state.layers[layer.id].status === status)
      .map(layer => {
        const item = state.layers[layer.id];
        return `<tr data-layer="${esc(layer.id)}">
          <td><strong class="layer-title">${esc(layer.title)}</strong><span class="layer-category">${esc(layer.category)}</span></td>
          <td><span class="access-badge">${esc(layer.access)}</span></td>
          <td><select data-field="status" aria-label="Status for ${esc(layer.title)}">${STATUS.map(value => `<option${value === item.status ? ' selected' : ''}>${esc(value)}</option>`).join('')}</select></td>
          <td><input data-field="responsible" type="text" value="${esc(item.responsible)}" placeholder="Role or person" aria-label="Responsible for ${esc(layer.title)}"></td>
          <td><input class="evidence-input" data-field="evidence" type="text" value="${esc(item.evidence)}" placeholder="Evidence, decision or next action" aria-label="Evidence for ${esc(layer.title)}"></td>
          <td>${sourceLink(layer)}</td>
        </tr>`;
      }).join('');
    $('assessmentRows').innerHTML = rows || '<tr><td colspan="6" class="empty-state">No layers match the selected filters.</td></tr>';

    $('assessmentRows').querySelectorAll('[data-layer]').forEach(row => {
      const id = row.dataset.layer;
      row.querySelectorAll('[data-field]').forEach(input => {
        const commit = () => {
          state.layers[id][input.dataset.field] = input.value;
          state.layers[id].updated = new Date().toISOString();
          saveState();
        };
        input.addEventListener('change', commit);
        if (input.tagName === 'INPUT') input.addEventListener('input', commit);
      });
    });
  }

  function updateScore() {
    const active = catalogue.layers
      .map(layer => state.layers[layer.id])
      .filter(item => item && item.status !== 'Not assessed' && item.status !== 'Not applicable');
    const score = active.length
      ? Math.round(active.reduce((sum,item) => sum + (WEIGHT[item.status] || 0), 0) / active.length * 100)
      : 0;
    const verified = active.filter(item => item.status === 'Verified').length;
    const open = active.filter(item => !['Implemented','Verified'].includes(item.status)).length;
    $('readinessScore').textContent = `${score}%`;
    $('scoreBar').style.width = `${score}%`;
    $('applicableCount').textContent = active.length;
    $('verifiedCount').textContent = verified;
    $('openCount').textContent = open;
    $('scoreSummary').textContent = active.length
      ? score >= 80 ? 'Implementation is substantially defined. Focus on remaining evidence and acceptance.'
      : score >= 50 ? 'The project has a working baseline, but several layers still need implementation or verification.'
      : 'The relevant stack is identified. Convert applicable layers into owned actions and evidence.'
      : 'Assess the relevant layers to create a project baseline.';
  }

  function renderCatalogue() {
    $('catalogueGrid').innerHTML = catalogue.layers.map(layer => `
      <article class="catalogue-card">
        <header><span class="standards-label">${esc(layer.category)}</span><span class="access-badge">${esc(layer.access)}</span></header>
        <h3>${esc(layer.title)}</h3>
        <p>${esc(layer.short)}</p>
        <p class="publisher">${esc(layer.publisher)}</p>
        <ul>${layer.outputs.slice(0,3).map(output => `<li>${esc(output)}</li>`).join('')}</ul>
        <footer><span class="layer-category">${esc(layer.supports.slice(0,3).join(' · '))}</span>${sourceLink(layer)}</footer>
      </article>`).join('');
  }

  function populateFiltersAndTemplates() {
    [...new Set(catalogue.layers.map(layer => layer.category))].sort()
      .forEach(category => $('categoryFilter').insertAdjacentHTML('beforeend', `<option>${esc(category)}</option>`));
    catalogue.templates.forEach(template => {
      $('templateSelect').insertAdjacentHTML('beforeend', `<option value="${esc(template.id)}">${esc(template.title)}</option>`);
    });
    $('categoryFilter').addEventListener('change', renderRows);
    $('statusFilter').addEventListener('change', renderRows);
  }

  function applyTemplate() {
    const template = catalogue.templates.find(item => item.id === $('templateSelect').value);
    if (!template) return;
    catalogue.layers.forEach(layer => {
      state.layers[layer.id] = defaultLayerState();
      state.layers[layer.id].status = template.layers.includes(layer.id) ? 'Applicable' : 'Not applicable';
      state.layers[layer.id].updated = new Date().toISOString();
    });
    saveState();
    renderRows();
    $('scoreSummary').textContent = template.description;
  }

  function exportAssessment() {
    const payload = {
      meta: {
        type: 'ipm-swiss-assessment',
        version: catalogue.meta.version,
        exported: new Date().toISOString(),
        notice: catalogue.meta.notice
      },
      ...state
    };
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (state.project.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    link.href = url;
    link.download = `ipm-${safeName || 'project'}-assessment.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importAssessment(file) {
    try {
      const parsed = JSON.parse(await file.text());
      state = normaliseState(parsed);
      saveState();
      bindProjectValues();
      renderRows();
    } catch (error) {
      alert(`The assessment could not be imported: ${error instanceof Error ? error.message : 'invalid JSON'}`);
    }
  }

  function bindProjectValues() {
    $('projectName').value = state.project.name;
    $('projectPhase').value = state.project.phase;
    $('assetType').value = state.project.assetType;
    $('assessmentOwner').value = state.project.owner;
  }

  function resetAssessment() {
    if (!confirm('Reset the complete local project assessment?')) return;
    state = normaliseState({});
    saveState();
    bindProjectValues();
    renderRows();
  }

  async function init() {
    try {
      const response = await fetch('./catalog.json', {cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      catalogue = await response.json();
      loadState();
      bindProjectFields();
      populateFiltersAndTemplates();
      renderRows();
      renderCatalogue();
      updateScore();
      $('applyTemplate').addEventListener('click', applyTemplate);
      $('exportAssessment').addEventListener('click', exportAssessment);
      $('resetAssessment').addEventListener('click', resetAssessment);
      $('importFile').addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) importAssessment(file);
        event.target.value = '';
      });
    } catch (error) {
      console.error(error);
      $('assessmentRows').innerHTML = `<tr><td colspan="6" class="empty-state">Standards catalogue unavailable: ${esc(error instanceof Error ? error.message : '')}</td></tr>`;
    }
  }

  init();
})();
