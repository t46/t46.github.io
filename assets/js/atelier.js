/**
 * Generative dandelion drawn in code.
 *
 * A sumi-e dandelion grows from the lower third of the canvas.
 * Its pappus seeds detach one by one and ride the wind; the cursor
 * stirs the air and shakes seeds loose. No image assets — every
 * stroke is drawn each frame.
 */
(function () {
    'use strict';

    var canvas = document.getElementById('atelier-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isHome = !!document.querySelector('.hero-atelier');
    var isMobile = window.innerWidth < 768;

    var INK = '34, 28, 19';
    var VERMILLION = '168, 58, 32';

    var W, H, DPR;
    var seeds = [];          // drifting seeds
    var attached = [];       // seeds still on the head
    var mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };
    var gust = 0;            // extra wind force, decays
    var time = 0;

    // Dandelion anchor (only drawn on home)
    var flower = { x: 0, y: 0, headR: 0, stemBase: 0 };

    function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

        var mobile = W < 768;
        flower.x = mobile ? W * 0.88 : W * 0.72;
        flower.y = mobile ? H * 0.24 : H * 0.38;
        flower.headR = mobile ? Math.min(W, H) * 0.075 : Math.min(W, H) * 0.105;
        flower.stemBase = H + 20;
    }

    // --- deterministic pseudo-noise -------------------------------------
    function n1(seed) {
        var x = Math.sin(seed * 127.1) * 43758.5453;
        return x - Math.floor(x);
    }

    // --- seed objects ----------------------------------------------------
    function makeAttachedSeed(i, total) {
        // golden-angle distribution over the head sphere
        var angle = i * 2.399963;
        var radius = Math.sqrt(i / total);
        return {
            angle: angle,
            radius: radius,
            len: 0.75 + n1(i * 3.7) * 0.45,
            sway: n1(i * 9.1) * Math.PI * 2,
            detachAt: null
        };
    }

    function makeDriftSeed(x, y, burst) {
        var s = {
            x: x, y: y,
            vx: 0.25 + Math.random() * 0.5,
            vy: -(0.15 + Math.random() * 0.35),
            size: 2.4 + Math.random() * 2.6,
            arms: 6 + Math.floor(Math.random() * 4),
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.012,
            wobbleFreq: 0.004 + Math.random() * 0.008,
            wobbleOffset: Math.random() * Math.PI * 2,
            alpha: 0.5 + Math.random() * 0.3,
            life: 1
        };
        if (burst) {
            s.vx += 0.8 + Math.random() * 1.6;
            s.vy -= 0.3 + Math.random() * 0.9;
        }
        return s;
    }

    function headPoint(seed) {
        // project the sphere point to 2D around the head
        var a = seed.angle + Math.sin(time * 0.0008 + seed.sway) * 0.02;
        var r = seed.radius * flower.headR;
        return {
            x: flower.x + Math.cos(a) * r,
            y: flower.y + Math.sin(a) * r * 0.92,
            a: a,
            r: r
        };
    }

    function initAttached() {
        attached = [];
        var total = isMobile ? 90 : 140;
        for (var i = 0; i < total; i++) {
            attached.push(makeAttachedSeed(i, total));
        }
    }

    function initAmbient() {
        // Content pages: just a few seeds drifting through
        seeds = [];
        var count = isMobile ? 4 : 8;
        for (var i = 0; i < count; i++) {
            var s = makeDriftSeed(Math.random() * W, Math.random() * H, false);
            s.ambient = true;
            s.alpha *= 0.6;
            seeds.push(s);
        }
    }

    // --- wind field --------------------------------------------------------
    function wind(x, y) {
        var base = 0.22 + 0.14 * Math.sin(time * 0.0004 + y * 0.002);
        var lift = 0.05 * Math.sin(time * 0.0007 + x * 0.003);
        return {
            x: base + gust * (0.6 + 0.4 * Math.sin(y * 0.01)),
            y: -0.04 + lift - gust * 0.12
        };
    }

    // --- drawing helpers -----------------------------------------------------
    function brushStroke(x1, y1, cx, cy, x2, y2, width, alpha) {
        // several offset passes fake a dry-brush line
        for (var i = 0; i < 3; i++) {
            var o = (i - 1) * width * 0.5;
            ctx.beginPath();
            ctx.moveTo(x1 + o, y1);
            ctx.quadraticCurveTo(cx + o * 1.4, cy, x2 + o * 0.6, y2);
            ctx.strokeStyle = 'rgba(' + INK + ',' + (alpha * (i === 1 ? 1 : 0.35)) + ')';
            ctx.lineWidth = i === 1 ? width : width * 0.5;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    function drawSeedShape(x, y, size, rot, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.strokeStyle = 'rgba(' + INK + ',' + alpha + ')';
        ctx.fillStyle = 'rgba(' + INK + ',' + alpha + ')';
        ctx.lineWidth = 0.55;

        var arms = 8;
        for (var i = 0; i < arms; i++) {
            var a = (Math.PI * 2 / arms) * i;
            var len = size * 2.2;
            var tx = Math.cos(a) * len;
            var ty = Math.sin(a) * len;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(tx, ty, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        // achene (the hanging grain)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size * 1.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, size * 1.9, size * 0.22, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawMountains() {
        // two ink-wash ridges, barely there
        var g1 = ctx.createLinearGradient(0, H * 0.55, 0, H);
        g1.addColorStop(0, 'rgba(' + INK + ', 0.045)');
        g1.addColorStop(1, 'rgba(' + INK + ', 0)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.moveTo(-50, H);
        for (var x = -50; x <= W + 50; x += 40) {
            var y = H * 0.72 - Math.sin(x * 0.0016 + 1.3) * H * 0.10 - n1(x * 0.01) * H * 0.02;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(W + 50, H);
        ctx.closePath();
        ctx.fill();

        var g2 = ctx.createLinearGradient(0, H * 0.65, 0, H);
        g2.addColorStop(0, 'rgba(' + INK + ', 0.07)');
        g2.addColorStop(1, 'rgba(' + INK + ', 0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.moveTo(-50, H);
        for (var x2 = -50; x2 <= W + 50; x2 += 40) {
            var y2 = H * 0.85 - Math.sin(x2 * 0.0011 + 4.2) * H * 0.07 - n1(x2 * 0.013 + 7) * H * 0.015;
            ctx.lineTo(x2, y2);
        }
        ctx.lineTo(W + 50, H);
        ctx.closePath();
        ctx.fill();
    }

    function drawFlower() {
        var sway = Math.sin(time * 0.0006) * 6 + gust * 14;

        // stem — one long breathing curve, ending exactly at the head centre
        var bx = flower.x - Math.min(W, H) * 0.16;
        brushStroke(
            bx, flower.stemBase,
            bx + (flower.x - bx) * 0.25 + sway * 0.4, flower.y + (flower.stemBase - flower.y) * 0.45,
            flower.x + sway, flower.y,
            2.2, 0.72
        );

        // a leaf near the base
        ctx.save();
        ctx.translate(bx + 8, flower.stemBase - H * 0.13);
        ctx.rotate(-0.9 + Math.sin(time * 0.0005) * 0.02);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(28, -16, 66, -10, 96, 6);
        ctx.bezierCurveTo(62, 12, 26, 12, 0, 0);
        ctx.fillStyle = 'rgba(' + INK + ', 0.16)';
        ctx.fill();
        ctx.restore();

        var hx = flower.x + sway;
        var hy = flower.y;

        // receptacle
        ctx.beginPath();
        ctx.arc(hx, hy, flower.headR * 0.13, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + INK + ', 0.8)';
        ctx.fill();

        // attached pappus
        for (var i = 0; i < attached.length; i++) {
            var s = attached[i];
            var p = headPoint(s);
            var px = p.x + sway;
            var py = p.y;
            var ex = hx + (px - hx) * (1 + s.len * 0.55);
            var ey = hy + (py - hy) * (1 + s.len * 0.55);

            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = 'rgba(' + INK + ', 0.30)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // tuft
            ctx.beginPath();
            ctx.arc(ex, ey, 1.1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + INK + ', 0.45)';
            ctx.fill();
        }

        // vermillion seal dot at the heart — the one drop of color
        ctx.beginPath();
        ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + VERMILLION + ', 0.9)';
        ctx.fill();
    }

    // --- release logic -----------------------------------------------------
    function detachOne(burst) {
        if (attached.length === 0) return;
        var idx = Math.floor(Math.random() * attached.length);
        var s = attached.splice(idx, 1)[0];
        var p = headPoint(s);
        var ex = flower.x + (p.x - flower.x) * (1 + s.len * 0.55);
        var ey = flower.y + (p.y - flower.y) * (1 + s.len * 0.55);
        seeds.push(makeDriftSeed(ex, ey, burst));
    }

    // --- main loop -----------------------------------------------------------
    var lastTrickle = 0;

    function heroFade() {
        // fade the fixed artwork away once the reader scrolls into the content
        if (!isHome) return 1;
        var y = window.scrollY || 0;
        var f = 1 - (y - H * 0.35) / (H * 0.55);
        return Math.max(0.06, Math.min(1, f));
    }

    function frame(now) {
        time = now;
        ctx.clearRect(0, 0, W, H);

        var fade = heroFade();

        if (isHome) {
            ctx.save();
            ctx.globalAlpha = fade;
            drawMountains();
            ctx.restore();
        }

        gust *= 0.985;

        // mouse stir velocity
        mouse.vx = (mouse.x - mouse.px) * 0.5;
        mouse.vy = (mouse.y - mouse.py) * 0.5;
        mouse.px = mouse.x;
        mouse.py = mouse.y;

        if (isHome) {
            ctx.save();
            ctx.globalAlpha = fade;
            drawFlower();
            ctx.restore();

            // slow natural trickle — a seed leaves every few seconds
            if (now - lastTrickle > 2600 + n1(now) * 2400 && attached.length > 30) {
                detachOne(false);
                lastTrickle = now;
            }

            // mouse near head shakes seeds loose
            var dx = mouse.x - flower.x;
            var dy = mouse.y - flower.y;
            if (Math.sqrt(dx * dx + dy * dy) < flower.headR * 1.4) {
                var speed = Math.abs(mouse.vx) + Math.abs(mouse.vy);
                if (speed > 4 && Math.random() < 0.3 && attached.length > 10) {
                    detachOne(true);
                    gust = Math.min(gust + 0.35, 1.5);
                }
            }
        }

        // drifting seeds
        for (var i = seeds.length - 1; i >= 0; i--) {
            var s = seeds[i];
            var w = wind(s.x, s.y);
            var wobble = Math.sin(now * s.wobbleFreq + s.wobbleOffset);

            s.vx += (w.x - s.vx) * 0.012;
            s.vy += (w.y - s.vy) * 0.012;

            // cursor stirs the air
            var mdx = s.x - mouse.x;
            var mdy = s.y - mouse.y;
            var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 130 && mdist > 0) {
                var force = (1 - mdist / 130) * 0.35;
                s.vx += (mdx / mdist) * force + mouse.vx * 0.02;
                s.vy += (mdy / mdist) * force + mouse.vy * 0.02;
            }

            s.x += s.vx + wobble * 0.3;
            s.y += s.vy;
            s.rot += s.rotSpeed + wobble * 0.002;

            if (s.x > W + 30 || s.y < -30 || s.x < -30 || s.y > H + 30) {
                if (s.ambient) {
                    // ambient seeds loop around
                    s.x = -20;
                    s.y = Math.random() * H * 0.8;
                    s.vx = 0.25 + Math.random() * 0.5;
                    s.vy = -(0.1 + Math.random() * 0.3);
                } else {
                    seeds.splice(i, 1);
                    continue;
                }
            }

            drawSeedShape(s.x, s.y, s.size, s.rot, s.alpha * 0.75);
        }

        requestAnimationFrame(frame);
    }

    // --- static fallback -------------------------------------------------------
    function drawStatic() {
        ctx.clearRect(0, 0, W, H);
        if (isHome) {
            drawMountains();
            drawFlower();
        }
    }

    // --- events -----------------------------------------------------------------
    window.addEventListener('resize', function () {
        clearTimeout(resize._t);
        resize._t = setTimeout(function () {
            resize();
            if (reducedMotion) drawStatic();
        }, 150);
    });

    if (!isMobile) {
        document.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
    }

    resize();
    if (isHome) {
        initAttached();
    } else {
        initAmbient();
    }

    if (reducedMotion) {
        drawStatic();
    } else {
        requestAnimationFrame(frame);
    }
})();
