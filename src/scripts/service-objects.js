/**
 * Services page: one 3D stage (Three.js) that morphs as you scroll.
 *
 * The same particles regroup into a different formation for each service,
 * flying in and out of the stage between them. Formations are drawn in the
 * AI page's language: glowing dots, thin light-blue links and white signals.
 *
 *   0  Creative Technology    a burst sphere: glowing shell, comets with trails
 *   1  Interaction Design     a sphere bouncing on stacked planes, sending out ripples
 *   2  Software Development   an octree of solid (dot-screen), wire and empty cells
 *   3  AI                     a neural sphere
 *
 * The stage tilts toward the pointer, renders only while on screen and
 * does not animate on its own for prefers-reduced-motion (it still follows scroll).
 */
import * as THREE from "three";

const N = 640;
const STAGE_SCALE = 0.8; // overall size of the formations
const C = { node: 0xb9c8f2, link: 0x7fa0e5, signal: 0xffffff, core: 0x2a2afc, dim: 0x8f9ad6 };
// the objects are a background layer under the text: softer colour, lower contrast
const DIM = 0.5;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- helpers ---------- */
function dotTexture() {
    const s = 64;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    // a crisp disc with only a hair of anti-aliasing at the edge (no soft glow)
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.82, "rgba(255,255,255,1)");
    grad.addColorStop(0.92, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(cv);
}

function pointsMaterial(map, color, size, opacity) {
    return new THREE.PointsMaterial({
        color, size, map, opacity,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
}

const ease = (x) => x * x * (3 - 2 * x);
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function rotateX(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    const y = v.y * c - v.z * s, z = v.y * s + v.z * c;
    v.y = y; v.z = z;
    return v;
}
function rotateY(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    const x = v.x * c + v.z * s, z = -v.x * s + v.z * c;
    v.x = x; v.z = z;
    return v;
}
function rotateZ(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    const x = v.x * c - v.y * s, y = v.x * s + v.y * c;
    v.x = x; v.y = y;
    return v;
}

/* ---------- formations: position of particle i at time t, plus links ---------- */

// 0. Burst sphere: a glowing shell of dust with bright clumps, and comets that
//    shoot from the centre to the shell along curved paths (trails drawn separately)
const SHELL = 440;            // particles 0..439 form the shell
const BURST_R = 2.05;
const BURST_CORE = 0.32;       // the small solid core the comets come from
const rand = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};
const CLUMPS = Array.from({ length: 14 }, (_, k) => {
    const u = rand(k + 1) * 2 - 1, a = rand(k + 50) * Math.PI * 2, r = Math.sqrt(1 - u * u);
    return new THREE.Vector3(Math.cos(a) * r, u, Math.sin(a) * r);
});
const SHELL_PTS = [];
(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < SHELL; i++) {
        let v;
        if (rand(i + 900) < 0.3) {
            // gather some dust around bright clumps
            const c = CLUMPS[i % CLUMPS.length];
            v = new THREE.Vector3(rand(i + 1) - 0.5, rand(i + 2) - 0.5, rand(i + 3) - 0.5).multiplyScalar(0.35).add(c).normalize();
        } else {
            const y = 1 - (i / (SHELL - 1)) * 2, r = Math.sqrt(1 - y * y), a = golden * i;
            v = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
        }
        SHELL_PTS.push(v.multiplyScalar(BURST_R * (0.97 + rand(i + 7) * 0.06)));
    }
})();
const COMETS = Array.from({ length: N - SHELL }, (_, k) => {
    const u = rand(k + 300) * 2 - 1, a = rand(k + 600) * Math.PI * 2, r = Math.sqrt(1 - u * u);
    const dir = new THREE.Vector3(Math.cos(a) * r, u, Math.sin(a) * r);
    const axis = new THREE.Vector3(rand(k + 11) - 0.5, rand(k + 12) - 0.5, rand(k + 13) - 0.5).cross(dir).normalize();
    return {
        dir, axis,
        curl: (rand(k + 20) - 0.5) * 1.6,
        speed: 0.18 + rand(k + 30) * 0.22,
        phase: rand(k + 40),
        start: BURST_CORE * 1.05, // comets leave from the surface of the core
    };
});
const qTmp = new THREE.Quaternion();
// position of comet k at phase p (0 = centre, 1 = shell)
function cometAt(k, p, out) {
    const c = COMETS[k];
    const end = BURST_R * 0.98;
    const r = c.start + (end - c.start) * (1 - (1 - p) ** 2); // ease out toward the shell
    out.copy(c.dir).multiplyScalar(r);
    qTmp.setFromAxisAngle(c.axis, c.curl * p);
    return out.applyQuaternion(qTmp);
}
const burst = {
    pos(i, t, out) {
        if (i < SHELL) out.copy(SHELL_PTS[i]);
        else {
            const k = i - SHELL, c = COMETS[k];
            cometAt(k, (t * c.speed + c.phase) % 1, out);
        }
        rotateY(out, t * 0.12);
        return rotateX(out, 0.15);
    },
    edges() {
        return []; // no links; the comet trails are drawn by the stage
    },
};

// 1. Layered ripples: three stacked planes (grids of particles joined by thin
//    lines), like a soft pillow, and a 3D sphere dropped onto it. The sphere
//    bounces straight up and down in one place; each landing presses the
//    layers in (the top one most) and sends rings out across them.
const RIP_W = 17, RIP_H = 12, RIP_L = 3;
const RIP_PER = RIP_W * RIP_H;            // particles per plane
const RIP_GRID = RIP_PER * RIP_L;         // the spare rest are hidden in this formation
const RIP_Y = [-0.7, -0.2, 0.3];          // plane heights, top plane last
const RIP_GIVE = [0.3, 0.6, 1];           // how much each layer gives, bottom to top
const RIP_R = 0.42;                       // sphere radius
const RIP_P = 2.6;                        // seconds per bounce
const RIP_C = 1.5;                        // ring speed
const RIP_SINK = 0.32;                    // how deep the sphere presses in
// time since the last landing (0 at impact)
const ripSince = (t) => ((t % RIP_P) + RIP_P) % RIP_P;
// how far the pillow is pressed in: a soft pulse around each landing
function ripPress(t) {
    const s = ripSince(t), d = Math.min(s, RIP_P - s);
    return RIP_SINK * Math.exp(-(d * d) / 0.02);
}
// sphere centre: a bounce arc above the top plane, sinking in on landing
function ripSphere(t, out) {
    const p = ripSince(t) / RIP_P;
    return out.set(0, RIP_Y[2] + RIP_R - ripPress(t) + 1.5 * Math.sin(Math.PI * p), 0);
}
const ripView = (t) => ({ x: 0.42, y: -0.35 + Math.sin(t * 0.15) * 0.2 });
const ripples = {
    pos(i, t, out) {
        if (i >= RIP_GRID) {
            // spare particles trace the sphere's outline while it arrives, so they
            // travel as a ring of shapes (not one bright stacked dot); they fade
            // out once the solid ball shows (see uTailHide)
            const k = i - RIP_GRID, n = N - RIP_GRID, a = (k / n) * Math.PI * 2 + t * 0.4;
            ripSphere(t, out);
            out.x += Math.cos(a) * RIP_R * 1.15;
            out.y += Math.sin(a) * RIP_R * 1.15;
        } else {
            const L = Math.floor(i / RIP_PER), g = i % RIP_PER;
            const x = ((g % RIP_W) / (RIP_W - 1)) * 4.6 - 2.3;
            const z = (Math.floor(g / RIP_W) / (RIP_H - 1)) * 2.9 - 1.45;
            const r = Math.hypot(x, z), give = RIP_GIVE[L];
            // the dent under the sphere, deepest on the top layer
            let y = RIP_Y[L] - ripPress(t) * give * Math.exp(-(r * r) / 0.45);
            // rings from this landing and the one before, fading as they spread;
            // lower layers feel them a moment later
            const s = ripSince(t) - (2 - L) * 0.08;
            for (const tau of [s, s + RIP_P]) {
                if (tau < 0) continue;
                const u = r - RIP_C * tau;
                y += 0.2 * give * Math.exp(-tau * 0.8) * Math.sin(u * 6) * Math.exp(-u * u * 2.5);
            }
            out.set(x, y, z);
        }
        const v = ripView(t);
        rotateY(out, v.y);
        return rotateX(out, v.x);
    },
    edges() {
        const e = [];
        for (let L = 0; L < RIP_L; L++)
            for (let z = 0; z < RIP_H; z++)
                for (let x = 0; x < RIP_W; x++) {
                    const i = L * RIP_PER + z * RIP_W + x;
                    if (x < RIP_W - 1) e.push(i, i + 1);
                    if (z < RIP_H - 1) e.push(i, i + RIP_W);
                }
        return e;
    },
    linkOpacity: 0.32,
    noSignals: true, // the rings carry the motion
};

// 2. Octree: a cube split into cells of mixed sizes (after the "Pollen Octree
//    Overprint" artwork and nested-cube sculptures). Cells are a mix of outlines,
//    soft white cubes, dark blue cubes, dot-screen cells (the particles, printed
//    on three visible faces) and empty space. Cubes move one at a time from cell
//    to free cell of the same size (see moveCubes).
const OCT_SOLID = [], OCT_WIRE = [], OCT_EMPTY = [], OCT_WHITE = [], OCT_DARK = [];
const OCT_SPLIT = [1, 0.6, 0.45, 0.3]; // chance a cell splits again, by depth
(() => {
    function build(cx, cy, cz, h, depth, seed) {
        if (depth < OCT_SPLIT.length && rand(seed) < OCT_SPLIT[depth]) {
            let k = 0;
            for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
                build(cx + sx * h / 2, cy + sy * h / 2, cz + sz * h / 2, h / 2, depth + 1, seed * 8 + k + 1);
                k++;
            }
            return;
        }
        const kind = rand(seed + 500);
        const cell = [cx, cy, cz, h];
        if (kind < 0.22) OCT_SOLID.push(cell);
        else if (kind < 0.55) OCT_WIRE.push(cell);
        else if (kind < 0.7) OCT_WHITE.push(cell);
        else if (kind < 0.87) OCT_DARK.push(cell);
        else OCT_EMPTY.push(cell);
    }
    build(0, 0, 0, 1.35, 0, 7);
    if (!OCT_SOLID.length) OCT_SOLID.push([0, 0, 0, 0.6]);
})();

// dot-screen points on the +x, +y, +z faces of each solid cell, spaced so the
// total comes close to N; then trimmed or padded to exactly N
const OCT_PTS = (() => {
    const area = OCT_SOLID.reduce((s, c) => s + 3 * (2 * c[3]) ** 2, 0);
    const sp = Math.sqrt(area / N) * 0.98;
    const pts = [];
    OCT_SOLID.forEach(([cx, cy, cz, h]) => {
        const n = Math.max(2, Math.round((2 * h) / sp));
        for (let a = 0; a < n; a++)
            for (let b = 0; b < n; b++) {
                const u = -h + ((a + 0.5) / n) * 2 * h, v = -h + ((b + 0.5) / n) * 2 * h;
                pts.push(new THREE.Vector3(cx + h, cy + u, cz + v)); // right face
                pts.push(new THREE.Vector3(cx + u, cy + h, cz + v)); // top face
                pts.push(new THREE.Vector3(cx + u, cy + v, cz + h)); // front face
            }
    });
    const out = [];
    for (let i = 0; i < N; i++) out.push(pts[Math.floor((i * pts.length) / N) % pts.length].clone());
    return out;
})();

// isometric-style view that sways a little; shared by particles and outlines
const octRot = (t) => ({ y: 0.785 + Math.sin(t * 0.15) * 0.3, x: 0.55 + Math.sin(t * 0.1) * 0.06 });
const octree = {
    pos(i, t, out) {
        out.copy(OCT_PTS[i]);
        const r = octRot(t);
        rotateY(out, r.y);
        return rotateX(out, r.x);
    },
    edges() {
        return []; // no lanes or running couriers: the cells and outlines carry it
    },
};

// 3. Neural sphere: a Fibonacci sphere with links to near neighbours
const SPHERE = [];
(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const a = golden * i;
        const jitter = 1 + (Math.sin(i * 12.9898) * 0.5) * 0.1;
        SPHERE.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(2.05 * jitter));
    }
})();
const sphere = {
    pos(i, t, out) {
        out.copy(SPHERE[i]);
        rotateY(out, t * 0.18);
        return rotateX(out, Math.sin(t * 0.25) * 0.2);
    },
    edges() {
        const e = [];
        for (let i = 0; i < N; i++) {
            SPHERE.map((p, j) => [j, p.distanceToSquared(SPHERE[i])])
                .filter(([j]) => j !== i)
                .sort((a, b) => a[1] - b[1])
                .slice(0, 2)
                .forEach(([j]) => {
                    if (i < j) e.push(i, j);
                });
        }
        return e;
    },
};

const FORMATIONS = [burst, ripples, octree, sphere];

// Hero: a calm field of particles drifting at different depths behind the hero text.
// Scrolling toward the first service gathers this field into the burst sphere.
const FIELD = Array.from({ length: N }, (_, i) => ({
    x: -7.6 + rand(i + 1100) * 10.8,
    y: -3.5 + rand(i + 1200) * 7,
    z: -5 + rand(i + 1300) * 6.5,
    p: rand(i + 1400) * Math.PI * 2,
}));
const field = {
    pos(i, t, out) {
        const f = FIELD[i];
        // divided by the stage scale so the field still spans the whole screen
        return out.set(
            f.x + Math.sin(t * 0.13 + f.p) * 0.25,
            f.y + Math.cos(t * 0.11 + f.p * 1.3) * 0.25,
            f.z + Math.sin(t * 0.07 + f.p * 0.7) * 0.3,
        ).divideScalar(STAGE_SCALE);
    },
};

/* ---------- particle shapes ----------
   Every particle is one of eight crisp shapes, drawn in the fragment shader:
   0 circle, 1 ring, 2 square, 3 square outline, 4 triangle, 5 triangle outline, 6 plus, 7 x */
const SHAPE_VERT = `
attribute float aShape;
attribute float aAngle;
attribute float aTail;
uniform float uSize;
uniform float uTailHide;
uniform float uScale;
uniform float uMin;
varying float vShape;
varying float vAngle;
varying float vHide;
void main() {
    vHide = aTail * uTailHide;
    vShape = aShape;
    vAngle = aAngle;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(uMin, uSize * (uScale / max(0.001, -mv.z)));
}`;
const SHAPE_FRAG = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vShape;
varying float vAngle;
varying float vHide;
float sdTri(vec2 p, float r) {
    const float k = 1.7320508;
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
}
float sdPlus(vec2 p, float len, float th) {
    p = abs(p);
    return min(max(p.x - len, p.y - th), max(p.y - len, p.x - th));
}
void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    p.y = -p.y;
    float c = cos(vAngle), s = sin(vAngle);
    p = mat2(c, -s, s, c) * p;
    float e = fwidth(p.x) * 0.9;     // about one pixel of anti-aliasing
    float th = 0.16;                 // outline and stroke thickness
    int shape = int(vShape + 0.5);
    float d;
    if (shape == 0) d = length(p) - 0.75;
    else if (shape == 1) d = abs(length(p) - 0.68) - th;
    else if (shape == 2) d = max(abs(p.x), abs(p.y)) - 0.6;
    else if (shape == 3) d = abs(max(abs(p.x), abs(p.y)) - 0.56) - th;
    else if (shape == 4) d = sdTri(p, 0.82);
    else if (shape == 5) d = abs(sdTri(p, 0.74)) - th;
    else if (shape == 6) d = sdPlus(p, 0.8, th);
    else d = sdPlus(mat2(0.7071, -0.7071, 0.7071, 0.7071) * p, 0.8, th);
    float alpha = (1.0 - smoothstep(-e, e, d)) * (1.0 - vHide);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha * uOpacity);
}`;

/* ---------- stage ---------- */
/* Moving gradient behind the whole scroll section: soft light in two colours
   that flows slowly over the navy (grain is a static CSS layer). The two colours change
   with scroll (see PALETTE), so each service has its own mood. It is subtle
   while the formations show and strongest behind Industries. */
const GRADIENT_VERT = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
}`;
const GRADIENT_FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uStrength;
uniform vec2 uRes;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec2 uFocus;
// sine-free hash (Dave Hoskins): stays random at large inputs, so no moire bands
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
}
void main() {
    vec2 uv = vUv;
    float asp = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * asp, uv.y);
    float t = uTime * 0.04;

    // slow flowing field that decides where each colour sits
    vec2 q = p * 1.1 + vec2(fbm(p * 1.2 + t), fbm(p * 1.2 - t + 3.1));
    float n = fbm(q + t * 1.5);
    vec3 light = mix(uColA, uColB, smoothstep(0.3, 0.7, n));

    // light gathers around the focus (behind the formation) and drifts
    vec2 f = vec2(uFocus.x * asp, uFocus.y) + vec2(sin(uTime * 0.11), cos(uTime * 0.09)) * 0.08;
    float d = length(p - f);
    float pool = exp(-d * d * 1.6);
    float wash = smoothstep(0.25, 0.85, n) * 0.55;
    float amount = clamp(pool * 0.85 + wash, 0.0, 1.0) * uStrength;

    vec3 navy = vec3(0.008, 0.0, 0.176);
    vec3 col = mix(navy, light, amount);

    // grain is a static CSS layer on top (.svc-stage::after), not drawn here
    gl_FragColor = vec4(col, 1.0);
}`;

/* Colour pairs per section (site palette: navy, brand blue, violet, lilac, rose).
   0 Creative, 1 Interaction, 2 Software, 3 AI, 4 Industries */
const PALETTE = [
    [0x8c5cff, 0xc35cd6], // violet + magenta-purple
    [0xcecde9, 0xe08fb8], // lilac + soft rose
    [0x2a2afc, 0x7fa0e5], // brand blue + light blue
    [0x4b2bd6, 0x8c5cff], // indigo + violet
    [0xb9a8ff, 0xe08fb8], // lilac-violet + rose (Industries, the fullest)
].map(([a, b]) => [new THREE.Color(a), new THREE.Color(b)]);

function createStage(canvas, steps, outroEl, heroEl) {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (e) {
        return; // no WebGL: the soft glow behind the canvas stays as a calm fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);
    // full-screen gradient, drawn first; it fades in once the last formation disperses
    const bgMat = new THREE.ShaderMaterial({
        vertexShader: GRADIENT_VERT,
        fragmentShader: GRADIENT_FRAG,
        uniforms: {
            uTime: { value: 0 },
            uStrength: { value: 0.4 },
            uRes: { value: new THREE.Vector2(1, 1) },
            uColA: { value: PALETTE[0][0].clone() },
            uColB: { value: PALETTE[0][1].clone() },
            uFocus: { value: new THREE.Vector2(0.74, 0.5) },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
    });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bg.frustumCulled = false;
    bg.renderOrder = -1;
    scene.add(bg);

    const holder = new THREE.Group();
    holder.scale.setScalar(STAGE_SCALE); // formations at 80% of their original size
    scene.add(holder);
    const map = dotTexture();

    // particles
    const pos = new Float32Array(N * 3);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    // Each particle is one of the eight shapes; triangles get a rotation,
    // plus and x stay upright.
    const aShape = new Float32Array(N), aAngle = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        const g = i;
        aShape[i] = Math.floor(rand(g + 2000) * 8);
        aAngle[i] = aShape[i] === 4 || aShape[i] === 5 ? rand(g + 2100) * Math.PI * 2 : 0;
    }
    pGeo.setAttribute("aShape", new THREE.BufferAttribute(aShape, 1));
    pGeo.setAttribute("aAngle", new THREE.BufferAttribute(aAngle, 1));
    // the particles the ripple planes do not use fade out while that formation shows
    const aTail = new Float32Array(N).map((_, i) => (i >= RIP_GRID ? 1 : 0));
    pGeo.setAttribute("aTail", new THREE.BufferAttribute(aTail, 1));
    const pMat = new THREE.ShaderMaterial({
        vertexShader: SHAPE_VERT,
        fragmentShader: SHAPE_FRAG,
        uniforms: {
            uColor: { value: new THREE.Color(C.dim) },
            uOpacity: { value: 0.95 * DIM },
            // large enough to tell the shapes apart (about 9 px on a 1200 px tall screen)
            uSize: { value: 0.125 },
            uScale: { value: 450 },
            uMin: { value: 4 },
            uTailHide: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    holder.add(new THREE.Points(pGeo, pMat));

    // one set of links per formation; each fades in only when its formation settles
    const links = FORMATIONS.map((f) => {
        const idx = f.edges();
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(idx.length * 3), 3));
        const m = new THREE.LineBasicMaterial({ color: C.link, transparent: true, opacity: 0, depthWrite: false });
        const line = new THREE.LineSegments(g, m);
        holder.add(line);
        return { idx, g, m };
    });

    // signals travelling along the current formation's links
    const SIG = 28;
    const sPos = new Float32Array(SIG * 3);
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const sMat = pointsMaterial(map, C.signal, 0.2, 1);
    holder.add(new THREE.Points(sGeo, sMat));
    let sigForm = -1;
    let signals = [];
    const adj = FORMATIONS.map((f, k) => {
        const a = Array.from({ length: N }, () => []);
        const idx = links[k].idx;
        for (let i = 0; i < idx.length; i += 2) {
            a[idx[i]].push(idx[i + 1]);
            a[idx[i + 1]].push(idx[i]);
        }
        return a;
    });
    function resetSignals(k) {
        sigForm = k;
        const idx = links[k].idx;
        if (!idx.length || FORMATIONS[k].noSignals) {
            signals = []; // burst sphere (no links) and ripples (rings carry the motion)
            sPos.fill(0);
            return;
        }
        signals = Array.from({ length: SIG }, () => {
            const e = Math.floor(Math.random() * (idx.length / 2)) * 2;
            return { a: idx[e], b: idx[e + 1], t: Math.random(), v: 1.2 + Math.random() * 1.4 };
        });
    }

    // burst sphere extras: fading comet tails and small bright spots on the rim
    const TRAIL = 9, TRAIL_STEP = 0.028;
    const nC = COMETS.length;
    const tPos = new Float32Array(nC * TRAIL * 6);
    const tCol = new Float32Array(nC * TRAIL * 6);
    for (let c = 0; c < nC; c++) {
        for (let s = 0; s < TRAIL; s++) {
            const a = 1 - s / TRAIL, b2 = 1 - (s + 1) / TRAIL; // white at the head, fading to nothing
            tCol.set([a * 0.85, a * 0.88, a, b2 * 0.85, b2 * 0.88, b2], (c * TRAIL + s) * 6);
        }
    }
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
    tGeo.setAttribute("color", new THREE.BufferAttribute(tCol, 3));
    const tMat = new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
    });
    holder.add(new THREE.LineSegments(tGeo, tMat));

    const spotPos = new Float32Array(CLUMPS.length * 3);
    const spotGeo = new THREE.BufferGeometry();
    spotGeo.setAttribute("position", new THREE.BufferAttribute(spotPos, 3));
    const spotMat = pointsMaterial(map, C.signal, 0.13, 0);
    holder.add(new THREE.Points(spotGeo, spotMat));
    const T1 = new THREE.Vector3(), T2 = new THREE.Vector3();

    // octree extras: outlines of every solid and wire cell, and a few shaded 3D cubes
    const octGroup = new THREE.Group();
    holder.add(octGroup);
    const boxEdges = (cx, cy, cz, h) => {
        const c = [];
        for (const x of [-h, h]) for (const y of [-h, h]) for (const z of [-h, h]) c.push([cx + x, cy + y, cz + z]);
        const pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
        return pairs.flatMap(([a, b]) => [...c[a], ...c[b]]);
    };
    const wirePos = [...OCT_WIRE, ...OCT_SOLID, ...OCT_WHITE, ...OCT_DARK].flatMap((c) => boxEdges(...c));
    const wireGeo = new THREE.BufferGeometry();
    wireGeo.setAttribute("position", new THREE.Float32BufferAttribute(wirePos, 3));
    const wireMat = new THREE.LineBasicMaterial({ color: C.link, transparent: true, opacity: 0, depthWrite: false });
    octGroup.add(new THREE.LineSegments(wireGeo, wireMat));

    // ripple extras: the solid 3D sphere that the planes react to.
    // Dark body with soft light and a lilac rim, so it reads as 3D but stays calm.
    const ballMat = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vN;
            varying vec3 vV;
            void main() {
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vN = normalize(normalMatrix * normal);
                vV = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: `
            uniform vec3 uBody;
            uniform vec3 uRim;
            uniform float uOpacity;
            varying vec3 vN;
            varying vec3 vV;
            void main() {
                vec3 n = normalize(vN);
                float light = clamp(dot(n, normalize(vec3(-0.45, 0.75, 0.5))), 0.0, 1.0);
                float rim = pow(1.0 - clamp(dot(n, normalize(vV)), 0.0, 1.0), 2.4);
                vec3 col = uBody * (0.35 + 0.9 * light) + uRim * rim;
                gl_FragColor = vec4(col, uOpacity);
            }`,
        uniforms: {
            uBody: { value: new THREE.Color(0x2b2470) },
            uRim: { value: new THREE.Color(C.dim).multiplyScalar(0.75) },
            uOpacity: { value: 0 },
        },
        transparent: true,
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(RIP_R, 48, 32), ballMat);
    ball.renderOrder = -0.5; // drawn before the particles, so nodes in front stay visible
    ball.visible = false;
    holder.add(ball);

    // Creative Technology: a small solid core that the comets shoot out of.
    // It swells a little as if it is pushing them out.
    const seedMat = ballMat.clone();
    const seed = new THREE.Mesh(new THREE.SphereGeometry(BURST_CORE, 40, 28), seedMat);
    seed.renderOrder = -0.5; // drawn before the particles, so comets in front stay visible
    seed.visible = false;
    holder.add(seed);
    function drawSeed(w) {
        seed.visible = w > 0.01;
        seedMat.uniforms.uOpacity.value = w * 0.92;
        seedMat.depthWrite = w > 0.6;
        seed.scale.setScalar(1 + Math.sin(t * 2.2) * 0.04);
    }

    // AI: a solid ball, shaded like the Interaction Design one, inside the node sphere.
    // It hides the nodes and links behind it, so the sphere reads in depth.
    const coreMat = ballMat.clone();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.58, 48, 32), coreMat);
    core.renderOrder = -0.5; // drawn before the particles, so nodes in front stay visible
    core.visible = false;
    holder.add(core);
    function drawCore(w) {
        core.visible = w > 0.01;
        coreMat.uniforms.uOpacity.value = w * 0.92;
        coreMat.depthWrite = w > 0.6;
    }

    // Software Development: soft white and dark blue 3D cubes, shaded like the ball
    const whiteMat = ballMat.clone();
    whiteMat.uniforms.uBody.value.set(0x9aa0d0);
    whiteMat.uniforms.uRim.value.set(0x9aa0d0).multiplyScalar(0.35);
    const darkMat = ballMat.clone();
    darkMat.uniforms.uBody.value.set(0x1b2a8c);
    darkMat.uniforms.uRim.value.set(C.dim).multiplyScalar(0.5);
    const unitBox = new THREE.BoxGeometry(1.94, 1.94, 1.94); // a hair smaller than its cell
    const slots = [...OCT_WHITE, ...OCT_DARK, ...OCT_WIRE, ...OCT_EMPTY].map(([x, y, z, h]) => ({ p: new THREE.Vector3(x, y, z), h }));
    const taken = new Set();
    const cubes = [];
    [...OCT_WHITE, ...OCT_DARK].forEach((c, n) => {
        const mesh = new THREE.Mesh(unitBox, n < OCT_WHITE.length ? whiteMat : darkMat);
        mesh.scale.setScalar(c[3]);
        mesh.position.copy(slots[n].p);
        mesh.renderOrder = -0.5; // drawn before the particles, so dots in front stay visible
        octGroup.add(mesh);
        taken.add(n);
        cubes.push({ mesh, slot: n, from: null, start: 0 });
    });
    const MOVE = 1.1; // seconds per move
    let nextMove = 1;
    function moveCubes() {
        if (t >= nextMove) {
            nextMove = t + 0.9 + Math.random() * 0.6;
            const idle = cubes.filter((c) => !c.from);
            const cube = idle[Math.floor(Math.random() * idle.length)];
            if (cube) {
                const h = slots[cube.slot].h;
                const free = slots.map((s, n) => n).filter((n) => !taken.has(n) && Math.abs(slots[n].h - h) < 1e-6);
                if (free.length) {
                    // prefer a nearby cell, so moves read as steps through the structure
                    free.sort((a, b) => slots[a].p.distanceTo(slots[cube.slot].p) - slots[b].p.distanceTo(slots[cube.slot].p));
                    const to = free[Math.floor(Math.random() * Math.min(3, free.length))];
                    taken.delete(cube.slot);
                    taken.add(to);
                    cube.from = slots[cube.slot].p;
                    cube.slot = to;
                    cube.start = t;
                }
            }
        }
        cubes.forEach((c) => {
            if (!c.from) return;
            const u = clamp01((t - c.start) / MOVE);
            c.mesh.position.lerpVectors(c.from, slots[c.slot].p, ease(u));
            if (u >= 1) c.from = null;
        });
    }

    function drawOctExtras(w) {
        wireMat.opacity = w * 0.6 * DIM;
        whiteMat.uniforms.uOpacity.value = w * 0.8;
        darkMat.uniforms.uOpacity.value = w * 0.92;
        whiteMat.depthWrite = darkMat.depthWrite = w > 0.6;
        octGroup.visible = w > 0.01;
        if (!octGroup.visible) return;
        const r = octRot(t);
        octGroup.rotation.set(r.x, r.y, 0);
        if (!reduceMotion) moveCubes();
    }

    function drawRippleExtras(w, zoom) {
        ball.visible = w > 0.01;
        if (!ball.visible) return;
        ballMat.uniforms.uOpacity.value = w * 0.92;
        // hides the grid behind it only while clearly visible
        ballMat.depthWrite = w > 0.6;
        ripSphere(t, T1);
        const v = ripView(t);
        rotateX(rotateY(T1, v.y), v.x);
        // follows the same zoom-through as the particles
        T1.multiplyScalar(1 + zoom * 2.6);
        T1.z += zoom * zoom * 13;
        ball.position.copy(T1);
        ball.scale.setScalar(1 + zoom * 2.6);
    }

    function drawBurstExtras(w) {
        tMat.opacity = w * 0.72 * DIM;
        spotMat.opacity = w * (0.85 + Math.sin(t * 1.7) * 0.15) * DIM;
        if (w < 0.01) return;
        for (let c = 0; c < nC; c++) {
            const cm = COMETS[c];
            const p = (t * cm.speed + cm.phase) % 1;
            for (let s = 0; s < TRAIL; s++) {
                cometAt(c, Math.max(0, p - s * TRAIL_STEP), T1);
                cometAt(c, Math.max(0, p - (s + 1) * TRAIL_STEP), T2);
                rotateX(rotateY(T1, t * 0.12), 0.15);
                rotateX(rotateY(T2, t * 0.12), 0.15);
                tPos.set([T1.x, T1.y, T1.z, T2.x, T2.y, T2.z], (c * TRAIL + s) * 6);
            }
        }
        tGeo.attributes.position.needsUpdate = true;
        CLUMPS.forEach((v, k) => {
            T1.copy(v).multiplyScalar(BURST_R);
            rotateX(rotateY(T1, t * 0.12), 0.15);
            spotPos.set([T1.x, T1.y, T1.z], k * 3);
        });
        spotGeo.attributes.position.needsUpdate = true;
    }

    const A = new THREE.Vector3(), B = new THREE.Vector3();
    let isWide = true;
    let stageW = 1, stageH = 1;
    // which side each formation sits on: 0 = right (text left), 1 = left (text right)
    const SIDE = [0, 1, 0, 1];
    let side = 0;

    // The stage fills the screen, but the formation sits at 74% (right) or 26% (left)
    // across. Shifting the view (not the objects) puts the vanishing point there too,
    // so zooming through flies straight into the formation.
    function applyView() {
        if (!isWide) return;
        const fullW = stageW * 1.48;
        camera.setViewOffset(fullW, stageH, side * (fullW - stageW), 0, stageW, stageH);
    }

    function resize() {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        stageW = w;
        stageH = h;
        renderer.setSize(w, h, false);
        // shape sizes in device pixels, like PointsMaterial's size attenuation
        const pr = renderer.getPixelRatio();
        pMat.uniforms.uScale.value = h * pr * 0.5;
        pMat.uniforms.uMin.value = 5 * pr;
        bgMat.uniforms.uRes.value.set(w, h);
        // narrow stages need the camera further back so wide formations fit
        camera.position.z = 8.4 * Math.max(1, 0.95 / (w / h));
        isWide = w > 1024;
        if (isWide) {
            camera.aspect = (w * 1.48) / h;
            applyView();
        } else {
            camera.aspect = w / h;
            camera.clearViewOffset();
        }
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // scroll position: -1 in the hero, 0..3 across the four services
    // (0 = first service centred), then 3..4 as Industries arrives (the outro)
    let target = 0, current = 0;
    function measure() {
        const vc = window.innerHeight / 2;
        const centres = steps.map((el) => {
            const r = el.getBoundingClientRect();
            return r.top + r.height / 2;
        });
        if (heroEl) {
            const r = heroEl.getBoundingClientRect();
            centres.unshift(r.top + r.height / 2);
        }
        if (outroEl) centres.push(outroEl.getBoundingClientRect().top + window.innerHeight * 0.4);
        let s;
        if (vc <= centres[0]) s = 0;
        else if (vc >= centres[centres.length - 1]) s = centres.length - 1;
        else {
            for (let i = 0; i < centres.length - 1; i++) {
                if (vc >= centres[i] && vc < centres[i + 1]) {
                    s = i + (vc - centres[i]) / (centres[i + 1] - centres[i]);
                    break;
                }
            }
        }
        target = heroEl ? s - 1 : s;
        const active = Math.round(target);
        steps.forEach((el, i) => el.classList.toggle("is-active", i === active));
    }
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    current = target;

    // pointer tilt
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener("pointermove", (e) => {
        tilt.tx = (e.clientX / window.innerWidth) * 2 - 1;
        tilt.ty = (e.clientY / window.innerHeight) * 2 - 1;
    });

    let t = 0, flowT = 0, last = performance.now(), running = false;

    function draw(dt) {
        current += (target - current) * (reduceMotion ? 1 : 0.07);
        const LAST = FORMATIONS.length - 1;
        const outro = clamp01(current - LAST); // 0..1 as Industries arrives
        const intro = clamp01(-current); // 1 in the hero, 0 at the first service
        const base = Math.max(0, Math.min(current, LAST));
        const k = Math.min(LAST, Math.floor(base));
        const next = Math.min(LAST, k + 1);
        const b = base - k; // 0..1 between formation k and next
        // links, signals and extras only show once a formation has arrived
        const fade = clamp01(1 - outro * 3) * clamp01(1 - intro * 3);

        for (let i = 0; i < N; i++) {
            // zoom through: the current formation swells and rushes past the camera,
            // filling the screen, then the next one arrives from deep in the distance.
            // A small stagger means particles do not all move at once.
            const bi = clamp01(b * 1.25 - (i / N) * 0.25);
            if (intro > 0) {
                // intro: the hero's drifting field gathers into the first formation
                const v = ease(clamp01(1 - intro * 1.2 + (i / N) * 0.2));
                field.pos(i, t, A);
                FORMATIONS[0].pos(i, t, B);
                A.lerp(B, v);
            } else if (outro > 0) {
                // outro: the last formation disperses completely past the camera
                // quick: gone by about halfway, so Industries shows only the gradient
                const u = ease(clamp01(outro * 2.2 - (i / N) * 0.2));
                FORMATIONS[LAST].pos(i, t, A);
                A.multiplyScalar(1 + u * 2.6);
                A.z += u * u * 13;
            } else if (bi < 0.5) {
                const u = ease(bi * 2);
                FORMATIONS[k].pos(i, t, A);
                A.multiplyScalar(1 + u * 2.6);
                A.z += u * u * 13;
            } else {
                const v = ease((bi - 0.5) * 2);
                FORMATIONS[next].pos(i, t, A);
                A.z -= (1 - v) * (1 - v) * 22;
            }
            pos[i * 3] = A.x;
            pos[i * 3 + 1] = A.y;
            pos[i * 3 + 2] = A.z;
        }
        pGeo.attributes.position.needsUpdate = true;

        // links: visible only near a settled formation
        links.forEach((L, f) => {
            let w = 0;
            if (f === k) w = clamp01(1 - b * 4);
            if (f === next && next !== k) w = Math.max(w, clamp01((b - 0.75) * 4));
            w *= fade;
            L.m.opacity = w * (FORMATIONS[f].linkOpacity ?? 0.3) * DIM;
            if (w > 0.01) {
                const p = L.g.attributes.position;
                for (let e = 0; e < L.idx.length; e++) {
                    const j = L.idx[e];
                    p.setXYZ(e, pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                }
                p.needsUpdate = true;
            }
        });

        // signals ride the formation that is closest to settled
        const dom = b < 0.5 ? k : next;
        if (dom !== sigForm) resetSignals(dom);
        const settle = clamp01(1 - Math.abs(b - (b < 0.5 ? 0 : 1)) * 4);
        // formations without signals park them at the centre, so hide the layer then
        sMat.opacity = signals.length ? settle * fade * DIM : 0;
        signals.forEach((s, n) => {
            s.t += s.v * dt;
            if (s.t >= 1) {
                const nbr = adj[dom][s.b].filter((x) => x !== s.a);
                const pick = nbr.length ? nbr : adj[dom][s.b];
                s.a = s.b;
                s.b = pick.length ? pick[Math.floor(Math.random() * pick.length)] : s.b;
                s.t = 0;
            }
            const u = s.t;
            sPos[n * 3] = pos[s.a * 3] + (pos[s.b * 3] - pos[s.a * 3]) * u;
            sPos[n * 3 + 1] = pos[s.a * 3 + 1] + (pos[s.b * 3 + 1] - pos[s.a * 3 + 1]) * u;
            sPos[n * 3 + 2] = pos[s.a * 3 + 2] + (pos[s.b * 3 + 2] - pos[s.a * 3 + 2]) * u;
        });
        sGeo.attributes.position.needsUpdate = true;

        // burst sphere trails and rim spots, only while it is the settled formation
        drawBurstExtras(k === 0 ? clamp01(1 - b * 3) * clamp01(1 - intro * 3) : 0);
        // the sphere zooms out with the planes, and arrives settled with them
        const ripOut = k === 1 && outro === 0 ? ease(Math.min(1, clamp01(b * 1.25 - 0.12) * 2)) : 0;
        // spare particles: hidden while the ripples are the main formation
        pMat.uniforms.uTailHide.value = clamp01(1 - Math.abs(base - 1) * 2.5) * (1 - intro);
        drawRippleExtras(
            (k === 1 ? clamp01(1 - b * 2.2) : next === 1 ? clamp01((b - 0.8) * 5) : 0) * fade,
            ripOut,
        );
        drawSeed(k === 0 ? clamp01(1 - b * 3) * clamp01(1 - intro * 3) : 0);
        drawCore((k === 3 ? 1 : next === 3 ? clamp01((b - 0.8) * 5) : 0) * fade);
        drawOctExtras((k === 2 ? clamp01(1 - b * 3) : next === 2 ? clamp01((b - 0.75) * 4) : 0) * fade);

        // background gradient: colours follow the scroll, strength rises for Industries
        const pc = Math.max(0, current); // the hero uses the first section's colours
        const pi = Math.min(PALETTE.length - 1, Math.floor(pc));
        const pn = Math.min(PALETTE.length - 1, pi + 1);
        const pb = ease(clamp01(pc - pi));
        bgMat.uniforms.uColA.value.copy(PALETTE[pi][0]).lerp(PALETTE[pn][0], pb);
        bgMat.uniforms.uColB.value.copy(PALETTE[pi][1]).lerp(PALETTE[pn][1], pb);
        bgMat.uniforms.uStrength.value = 0.42 + ease(outro) * 0.2;
        // object side follows the scroll; it switches mid-transition while dispersed
        const sideTarget = SIDE[k] + (SIDE[next] - SIDE[k]) * ease(clamp01((b - 0.3) / 0.4));
        side = sideTarget;
        applyView();
        const focusX = 0.74 - side * 0.48;
        bgMat.uniforms.uFocus.value.set(isWide ? focusX + (0.5 - focusX) * ease(outro) * 0.4 : 0.5, 0.5);
        // the gradient flows faster once it is on its own behind Industries
        flowT += dt * (1 + ease(outro) * 3);
        bgMat.uniforms.uTime.value = flowT;
        // particles are hidden completely once they have left
        pMat.uniforms.uOpacity.value = 0.95 * DIM * clamp01(1 - (outro - 0.3) * 4) * (1 - intro * 0.35);

        tilt.x += (tilt.tx - tilt.x) * 0.05;
        tilt.y += (tilt.ty - tilt.y) * 0.05;
        holder.rotation.y = tilt.x * 0.3;
        holder.rotation.x = tilt.y * 0.2;

        renderer.render(scene, camera);
    }

    function frame(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduceMotion) t += dt;
        draw(dt);
        requestAnimationFrame(frame);
    }

    new IntersectionObserver(
        (entries) => {
            const visible = entries[0].isIntersecting;
            if (visible && !running) {
                running = true;
                last = performance.now();
                requestAnimationFrame(frame);
            } else if (!visible) {
                running = false;
            }
        },
        { rootMargin: "100px" },
    ).observe(canvas.closest(".svc-scrolly") || canvas);
}

const stageCanvas = document.querySelector("canvas[data-formations]");
const stepEls = Array.from(document.querySelectorAll(".svc-step"));
if (stageCanvas && stepEls.length) {
    document.documentElement.classList.add("svc-js");
    createStage(stageCanvas, stepEls, document.querySelector(".svc-outro"), document.querySelector(".svc-hero"));
}
