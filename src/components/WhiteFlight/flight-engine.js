import source from './points.json';

/** Canvas renderer: all coordinates and listeners are scoped to this instance. */
export function createWhiteFlight(canvas, initialOptions = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setOptions() {}, reset() {}, destroy() {} };
  const options = {
    radius: 140, distance: 90, ambientStrength: 1, speed: 1,
    background: '#ce479c', dotColor: '#fffff4', showGrid: true,
    paused: false, showControls: true, showCaption: true, ...initialOptions,
  };
  let W = 1, H = 1, scale = 1, ox = 0, oy = 0;
  let last = 0, time = 0, raf = 0, destroyed = false;
  const mouse = { x: -10000, y: -10000, px: -10000, py: -10000, vx: 0, vy: 0, active: false };
  const points = source.points.map(([x, y, size], i) => ({
    hx: x, hy: y, x, y, size, vx: 0, vy: 0, energy: 0,
    phase: Math.sin(i * 12.9898) * .8,
  }));
  const cleanups = [];
  const listen = (target, name, fn) => {
    target.addEventListener(name, fn);
    cleanups.push(() => target.removeEventListener(name, fn));
  };

  function resize() {
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const top = options.showCaption ? 60 : 16;
    const bottom = options.showControls ? (W < 600 ? 130 : 50) : 16;
    const usableH = Math.max(1, H - top - bottom);
    scale = Math.max(.001, Math.min(Math.max(1, W - 32) / source.width, usableH / source.height));
    ox = (W - source.width * scale) / 2;
    oy = top + (usableH - source.height * scale) / 2;
    mouse.active = false;
  }
  function move(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * W / rect.width;
    const y = (e.clientY - rect.top) * H / rect.height;
    if (!mouse.active) { mouse.px = x; mouse.py = y; }
    mouse.active = true; mouse.x = x; mouse.y = y;
  }
  function deactivate() { mouse.active = false; }
  listen(canvas, 'pointermove', move);
  listen(canvas, 'pointerdown', e => { move(e); canvas.setPointerCapture(e.pointerId); });
  listen(canvas, 'pointerleave', deactivate);
  listen(canvas, 'pointerup', e => { if (e.pointerType !== 'mouse') deactivate(); });
  listen(canvas, 'pointercancel', deactivate);
  listen(window, 'blur', deactivate);
  listen(window, 'resize', resize);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  function draw(ts) {
    if (destroyed) return;
    const dt = Math.min((ts - last) / 16.667 || 1, 2) * options.speed;
    last = ts;
    const moving = !options.paused && !document.hidden;
    if (moving) time += dt * .016667;
    ctx.globalAlpha = 1;
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, W, H);
    const grid = 25 * scale;
    if (options.showGrid && grid >= 2) {
      ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = .5; ctx.beginPath();
      for (let x = ox % grid; x < W; x += grid) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = oy % grid; y < H; y += grid) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
    }
    const radius = options.radius / scale, travel = options.distance / scale;
    const mx = (mouse.x - ox) / scale, my = (mouse.y - oy) / scale;
    if (moving) {
      mouse.vx += (Math.max(-32, Math.min(32, mouse.x - mouse.px)) - mouse.vx) * .22;
      mouse.vy += (Math.max(-32, Math.min(32, mouse.y - mouse.py)) - mouse.vy) * .22;
      mouse.px = mouse.x; mouse.py = mouse.y;
    }
    ctx.fillStyle = options.dotColor;
    for (const p of points) {
      if (moving) {
        const dx = p.hx - mx, dy = p.hy - my, d = Math.hypot(dx, dy);
        const influence = mouse.active ? Math.max(0, 1 - d / radius) : 0;
        p.energy += (influence - p.energy) * (influence > p.energy ? .12 : .024) * dt;
        const a = Math.atan2(dy, dx), phase = time * 2.3 + p.phase;
        const flow = a + .65 + Math.sin(phase) * .22, force = travel * p.energy;
        const wind = time * .85 + p.hx * .004 + p.hy * .002;
        const flock = Math.pow((1 + Math.sin(time * .65 - p.hx * .006 + p.hy * .0025)) / 2, 6);
        const ambientX = (Math.sin(wind) * 3 + Math.cos(wind * .7) * flock * 11) / scale * options.ambientStrength;
        const ambientY = (Math.cos(wind * .8) * 2.5 - Math.sin(wind * .7) * flock * 9) / scale * options.ambientStrength;
        const targetX = p.hx + ambientX + Math.cos(flow) * force + mouse.vx / scale * p.energy * 1.2;
        const targetY = p.hy + ambientY + Math.sin(flow) * force + mouse.vy / scale * p.energy * 1.2 - Math.sin(phase * .7) * force * .18;
        p.vx += (targetX - p.x) * .012 * dt; p.vy += (targetY - p.y) * .012 * dt;
        const damping = Math.pow(.88, dt); p.vx *= damping; p.vy *= damping;
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
      const x = ox + p.x * scale, y = oy + p.y * scale, size = Math.max(1.7, p.size * scale);
      const velocity = Math.hypot(p.vx, p.vy) * scale;
      if (velocity > .5) {
        ctx.globalAlpha = Math.min(.22, velocity * .045);
        ctx.fillRect(x - p.vx * scale * 1.5 - size / 2, y - p.vy * scale * 1.5 - size / 2, size, size);
      }
      ctx.globalAlpha = 1; ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return {
    setOptions(next) {
      const relayout = (next.showControls !== undefined && next.showControls !== options.showControls)
        || (next.showCaption !== undefined && next.showCaption !== options.showCaption);
      Object.assign(options, next);
      for (const [key, fallback, min, max] of [
        ['radius', 140, 1, 1000], ['distance', 90, 0, 500],
        ['ambientStrength', 1, 0, 5], ['speed', 1, .05, 2],
      ]) options[key] = Number.isFinite(Number(options[key]))
        ? Math.max(min, Math.min(max, Number(options[key]))) : fallback;
      if (relayout) resize();
    },
    reset() {
      for (const p of points) { p.x = p.hx; p.y = p.hy; p.vx = p.vy = p.energy = 0; }
      mouse.active = false; mouse.vx = mouse.vy = 0;
    },
    destroy() {
      destroyed = true; cancelAnimationFrame(raf); observer.disconnect();
      cleanups.forEach(cleanup => cleanup());
    },
  };
}
