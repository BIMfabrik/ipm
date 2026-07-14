(() => {
  const MODEL_URL = './information-acceptance.bpmn';
  const mainPath = [
    'StartEvent_1', 'Task_DefineRequirement', 'Flow_1',
    'Task_ConfigureUseCase', 'Flow_2', 'Task_AssignProcess', 'Flow_3',
    'Task_ExecuteProcess', 'Flow_4', 'Task_ProduceEvidence', 'Flow_5',
    'Task_ReviewEvidence', 'Flow_6', 'Gateway_Accepted', 'Flow_7',
    'Flow_8', 'Task_RecordAcceptance', 'Flow_11', 'EndEvent_1'
  ];
  const reworkPath = ['Task_CorrectDelivery', 'Flow_9', 'Flow_10'];
  let viewer;
  let xml = '';

  const $ = id => document.getElementById(id);
  const setStatus = (message, state = '') => {
    const node = $('bpmnStatus');
    if (!node) return;
    node.textContent = message;
    node.dataset.state = state;
  };

  function readableType(type = '') {
    return type.replace('bpmn:', '').replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  function showDetails(element) {
    const target = element?.labelTarget || element;
    const businessObject = target?.businessObject;
    if (!businessObject) return;
    const title = businessObject.name || readableType(businessObject.$type);
    const documentation = businessObject.documentation?.[0]?.text
      || 'This BPMN element structures the project information-delivery and acceptance process.';
    $('bpmnSelectionType').textContent = readableType(businessObject.$type);
    $('bpmnSelectionTitle').textContent = title;
    $('bpmnSelectionDescription').textContent = documentation;
    $('bpmnSelectionId').textContent = businessObject.id || '—';
  }

  function download(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function downloadSvg() {
    if (!viewer) return;
    try {
      const result = await viewer.saveSVG({ format: true });
      download(result.svg, 'ipm-requirement-to-acceptance.svg', 'image/svg+xml');
    } catch (error) {
      console.error(error);
      setStatus('SVG export failed.', 'error');
    }
  }

  function bindControls() {
    const canvas = () => viewer?.get('canvas');
    $('bpmnFit').addEventListener('click', () => canvas()?.zoom('fit-viewport'));
    $('bpmnZoomIn').addEventListener('click', () => {
      const service = canvas();
      if (service) service.zoom(Math.min(4, service.zoom() * 1.2));
    });
    $('bpmnZoomOut').addEventListener('click', () => {
      const service = canvas();
      if (service) service.zoom(Math.max(0.2, service.zoom() / 1.2));
    });
    $('bpmnDownload').addEventListener('click', () => {
      if (xml) download(xml, 'ipm-requirement-to-acceptance.bpmn', 'application/xml');
    });
    $('bpmnDownloadSvg').addEventListener('click', downloadSvg);
  }

  async function init() {
    const canvasHost = $('bpmnCanvas');
    if (!canvasHost) return;
    bindControls();

    try {
      setStatus('Loading BPMN 2.0 process…');
      const response = await fetch(MODEL_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      xml = await response.text();

      if (typeof window.BpmnJS !== 'function') {
        setStatus('Interactive viewer unavailable · BPMN download remains available', 'error');
        canvasHost.innerHTML = '<div class="bpmn-error"><strong>Interactive viewer unavailable</strong><span>The portable BPMN 2.0 process can still be downloaded from the toolbar.</span></div>';
        return;
      }

      viewer = new window.BpmnJS({ container: canvasHost });
      const result = await viewer.importXML(xml);
      viewer.get('canvas').zoom('fit-viewport');

      const canvas = viewer.get('canvas');
      mainPath.forEach(id => canvas.addMarker(id, 'ipm-bpmn-main-path'));
      reworkPath.forEach(id => canvas.addMarker(id, 'ipm-bpmn-rework'));

      viewer.on('element.click', event => showDetails(event.element));
      const registry = viewer.get('elementRegistry');
      showDetails(registry.get('Task_DefineRequirement'));

      if (result.warnings?.length) {
        console.warn('BPMN import warnings', result.warnings);
        setStatus(`Process loaded with ${result.warnings.length} warning${result.warnings.length === 1 ? '' : 's'}.`, 'warning');
      } else {
        setStatus('BPMN 2.0 process loaded · Select any element for details', 'ready');
      }
    } catch (error) {
      console.error(error);
      setStatus('The BPMN process could not be loaded.', 'error');
      canvasHost.innerHTML = `<div class="bpmn-error"><strong>Diagram unavailable</strong><span>${String(error.message || error)}</span></div>`;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
