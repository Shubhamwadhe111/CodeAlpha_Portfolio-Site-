/**
 * Three.js 3D Visual Engine - Professional Modern Edition
 * Shubham Wadhe Portfolio
 * Features:
 *  1. Minimalist geometric metallic polyhedron with studio lighting & drag inspection
 *  2. Subtle, low-opacity ambient background particle constellation (non-distracting)
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    return;
  }

  /* ==========================================================================
     1. HERO 3D GEOMETRIC SCULPTURE
     ========================================================================== */
  const heroViewport = document.getElementById('sceneViewport');
  if (heroViewport) {
    initHeroScene(heroViewport);
  }

  function initHeroScene(container) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Group for 3D object
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // A. Inner Metallic Faceted Core (Icosahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(1.25, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      metalness: 0.85,
      roughness: 0.25,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // B. Precision Wireframe Cage (Slightly larger)
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.58, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x475569,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    mainGroup.add(wireframeMesh);

    // C. Thin Gyroscopic Rings (Architectural / Orbital)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.4
    });

    const ring1Geo = new THREE.TorusGeometry(2.1, 0.012, 16, 120);
    const ring1 = new THREE.Mesh(ring1Geo, ringMaterial);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.35, 0.01, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.3
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    mainGroup.add(ring2);

    // D. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 0.9);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    // Drag Interaction with smooth physics damping
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRotX = 0.2;
    let targetRotY = 0.3;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;

        targetRotY += dx * 0.007;
        targetRotX += dy * 0.007;

        prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    // Mobile touch controls
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    container.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;

        targetRotY += dx * 0.007;
        targetRotX += dy * 0.007;

        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    // Render loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth interpolation towards target rotation
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.06;

      // Gentle continuous ambient drift
      if (!isDragging) {
        targetRotY += 0.0025;
        targetRotX += 0.001;
      }

      coreMesh.rotation.y += 0.004;
      wireframeMesh.rotation.y -= 0.003;
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.0025;

      renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  /* ==========================================================================
     2. SUBTLE AMBIENT CANVAS DUST
     ========================================================================== */
  const bgCanvas = document.getElementById('bg-3d-canvas');
  if (bgCanvas) {
    initBackgroundCanvas(bgCanvas);
  }

  function initBackgroundCanvas(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Particle field with muted slate/white tones
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      color: 0x64748b,
      transparent: true,
      opacity: 0.35
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    function renderBg() {
      requestAnimationFrame(renderBg);
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.0001;
      renderer.render(scene, camera);
    }

    renderBg();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();
