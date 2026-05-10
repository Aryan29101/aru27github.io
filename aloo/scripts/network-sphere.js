/**
 * DATA_NODE_V1.0 — 3D Holographic Network Sphere
 * Creates an interactive wireframe icosphere with orbiting data nodes
 * and connection lines that pulse with energy.
 */
function initNetworkSphere(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Main Icosphere (wireframe shell) ---
    const icoGeo = new THREE.IcosahedronGeometry(1.8, 2);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x56ffa7,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const icosphere = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icosphere);

    // --- Inner sphere (solid core glow) ---
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x56ffa7,
        transparent: true,
        opacity: 0.6
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // --- Orbiting rings ---
    const ringColors = [0x56ffa7, 0x00daf3, 0x56ffa7];
    const rings = [];
    ringColors.forEach((color, i) => {
        const ringGeo = new THREE.TorusGeometry(1.2 + i * 0.4, 0.008, 8, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.25 - i * 0.05
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + (i * 0.4);
        ring.rotation.y = i * 0.8;
        scene.add(ring);
        rings.push(ring);
    });

    // --- Data nodes orbiting the sphere ---
    const nodeGroup = new THREE.Group();
    const nodeCount = 24;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const radius = 1.6 + Math.random() * 0.4;

        const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const isHighlight = Math.random() > 0.7;
        const nodeMat = new THREE.MeshBasicMaterial({
            color: isHighlight ? 0x00daf3 : 0x56ffa7,
            transparent: true,
            opacity: 0.9
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.setFromSphericalCoords(radius, phi, theta);
        node.userData = { baseRadius: radius, phi, theta, speed: 0.1 + Math.random() * 0.3 };
        nodeGroup.add(node);
        nodes.push(node);
    }
    scene.add(nodeGroup);

    // --- Connection lines between nearby nodes ---
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x56ffa7,
        transparent: true,
        opacity: 0.08
    });

    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = nodes[i].position.distanceTo(nodes[j].position);
            if (dist < 1.2) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position.clone(),
                    nodes[j].position.clone()
                ]);
                const line = new THREE.Line(lineGeo, lineMat.clone());
                line.userData = { nodeA: i, nodeB: j };
                scene.add(line);
                connections.push(line);
            }
        }
    }

    camera.position.set(0, 0, 4.5);
    camera.lookAt(0, 0, 0);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Rotate main sphere
        icosphere.rotation.y = t * 0.15 + mouseX * 0.3;
        icosphere.rotation.x = t * 0.08 + mouseY * 0.2;

        // Pulse core
        const pulse = 1 + Math.sin(t * 2) * 0.15;
        core.scale.setScalar(pulse);
        coreMat.opacity = 0.4 + Math.sin(t * 3) * 0.2;

        // Rotate rings
        rings.forEach((ring, i) => {
            ring.rotation.z = t * (0.2 + i * 0.1);
            ring.rotation.x = Math.PI / 2 + i * 0.4 + Math.sin(t * 0.5) * 0.1;
        });

        // Rotate node group
        nodeGroup.rotation.y = t * 0.1;
        nodeGroup.rotation.x = Math.sin(t * 0.2) * 0.1;

        // Animate individual nodes (subtle float)
        nodes.forEach((node, i) => {
            const ud = node.userData;
            const r = ud.baseRadius + Math.sin(t * ud.speed + i) * 0.1;
            node.position.setFromSphericalCoords(r, ud.phi, ud.theta + t * 0.05);
            node.scale.setScalar(0.8 + Math.sin(t * 2 + i) * 0.3);
        });

        // Update connection lines
        connections.forEach(line => {
            const a = nodes[line.userData.nodeA].position;
            const b = nodes[line.userData.nodeB].position;
            const positions = line.geometry.attributes.position.array;
            positions[0] = a.x; positions[1] = a.y; positions[2] = a.z;
            positions[3] = b.x; positions[4] = b.y; positions[5] = b.z;
            line.geometry.attributes.position.needsUpdate = true;
            
            const dist = a.distanceTo(b);
            line.material.opacity = Math.max(0, 0.15 - dist * 0.08);
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const ro = new ResizeObserver(() => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    });
    ro.observe(container);
}
