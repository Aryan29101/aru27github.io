/**
 * DATA_NODE_V1.0 — CRT Emulation & Page Transitions
 * - Vignette overlay with subtle green tint
 * - Randomized micro-flicker (CRT refresh simulation)
 * - Smooth page transition with TV power-off effect
 * - Page fade-in on load
 */
(function() {
    // --- CRT Vignette Overlay ---
    const crtOverlay = document.createElement('div');
    crtOverlay.id = 'crt-vignette';
    crtOverlay.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 10000;
        background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%);
        mix-blend-mode: multiply;
    `;
    document.body.appendChild(crtOverlay);

    // --- Subtle Flicker Layer ---
    const flickerLayer = document.createElement('div');
    flickerLayer.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 10001;
        background: rgba(86, 255, 167, 0.003);
        opacity: 0;
    `;
    document.body.appendChild(flickerLayer);

    function flicker() {
        flickerLayer.style.opacity = Math.random() * 0.015;
        const delay = 80 + Math.random() * 150;
        setTimeout(() => requestAnimationFrame(flicker), delay);
    }
    flicker();

    // --- Page Transition Styles ---
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 1;
            transition: opacity 0.4s ease-out, filter 0.4s ease-out;
        }
        body.page-enter {
            animation: pageEnter 0.6s ease-out forwards;
        }
        body.page-out {
            opacity: 0 !important;
            filter: brightness(3) blur(6px) !important;
        }
        @keyframes pageEnter {
            0% { opacity: 0; filter: brightness(2) blur(4px); }
            100% { opacity: 1; filter: brightness(1) blur(0px); }
        }
    `;
    document.head.appendChild(style);

    // --- Fade-in on load ---
    document.body.classList.add('page-enter');
    setTimeout(() => document.body.classList.remove('page-enter'), 700);

    // --- Intercept link clicks for smooth transitions ---
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        // Only intercept internal same-origin navigation links
        if (link.hostname !== window.location.hostname) return;
        if (link.hash && link.pathname === window.location.pathname) return;
        if (link.target === '_blank') return;
        
        e.preventDefault();
        const target = link.href;
        document.body.classList.add('page-out');
        setTimeout(() => {
            window.location.href = target;
        }, 400);
    });
})();
