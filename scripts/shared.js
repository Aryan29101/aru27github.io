/**
 * Aryan Srivastava Portfolio — Shared Module
 * Giulio-inspired: Custom cursor, intro sequence, particles, smooth reveals
 */

const NAV_LINKS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Profile', href: 'profile.html' },
    { label: 'Skills', href: 'capabilities.html' },
    { label: 'Projects', href: 'missions.html' },
    { label: 'Contact', href: 'contact.html' }
];

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
    if (window.innerWidth < 769) return;
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.appendChild(glow);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx - 4 + 'px';
        dot.style.top = my - 4 + 'px';
        glow.style.transform = `translate(${mx - 250}px, ${my - 250}px)`;
    });

    function followRing() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        ring.style.left = rx - 20 + 'px';
        ring.style.top = ry - 20 + 'px';
        requestAnimationFrame(followRing);
    }
    followRing();

    document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

/* ===== INTRO OVERLAY ===== */
function initIntro() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;
    if (sessionStorage.getItem('intro-done')) {
        overlay.classList.add('done');
        return;
    }
    setTimeout(() => {
        overlay.classList.add('done');
        sessionStorage.setItem('intro-done', 'true');
    }, 3200);
}

/* ===== NAV ===== */
function renderNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const current = window.location.pathname.split('/').pop() || 'index.html';
    const links = NAV_LINKS.map(l => {
        const active = l.href === current ? ' active' : '';
        return `<a class="nav-link${active}" href="${l.href}">${l.label}</a>`;
    }).join('');

    nav.innerHTML = `
        <a class="nav-logo" href="index.html">Aryan<span>.</span></a>
        <div class="nav-links">
            ${links}
            <button id="mute-toggle" class="nav-icon-btn" aria-label="Toggle Mute">
                <span class="material-icons-outlined">volume_off</span>
            </button>
        </div>
        <button class="nav-toggle" onclick="toggleMobile()" aria-label="Menu">☰</button>
    `;

    if (!document.getElementById('mobile-nav')) {
        const mob = document.createElement('div');
        mob.id = 'mobile-nav';
        mob.className = 'mobile-nav';
        mob.innerHTML = `
            <button class="mobile-close" onclick="toggleMobile()">✕</button>
            ${NAV_LINKS.map(l => `<a href="${l.href}" onclick="toggleMobile()">${l.label}</a>`).join('')}
        `;
        document.body.appendChild(mob);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function toggleMobile() {
    const m = document.getElementById('mobile-nav');
    if (m) {
        m.classList.toggle('open');
        document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
    }
}

/* ===== FOOTER ===== */
function renderFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.innerHTML = `
        <div class="footer-content">
            <a class="nav-logo" href="index.html" style="font-size:1.2rem;">Aryan<span style="color:var(--secondary)">.</span></a>
            <div class="footer-links">
                <a href="https://linkedin.com/in/aryan-srivastava-048b93344" target="_blank">LinkedIn</a>
                <a href="https://github.com/Aryan29101" target="_blank">GitHub</a>
                <a href="https://hackerrank.com/AryanSrivastava" target="_blank">HackerRank</a>
                <a href="mailto:aryansrivastava292005@gmail.com">Email</a>
            </div>
            <p class="footer-copy">© ${new Date().getFullYear()} Aryan Srivastava · Greater Noida, India</p>
        </div>
    `;
}

/* ===== PARTICLES ===== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(50, Math.floor(window.innerWidth / 25));
    const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(244,114,182,'];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
            r: Math.random() * 1.2 + 0.3,
            color: colors[Math.floor(Math.random() * 3)]
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + '0.5)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = p.color + (0.08 * (1 - dist / 100)) + ')';
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ===== TILT EFFECT ===== */
function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* ===== TYPED TEXT ===== */
function typeText(element, texts, speed = 70, pause = 2200) {
    if (!element) return;
    let textIdx = 0, charIdx = 0, deleting = false;
    function tick() {
        const current = texts[textIdx];
        if (!deleting) {
            element.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) { deleting = true; setTimeout(tick, pause); return; }
        } else {
            element.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % texts.length; }
        }
        setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
}

/* ===== SKILL RINGS ===== */
function animateSkillRings() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const circle = e.target.querySelector('.fill');
                if (circle) {
                    const pct = parseInt(circle.dataset.percent) || 0;
                    const circ = 2 * Math.PI * 52;
                    circle.style.strokeDasharray = circ;
                    circle.style.strokeDashoffset = circ - (pct / 100) * circ;
                }
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-ring').forEach(el => obs.observe(el));
}

/* ===== SMOOTH SCROLL FOR ANCHORS ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    renderNav();
    renderFooter();
    initParticles();
    initReveal();
    initTilt();
    initCursor();
    animateSkillRings();
    initSmoothScroll();
});
