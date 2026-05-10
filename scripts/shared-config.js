/**
 * DATA_NODE_V1.0 — Shared Configuration Module
 * Centralizes Tailwind config, shared styles, nav rendering, and footer rendering
 * so all pages stay consistent without duplicating markup.
 */

const NODE_CONFIG = {
    tailwind: {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    "primary-fixed": "#56ffa7",
                    "secondary-fixed": "#9cf0ff",
                    "secondary-fixed-dim": "#00daf3",
                    "surface": "#131313",
                    "background": "#050505",
                    "on-surface": "#e5e2e1",
                    "on-surface-variant": "#b9cbbc",
                    "surface-variant": "#353534",
                    "outline": "#849587",
                    "outline-variant": "#3b4b3f",
                    "surface-dim": "#131313",
                    "surface-container": "#201f1f",
                    "surface-container-low": "#1c1b1b",
                    "surface-container-lowest": "#0e0e0e",
                    "surface-container-high": "#2a2a2a",
                    "surface-container-highest": "#353534",
                    "error": "#ffb4ab",
                    "tertiary-fixed-dim": "#ffb3b2"
                },
                fontFamily: {
                    "terminal": ["Fira Code", "monospace"],
                    "headline": ["Space Grotesk", "sans-serif"]
                }
            }
        }
    },

    navLinks: [
        { label: ">_ DASHBOARD", href: "index.html" },
        { label: ">_ PROFILE", href: "profile.html" },
        { label: ">_ CAPABILITIES", href: "capabilities.html" },
        { label: ">_ MISSIONS", href: "missions.html" },
        { label: ">_ CONTACT", href: "contact.html" }
    ],

    sharedCSS: `
        body {
            background-color: #050505;
            font-family: 'Space Grotesk', sans-serif;
        }
        .glow-sm { text-shadow: 0 0 10px rgba(86, 255, 167, 0.5); }
        .glow-md { text-shadow: 0 0 15px rgba(86, 255, 167, 0.6), 0 0 30px rgba(86, 255, 167, 0.2); }
        .border-glow { box-shadow: 0 0 10px rgba(86, 255, 167, 0.3), inset 0 0 10px rgba(86, 255, 167, 0.1); }
        .terminal-text { font-family: 'Fira Code', monospace; }
        .blinking-cursor::after {
            content: '█';
            animation: blink 1s step-end infinite;
            color: #56ffa7;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
        
        .scan-line {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, transparent, rgba(86, 255, 167, 0.15), transparent);
            pointer-events: none;
            z-index: 9999;
            animation: scan 8s linear infinite;
        }

        .glass-panel {
            background: rgba(17, 17, 17, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(86, 255, 167, 0.15);
            box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-panel:hover {
            border-color: rgba(86, 255, 167, 0.35);
            box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(86, 255, 167, 0.08);
        }

        .hover-scan:hover {
            box-shadow: inset 0 0 20px rgba(86, 255, 167, 0.15), 0 0 15px rgba(86, 255, 167, 0.3);
            border-color: rgba(86, 255, 167, 0.5);
        }
        
        .grid-bg {
            background-image: 
                linear-gradient(rgba(86, 255, 167, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(86, 255, 167, 0.03) 1px, transparent 1px);
            background-size: 24px 24px;
        }

        /* Glitch Effect */
        .glitch-text {
            position: relative;
            display: inline-block;
        }
        .glitch-text::before, .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #050505;
            clip: rect(0, 0, 0, 0);
        }
        .glitch-text:hover::before {
            left: 2px;
            text-shadow: -2px 0 #ff00c1;
            animation: glitch-anim 0.3s steps(2) infinite;
        }
        .glitch-text:hover::after {
            left: -2px;
            text-shadow: -2px 0 #00fff9;
            animation: glitch-anim2 0.3s steps(2) infinite;
        }
        @keyframes glitch-anim {
            0% { clip: rect(31px, 9999px, 94px, 0); }
            25% { clip: rect(62px, 9999px, 42px, 0); }
            50% { clip: rect(16px, 9999px, 78px, 0); }
            75% { clip: rect(58px, 9999px, 43px, 0); }
            100% { clip: rect(36px, 9999px, 99px, 0); }
        }
        @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 100px, 0); }
            25% { clip: rect(20px, 9999px, 36px, 0); }
            50% { clip: rect(81px, 9999px, 94px, 0); }
            75% { clip: rect(45px, 9999px, 69px, 0); }
            100% { clip: rect(12px, 9999px, 84px, 0); }
        }

        /* Boot Overlay */
        #boot-overlay {
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 2rem;
            font-family: 'Fira Code', monospace;
            color: #56ffa7;
            overflow: hidden;
            pointer-events: none;
            transition: opacity 0.8s ease-out;
        }
        #boot-overlay .progress-bar {
            width: 0%;
            height: 2px;
            background: #56ffa7;
            margin-top: 1rem;
            box-shadow: 0 0 8px #56ffa7;
            transition: width 0.3s ease;
        }

        /* Mobile nav drawer */
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
            .mobile-menu-btn { display: flex; }
            .nav-links-desktop { display: none !important; }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        #mobile-nav {
            transition: opacity 0.3s ease;
        }
    `
};

/**
 * Inject shared Tailwind config before Tailwind processes the page.
 * Call this in a <script> before the Tailwind CDN script runs,
 * or it will be picked up automatically if tailwind.config is set globally.
 */
if (typeof tailwind !== 'undefined') {
    tailwind.config = NODE_CONFIG.tailwind;
}

/**
 * Inject shared stylesheet into <head>
 */
function injectSharedStyles() {
    const style = document.createElement('style');
    style.id = 'shared-styles';
    style.textContent = NODE_CONFIG.sharedCSS;
    document.head.appendChild(style);
}

/**
 * Render the navigation bar.
 * @param {string} activePage - filename of the current page (e.g., 'index.html')
 */
function renderNav(activePage) {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    
    const currentPage = activePage || window.location.pathname.split('/').pop() || 'index.html';
    
    const links = NODE_CONFIG.navLinks.map(link => {
        const isActive = link.href === currentPage;
        const activeClass = isActive 
            ? 'text-primary-fixed font-bold border-b-2 border-primary-fixed pb-1 glow-sm' 
            : 'text-on-surface-variant hover:text-primary-fixed hover:bg-primary-fixed/10';
        return `<a class="${activeClass} terminal-text text-sm transition-all px-3 py-2 rounded" href="${link.href}">${link.label}</a>`;
    }).join('');

    nav.innerHTML = `
        <div class="flex items-center gap-4">
            <span class="font-headline text-2xl tracking-tighter text-primary-fixed glow-sm cursor-pointer" onclick="window.location='index.html'">ARYAN_NODE_V1.0</span>
        </div>
        <div class="nav-links-desktop hidden md:flex items-center gap-6">
            ${links}
        </div>
        <div class="flex items-center gap-3 text-primary-fixed">
            <span id="mute-toggle" class="material-symbols-outlined cursor-pointer hover:glow-sm transition-all" title="Toggle Sound">volume_off</span>
            <span class="material-symbols-outlined cursor-pointer hover:glow-sm md:hidden mobile-menu-btn" onclick="toggleMobileNav()">menu</span>
        </div>
        <!-- Improved Mobile Nav -->
        <div id="mobile-nav" class="fixed inset-0 bg-black/98 z-[9999] hidden flex-col items-center justify-center backdrop-blur-3xl overflow-hidden">
            <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: linear-gradient(rgba(86,255,167,0.1) 1px, transparent 1px); background-size: 100% 3px;"></div>
            <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div class="w-full h-2 bg-primary-fixed blur-sm absolute" style="animation: scan 4s linear infinite;"></div>
            </div>
            
            <span class="material-symbols-outlined absolute top-8 right-8 text-primary-fixed cursor-pointer text-4xl hover:rotate-90 transition-transform duration-300" onclick="toggleMobileNav()">close</span>
            
            <div class="flex flex-col items-center gap-8 z-10">
                <div class="terminal-text text-[10px] text-primary-fixed opacity-60 tracking-[0.5em] mb-4 uppercase animate-pulse">-- SELECT_DESTINATION --</div>
                ${NODE_CONFIG.navLinks.map((link, i) => `
                    <a class="terminal-text text-2xl text-on-surface hover:text-primary-fixed transition-all hover:scale-110 relative group" 
                       style="animation: slideUp 0.4s ease-out ${i * 0.1}s both;" 
                       href="${link.href}">
                       <span class="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-8 text-primary-fixed">>></span>
                       ${link.label}
                    </a>
                `).join('')}
                <div class="mt-12 h-[1px] w-48 bg-gradient-to-r from-transparent via-primary-fixed/30 to-transparent"></div>
                <div class="terminal-text text-[8px] text-on-surface-variant tracking-widest opacity-40 uppercase">System_Auth: Aryan_Srivastava_X</div>
            </div>
        </div>
    `;
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        const isOpening = mobileNav.classList.contains('hidden');
        if (isOpening) {
            mobileNav.classList.remove('hidden');
            mobileNav.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Prevent scroll
            if (window.AudioSystem) window.AudioSystem.play('click');
        } else {
            mobileNav.style.opacity = '0';
            setTimeout(() => {
                mobileNav.classList.add('hidden');
                mobileNav.classList.remove('flex');
                mobileNav.style.opacity = '1';
                document.body.style.overflow = '';
            }, 300);
            if (window.AudioSystem) window.AudioSystem.play('click');
        }
    }
}

/**
 * Render the footer.
 */
function renderFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    
    footer.innerHTML = `
        <div class="font-headline text-lg text-primary-fixed glow-sm cursor-pointer" onclick="window.location='index.html'">ARYAN_NODE_V1.0</div>
        <div class="terminal-text text-xs text-on-surface-variant uppercase tracking-widest">
            © 2025 // ROOT@ARYAN_INTEL // ALL RIGHTS RESERVED
        </div>
        <div class="flex gap-6 terminal-text text-[10px] text-on-surface-variant uppercase tracking-widest">
            <span class="hover:text-primary-fixed transition-colors cursor-default">SYSTEM: OPTIMAL</span>
            <span class="hover:text-primary-fixed transition-colors cursor-default">LATENCY: 14MS</span>
            <span class="text-primary-fixed">ENCRYPTION: ACTIVE</span>
        </div>
    `;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    injectSharedStyles();
    renderNav();
    renderFooter();
});
