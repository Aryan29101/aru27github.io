# 3D Elements Guide — Aryan Srivastava Portfolio

> Ready-to-use 3D interactive elements you can drop into your portfolio website.
> Organized from **easiest** (pure CSS) → **most impressive** (Three.js / Spline).

---

## 🔥 Option 1: CSS-Only Floating 3D Cube (No Libraries!)

**Best for:** Hero section background accent or skill showcase

### How to Add:
Place this in any page's `<main>` section:

```html
<div class="cube-scene">
  <div class="cube">
    <div class="face front">🐍</div>
    <div class="face back">☕</div>
    <div class="face right">⚡</div>
    <div class="face left">📊</div>
    <div class="face top">💻</div>
    <div class="face bottom">🎯</div>
  </div>
</div>
```

### CSS to add to `style.css`:

```css
/* ===== 3D FLOATING CUBE ===== */
.cube-scene {
    width: 160px; height: 160px;
    perspective: 800px;
    margin: 0 auto;
}
.cube {
    width: 100%; height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: cube-float 12s ease-in-out infinite;
}
.face {
    position: absolute; width: 160px; height: 160px;
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem;
    background: rgba(124, 58, 237, 0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
}
.front  { transform: rotateY(0deg)    translateZ(80px); }
.back   { transform: rotateY(180deg)  translateZ(80px); }
.right  { transform: rotateY(90deg)   translateZ(80px); }
.left   { transform: rotateY(-90deg)  translateZ(80px); }
.top    { transform: rotateX(90deg)   translateZ(80px); }
.bottom { transform: rotateX(-90deg)  translateZ(80px); }

@keyframes cube-float {
    0%   { transform: rotateX(-15deg) rotateY(0deg)   translateY(0px); }
    25%  { transform: rotateX(5deg)   rotateY(90deg)  translateY(-10px); }
    50%  { transform: rotateX(-10deg) rotateY(180deg) translateY(0px); }
    75%  { transform: rotateX(8deg)   rotateY(270deg) translateY(-8px); }
    100% { transform: rotateX(-15deg) rotateY(360deg) translateY(0px); }
}

/* Pause on hover, user can drag-rotate */
.cube-scene:hover .cube {
    animation-play-state: paused;
}
```

---

## 🌐 Option 2: Three.js Wireframe Sphere (Interactive!)

**Best for:** Hero section — a glowing, rotating wireframe sphere

### Setup:
Add this `<script>` tag to your HTML `<head>`:
```html
<script type="importmap">
  { "imports": { "three": "https://unpkg.com/three@0.170.0/build/three.module.js" } }
</script>
```

### HTML:
```html
<div id="sphere-container" style="position:absolute;inset:0;z-index:0;pointer-events:none;"></div>
```

### JavaScript — save as `scripts/3d-sphere.js`:
```javascript
import * as THREE from 'three';

export function initSphere(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Wireframe sphere
    const geometry = new THREE.IcosahedronGeometry(1.8, 3);
    const material = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner glow sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Floating particles
    const particlesGeo = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.015, color: 0xa78bfa, transparent: true, opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.003;
        sphere.rotation.x += 0.001;
        innerSphere.rotation.y -= 0.002;
        innerSphere.rotation.x -= 0.001;
        particles.rotation.y += 0.0005;

        // Subtle mouse follow
        sphere.rotation.y += mouseX * 0.002;
        sphere.rotation.x += mouseY * 0.002;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
```

### Usage in `index.html`:
```html
<script type="module">
    import { initSphere } from './scripts/3d-sphere.js';
    initSphere('sphere-container');
</script>
```

---

## ✨ Option 3: Spline 3D Embed (Easiest Premium Look)

**Best for:** Hero section — no-code, stunning 3D objects with interactions

### Steps:
1. Go to [spline.design](https://spline.design) and sign up (free)
2. Create or **Remix** a community scene (search "portfolio", "abstract", "sphere")
3. Click **Export** → **Viewer** tab → Copy the embed URL

### HTML to embed:
```html
<!-- Replace the URL with your own Spline scene URL -->
<div style="position:relative;width:100%;height:400px;overflow:hidden;border-radius:16px;">
    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js"></script>
    <spline-viewer
        url="YOUR_SPLINE_SCENE_URL_HERE"
        style="width:100%;height:100%;"
    ></spline-viewer>
</div>
```

### Free Spline Scenes to Remix:
- Search "gradient blob" → organic flowing shapes
- Search "floating shapes" → geometric portfolio accents
- Search "planet" → sci-fi sphere for hero
- Search "abstract 3d" → modern liquid shapes

> ⚠️ **Note:** Free Spline plans include a small watermark. Upgrade to remove.

---

## 🔮 Option 4: Three.js Morphing Blob (Most Impressive)

**Best for:** Hero section — organic, living shape that reacts to mouse

### HTML:
```html
<canvas id="blob-canvas" style="position:absolute;inset:0;z-index:0;pointer-events:none;"></canvas>
```

### JavaScript — save as `scripts/3d-blob.js`:
```javascript
import * as THREE from 'three';

export function initBlob(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create sphere with lots of segments for morphing
    const geometry = new THREE.SphereGeometry(1.5, 128, 128);
    const material = new THREE.MeshPhongMaterial({
        color: 0x7c3aed,
        shininess: 100,
        transparent: true,
        opacity: 0.6,
        wireframe: false
    });
    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Lighting
    const light1 = new THREE.DirectionalLight(0x06b6d4, 1);
    light1.position.set(2, 2, 2);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xf472b6, 0.5);
    light2.position.set(-2, -1, 1);
    scene.add(light2);
    scene.add(new THREE.AmbientLight(0x404040, 0.5));

    // Store original positions
    const posAttr = geometry.attributes.position;
    const origPositions = new Float32Array(posAttr.array);

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Morph vertices
        for (let i = 0; i < posAttr.count; i++) {
            const ox = origPositions[i * 3];
            const oy = origPositions[i * 3 + 1];
            const oz = origPositions[i * 3 + 2];

            const noise = Math.sin(ox * 3 + time) * Math.cos(oy * 3 + time) * Math.sin(oz * 3 + time) * 0.15;

            posAttr.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
        }
        posAttr.needsUpdate = true;
        geometry.computeVertexNormals();

        blob.rotation.y += 0.005;
        blob.rotation.x += 0.002;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
```

---

## 📍 Where to Place Each 3D Element

| Element | Best Page | Placement |
|---------|-----------|-----------|
| CSS Cube | `capabilities.html` | Center of skills section as a visual accent |
| Wireframe Sphere | `index.html` | Behind hero text (absolute positioned) |
| Spline Embed | `index.html` | Hero section or profile card |
| Morphing Blob | `index.html` | Full-screen hero background |

## 🚀 Quick Integration Checklist

1. **Pick one option** — don't use all of them at once (performance!)
2. **Add the CSS/JS** to the respective files
3. **Test on mobile** — disable heavy 3D on small screens:
   ```css
   @media (max-width: 768px) {
       #sphere-container, #blob-canvas { display: none; }
   }
   ```
4. **Performance tip:** Always use `alpha: true` for transparent backgrounds
5. **Z-index:** Keep 3D elements behind content with `z-index: 0` or negative

---

## 🎨 Recommended: Wireframe Sphere for This Portfolio

For the **Cosmic Aurora** theme, the **Three.js Wireframe Sphere** (Option 2) is the best fit because:
- Matches the purple/cyan/pink color palette
- Lightweight enough for all devices
- Interactive (follows mouse)
- Creates depth without overwhelming the content
- No external dependencies beyond Three.js CDN
