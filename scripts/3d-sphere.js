import * as THREE from 'three';

export function initSphere(containerId) {
    const container = document.getElementById(containerId);
    if (!container || window.innerWidth < 769) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Outer wireframe sphere — purple
    const outerGeo = new THREE.IcosahedronGeometry(2, 3);
    const outerMat = new THREE.MeshBasicMaterial({
        color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.08
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerSphere);

    // Inner wireframe sphere — cyan
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.04
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Core glow sphere
    const coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xa78bfa, transparent: true, opacity: 0.12
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Orbiting particles
    const particlesGeo = new THREE.BufferGeometry();
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 7;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.02, color: 0xa78bfa, transparent: true, opacity: 0.5
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse tracking for interactive rotation
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animate
    function animate() {
        requestAnimationFrame(animate);

        outerSphere.rotation.y += 0.002;
        outerSphere.rotation.x += 0.001;
        innerSphere.rotation.y -= 0.003;
        innerSphere.rotation.z += 0.001;
        particles.rotation.y += 0.0003;

        // Mouse follow
        outerSphere.rotation.y += mouseX * 0.001;
        outerSphere.rotation.x += mouseY * 0.001;

        // Core pulse
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        core.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 769) { renderer.setSize(0, 0); return; }
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
