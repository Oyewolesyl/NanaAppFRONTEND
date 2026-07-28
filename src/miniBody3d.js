let loading;

function showMiniBodyFallback(container, label) {
  container.classList.add('mini-body-wrap--error');
  container.innerHTML = `
    <div class="mini-body-fallback" aria-hidden="true">
      <span class="mini-body-fallback-head"></span>
      <span class="mini-body-fallback-torso"></span>
      <span class="mini-body-fallback-arm mini-body-fallback-arm--left"></span>
      <span class="mini-body-fallback-arm mini-body-fallback-arm--right"></span>
      <span class="mini-body-fallback-leg mini-body-fallback-leg--left"></span>
      <span class="mini-body-fallback-leg mini-body-fallback-leg--right"></span>
    </div>
  `;
  if (label) label.remove();
}

const MINI_ZONE_POINTS = {
  head: { x: 0, y: 0.99, z: 0.1 },
  "back-head": { x: 0, y: 0.99, z: -0.09 },
  neck: { x: 0, y: 0.86, z: 0.1 },
  "back-neck": { x: 0, y: 0.86, z: -0.09 },
  chest: { x: 0, y: 0.76, z: 0.12 },
  tummy: { x: 0, y: 0.62, z: 0.12 },
  groin: { x: 0, y: 0.5, z: 0.1 },
  "upper-back": { x: 0, y: 0.76, z: -0.1 },
  "lower-back": { x: 0, y: 0.62, z: -0.1 },
  "left-shoulder": { x: -0.18, y: 0.78, z: 0.06 },
  "right-shoulder": { x: 0.18, y: 0.78, z: 0.06 },
  "left-upper-arm": { x: -0.25, y: 0.66, z: 0.04 },
  "right-upper-arm": { x: 0.25, y: 0.66, z: 0.04 },
  "left-forearm": { x: -0.28, y: 0.49, z: 0.04 },
  "right-forearm": { x: 0.28, y: 0.49, z: 0.04 },
  "left-hand": { x: -0.29, y: 0.32, z: 0.04 },
  "right-hand": { x: 0.29, y: 0.32, z: 0.04 },
  "left-hip": { x: -0.12, y: 0.5, z: 0.1 },
  "right-hip": { x: 0.12, y: 0.5, z: 0.1 },
  "left-glute": { x: -0.11, y: 0.5, z: -0.1 },
  "right-glute": { x: 0.11, y: 0.5, z: -0.1 },
  "left-thigh": { x: -0.09, y: 0.34, z: 0.08 },
  "right-thigh": { x: 0.09, y: 0.34, z: 0.08 },
  "left-hamstring": { x: -0.09, y: 0.34, z: -0.08 },
  "right-hamstring": { x: 0.09, y: 0.34, z: -0.08 },
  "left-knee": { x: -0.08, y: 0.23, z: 0.08 },
  "right-knee": { x: 0.08, y: 0.23, z: 0.08 },
  "left-back-knee": { x: -0.08, y: 0.23, z: -0.08 },
  "right-back-knee": { x: 0.08, y: 0.23, z: -0.08 },
  "left-shin": { x: -0.08, y: 0.14, z: 0.07 },
  "right-shin": { x: 0.08, y: 0.14, z: 0.07 },
  "left-calf": { x: -0.08, y: 0.14, z: -0.07 },
  "right-calf": { x: 0.08, y: 0.14, z: -0.07 },
  "left-ankle": { x: -0.08, y: 0.05, z: 0.06 },
  "right-ankle": { x: 0.08, y: 0.05, z: 0.06 },
  "left-foot": { x: -0.08, y: 0.02, z: 0.11 },
  "right-foot": { x: 0.08, y: 0.02, z: 0.11 },
  "left-heel": { x: -0.08, y: 0.02, z: -0.08 },
  "right-heel": { x: 0.08, y: 0.02, z: -0.08 },
};

function loadLibs() {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    if (window.THREE && window.THREE.GLTFLoader) { resolve(); return; }
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s1.onerror = reject;
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      s2.onload = resolve;
      s2.onerror = reject;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  });
  return loading;
}

export function mountMiniBody(container, {
  view = 'front',
  zones = [],
  rotate = true,
  rotateSpeed = 0.006,
  showLabel = true,
  canvasClassName = '',
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = `mini-body-canvas ${canvasClassName}`.trim();
  container.innerHTML = '';
  container.append(canvas);
  let label = null;
  if (showLabel && zones?.length) {
    label = document.createElement('span');
    label.className = 'mini-body-pin-count';
    label.textContent = `${zones.length} spot${zones.length > 1 ? 's' : ''}`;
    container.append(label);
  }
  loadLibs().then(() => {
    // This miniature model mirrors the full body-map selection on review
    // screens. It is intentionally passive so the form remains the focus.
    const THREE = window.THREE;
    const rect = container.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(rect.width || 130, rect.height || 170);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, (rect.width || 130) / (rect.height || 170), 0.01, 100);
    camera.position.set(0, 0, view === 'back' ? -2.2 : 2.2);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xfff8ef, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(2, 3, 2); scene.add(key);
    new THREE.GLTFLoader().load('/bodymap.glb', gltf => {
      const model = gltf.scene;
      const S = 1.8 / (1.1005 - 0.0008);
      model.scale.setScalar(S);
      model.position.set(0, -(((0.0008 + 1.1005) / 2) * S), 0);
      model.traverse(c => { if (c.isMesh) c.material = new THREE.MeshStandardMaterial({ color: 0xf0b882, roughness: .55 }); });
      scene.add(model);
      (zones || []).forEach((zone, index) => {
        const point = MINI_ZONE_POINTS[zone] || { x: 0, y: 0.55, z: view === 'back' ? -0.1 : 0.1 };
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(.026, 18, 18),
          new THREE.MeshBasicMaterial({ color: 0xff6f61, depthTest: false })
        );
        dot.renderOrder = 20 + index;
        dot.position.set(point.x, point.y, point.z);
        model.add(dot);
      });
      function loop() {
        requestAnimationFrame(loop);
        if (rotate) model.rotation.y += rotateSpeed;
        renderer.render(scene, camera);
      }
      loop();
    }, undefined, () => {
      showMiniBodyFallback(container, label);
    });
  }).catch(() => {
    showMiniBodyFallback(container, label);
  });
}
