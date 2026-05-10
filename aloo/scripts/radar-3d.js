/**
 * DATA_NODE_V1.0 — 3D Tactical Radar Scanner
 * A high-fidelity radar component with additive glow, 
 * dynamic blip tracking, and recursive scanning geometry.
 */
function init3DRadar(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const accentColor = 0x56ffa7;
    const secondaryColor = 0x00daf3;

    // --- Radar Base & Rings ---
    const ringGroup = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: accentColor, 
        transparent: true, 
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    [1.0, 0.75, 0.5, 0.25].forEach(radius => {
        const ringGeo = new THREE.RingGeometry(radius - 0.005, radius, 64);
        const ring = new THREE.Mesh(ringGeo, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ringGroup.add(ring);
    });

    // Crosshairs
    const lineMaterial = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.1 });
    const crossGeoX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0)]);
    const crossGeoY = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 1)]);
    const lineX = new THREE.Line(crossGeoX, lineMaterial);
    const lineY = new THREE.Line(crossGeoY, lineMaterial);
    ringGroup.add(lineX, lineY);

    scene.add(ringGroup);

    // --- The Sweep (Scanner Beam) ---
    const sweepGroup = new THREE.Group();
    const sweepGeo = new THREE.PlaneGeometry(1, 1);
    
    // Create a gradient-like effect with multiple layers
    for(let i=0; i<5; i++) {
        const sweepLayerMat = new THREE.MeshBasicMaterial({
            color: accentColor,
            transparent: true,
            opacity: 0.4 / (i + 1),
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const sweepLayer = new THREE.Mesh(sweepGeo, sweepLayerMat);
        sweepLayer.position.x = 0.5;
        sweepLayer.rotation.x = Math.PI / 2;
        sweepLayer.rotation.y = i * 0.02; // Tiny offset for "trail"
        sweepGroup.add(sweepLayer);
    }
    scene.add(sweepGroup);

    // --- Scanning Blips ---
    const blipGeo = new THREE.SphereGeometry(0.025, 16, 16);
    const blips = [];
    const blipCount = 6;

    for(let i=0; i<blipCount; i++) {
        const isCyan = Math.random() > 0.7;
        const blipMat = new THREE.MeshBasicMaterial({ 
            color: isCyan ? secondaryColor : accentColor,
            transparent: true,
            opacity: 0
        });
        const blip = new THREE.Mesh(blipGeo, blipMat);
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.15 + Math.random() * 0.8;
        blip.position.set(Math.cos(angle) * dist, 0.02, Math.sin(angle) * dist);
        
        blip.userData = { 
            angle: angle, 
            dist: dist, 
            life: 0, 
            detected: false 
        };
        
        scene.add(blip);
        blips.push(blip);
    }

    camera.position.set(0, 1.8, 1.8);
    camera.lookAt(0, 0, 0);

    // Mouse responsiveness
    let targetRotationX = 0;
    let targetRotationZ = 0;
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationZ = x * 0.4;
        targetRotationX = y * 0.4;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // Tilt the whole scene based on mouse
        ringGroup.rotation.z += (targetRotationZ - ringGroup.rotation.z) * 0.05;
        ringGroup.rotation.x = (Math.PI / 2) + (targetRotationX - (ringGroup.rotation.x - Math.PI/2)) * 0.05;
        sweepGroup.rotation.y -= 0.025;

        const currentSweepAngle = (sweepGroup.rotation.y % (Math.PI * 2)) + Math.PI * 2;
        const normalizedSweep = currentSweepAngle % (Math.PI * 2);

        blips.forEach(blip => {
            // Check if sweep passed the blip
            let diff = normalizedSweep - blip.userData.angle;
            if (diff < 0) diff += Math.PI * 2;

            if (diff < 0.1) {
                // Detected!
                blip.userData.detected = true;
                blip.userData.life = 1.0;
                blip.scale.setScalar(2.0);
            }

            if (blip.userData.detected) {
                blip.userData.life -= 0.01;
                if (blip.userData.life <= 0) {
                    blip.userData.detected = false;
                    // Relocate blip for variety
                    const newAngle = Math.random() * Math.PI * 2;
                    const newDist = 0.15 + Math.random() * 0.8;
                    blip.position.set(Math.cos(newAngle) * newDist, 0.02, Math.sin(newAngle) * newDist);
                    blip.userData.angle = newAngle;
                }
            }

            blip.material.opacity = blip.userData.life;
            blip.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        });

        renderer.render(scene, camera);
    }

    animate();

    const ro = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);
}
