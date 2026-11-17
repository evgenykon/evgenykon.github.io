/**
 * Liquid background: soft drifting volumes + suspended particles in two muted
 * tones (lilac + deep green).
 *
 * Scrolling gives the field inertia — a particle keeps its old velocity for a
 * moment, then catches up with the page, so the field lags behind the content
 * and flows up (or down) after the scroll stops.
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
  tone: 0 | 1;
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
  tone: 0 | 1;
}

interface Trio {
  deep: HTMLCanvasElement;
  mid: HTMLCanvasElement;
  pale: HTMLCanvasElement;
  spark: HTMLCanvasElement;
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

  /* tone 0 = muted lilac, tone 1 = deep green */
  const sprites: Trio[] = [];

  const particles: Particle[] = [];
  const blobs: Blob[] = [];

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  function buildSprites(): void {
    const light = root.dataset.theme === 'light';
    sprites[0] = {
      deep: makeSprite(light ? '86,78,124' : '74,68,110'),
      mid: makeSprite(light ? '126,116,176' : '126,116,176'),
      pale: makeSprite(light ? '196,190,225' : '196,190,225'),
      spark: makeSprite(light ? '70,62,105' : '214,208,236'),
    };
    sprites[1] = {
      deep: makeSprite(light ? '31,58,46' : '28,52,41'),
      mid: makeSprite(light ? '63,107,82' : '79,125,99'),
      pale: makeSprite(light ? '150,190,168' : '159,199,177'),
      spark: makeSprite(light ? '44,74,58' : '198,224,208'),
    };
  }

  function seed(): void {
    const density = Math.min(420, Math.max(140, Math.round((W * H) / 4800)));
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
        tone: Math.random() < 0.55 ? 0 : 1,
      });
    }

    for (let i = 0; i < 12; i++) {
      const depth = rand(0.1, 0.5);
      blobs.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(120, 330),
        depth,
        vy: 0,
        vx: rand(-0.05, 0.05),
        alpha: rand(0.022, 0.05),
        phase: rand(0, TAU),
        tone: Math.random() < 0.5 ? 0 : 1,
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

  let lastScroll = window.scrollY;
  let scrollVelocity = 0;
  let t = 0;

  function frame(): void {
    const sy = window.scrollY;
    const delta = sy - lastScroll;
    lastScroll = sy;
    scrollVelocity += (delta - scrollVelocity) * 0.1;
    if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;
    t += 0.016;

    ctx!.clearRect(0, 0, W, H);
    ctx!.globalCompositeOperation = root.dataset.theme === 'light' ? 'source-over' : 'lighter';

    /* soft volumes: deep body + slowly breathing lighter core */
    for (const b of blobs) {
      const target = -scrollVelocity * b.depth * 0.42;
      b.vy += (target - b.vy) * 0.035;
      b.y += b.vy;
      b.x += b.vx + Math.sin(t * 0.25 + b.phase) * 0.12;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      const s = sprites[b.tone];
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.45 + b.phase * 2);

      ctx!.globalAlpha = b.alpha * (0.8 + 0.5 * pulse);
      ctx!.drawImage(s.deep, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);

      ctx!.globalAlpha = b.alpha * (0.45 + 0.9 * pulse);
      const coreR = b.r * (0.45 + 0.15 * pulse);
      const cx = b.x + Math.sin(t * 0.4 + b.phase) * b.r * 0.22;
      ctx!.drawImage(s.mid, cx - coreR, b.y - coreR * 0.85, coreR * 2, coreR * 1.7);
    }

    /* suspended specks */
    for (const p of particles) {
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
      ctx!.globalAlpha = Math.min(1, p.alpha * (0.6 + 0.8 * twinkle));
      const sprite = sprites[p.tone].spark;
      ctx!.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
    }

    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  }

  buildSprites();
  resize();
  /* debug handle: lets a test read particle positions from the console */
  (window as unknown as Record<string, unknown>).__fluidParticles = particles;

  window.addEventListener('resize', resize);
  new MutationObserver(() => {
    buildSprites();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  requestAnimationFrame(frame);
}
