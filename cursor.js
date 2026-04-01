/**
 * Custom Cursor Glow
 * A soft radial glow that follows the mouse cursor.
 */
(function () {
    'use strict';

    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reducedMotion) return;

    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let visible = false;

    document.addEventListener('mousemove', function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!visible) {
            visible = true;
            glow.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', function () {
        visible = false;
        glow.style.opacity = '0';
    });

    function update() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(update);
    }

    update();
})();
