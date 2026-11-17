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

  let particleSprite = makeSprite('236,234,229');
  let blobSprite = makeSprite('212,175,55');

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
    particleSprite = makeSprite(light ? '40,38,34' : '236,234,229');
    blobSprite = makeSprite(light ? '168,134,31' : '212,175,55');
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

    /* big soft volumes of liquid */
    for (const b of blobs) {
      const target = -scrollVelocity * b.depth * 0.42;
      b.vy += (target - b.vy) * 0.035;
      b.y += b.vy;
      b.x += b.vx + Math.sin(t * 0.25 + b.phase) * 0.12;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      ctx!.globalAlpha = b.alpha;
      ctx!.drawImage(blobSprite, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
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
      ctx!.globalAlpha = p.alpha;
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
