let loading;
function loadLibs() {
  if (loading) return loading;
  loading = new Promise(resolve => {
    if (window.THREE && window.THREE.GLTFLoader) { resolve(); return; }
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      s2.onload = resolve;
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
  if (showLabel) {
    label = document.createElement('span');
    label.className = 'mini-body-pin-count';
    label.textContent = zones?.length ? `${zones.length} spot${zones.length > 1 ? 's' : ''}` : 'no spot';
    container.append(label);
  }
  loadLibs().then(() => {
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
      if (zones?.length) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(.055, 18, 18), new THREE.MeshBasicMaterial({ color: 0xff6f61 }));
        dot.position.set(0, .18, view === 'back' ? -.35 : .35);
        scene.add(dot);
      }
      function loop() {
        requestAnimationFrame(loop);
        if (rotate) model.rotation.y += rotateSpeed;
        renderer.render(scene, camera);
      }
      loop();
    }, undefined, () => {
      if (label) label.textContent = 'body model';
    });
  });
}
