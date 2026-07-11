(() => {
  const MOBILE = window.matchMedia('(max-width:620px)');
  let configured = false;

  function configureGraph() {
    if (typeof graph === 'undefined' || !graph) return false;

    // Run most of the force simulation before the first visible frame and
    // stop reheating quickly afterwards. This removes the long connector
    // swinging phase without making the graph completely static.
    if (typeof graph.warmupTicks === 'function') graph.warmupTicks(MOBILE.matches ? 110 : 150);
    if (typeof graph.cooldownTicks === 'function') graph.cooldownTicks(MOBILE.matches ? 35 : 50);
    if (typeof graph.cooldownTime === 'function') graph.cooldownTime(MOBILE.matches ? 700 : 950);

    const charge = graph.d3Force?.('charge');
    if (charge?.strength) charge.strength(MOBILE.matches ? -95 : -120);

    const link = graph.d3Force?.('link');
    if (link?.iterations) link.iterations(MOBILE.matches ? 2 : 3);

    configured = true;
    return true;
  }

  function settleAndFit() {
    if (!configureGraph()) return;
    window.setTimeout(() => {
      graph.zoomToFit?.(450, 95);
    }, MOBILE.matches ? 180 : 250);
  }

  function start() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (configureGraph() || attempts > 40) window.clearInterval(timer);
    }, 100);

    const mode = document.getElementById('graphMode');
    mode?.addEventListener('change', () => {
      configured = false;
      window.setTimeout(settleAndFit, 30);
    });

    document.querySelectorAll('.scenario').forEach(button => {
      button.addEventListener('click', () => window.setTimeout(settleAndFit, 30));
    });

    document.getElementById('resetFilter')?.addEventListener('click', () => {
      window.setTimeout(settleAndFit, 30);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
