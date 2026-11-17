import type { CollectionEntry } from 'astro:content';

const TRICKS = ['360° spin', 'Backflip', 'Indy grab', 'Method air', 'Rodeo 720'] as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Scroll-driven rider for the blog stream.
 *
 * The rail is sticky; the page scrolls full articles past it. Between two
 * articles there is a `.post-gap` spacer — when one crosses the rider's line,
 * the rider throws a trick (all five are cycled in order).
 */
export function initBlogRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;

  const riderBody = rail.querySelector<SVGGElement>('[data-rider-body]');
  const board = rail.querySelector<SVGGElement>('[data-board]');
  const shadow = rail.querySelector<HTMLElement>('[data-shadow]');
  const label = rail.querySelector<HTMLElement>('[data-trick-label]');
  const hudNum = rail.querySelector<HTMLElement>('[data-hud-num]');
  const hudFill = rail.querySelector<HTMLElement>('[data-hud-fill]');
  const trail = rail.querySelector<HTMLElement>('[data-trail]');
  const gates = Array.from(rail.querySelectorAll<HTMLElement>('[data-gate]'));
  const sprays = Array.from(rail.querySelectorAll<HTMLElement>('[data-spray-dot]'));

  const gaps = Array.from(document.querySelectorAll<HTMLElement>('[data-gap]'));
  const articles = Array.from(document.querySelectorAll<HTMLElement>('[data-post]'));
  if (!gaps.length || !articles.length) return;

  let rafId = 0;

  function frame(): void {
    rafId = 0;
    if (window.matchMedia('(max-width: 899px)').matches) return;

    const box = rail!.getBoundingClientRect();
    const line = box.top + box.height * 0.45;
    const scroll = window.scrollY;

    /* speed cues moving with the page */
    if (trail) trail.style.backgroundPositionY = `${(-scroll * 0.7) % 42}px`;
    if (gates.length) {
      const step = box.height / (gates.length - 1);
      const off = ((-scroll * 0.7) % step + step) % step;
      gates.forEach((gate, i) => {
        gate.style.transform = `translateY(${(off + i * step - step).toFixed(1)}px)`;
      });
    }

    /* closest article gap to the rider line → the trick */
    let closest = -1;
    let closestDist = Infinity;
    for (let i = 0; i < gaps.length; i++) {
      const r = gaps[i].getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - line);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }

    const trickWindow = Math.max(180, box.height * 0.3);
    const tt = closest >= 0 ? clamp(1 - closestDist / trickWindow, 0, 1) : 0;
    const e = easeInOut(tt);
    const air = Math.sin(Math.PI * tt);
    const trick = TRICKS[Math.max(0, closest) % TRICKS.length];

    let rot = Math.sin(scroll * 0.004) * 5;
    let scale = 1;
    let ty = 0;
    let boardRot = Math.sin(scroll * 0.005) * 5;

    if (tt > 0) {
      switch (trick) {
        case '360° spin':
          rot += 360 * e;
          ty = -10 * air;
          break;
        case 'Backflip':
          rot += 180 * e;
          scale += 0.18 * air;
          ty = -22 * air;
          break;
        case 'Indy grab':
          boardRot += 30 * air;
          scale -= 0.06 * air;
          ty = -14 * air;
          break;
        case 'Method air':
          rot -= 26 * air;
          boardRot -= 16 * air;
          ty = -18 * air;
          break;
        case 'Rodeo 720':
          rot += 360 * e;
          boardRot += 22 * air;
          ty = -20 * air;
          break;
      }
    }

    if (riderBody) {
      riderBody.style.transform = `translate(${(Math.sin(scroll * 0.006) * 6).toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    }
    if (board) board.style.transform = `rotate(${boardRot.toFixed(1)}deg)`;
    if (shadow) {
      shadow.style.transform = `scale(${(1 + 0.5 * air).toFixed(2)})`;
      shadow.style.opacity = (0.55 - 0.35 * air).toFixed(2);
    }
    if (label) {
      label.textContent = trick;
      label.style.opacity = tt > 0.05 ? Math.min(1, Math.min(tt, 1 - tt) * 6).toFixed(2) : '0';
    }
    sprays.forEach((dot, k) => {
      const ang = (k / sprays.length) * Math.PI * 2 - Math.PI * 0.5;
      const r = 22 + 46 * tt;
      dot.style.transform = `translate(${(Math.cos(ang) * r).toFixed(1)}px, ${(Math.sin(ang) * r).toFixed(1)}px) scale(${(0.9 - 0.6 * tt).toFixed(2)})`;
      dot.style.opacity = (air * 0.85).toFixed(2);
    });

    /* HUD: which article is at the rider line + progress through the feed */
    if (hudNum) {
      let current = 1;
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].getBoundingClientRect().top <= line) current = i + 1;
      }
      hudNum.textContent = String(current).padStart(2, '0');
    }
    if (hudFill) {
      const first = articles[0].getBoundingClientRect().top + scroll;
      const lastEl = articles[articles.length - 1];
      const last = lastEl.getBoundingClientRect().bottom + scroll;
      const p = clamp((scroll + line - first) / Math.max(1, last - first), 0, 1);
      hudFill.style.width = `${(p * 100).toFixed(1)}%`;
    }
  }

  function schedule(): void {
    if (rafId) return;
    rafId = requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule);

  schedule();
}
