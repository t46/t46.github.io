/**
 * Dandelion Fluff Particle System
 * Meditative, organic particles that drift like dandelion seeds.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let width, height;
    let particles = [];
    let mouseX = -9999, mouseY = -9999;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 20 : 50;
    const MOUSE_RADIUS = 150;
    const MOUSE_FORCE = 0.3;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class DandelionFluff {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + Math.random() * 50;
            this.size = 1 + Math.random() * 3;
            this.opacity = 0.15 + Math.random() * 0.35;
            this.speedY = -(0.1 + Math.random() * 0.25);
            this.speedX = (Math.random() - 0.5) * 0.05;
            this.wobbleAmp = 0.2 + Math.random() * 0.6;
            this.wobbleFreq = 0.005 + Math.random() * 0.01;
            this.wobbleOffset = Math.random() * Math.PI * 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.005;
            this.arms = 3 + Math.floor(Math.random() * 3); // 3-5 arms
            this.time = 0;
        }

        update() {
            this.time++;

            // Sinusoidal wobble
            const wobble = Math.sin(this.time * this.wobbleFreq + this.wobbleOffset) * this.wobbleAmp;

            this.x += this.speedX + wobble * 0.02;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            // Mouse repulsion
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }

            // Respawn when off screen
            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.strokeStyle = 'rgba(200, 195, 185, 1)';
            ctx.lineWidth = 0.5;

            // Draw dandelion seed — radiating lines with tiny dots at tips
            for (let i = 0; i < this.arms; i++) {
                const angle = (Math.PI * 2 / this.arms) * i;
                const len = this.size * 2.5;
                const tipX = Math.cos(angle) * len;
                const tipY = Math.sin(angle) * len;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(tipX, tipY);
                ctx.stroke();

                // Tiny dot at the tip
                ctx.beginPath();
                ctx.arc(tipX, tipY, 0.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200, 195, 185, 1)';
                ctx.fill();
            }

            // Center dot
            ctx.beginPath();
            ctx.arc(0, 0, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 195, 185, 0.8)';
            ctx.fill();

            ctx.restore();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new DandelionFluff());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(animate);
    }

    // Event listeners
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    });

    if (!isMobile) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    init();
    animate();
})();
