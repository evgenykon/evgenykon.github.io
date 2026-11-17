/**
 * Liquid background: soft drifting blobs + suspended particles.
 *
 * Scrolling gives the field inertia — a particle keeps its old velocity for a
 * moment, then catches up with the page, so the whole field lags behind the
 * content and flows up (or down) after the scroll stops.
 */

interface Particle {
  x: number;
  y: number;
  r: number;
  depth: number;
  vy: number;
  vx: number;
  alpha: number;
  drift: number;
  phase: number;
  twinkle: number;
}

interface Blob {
  x: number;
  y: number;
  r: number;
  depth: number;
  vy: number;
  vx: number;
  alpha: number;
  phase: number;
}

const TAU = Math.PI * 2;

function makeSprite(rgb: string, size = 96): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.45, `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function initFluidBackground(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-fluid]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const root = document.documentElement;
  let W = 0;
  let H = 0;
  let dpr = 1;

  let particleSprite = makeSprite('255,244,205');
  let goldDeep = makeSprite('190,132,20');
  let goldMid = makeSprite('255,199,60');
  let goldPale = makeSprite('255,243,190');

  const particles: Particle[] = [];
  const blobs: Blob[] = [];

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  function seed(): void {
    const density = Math.min(190, Math.max(60, Math.round((W * H) / 13000)));
    particles.length = 0;
    blobs.length = 0;

    for (let i = 0; i < density; i++) {
      const depth = rand(0.15, 1);
      particles.push({
        x: rand(-40, W + 40),
        y: rand(-40, H + 40),
        r: rand(0.6, 2.1) * (0.6 + depth * 0.85),
        depth,
        vy: 0,
        vx: rand(-0.08, 0.08),
        alpha: rand(0.12, 0.4) * (0.45 + depth * 0.7),
        drift: rand(0.06, 0.3),
        phase: rand(0, TAU),
        twinkle: rand(0.5, 2.4),
      });
    }

    for (let i = 0; i < 7; i++) {
      const depth = rand(0.1, 0.5);
      blobs.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(120, 320),
        depth,
        vy: 0,
        vx: rand(-0.05, 0.05),
        alpha: rand(0.035, 0.08),
        phase: rand(0, TAU),
      });
    }
  }

  function resize(): void {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    canvas!.style.width = `${W}px`;
    canvas!.style.height = `${H}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  /* theme change → refresh the sprite tint */
  function retint(): void {
    const light = root.dataset.theme === 'light';
    particleSprite = makeSprite(light ? '60,44,10' : '255,244,205');
    goldDeep = makeSprite(light ? '150,102,10' : '190,132,20');
    goldMid = makeSprite(light ? '230,168,22' : '255,199,60');
    goldPale = makeSprite(light ? '255,224,140' : '255,243,190');
  }

  let lastScroll = window.scrollY;
  let scrollVelocity = 0; // px per frame, smoothed
  let t = 0;

  function frame(): void {
    const sy = window.scrollY;
    const delta = sy - lastScroll;
    lastScroll = sy;
    /* heavy smoothing = the fluid does not react instantly to the wheel */
    scrollVelocity += (delta - scrollVelocity) * 0.1;
    if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;
    t += 0.016;

    ctx!.clearRect(0, 0, W, H);
    ctx!.globalCompositeOperation = 'lighter';
    if (root.dataset.theme === 'light') ctx!.globalCompositeOperation = 'source-over';

    /* big soft volumes of liquid metal */
    for (const b of blobs) {
      const target = -scrollVelocity * b.depth * 0.42;
      b.vy += (target - b.vy) * 0.035;
      b.y += b.vy;
      b.x += b.vx + Math.sin(t * 0.25 + b.phase) * 0.12;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      /* the sheen travels across the blob: deep gold body + moving bright core */
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6 + b.phase * 2);
      ctx!.globalAlpha = b.alpha * (0.75 + 0.55 * pulse);
      ctx!.drawImage(goldDeep, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);

      ctx!.globalAlpha = b.alpha * (0.5 + 1.1 * pulse);
      const coreR = b.r * (0.45 + 0.18 * pulse);
      const cx = b.x + Math.sin(t * 0.5 + b.phase) * b.r * 0.25;
      ctx!.drawImage(goldMid, cx - coreR, b.y - coreR * 0.8, coreR * 2, coreR * 1.6);

      ctx!.globalAlpha = b.alpha * pulse * 0.9;
      const glintR = b.r * 0.3;
      ctx!.drawImage(goldPale, cx - glintR, b.y - glintR * 0.7, glintR * 2, glintR * 1.4);
    }

    /* suspended specks */
    for (const p of particles) {
      /* the scroll drags the fluid: closer particles follow faster, all lag behind */
      const target = -scrollVelocity * p.depth * 1.15;
      p.vy += (target - p.vy) * (0.025 + p.depth * 0.03);
      p.y += p.vy - p.drift * 0.35;
      p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.22 * p.depth;

      if (p.y < -20) {
        p.y = H + 20;
        p.x = rand(-20, W + 20);
      } else if (p.y > H + 20) {
        p.y = -20;
        p.x = rand(-20, W + 20);
      }
      if (p.x < -20) p.x = W + 20;
      else if (p.x > W + 20) p.x = -20;

      const size = p.r * 8;
      const twinkle = 0.55 + 0.45 * Math.sin(t * p.twinkle + p.phase);
      ctx!.globalAlpha = Math.min(1, p.alpha * (0.6 + 0.9 * twinkle));
      ctx!.drawImage(particleSprite, p.x - size / 2, p.y - size / 2, size, size);
    }

    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  }

  resize();
  retint();
  /* debug handle: lets a test read particle positions from the console */
  (window as unknown as Record<string, unknown>).__fluidParticles = particles;
  window.addEventListener('resize', resize);
  new MutationObserver(retint).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  requestAnimationFrame(frame);
}
