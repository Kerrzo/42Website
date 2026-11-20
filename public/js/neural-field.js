/**
 * Neural field — an interactive "thinking" network for the AI page hero.
 *
 * Nodes drift like neurons. Your cursor acts as an attention head: nearby
 * nodes light up and wire themselves to it. Active nodes fire signals along
 * their connections, which wake their neighbours, so thoughts spread through
 * the network. Click or tap to fire a burst.
 *
 * Usage: <canvas data-neural-field></canvas> inside a positioned container.
 */
(function () {
    const canvas = document.querySelector('[data-neural-field]');
    if (!canvas) return;

    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const LINK = 140;          // max distance for a connection
    const ATTENTION = 200;     // cursor influence radius
    const MAX_SIGNALS = 260;
    const FIRE_AT = 0.55;      // activation needed to fire
    const COLORS = {
        idle: [127, 160, 229],  // brand light blue
        hot: [255, 255, 255],
        signal: [140, 140, 255],
    };

    let w = 0, h = 0, dpr = 1;
    let nodes = [];
    let signals = [];
    let pointer = { x: -9999, y: -9999, active: false };
    let running = false;
    let visible = true;
    let last = performance.now();
    let idleTimer = 0;

    function resize() {
        const rect = host.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = rect.width;
        h = rect.height;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
    }

    function seed() {
        const count = Math.max(40, Math.min(170, Math.round((w * h) / 8500)));
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                r: 1.2 + Math.random() * 1.6,
                a: 0,          // activation 0..1
                cool: 0,       // refractory time (ms)
            });
        }
        signals = [];
    }

    function neighbours(i, limit) {
        const n = nodes[i];
        const out = [];
        for (let j = 0; j < nodes.length; j++) {
            if (j === i) continue;
            const dx = nodes[j].x - n.x, dy = nodes[j].y - n.y;
            const d = dx * dx + dy * dy;
            if (d < LINK * LINK) out.push([j, d]);
        }
        out.sort((p, q) => p[1] - q[1]);
        return out.slice(0, limit).map((p) => p[0]);
    }

    function fire(i, strength) {
        const n = nodes[i];
        if (n.cool > 0 || signals.length > MAX_SIGNALS) return;
        n.cool = 520 + Math.random() * 400;
        const targets = neighbours(i, 4);
        // fire to 2 random close neighbours
        for (let k = 0; k < 2 && targets.length; k++) {
            const j = targets.splice(Math.floor(Math.random() * targets.length), 1)[0];
            signals.push({ from: i, to: j, t: 0, speed: 0.0016 + Math.random() * 0.0012, s: strength });
        }
    }

    function burst(x, y) {
        for (let i = 0; i < nodes.length; i++) {
            const dx = nodes[i].x - x, dy = nodes[i].y - y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < ATTENTION * 0.8) {
                nodes[i].a = 1;
                nodes[i].cool = 0;
                fire(i, 0.95);
                // little shove outward for feel
                nodes[i].vx += (dx / (d || 1)) * 0.9;
                nodes[i].vy += (dy / (d || 1)) * 0.9;
            }
        }
    }

    function rgba(c, a) {
        return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
    }

    function mix(a, b, t) {
        return [
            Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t),
        ];
    }

    function step(dt) {
        const px = pointer.x, py = pointer.y;

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];

            // attention: gently pull toward the cursor and wake up
            if (pointer.active) {
                const dx = px - n.x, dy = py - n.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < ATTENTION) {
                    const f = 1 - d / ATTENTION;
                    n.vx += (dx / (d || 1)) * f * 0.012 * dt / 16;
                    n.vy += (dy / (d || 1)) * f * 0.012 * dt / 16;
                    n.a = Math.min(1, n.a + f * 0.04);
                    if (n.a > FIRE_AT && Math.random() < 0.02) fire(i, 0.8);
                }
            }

            n.x += n.vx * dt / 16;
            n.y += n.vy * dt / 16;
            n.vx *= 0.985;
            n.vy *= 0.985;
            // keep a minimum drift so it never freezes
            if (Math.abs(n.vx) < 0.04) n.vx += (Math.random() - 0.5) * 0.02;
            if (Math.abs(n.vy) < 0.04) n.vy += (Math.random() - 0.5) * 0.02;

            if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
            if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;

            n.a = Math.max(0, n.a - 0.0009 * dt);
            n.cool = Math.max(0, n.cool - dt);
        }

        for (let k = signals.length - 1; k >= 0; k--) {
            const s = signals[k];
            s.t += s.speed * dt;
            if (s.t >= 1) {
                const target = nodes[s.to];
                target.a = Math.min(1, target.a + s.s);
                if (target.a > FIRE_AT && s.s > 0.25) fire(s.to, s.s * 0.82);
                signals.splice(k, 1);
            }
        }

        // the network daydreams when nobody is around
        idleTimer -= dt;
        if (idleTimer <= 0) {
            idleTimer = pointer.active ? 1400 : 650;
            const i = Math.floor(Math.random() * nodes.length);
            nodes[i].a = 0.9;
            fire(i, 0.7);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // connections
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > LINK * LINK) continue;
                const fade = 1 - Math.sqrt(d2) / LINK;
                const heat = Math.max(a.a, b.a);
                ctx.strokeStyle = rgba(mix(COLORS.idle, COLORS.hot, heat * 0.6), fade * (0.08 + heat * 0.35));
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        // attention lines from the cursor to the closest nodes
        if (pointer.active) {
            const near = nodes
                .map((n, i) => [i, (n.x - pointer.x) ** 2 + (n.y - pointer.y) ** 2])
                .filter((p) => p[1] < ATTENTION * ATTENTION)
                .sort((p, q) => p[1] - q[1])
                .slice(0, 6);
            for (const [i, d2] of near) {
                const f = 1 - Math.sqrt(d2) / ATTENTION;
                const g = ctx.createLinearGradient(pointer.x, pointer.y, nodes[i].x, nodes[i].y);
                g.addColorStop(0, rgba(COLORS.hot, 0.8 * f + 0.1));
                g.addColorStop(1, rgba(COLORS.signal, 0.25 * f));
                ctx.strokeStyle = g;
                ctx.beginPath();
                ctx.moveTo(pointer.x, pointer.y);
                ctx.lineTo(nodes[i].x, nodes[i].y);
                ctx.stroke();
            }
            // the attention head itself
            const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 60);
            halo.addColorStop(0, 'rgba(120,120,255,0.3)');
            halo.addColorStop(1, 'rgba(120,120,255,0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(pointer.x, pointer.y, 60, 0, Math.PI * 2);
            ctx.fill();
        }

        // signals travelling along connections
        for (const s of signals) {
            const a = nodes[s.from], b = nodes[s.to];
            const x = a.x + (b.x - a.x) * s.t;
            const y = a.y + (b.y - a.y) * s.t;
            const tx = a.x + (b.x - a.x) * Math.max(0, s.t - 0.18);
            const ty = a.y + (b.y - a.y) * Math.max(0, s.t - 0.18);
            const g = ctx.createLinearGradient(tx, ty, x, y);
            g.addColorStop(0, rgba(COLORS.signal, 0));
            g.addColorStop(1, rgba(COLORS.hot, 0.9 * s.s));
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        ctx.lineWidth = 1;

        // nodes
        for (const n of nodes) {
            const c = mix(COLORS.idle, COLORS.hot, n.a);
            if (n.a > 0.15) {
                const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 10 + n.a * 14);
                glow.addColorStop(0, rgba([110, 110, 255], 0.45 * n.a));
                glow.addColorStop(1, rgba([110, 110, 255], 0));
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 10 + n.a * 14, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = rgba(c, 0.45 + n.a * 0.55);
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + n.a * 1.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function frame(now) {
        if (!running) return;
        const dt = Math.min(48, now - last);
        last = now;
        step(dt);
        draw();
        requestAnimationFrame(frame);
    }

    function start() {
        if (running || reduceMotion || !visible || document.hidden) return;
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
    }

    function localPoint(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    host.addEventListener('pointermove', (e) => {
        const p = localPoint(e);
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.active = true;
    });
    host.addEventListener('pointerleave', () => {
        pointer.active = false;
    });
    host.addEventListener('pointerdown', (e) => {
        const p = localPoint(e);
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.active = e.pointerType === 'mouse';
        burst(p.x, p.y);
        if (reduceMotion) draw();
    });

    new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
    }).observe(host);

    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            if (reduceMotion) draw();
        }, 150);
    });

    resize();
    // light up a few nodes so the first frame already looks alive
    for (let i = 0; i < 6; i++) nodes[Math.floor(Math.random() * nodes.length)].a = 0.8;
    if (reduceMotion) draw(); else start();
})();
