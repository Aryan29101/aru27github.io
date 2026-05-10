/**
 * DATA_NODE_V1.0 — Immersive 3D Particle Field
 * A high-performance WebGL starfield with mouse-reactive depth,
 * color drifting, and pulsating geometry.
 */
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background: #050505;
    `;
    document.body.prepend(canvas);

    // Load Three.js dynamically if not already present
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = init3DBackground;
        document.head.appendChild(script);
    } else {
        init3DBackground();
    }

    function init3DBackground() {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.015);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- Particle System ---
        const geometry = new THREE.BufferGeometry();
        const count = 2500;
        
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        const color1 = new THREE.Color(0x56ffa7); // Neon Green
        const color2 = new THREE.Color(0x00daf3); // Cyan
        
        for(let i = 0; i < count; i++) {
            // Sphere distribution
            const r = 20 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            
            // Randomly mix colors
            const mix = Math.random();
            const chosenColor = mix > 0.8 ? color2 : color1;
            colors[i * 3] = chosenColor.r;
            colors[i * 3 + 1] = chosenColor.g;
            colors[i * 3 + 2] = chosenColor.b;
            
            sizes[i] = Math.random() * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        
        camera.position.z = 30;
        
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            
            // Subtle rotation
            points.rotation.y += delta * 0.05;
            points.rotation.x += delta * 0.02;
            
            // Smooth mouse follow
            camera.position.x += (mouseX * 10 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 10 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            // Pulse opacity
            material.opacity = 0.4 + Math.sin(elapsed * 0.5) * 0.2;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
})();
