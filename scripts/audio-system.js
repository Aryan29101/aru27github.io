/**
 * DATA_NODE_V1.0 — Audio Feedback System
 * Uses Web Audio API to synthesize cyberpunk UI sounds.
 * Defaults to MUTED for accessibility. Toggle with the navbar icon.
 */
const AudioSystem = (() => {
    let muted = true;
    let audioCtx = null;

    // Lazy-init AudioContext (avoids Chrome autoplay policy issues)
    function getCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type, duration, volume) {
        if (muted) return;
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    const sounds = {
        hover:    () => playTone(180, 'sine', 0.08, 0.03),
        click:    () => playTone(440, 'square', 0.04, 0.04),
        boot:     () => {
            playTone(80, 'sawtooth', 0.6, 0.08);
            setTimeout(() => playTone(160, 'sine', 0.3, 0.05), 200);
        },
        transmit: () => {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => playTone(600 + i * 150, 'square', 0.12, 0.03), i * 60);
            }
        },
        success:  () => {
            playTone(523, 'sine', 0.15, 0.05);
            setTimeout(() => playTone(659, 'sine', 0.15, 0.05), 120);
            setTimeout(() => playTone(784, 'sine', 0.3, 0.05), 240);
        }
    };

    function toggleMute() {
        muted = !muted;
        if (!muted) sounds.boot();
        return muted;
    }

    function init() {
        // Wire up mute toggle button
        const toggleBtn = document.getElementById('mute-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isMuted = toggleMute();
                const icon = toggleBtn.querySelector('.material-icons-outlined') || toggleBtn;
                icon.textContent = isMuted ? 'volume_off' : 'volume_up';
            });
        }

        // Delegate hover/click sounds to the document (catches dynamic elements)
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('a, button, [data-tilt], .nav-link, .hover-scan')) {
                sounds.hover();
            }
        }, true);

        document.addEventListener('click', (e) => {
            if (e.target.matches('a, button, [data-tilt], input[type="submit"]')) {
                sounds.click();
            }
        }, true);
    }

    return {
        init,
        transmitSound: sounds.transmit,
        successSound: sounds.success,
        toggleMute
    };
})();

window.addEventListener('DOMContentLoaded', AudioSystem.init);
