/**
 * Ink Atelier — interactions.
 * Header scroll state, mobile overlay menu, scroll reveals.
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =================================================================
    // Header scroll state
    // =================================================================
    var header = document.querySelector('.site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 30);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // =================================================================
    // Mobile overlay menu
    // =================================================================
    var hamburger = document.querySelector('.hamburger');
    var overlay = document.getElementById('menuOverlay');

    if (hamburger && overlay) {
        var closeMenu = function () {
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.querySelectorAll('.menu-overlay__item').forEach(function (item) {
                item.style.opacity = '0';
                item.style.transform = 'translateY(16px)';
            });
        };

        hamburger.addEventListener('click', function () {
            var isOpen = overlay.classList.toggle('active');
            hamburger.classList.toggle('active');

            if (isOpen && typeof gsap !== 'undefined' && !reducedMotion) {
                gsap.fromTo('.menu-overlay__item',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
                );
            } else if (isOpen) {
                document.querySelectorAll('.menu-overlay__item').forEach(function (item) {
                    item.style.opacity = '1';
                    item.style.transform = 'none';
                });
            } else {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeMenu();
        });

        overlay.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeMenu);
        });
    }

    // =================================================================
    // Scroll reveals
    // =================================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        var heroBits = document.querySelectorAll('.hero-label, .hero-title, .hero-desc');
        if (heroBits.length) {
            gsap.fromTo(heroBits,
                { opacity: 0, y: 26 },
                { opacity: 1, y: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out', delay: 0.15 }
            );
        }

        // Home section reveals
        gsap.utils.toArray('.atelier-section').forEach(function (section) {
            var bits = section.querySelectorAll('.section-head, .section-lede, .index-list li, .section-more, .band-quote');
            if (!bits.length) return;
            gsap.fromTo(bits,
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0,
                    stagger: 0.08,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 78%' }
                }
            );
        });

        // Content page reveals
        gsap.utils.toArray('.main-content h2, .main-content > .content-wrapper > p, .main-content li').forEach(function (el) {
            gsap.fromTo(el,
                { opacity: 0, y: 18 },
                {
                    opacity: 1, y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                }
            );
        });

        // Gallery
        gsap.utils.toArray('.gallery').forEach(function (el, i) {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    delay: (i % 4) * 0.07,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 92%' }
                }
            );
        });
    }
});
