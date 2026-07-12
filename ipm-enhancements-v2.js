(() => {
  const MOBILE_BREAKPOINT = 620;
  let galaxyStars = null;

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
    if (updateHash && location.hash !== '#graph') history.pushState(null, '', '#graph');
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

  function injectPortalNavigation() {
    const actions = document.querySelector('.nav-actions');
    if (actions && !document.getElementById('knowledgeNav')) {
      const knowledge = document.createElement('a');
      knowledge.id = 'knowledgeNav';
      knowledge.className = 'pill';
      knowledge.href = './knowledge/';
      knowledge.textContent = 'Knowledge';

      const tables = document.createElement('a');
      tables.id = 'tablesNav';
      tables.className = 'pill';
      tables.href = './tables/';
      tables.textContent = 'Smart tables';

      actions.insertBefore(knowledge, actions.firstChild);
      actions.insertBefore(tables, knowledge.nextSibling);
    }

    const graphSection = document.getElementById('graph');
    if (!graphSection || document.getElementById('knowledgeSeries')) return;

    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'knowledgeSeries';
    section.innerHTML = `
      <div class="section-head">
        <div><span class="eyebrow">8-part insight series</span><h2>From requirements to operational value.</h2></div>
        <p>Eight focused articles designed for LinkedIn discussion and deeper exploration on this site.</p>
      </div>
      <div class="cards insight-cards">
        ${[
          ['01','Why static requirements fail','static-requirements-fail'],
          ['02','What should the Bauherr order?','what-should-the-owner-order'],
          ['03','Why start with use cases?','why-start-with-use-cases'],
          ['04','How does this connect to IDS?','how-this-connects-to-ids'],
          ['05','Who is responsible?','who-is-responsible'],
          ['06','What skills are missing?','what-skills-are-missing'],
          ['07','How does FM benefit?','how-fm-benefits'],
          ['08','What is the full vision?','the-full-vision']
        ].map(([n,t,s]) => `<a class="card insight-card" href="./knowledge/${s}/"><span class="num">${n}</span><h3>${t}</h3><p>Open article →</p></a>`).join('')}
      </div>`;
    graphSection.insertAdjacentElement('afterend', section);

    const style = document.createElement('style');
    style.textContent = `
      .insight-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .insight-card{display:grid;min-width:0;min-height:128px;grid-template-rows:auto 1fr auto;gap:8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);padding:16px;transition:background-color .12s ease,border-color .12s ease}
      .insight-card .num{color:var(--muted-foreground);font-size:12px;font-weight:600;letter-spacing:.06em}
      .insight-card h3{margin:0;font-size:16px;line-height:1.3;overflow-wrap:anywhere}
      .insight-card p{margin:0;color:var(--muted-foreground);font-size:13px}
      .insight-card:hover{transform:none;border-color:var(--ring);background:var(--surface-subtle);box-shadow:none}
      .insight-card:focus-visible{outline:2px solid var(--ring);outline-offset:2px}
      .galaxy-badge{position:absolute;right:16px;bottom:16px;z-index:6;border:1px solid var(--border);border-radius:var(--radius);padding:8px 11px;background:var(--surface-elevated);font-size:.76rem;color:var(--foreground);display:none}
      body.galaxy-active .galaxy-badge{display:block}
      body.galaxy-active .graph-shell{box-shadow:none}
      @media(max-width:760px){#knowledgeNav,#tablesNav{display:none}.insight-cards{grid-template-columns:1fr;gap:8px}.insight-card{min-height:0;padding:14px}}
    `;
    document.head.appendChild(style);

    const wrap = graphSection.querySelector('.graph-wrap');
    if (wrap) wrap.insertAdjacentHTML('beforeend','<div class="galaxy-badge">Galaxy showcase · drag to orbit</div>');
  }

  function ensureGalaxyOption() {
    const select = document.getElementById('graphMode');
    if (!select || select.querySelector('option[value="galaxy"]')) return;
    const option = document.createElement('option');
    option.value = 'galaxy';
    option.textContent = 'Galaxy showcase';
    select.appendChild(option);
    select.addEventListener('change', () => window.setTimeout(applyGraphModeVisuals, 20));
  }

  function colorWithAlpha(color, alpha) {
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      const n = parseInt(color.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    }
    return color;
  }

  function createGlowTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64,64,0,64,64,64);
    gradient.addColorStop(0,'rgba(255,255,255,1)');
    gradient.addColorStop(.14,color);
    gradient.addColorStop(.42,colorWithAlpha(color,.34));
    gradient.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(canvas);
  }

  function galaxyNodeObject(node) {
    const group = new THREE.Group();
    const size = node.type === 'usecase' ? 15 : node.type === 'process' ? 8 : node.type === 'cluster' ? 2 : 5;
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(1.2,size*.24),18,18),
      new THREE.MeshBasicMaterial({color:node.color,transparent:true,opacity:.96})
    );
    group.add(core);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map:createGlowTexture(node.color),
      transparent:true,
      depthWrite:false,
      blending:THREE.AdditiveBlending
    }));
    sprite.scale.set(size,size,1);
    group.add(sprite);

    if (node.type === 'usecase') {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(size*.42,.22,8,64),
        new THREE.MeshBasicMaterial({color:node.color,transparent:true,opacity:.42,blending:THREE.AdditiveBlending})
      );
      ring.rotation.x = Math.PI/2.8;
      group.add(ring);
    }
    return group;
  }

  function addStarfield() {
    if (galaxyStars || typeof graph === 'undefined' || !graph?.scene) return;
    const count = matchMedia('(max-width:620px)').matches ? 1000 : 2600;
    const positions = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const radius = 500 + Math.random()*1600;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      positions[i*3] = radius*Math.sin(phi)*Math.cos(theta);
      positions[i*3+1] = radius*Math.sin(phi)*Math.sin(theta);
      positions[i*3+2] = radius*Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({color:0xb9eaff,size:1.25,transparent:true,opacity:.52,sizeAttenuation:true,depthWrite:false});
    galaxyStars = new THREE.Points(geometry,material);
    graph.scene().add(galaxyStars);
  }

  function setAutoRotate(enabled) {
    if (typeof graph === 'undefined' || !graph?.controls) return;
    const controls = graph.controls();
    controls.autoRotate = enabled;
    controls.autoRotateSpeed = .32;
    controls.enableDamping = true;
    controls.dampingFactor = .06;
  }

  function applyGraphModeVisuals() {
    if (typeof graph === 'undefined' || !graph) return;
    const select = document.getElementById('graphMode');
    const isGalaxy = select?.value === 'galaxy';
    document.body.classList.toggle('galaxy-active',isGalaxy);
    setAutoRotate(isGalaxy);

    if (isGalaxy) {
      addStarfield();
      graph
        .nodeThreeObject(galaxyNodeObject)
        .linkWidth(link => link.hidden ? 0 : (selected && (link.source?.id===selected || link.target?.id===selected) ? 2.6 : .42))
        .linkOpacity(.28)
        .linkCurvature(.16)
        .linkCurveRotation(() => Math.random()*Math.PI*2)
        .linkDirectionalParticles(link => link.hidden ? 0 : (selected ? 3 : 1))
        .linkDirectionalParticleWidth(1.4)
        .linkDirectionalParticleSpeed(.005)
        .linkDirectionalArrowLength(0);
      graph.d3Force('charge')?.strength(-62);
      graph.d3Force('link')?.distance(link => link.hidden ? 58 : 78);
      window.setTimeout(() => graph.zoomToFit(1100,120),180);
    } else {
      graph
        .nodeThreeObject(nodeObject)
        .linkWidth(link => link.width)
        .linkOpacity(.9)
        .linkCurvature(0)
        .linkDirectionalParticles(link => link.particles)
        .linkDirectionalParticleWidth(3)
        .linkDirectionalParticleSpeed(.012)
        .linkDirectionalArrowLength(link => link.hidden ? 0 : 6);
      graph.d3Force('charge')?.strength(-150);
      graph.d3Force('link')?.distance(link => link.hidden ? 90 : 110);
      if (typeof renderGraph === 'function') renderGraph();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const graphSection = document.getElementById('graph');
    if (graphSection) graphSection.style.scrollMarginTop = `${navOffset()}px`;
    bindGraphLinks();
    injectPortalNavigation();
    ensureGalaxyOption();
    if (location.hash === '#graph') {
      requestAnimationFrame(() => window.setTimeout(() => scrollToGraph({updateHash:false,smooth:false}),120));
    }
    window.setTimeout(applyGraphModeVisuals,900);
  });

  window.addEventListener('hashchange', () => {
    if (location.hash === '#graph') scrollToGraph({updateHash:false});
  });
})();
