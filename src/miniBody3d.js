import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MINI_ZONE_POINTS } from './bodyMap/bodyZones.js';

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
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  Promise.resolve().then(() => {
    // This miniature model mirrors the full body-map selection on review
    // screens. It is intentionally passive so the form remains the focus.
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
    new GLTFLoader().load('/bodymap.glb', gltf => {
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
        if (rotate && !reduceMotion) model.rotation.y += rotateSpeed;
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
