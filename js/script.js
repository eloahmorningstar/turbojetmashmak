// === Copyright protection ===
document.addEventListener('contextmenu', e => { e.preventDefault(); alert("Copyright Kusanagi 2026 Philippines!"); });
document.addEventListener('keydown', e => {
  if (e.key === 'F12') { e.preventDefault(); alert("Copyright Kusanagi 2026 Philippines!"); }
  if (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) { e.preventDefault(); alert("Copyright Kusanagi 2026 Philippines!"); }
  if (e.ctrlKey && e.key.toUpperCase() === 'U') { e.preventDefault(); alert("Copyright Kusanagi 2026 Philippines!"); }
  if (e.key === 'PrintScreen') e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.key === 'S') e.preventDefault();
  if (e.ctrlKey && e.key === 'p') e.preventDefault();
});
document.addEventListener('keyup', e => { if (e.key === 'PrintScreen') { navigator.clipboard.writeText(''); alert("Copyright Kusanagi 2026 Philippines!"); } });
document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });
setInterval(() => {
  if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
    document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:20%;font-family:Orbitron;'>Copyright Kusanagi 2026 Philippines!</h1>";
  }
}, 1000);
window.addEventListener('blur', () => document.body.style.filter = 'blur(20px)');
window.addEventListener('focus', () => document.body.style.filter = 'none');

// === Three.js Background ===
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 60;

const grid = new THREE.GridHelper(200, 50, 0x00ffff, 0x003333);
grid.rotation.x = Math.PI / 2;
grid.material.opacity = 0.15;
grid.material.transparent = true;
scene.add(grid);

const particles = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < 600; i++) {
  positions.push((Math.random()-.5)*200, (Math.random()-.5)*200, (Math.random()-.5)*200);
}
particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const particleSystem = new THREE.Points(particles, new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5, transparent: true, opacity: 0.5 }));
scene.add(particleSystem);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

(function animate() {
  requestAnimationFrame(animate);
  grid.rotation.z += 0.0005;
  particleSystem.rotation.y += 0.001;
  renderer.render(scene, camera);
})();

// === HUD Tech Canvas (map surround) ===
(function() {
  const hc = document.getElementById('hud-canvas');
  const ctx = hc.getContext('2d');
  let W, H, mapRect;
  let t = 0;

  const G = '#FFD700', GD = 'rgba(255,215,0,', GB = '#c8a000';

  // ── STARS ──
  const stars = [];
  function buildStars() {
    stars.length = 0;
    for (let i = 0; i < 280; i++) {
      let x, y, tries = 0;
      do { x = Math.random() * W; y = Math.random() * H; tries++; }
      while (isInMap(x, y, 6) && tries < 20);
      if (isInMap(x, y, 4)) continue;
      stars.push({
        x, y,
        r: Math.random() * 1.3 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.0,
        warm: Math.random() < 0.2
      });
    }
  }

  // ── NEBULA CLOUDS ──
  const nebulas = [];
  function buildNebulas() {
    nebulas.length = 0;
    [
      { fx: 0.08, fy: 0.25 }, { fx: 0.08, fy: 0.75 },
      { fx: 0.92, fy: 0.35 }, { fx: 0.92, fy: 0.65 },
      { fx: 0.5,  fy: 0.07 }, { fx: 0.5,  fy: 0.93 },
    ].forEach(s => {
      const x = s.fx * W, y = s.fy * H;
      if (!isInMap(x, y, 10)) nebulas.push({
        x, y,
        r: 40 + Math.random() * 35,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.5 ? [0, 160, 255] : [80, 0, 200]
      });
    });
  }

  // ── CONSTELLATION NETWORK ──
  const cnodes = [], cconns = [];
  function buildConstellations() {
    cnodes.length = 0; cconns.length = 0;
    for (let attempt = 0; attempt < 200 && cnodes.length < 30; attempt++) {
      const x = Math.random() * W, y = Math.random() * H;
      if (!isInMap(x, y, 12)) cnodes.push({
        x, y,
        r: 1 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.5
      });
    }
    for (let i = 0; i < cnodes.length; i++)
      for (let j = i + 1; j < cnodes.length; j++) {
        const dx = cnodes[i].x - cnodes[j].x, dy = cnodes[i].y - cnodes[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) cconns.push({ a: i, b: j, d });
      }
  }

  // ── WARP LINES ──
  const warps = [];
  function spawnWarp() {
    if (!mapRect) return;
    const side = Math.floor(Math.random() * 4);
    let x, y, angle;
    if (side === 0) { x = Math.random() * mapRect.x; y = Math.random() * H; angle = Math.random() * 0.4 - 0.2; }
    else if (side === 1) { x = mapRect.x + mapRect.w + Math.random() * (W - mapRect.x - mapRect.w); y = Math.random() * H; angle = Math.PI + Math.random() * 0.4 - 0.2; }
    else if (side === 2) { x = Math.random() * W; y = Math.random() * mapRect.y; angle = Math.PI * 0.5 + Math.random() * 0.4 - 0.2; }
    else { x = Math.random() * W; y = mapRect.y + mapRect.h + Math.random() * (H - mapRect.y - mapRect.h); angle = -Math.PI * 0.5 + Math.random() * 0.4 - 0.2; }
    warps.push({ x, y, angle, speed: 1.8 + Math.random() * 3, len: 18 + Math.random() * 45, life: 1, decay: 0.007 + Math.random() * 0.01 });
  }
  function initWarps() { warps.length = 0; for (let i = 0; i < 35; i++) spawnWarp(); }

  function drawSpace() {
    // 1. Nebula glows
    nebulas.forEach(n => {
      const p = 0.035 + 0.02 * Math.sin(t * 0.4 + n.phase);
      const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 1.6);
      gr.addColorStop(0,   `rgba(${n.hue[0]},${n.hue[1]},${n.hue[2]},${p * 2.8})`);
      gr.addColorStop(0.5, `rgba(${n.hue[0]},${n.hue[1]},${n.hue[2]},${p})`);
      gr.addColorStop(1,   `rgba(${n.hue[0]},${n.hue[1]},${n.hue[2]},0)`);
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 1.6, 0, Math.PI * 2); ctx.fill();
    });

    // 2. Stars
    stars.forEach(s => {
      const bright = 0.25 + 0.75 * ((Math.sin(t * s.speed + s.phase) + 1) * 0.5);
      ctx.save();
      ctx.globalAlpha = bright;
      ctx.fillStyle = s.warm ? '#ffeebb' : '#cce8ff';
      ctx.shadowBlur = s.r > 1 ? 5 : 0;
      ctx.shadowColor = s.warm ? '#ffcc44' : '#88ccff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.r > 1 && bright > 0.75) {
        ctx.strokeStyle = s.warm ? '#ffcc44' : '#88ccff';
        ctx.lineWidth = 0.4;
        ctx.globalAlpha = bright * 0.35;
        ctx.beginPath(); ctx.moveTo(s.x - s.r*3, s.y); ctx.lineTo(s.x + s.r*3, s.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s.x, s.y - s.r*3); ctx.lineTo(s.x, s.y + s.r*3); ctx.stroke();
      }
      ctx.restore();
    });

    // 3. Constellation lines + nodes
    cconns.forEach(c => {
      const a = cnodes[c.a], b = cnodes[c.b];
      const alpha = (0.04 + 0.05 * Math.sin(t * 0.3 + a.phase)) * (1 - c.d / 110);
      ctx.save();
      ctx.strokeStyle = `rgba(120,190,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.restore();
    });
    cnodes.forEach(n => {
      const p = 0.35 + 0.65 * ((Math.sin(t * n.speed + n.phase) + 1) * 0.5);
      ctx.save();
      ctx.fillStyle = `rgba(140,210,255,${p * 0.85})`;
      ctx.shadowBlur = 5; ctx.shadowColor = '#88ccff';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });

    // 4. Warp lines
    for (let i = warps.length - 1; i >= 0; i--) {
      const w = warps[i];
      w.x += Math.cos(w.angle) * w.speed;
      w.y += Math.sin(w.angle) * w.speed;
      w.life -= w.decay;
      if (w.life <= 0 || isInMap(w.x, w.y, 2)) { warps.splice(i, 1); spawnWarp(); continue; }
      ctx.save();
      ctx.strokeStyle = `rgba(200,230,255,${w.life * 0.55})`;
      ctx.lineWidth = 0.7;
      ctx.shadowBlur = 3; ctx.shadowColor = '#aaddff';
      ctx.beginPath();
      ctx.moveTo(w.x, w.y);
      ctx.lineTo(w.x - Math.cos(w.angle) * w.len * w.life, w.y - Math.sin(w.angle) * w.len * w.life);
      ctx.stroke();
      ctx.restore();
    }
  }

  function resize() {
    const area = document.querySelector('.map-area');
    const r = area.getBoundingClientRect();
    W = hc.width  = r.width;
    H = hc.height = r.height;
    const mc = document.getElementById('map-container');
    const mr = mc.getBoundingClientRect();
    const ar = area.getBoundingClientRect();
    mapRect = { x: mr.left - ar.left, y: mr.top - ar.top, w: mr.width, h: mr.height };
    buildCircuitTraces();
    buildFloatRects();
    buildStars();
    buildNebulas();
    buildConstellations();
    initWarps();
  }
  window.addEventListener('resize', () => setTimeout(resize, 100));
  setTimeout(resize, 200);

  function isInMap(x, y, pad) {
    pad = pad || 0;
    if (!mapRect) return false;
    return x > mapRect.x - pad && x < mapRect.x + mapRect.w + pad &&
           y > mapRect.y - pad && y < mapRect.y + mapRect.h + pad;
  }

  // ── CIRCUIT TRACES along the outer edges ──
  const traces = [];
  function buildCircuitTraces() {
    traces.length = 0;
    // Generate L-shaped circuit paths confined to border strips
    const strips = [
      { axis:'h', band:{ x:0, y:0, w:W, h: mapRect ? mapRect.y : 30 } },
      { axis:'h', band:{ x:0, y: mapRect ? mapRect.y+mapRect.h : H-30, w:W, h:H } },
      { axis:'v', band:{ x:0, y:0, w: mapRect ? mapRect.x : 30, h:H } },
      { axis:'v', band:{ x: mapRect ? mapRect.x+mapRect.w : W-30, y:0, w:W, h:H } },
    ];
    strips.forEach(strip => {
      for (let i = 0; i < 8; i++) {
        const segs = [];
        let cx, cy;
        if (strip.axis === 'h') {
          cx = Math.random() * strip.band.w;
          cy = strip.band.y + Math.random() * Math.max(4, strip.band.h - strip.band.y);
        } else {
          cx = strip.band.x + Math.random() * Math.max(4, strip.band.w - strip.band.x);
          cy = Math.random() * H;
        }
        for (let s = 0; s < 5; s++) {
          const horiz = (s % 2 === 0);
          const len = 12 + Math.random() * 40;
          const dir = Math.random() < 0.5 ? 1 : -1;
          const nx = horiz ? cx + len * dir : cx;
          const ny = horiz ? cy : cy + len * dir;
          segs.push({ x1: cx, y1: cy, x2: nx, y2: ny });
          cx = nx; cy = ny;
        }
        traces.push({
          segs,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.6,
          bright: 0.3 + Math.random() * 0.4
        });
      }
    });
  }

  // ── FLOATING GRID RECTANGLES (center background feel) ──
  const floatRects = [];
  function buildFloatRects() {
    floatRects.length = 0;
    // Scattered small boxes only in border areas
    for (let i = 0; i < 60; i++) {
      let x, y, tries = 0;
      do {
        x = Math.random() * W;
        y = Math.random() * H;
        tries++;
      } while (isInMap(x, y, 8) && tries < 30);
      if (isInMap(x, y, 4)) continue;
      floatRects.push({
        x, y,
        w: 4 + Math.random() * 16,
        h: 4 + Math.random() * 16,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.5
      });
    }
  }

  // ── CONCENTRIC ARCS — left side ──
  const arcRings = [
    { r: 30, dash: [6,4],  speed:  0.008, startA: -Math.PI*0.7, endA: Math.PI*0.7 },
    { r: 48, dash: [4,6],  speed: -0.006, startA: -Math.PI*0.6, endA: Math.PI*0.6 },
    { r: 65, dash: [8,5],  speed:  0.005, startA: -Math.PI*0.5, endA: Math.PI*0.5 },
    { r: 82, dash: [3,7],  speed: -0.004, startA: -Math.PI*0.4, endA: Math.PI*0.4 },
    { r: 98, dash: [6,8],  speed:  0.003, startA: -Math.PI*0.35,endA: Math.PI*0.35 },
  ];
  const arcAngles = arcRings.map(() => 0);

  // ── PERCENTAGE CIRCLES — top right area ──
  const pctCircles = [
    { pct: 0.86, label: '86%', offset: 0 },
    { pct: 0.60, label: '60%', offset: 1 },
    { pct: 0.40, label: '40%', offset: 2 },
  ];

  // ── SMALL CORNER SQUARES ──
  function drawCornerSquare(x, y, size, alpha) {
    ctx.save();
    ctx.strokeStyle = GD + alpha + ')';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
    ctx.restore();
  }

  // ── SCAN LINE ──
  let scanY = 0;

  function drawCircuitTraces() {
    traces.forEach(tr => {
      const a = tr.bright * (0.5 + 0.5 * Math.sin(t * tr.speed + tr.phase));
      ctx.save();
      ctx.strokeStyle = GD + a + ')';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.shadowColor = G;
      tr.segs.forEach(seg => {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      });
      // dot at end
      const last = tr.segs[tr.segs.length - 1];
      ctx.fillStyle = GD + (a * 2) + ')';
      ctx.beginPath();
      ctx.arc(last.x2, last.y2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawFloatRects() {
    floatRects.forEach(r => {
      const a = 0.04 + 0.06 * Math.sin(t * r.speed + r.phase);
      ctx.save();
      ctx.strokeStyle = GD + a + ')';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = GD + (a * 0.4) + ')';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    });
  }

  function drawConcentrieArcs() {
    if (!mapRect) return;
    // Position: vertically centered on left black strip
    const cx = mapRect.x * 0.5;
    const cy = H * 0.5;
    if (mapRect.x < 60) return;

    arcRings.forEach((ring, i) => {
      arcAngles[i] += ring.speed;
      const pulse = 0.5 + 0.3 * Math.sin(t * 1.2 + i * 0.8);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(arcAngles[i]);
      ctx.setLineDash(ring.dash);
      ctx.strokeStyle = GD + (pulse * 0.7) + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = G;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, ring.startA, ring.endA);
      ctx.stroke();
      ctx.restore();
    });

    // Center dot + inner solid ring
    const cp = 0.6 + 0.4 * Math.sin(t * 2);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = GD + (cp * 0.9) + ')';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.shadowBlur = 12; ctx.shadowColor = G;
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke();
    // dot
    const g = ctx.createRadialGradient(0,0,0, 0,0,10);
    g.addColorStop(0, GD + cp + ')');
    g.addColorStop(1, GD + '0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawPercentageCircles() {
    if (!mapRect) return;
    // Top-right area, above the map
    const topH = mapRect.y;
    if (topH < 30) return;
    const rightX = mapRect.x + mapRect.w;
    const r = Math.min(22, topH * 0.38);
    const spacing = r * 2.8;
    const cy = mapRect.y * 0.52;

    pctCircles.forEach((pc, i) => {
      const cx = rightX - spacing * (pctCircles.length - i - 0.5);
      if (cx < mapRect.x + 10) return;
      const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + i * 1.2);

      // Background ring
      ctx.save();
      ctx.strokeStyle = GD + '0.15)';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      // Progress arc
      ctx.strokeStyle = GD + (pulse * 0.9) + ')';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8; ctx.shadowColor = G;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * pc.pct);
      ctx.stroke();

      // Label
      ctx.fillStyle = GD + pulse + ')';
      ctx.font = `bold ${Math.max(8, r * 0.45)}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 6; ctx.shadowColor = G;
      ctx.fillText(pc.label, cx, cy);
      ctx.restore();
    });
  }

  function drawEdgeUI() {
    if (!mapRect) return;

    // ── Top edge: thin line with notches ──
    const topY = mapRect.y - 8;
    if (topY > 4) {
      ctx.save();
      ctx.strokeStyle = GD + '0.3)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4; ctx.shadowColor = G;
      // full top line
      ctx.beginPath();
      ctx.moveTo(mapRect.x, topY);
      ctx.lineTo(mapRect.x + mapRect.w, topY);
      ctx.stroke();
      // tick marks every ~60px
      ctx.strokeStyle = GD + '0.5)';
      ctx.lineWidth = 1;
      for (let tx = mapRect.x + 30; tx < mapRect.x + mapRect.w - 30; tx += 60) {
        ctx.beginPath();
        ctx.moveTo(tx, topY - 4);
        ctx.lineTo(tx, topY + 4);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Bottom edge: thin line ──
    const botY = mapRect.y + mapRect.h + 8;
    if (botY < H - 4) {
      ctx.save();
      ctx.strokeStyle = GD + '0.3)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4; ctx.shadowColor = G;
      ctx.beginPath();
      ctx.moveTo(mapRect.x, botY);
      ctx.lineTo(mapRect.x + mapRect.w, botY);
      ctx.stroke();
      ctx.restore();
    }

    // ── Left edge vertical line ──
    const leftX = mapRect.x - 8;
    if (leftX > 4) {
      ctx.save();
      ctx.strokeStyle = GD + '0.3)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4; ctx.shadowColor = G;
      ctx.beginPath();
      ctx.moveTo(leftX, mapRect.y);
      ctx.lineTo(leftX, mapRect.y + mapRect.h);
      ctx.stroke();
      ctx.restore();
    }

    // ── Right edge vertical line ──
    const rightX2 = mapRect.x + mapRect.w + 8;
    if (rightX2 < W - 4) {
      ctx.save();
      ctx.strokeStyle = GD + '0.3)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4; ctx.shadowColor = G;
      ctx.beginPath();
      ctx.moveTo(rightX2, mapRect.y);
      ctx.lineTo(rightX2, mapRect.y + mapRect.h);
      ctx.stroke();
      ctx.restore();
    }

    // ── Corner small brackets (outer) ──
    const bsz = 10, boff = 12;
    const corners = [
      { x: mapRect.x - boff - bsz, y: mapRect.y - boff - bsz },
      { x: mapRect.x + mapRect.w + boff, y: mapRect.y - boff - bsz },
      { x: mapRect.x - boff - bsz, y: mapRect.y + mapRect.h + boff },
      { x: mapRect.x + mapRect.w + boff, y: mapRect.y + mapRect.h + boff },
    ];
    const ca = 0.35 + 0.2 * Math.sin(t * 1.5);
    corners.forEach(c => drawCornerSquare(c.x, c.y, bsz, ca));

    // ── Top-left text label ──
    if (mapRect.y > 14) {
      ctx.save();
      ctx.fillStyle = GD + '0.35)';
      ctx.font = '9px Share Tech Mono, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('TACTICAL MAP // MASHMAK', mapRect.x, mapRect.y * 0.4);
      ctx.restore();
    }

    // ── Bottom-right coordinates ──
    if (H - mapRect.y - mapRect.h > 10) {
      ctx.save();
      ctx.fillStyle = GD + '0.3)';
      ctx.font = '9px Share Tech Mono, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('SYS:ONLINE // v2.3', mapRect.x + mapRect.w, mapRect.y + mapRect.h + (H - mapRect.y - mapRect.h) * 0.5);
      ctx.restore();
    }

    // ── Right side: small dashes/rows ──
    const rStrip = W - (mapRect.x + mapRect.w);
    if (rStrip > 20) {
      ctx.save();
      ctx.fillStyle = GD + '0.25)';
      ctx.font = '8px Share Tech Mono, monospace';
      ctx.textAlign = 'center';
      const rx = mapRect.x + mapRect.w + rStrip * 0.5;
      for (let row = 0; row < 6; row++) {
        const ry = mapRect.y + mapRect.h * 0.25 + row * 18;
        ctx.globalAlpha = 0.3 + 0.15 * Math.sin(t * 0.8 + row);
        ctx.fillText('——', rx, ry);
      }
      ctx.restore();
    }
  }

  function drawScanLine() {
    scanY += 0.6;
    if (scanY > H) scanY = 0;
    ctx.save();
    ctx.strokeStyle = GD + '0.15)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 5; ctx.shadowColor = G;
    if (mapRect.x > 2 && !isInMap(4, scanY)) {
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(mapRect.x, scanY); ctx.stroke();
    }
    if (mapRect.x + mapRect.w < W - 2 && !isInMap(W - 4, scanY)) {
      ctx.beginPath(); ctx.moveTo(mapRect.x + mapRect.w, scanY); ctx.lineTo(W, scanY); ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    if (!mapRect) { t += 0.016; requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    drawSpace();
    drawFloatRects();
    drawCircuitTraces();
    drawConcentrieArcs();
    drawPercentageCircles();
    drawEdgeUI();
    drawScanLine();

    requestAnimationFrame(draw);
  }

  draw();
})();
document.querySelectorAll('.radio-list input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.marker').forEach(m => m.style.display = 'none');
    if (radio.value) {
      const el = document.getElementById(radio.value);
      if (el) el.style.display = 'block';
    }
  });
});

// === View counter ===
let count = parseInt(localStorage.getItem('visitCount') || '0') + 1;
document.getElementById('counter').innerText = count;
localStorage.setItem('visitCount', count);

// === Image lightbox ===
const lightbox = document.getElementById('img-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.getElementById('table-popup').addEventListener('click', e => {
  if (e.target.tagName === 'IMG') {
    lightboxImg.src = e.target.src;
    lightbox.classList.add('open');
    e.stopPropagation();
  }
});

lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
const backdrop = document.getElementById('modal-backdrop');
document.getElementById('open-table-btn').addEventListener('click', () => backdrop.classList.add('open'));
document.getElementById('close-table-btn').addEventListener('click', () => backdrop.classList.remove('open'));
backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); });

// === Audio ===
const audio = document.getElementById('myAudio');
const muteBtn = document.getElementById('muteBtn');
function startMusic() {
  audio.volume = 0.1;
  audio.play().catch(() => {});
  window.removeEventListener('click', startMusic);
  window.removeEventListener('keydown', startMusic);
}
window.addEventListener('click', startMusic);
window.addEventListener('keydown', startMusic);
muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '▶ Unmute' : '⏸ Mute';
});
