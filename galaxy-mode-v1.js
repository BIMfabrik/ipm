(() => {
  let stars = null;
  let bound = false;

  function selectElement() {
    return document.getElementById('graphMode');
  }

  function ensureOption() {
    const select = selectElement();
    if (!select) return false;
    if (!select.querySelector('option[value="galaxy"]')) {
      const option = document.createElement('option');
      option.value = 'galaxy';
      option.textContent = 'Galaxy showcase';
      select.appendChild(option);
    }
    return true;
  }

  function rgba(hex, alpha) {
    if (!/^#[0-9a-f]{6}$/i.test(hex || '')) return `rgba(110,231,255,${alpha})`;
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function glowTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(.12, color || '#6ee7ff');
    gradient.addColorStop(.42, rgba(color || '#6ee7ff', .38));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  function galaxyNode(node) {
    const group = new THREE.Group();
    const size = node.type === 'usecase' ? 17 : node.type === 'process' ? 9 : node.type === 'cluster' ? 2 : 5.5;
    const color = node.color || '#6ee7ff';

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(1.15, size * .23), 18, 18),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .98 })
    );
    group.add(core);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture(color),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    sprite.scale.set(size, size, 1);
    group.add(sprite);

    if (node.type === 'usecase') {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(size * .43, .2, 8, 64),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .46, blending: THREE.AdditiveBlending })
      );
      ring.rotation.x = Math.PI / 2.7;
      group.add(ring);
    }
    return group;
  }

  function addStars() {
    if (stars || typeof graph === 'undefined' || !graph || typeof graph.scene !== 'function') return;
    const mobile = window.matchMedia('(max-width:620px)').matches;
    const count = mobile ? 900 : 2400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 480 + Math.random() * 1500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0xb9eaff, size: 1.15, transparent: true, opacity: .48, depthWrite: false })
    );
    graph.scene().add(stars);
  }

  function linkRotation(link) {
    const source = typeof link.source === 'object' ? link.source.id : link.source;
    const target = typeof link.target === 'object' ? link.target.id : link.target;
    const text = `${source || ''}|${target || ''}`;
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    return (Math.abs(hash) % 628) / 100;
  }

  function setControls(enabled) {
    if (typeof graph === 'undefined' || !graph || typeof graph.controls !== 'function') return;
    const controls = graph.controls();
    controls.autoRotate = enabled;
    controls.autoRotateSpeed = .26;
    controls.enableDamping = true;
    controls.dampingFactor = .07;
  }

  function apply() {
    const select = selectElement();
    if (!select || typeof graph === 'undefined' || !graph) return false;
    const galaxy = select.value === 'galaxy';
    document.body.classList.toggle('galaxy-active', galaxy);
    setControls(galaxy);

    if (galaxy) {
      addStars();
      graph
        .nodeThreeObject(galaxyNode)
        .linkWidth(link => link.hidden ? 0 : .48)
        .linkOpacity(.3)
        .linkCurvature(.15)
        .linkCurveRotation(linkRotation)
        .linkDirectionalParticles(link => link.hidden ? 0 : 1)
        .linkDirectionalParticleWidth(1.35)
        .linkDirectionalParticleSpeed(.004)
        .linkDirectionalArrowLength(0);
      const charge = graph.d3Force && graph.d3Force('charge');
      const link = graph.d3Force && graph.d3Force('link');
      if (charge && charge.strength) charge.strength(window.matchMedia('(max-width:620px)').matches ? -55 : -68);
      if (link && link.distance) link.distance(item => item.hidden ? 58 : 78);
      if (typeof graph.warmupTicks === 'function') graph.warmupTicks(100);
      if (typeof graph.cooldownTime === 'function') graph.cooldownTime(650);
      window.setTimeout(() => graph.zoomToFit && graph.zoomToFit(650, 110), 120);
    } else if (typeof nodeObject === 'function') {
      graph
        .nodeThreeObject(nodeObject)
        .linkWidth(link => link.width)
        .linkOpacity(.9)
        .linkCurvature(0)
        .linkDirectionalParticles(link => link.particles)
        .linkDirectionalParticleWidth(3)
        .linkDirectionalParticleSpeed(.012)
        .linkDirectionalArrowLength(link => link.hidden ? 0 : 6);
    }
    return true;
  }

  function bind() {
    if (!ensureOption()) return;
    const select = selectElement();
    if (!bound) {
      bound = true;
      select.addEventListener('change', () => window.setTimeout(apply, 40));
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (apply() || attempts > 50) window.clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
