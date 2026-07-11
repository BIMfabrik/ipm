(() => {
  const MOBILE_BREAKPOINT = 620;

  function navOffset() {
    const nav = document.querySelector('.nav');
    return (nav?.getBoundingClientRect().height || 64) + 12;
  }

  function graphTarget() {
    const section = document.getElementById('graph');
    if (!section) return null;
    if (window.matchMedia(`(max-width:${MOBILE_BREAKPOINT}px)`).matches) {
      return section.querySelector('.graph-shell') || section;
    }
    return section;
  }

  function scrollToGraph({ updateHash = true, smooth = true } = {}) {
    const target = graphTarget();
    if (!target) return;

    const top = window.scrollY + target.getBoundingClientRect().top - navOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });

    if (updateHash && location.hash !== '#graph') {
      history.pushState(null, '', '#graph');
    }

    // The WebGL canvas may have been sized before reaching its final mobile layout.
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      document.getElementById('fitGraph')?.click();
    }, smooth ? 550 : 80);
  }

  function bindGraphLinks() {
    document.querySelectorAll('a[href="#graph"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        scrollToGraph();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const graphSection = document.getElementById('graph');
    if (graphSection) graphSection.style.scrollMarginTop = `${navOffset()}px`;

    bindGraphLinks();

    // Browsers may restore the hash before fonts, cards and the graph obtain their final height.
    if (location.hash === '#graph') {
      requestAnimationFrame(() => window.setTimeout(() => scrollToGraph({ updateHash: false, smooth: false }), 120));
    }
  });

  window.addEventListener('hashchange', () => {
    if (location.hash === '#graph') scrollToGraph({ updateHash: false });
  });
})();
