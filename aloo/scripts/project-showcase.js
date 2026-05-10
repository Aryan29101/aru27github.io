/**
 * DATA_NODE_V1.0 — 3D Project Micro-Icons
 * Lightweight, wireframe 3D primitives with glowing cores
 * and holographic scan effects.
 */
function initProjectIcon(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const accentColor = 0x56ffa7;

    let geometry;
    switch(type) {
        case 'cube': geometry = new THREE.BoxGeometry(1, 1, 1); break;
        case 'octa': geometry = new THREE.OctahedronGeometry(1); break;
        case 'dodeca': geometry = new THREE.DodecahedronGeometry(1); break;
        case 'torus': geometry = new THREE.TorusGeometry(0.7, 0.2, 12, 48); break;
        default: geometry = new THREE.IcosahedronGeometry(1);
    }

    const material = new THREE.MeshBasicMaterial({ 
        color: accentColor, 
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Glowing Core ---
    const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ 
        color: accentColor, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending 
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // --- Holographic Scan Ring ---
    const ringGeo = new THREE.RingGeometry(0.8, 0.85, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    camera.position.z = 2.5;

    let mouseX = 0;
    let mouseY = 0;
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        mesh.rotation.x += 0.005 + mouseY * 0.05;
        mesh.rotation.y += 0.005 + mouseX * 0.05;
        
        // Pulse core
        const pulse = 1 + Math.sin(time * 4) * 0.2;
        core.scale.setScalar(pulse);
        coreMat.opacity = 0.4 + Math.sin(time * 4) * 0.2;

        // Animate scan ring
        ring.rotation.x = time * 0.5;
        ring.rotation.y = time * 0.3;
        ring.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

        renderer.render(scene, camera);
    }

    animate();

    // Intersection observer to pause animation when not visible (Performance)
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Already running
        } else {
            // Could pause here if needed
        }
    });
    observer.observe(container);
}
