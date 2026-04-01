/**
 * Meditative Living Site — Main Script
 * Handles: overlay menu, logo typewriter, hero effects, scroll animations, contact entrance.
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // =================================================================
    // Fullscreen Overlay Menu
    // =================================================================
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.getElementById('menuOverlay');

    if (hamburger && overlay) {
        hamburger.addEventListener('click', function () {
            const isOpen = overlay.classList.toggle('active');
            hamburger.classList.toggle('active');

            if (isOpen && typeof gsap !== 'undefined') {
                gsap.fromTo('.menu-overlay__item',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
                );
            } else if (!isOpen) {
                // Reset items for next open
                document.querySelectorAll('.menu-overlay__item').forEach(function (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });
            }
        });

        // Close overlay on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                hamburger.classList.remove('active');
                document.querySelectorAll('.menu-overlay__item').forEach(function (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });
            }
        });
    }

    // =================================================================
    // Logo Typewriter Effect
    // =================================================================
    const logoLink = document.querySelector('.logo a');
    if (logoLink && !reducedMotion) {
        const text = logoLink.textContent.trim();
        logoLink.textContent = '';
        logoLink.setAttribute('aria-label', text);

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.classList.add('logo-char');
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.animationDelay = (i * 100) + 'ms';
            logoLink.appendChild(span);
        }
    }

    // =================================================================
    // Hero Image Effects (Landing page only)
    // =================================================================
    const heroImage = document.querySelector('.central-image');
    const heroWrapper = document.querySelector('.hero-parallax');

    if (heroImage && typeof gsap !== 'undefined') {
        // Blur → Reveal
        gsap.fromTo(heroImage,
            { filter: 'blur(15px)', opacity: 0 },
            {
                filter: 'blur(0px)',
                opacity: 1,
                duration: 2.5,
                ease: 'power2.out',
                delay: 0.3,
                onComplete: function () {
                    heroImage.classList.add('revealed');
                }
            }
        );

        // Mouse Parallax (desktop only)
        if (!isMobile && heroWrapper) {
            let targetX = 0, targetY = 0;
            let currentX = 0, currentY = 0;

            document.addEventListener('mousemove', function (e) {
                targetX = (e.clientX - window.innerWidth / 2) * 0.02;
                targetY = (e.clientY - window.innerHeight / 2) * 0.02;
            });

            function parallaxLoop() {
                currentX += (targetX - currentX) * 0.05;
                currentY += (targetY - currentY) * 0.05;
                heroWrapper.style.transform =
                    'translate(' + currentX + 'px, ' + currentY + 'px)';
                requestAnimationFrame(parallaxLoop);
            }
            parallaxLoop();
        }
    }

    // =================================================================
    // Contact Icons Staggered Entrance
    // =================================================================
    if (typeof gsap !== 'undefined' && !reducedMotion) {
        gsap.from('.contact-info a', {
            opacity: 0,
            y: 15,
            stagger: 0.15,
            duration: 0.6,
            delay: 1.5,
            ease: 'power2.out'
        });
    }

    // =================================================================
    // Scroll Reveal Animations (content pages)
    // =================================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Content elements
        gsap.utils.toArray('.main-content p, .main-content h2, .main-content li').forEach(function (el) {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power2.out'
            });
        });

        // Gallery items
        gsap.utils.toArray('.gallery').forEach(function (el, i) {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%'
                },
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                delay: (i % 4) * 0.1,
                ease: 'power2.out'
            });
        });
    }

    // =================================================================
    // Click Bloom — Flower petals scatter on click
    // =================================================================
    if (!reducedMotion) {
        var petalColors = [
            'var(--color-accent)',      // dusty rose
            'var(--color-accent-alt)',   // muted sage
        ];

        function createPetal(x, y) {
            var petal = document.createElement('div');
            petal.classList.add('click-petal');

            var color = petalColors[Math.floor(Math.random() * petalColors.length)];
            var size = 6 + Math.random() * 10;
            var angle = Math.random() * Math.PI * 2;
            var distance = 30 + Math.random() * 80;
            var tx = Math.cos(angle) * distance;
            var ty = Math.sin(angle) * distance + 20;
            var rotation = Math.random() * 360;
            var duration = 0.8 + Math.random() * 0.6;

            petal.style.cssText =
                'left:' + x + 'px;' +
                'top:' + y + 'px;' +
                'width:' + size + 'px;' +
                'height:' + (size * 0.6) + 'px;' +
                'background:' + color + ';' +
                '--tx:' + tx + 'px;' +
                '--ty:' + ty + 'px;' +
                '--rot:' + rotation + 'deg;' +
                'animation-duration:' + duration + 's;';

            document.body.appendChild(petal);

            setTimeout(function () {
                petal.remove();
            }, duration * 1000 + 50);
        }

        document.addEventListener('click', function (e) {
            var count = 6 + Math.floor(Math.random() * 5);
            for (var i = 0; i < count; i++) {
                createPetal(e.clientX, e.clientY);
            }
        });
    }
});
