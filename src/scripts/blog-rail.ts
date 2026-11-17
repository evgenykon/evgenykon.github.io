import type { CollectionEntry } from 'astro:content';

const TRICKS = ['360° spin', 'Backflip', 'Indy grab', 'Method air', 'Rodeo 720'] as const;
type Trick = (typeof TRICKS)[number];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);

/* phase boundaries of one trick, 0..1 */
const APPROACH = 0.2;
const TAKEOFF = 0.3;
const AIR_END = 0.76;
const LAND = 0.88;

/** Arc geometry as fractions of the rail box. */
const ARC = { bx: 0.5, by: 0.52, ax: 0.14, ay: 0.23 };

interface Pose {
  dx: number;
  dy: number;
  rot: number;
  spin: number;
  scale: number;
  crouch: number;
  boardLift: number;
  boardRot: number;
  armFront: number;
  armBack: number;
  air: number;
}

export function initBlogRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;

  const rider = rail.querySelector<HTMLElement>('[data-rider]');
  const spinGroup = rail.querySelector<SVGGElement>('[data-spin]');
  const board = rail.querySelector<SVGGElement>('[data-board]');
  const thighF = rail.querySelector<SVGGElement>('[data-thigh-front]');
  const shinF = rail.querySelector<SVGGElement>('[data-shin-front]');
  const thighB = rail.querySelector<SVGGElement>('[data-thigh-back]');
  const shinB = rail.querySelector<SVGGElement>('[data-shin-back]');
  const armF = rail.querySelector<SVGGElement>('[data-arm-front]');
  const armB = rail.querySelector<SVGGElement>('[data-arm-back]');
  const torso = rail.querySelector<SVGGElement>('[data-torso]');
  const shadow = rail.querySelector<HTMLElement>('[data-shadow]');
  const label = rail.querySelector<HTMLElement>('[data-trick-label]');
  const arc = rail.querySelector<SVGPathElement>('[data-arc]');
  const ramp = rail.querySelector<HTMLElement>('[data-ramp]');
  const burst = rail.querySelector<HTMLElement>('[data-burst]');
  const hudNum = rail.querySelector<HTMLElement>('[data-hud-num]');
  const hudFill = rail.querySelector<HTMLElement>('[data-hud-fill]');
  const trail = rail.querySelector<HTMLElement>('[data-trail]');
  const gates = Array.from(rail.querySelectorAll<HTMLElement>('[data-gate]'));
  const sprays = Array.from(rail.querySelectorAll<HTMLElement>('[data-spray-dot]'));

  const gaps = Array.from(document.querySelectorAll<HTMLElement>('[data-gap]'));
  const articles = Array.from(document.querySelectorAll<HTMLElement>('[data-post]'));
  if (!gaps.length || !articles.length) return;

  let rafId = 0;
  let W = 0;
  let H = 0;

  function measure(): void {
    const box = rail!.getBoundingClientRect();
    W = box.width;
    H = box.height;
    if (arc) {
      const pct = (v: number) => (v * 100).toFixed(2);
      arc.setAttribute(
        'd',
        `M ${pct(ARC.bx - ARC.ax)} ${pct(ARC.by)} Q ${pct(ARC.bx)} ${pct(ARC.by - 2 * ARC.ay)} ${pct(ARC.bx + ARC.ax)} ${pct(ARC.by)}`,
      );
    }
    if (ramp) {
      ramp.style.left = `${(ARC.bx - ARC.ax) * 100}%`;
      ramp.style.top = `${ARC.by * 100}%`;
    }
  }

  /** The trick as a real sequence: ride in, compress, pop, rotate, absorb, ride out. */
  function pose(kind: Trick, t: number): Pose {
    let crouch = 0;
    if (t < APPROACH) crouch = smooth(seg(t, 0, APPROACH)) * 0.85;
    else if (t < TAKEOFF) crouch = 0.85 * (1 - smooth(seg(t, APPROACH, TAKEOFF)));
    else if (t < AIR_END) crouch = 0.3 * smooth(seg(t, TAKEOFF, TAKEOFF + 0.12));
    else if (t < LAND) crouch = 0.95 * smooth(seg(t, AIR_END, LAND));
    else crouch = 0.95 * (1 - smooth(seg(t, LAND, 1)));

    const u = seg(t, TAKEOFF, AIR_END);
    const airborne = t >= TAKEOFF && t <= AIR_END;
    const air = airborne ? Math.sin(Math.PI * u) : 0;

    let dx = 0;
    let dy = 0;
    if (t < TAKEOFF) {
      /* glide in to the lip: 0 → -ax so the pose is continuous at t = 0 */
      dx = -ARC.ax * W * smooth(seg(t, 0, TAKEOFF));
    } else if (airborne) {
      dx = (u - 0.5) * 2 * ARC.ax * W;
      dy = -4 * u * (1 - u) * ARC.ay * H;
    } else {
      const k = smooth(seg(t, AIR_END, 1));
      dx = ARC.ax * W * (1 - k);
      dy = 0;
    }

    const p: Pose = {
      dx,
      dy,
      rot: 0,
      spin: 1,
      scale: 1,
      crouch,
      boardLift: crouch * 6,
      boardRot: 0,
      armFront: 0,
      armBack: 0,
      air,
    };

    if (!airborne) return p;

    switch (kind) {
      case '360° spin':
        p.spin = Math.cos(Math.PI * 2 * u);
        p.rot = 5 * Math.sin(Math.PI * u);
        p.boardLift += 10 * air;
        p.armFront = 18 * air;
        p.armBack = -18 * air;
        break;
      case 'Backflip':
        p.rot = 360 * smooth(u);
        p.boardLift += 14 * air;
        p.armFront = 30 * air;
        p.armBack = 30 * air;
        p.scale = 1 + 0.06 * air;
        break;
      case 'Indy grab':
        p.rot = -12 * air;
        p.boardRot = 26 * air;
        p.boardLift += 26 * air;
        p.armBack = -46 * air;
        p.armFront = 14 * air;
        break;
      case 'Method air':
        p.rot = -26 * air;
        p.boardRot = -40 * air;
        p.boardLift += 22 * air;
        p.armFront = 42 * air;
        p.armBack = -30 * air;
        break;
      case 'Rodeo 720':
        p.spin = Math.cos(Math.PI * 4 * u);
        p.rot = 180 * smooth(u);
        p.boardLift += 18 * air;
        p.armFront = 26 * air;
        p.armBack = -26 * air;
        break;
    }

    return p;
  }

  function apply(p: Pose): void {
    if (rider) {
      rider.style.transform = `translate(-50%, -50%) translate(${p.dx.toFixed(1)}px, ${p.dy.toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg) scale(${p.scale.toFixed(3)})`;
    }
    if (spinGroup) {
      const s = p.spin;
      const sign = s < 0 ? -1 : 1;
      spinGroup.style.transform = `scaleX(${(sign * Math.max(0.3, Math.abs(s))).toFixed(3)})`;
    }
    if (board) {
      board.style.transform = `translateY(${(-p.boardLift).toFixed(1)}px) rotate(${p.boardRot.toFixed(1)}deg)`;
    }
    const c = p.crouch;
    if (thighF) thighF.style.transform = `rotate(${(c * 16).toFixed(1)}deg)`;
    if (thighB) thighB.style.transform = `rotate(${(-c * 16).toFixed(1)}deg)`;
    if (shinF) shinF.style.transform = `rotate(${(-c * 30).toFixed(1)}deg)`;
    if (shinB) shinB.style.transform = `rotate(${(c * 30).toFixed(1)}deg)`;
    if (torso) torso.style.transform = `translateY(${(c * 8).toFixed(1)}px)`;
    if (armF) armF.style.transform = `rotate(${(p.armFront - c * 10).toFixed(1)}deg)`;
    if (armB) armB.style.transform = `rotate(${(p.armBack + c * 10).toFixed(1)}deg)`;
    if (shadow) {
      shadow.style.transform = `scale(${(1 + 0.55 * p.air).toFixed(2)})`;
      shadow.style.opacity = (0.5 - 0.28 * p.air).toFixed(2);
    }
    if (arc) arc.style.opacity = (p.air * 0.55).toFixed(2);
    if (ramp) ramp.style.opacity = p.air > 0.02 ? '0.85' : '0';
    if (burst) {
      burst.style.transform = `scale(${(1 + p.air * 0.4).toFixed(2)})`;
      burst.style.opacity = (p.air * 0.35).toFixed(2);
    }
    sprays.forEach((dot, k) => {
      const ang = (k / sprays.length) * Math.PI * 2 - Math.PI * 0.5;
      const r = 18 + 56 * p.air;
      dot.style.transform = `translate(${(Math.cos(ang) * r).toFixed(1)}px, ${(Math.sin(ang) * r + 18).toFixed(1)}px) scale(${(1 - 0.4 * p.air).toFixed(2)})`;
      dot.style.opacity = (p.air * 0.9).toFixed(2);
    });
  }

  function frame(): void {
    rafId = 0;
    if (window.matchMedia('(max-width: 899px)').matches) return;

    const box = rail!.getBoundingClientRect();
    const line = box.top + box.height * 0.55;
    const scroll = window.scrollY;

    if (trail) trail.style.backgroundPositionY = `${(-scroll * 0.7) % 42}px`;
    if (gates.length) {
      const step = box.height / (gates.length - 1);
      const off = ((-scroll * 0.7) % step + step) % step;
      gates.forEach((gate, i) => {
        gate.style.transform = `translateY(${(off + i * step - step).toFixed(1)}px)`;
      });
    }

    /* one trick per article interval: the rider line sits between two gaps */
    const centers = gaps.map((g) => {
      const r = g.getBoundingClientRect();
      return r.top + r.height / 2;
    });

    let above = -1;
    for (let i = 0; i < centers.length; i++) if (centers[i] <= line) above = i;

    const hasInterval = above >= 0 && above < centers.length - 1;

    if (!hasInterval) {
      apply({
        dx: 0,
        dy: 0,
        rot: Math.sin(scroll * 0.004) * 3,
        spin: 1,
        scale: 1,
        crouch: 0.08 + 0.04 * Math.sin(scroll * 0.006),
        boardLift: 0,
        boardRot: Math.sin(scroll * 0.005) * 4,
        armFront: Math.sin(scroll * 0.005) * 6,
        armBack: -Math.sin(scroll * 0.005) * 6,
        air: 0,
      });
      if (label) label.style.opacity = '0';
    } else {
      const kind = TRICKS[above % TRICKS.length];
      const gapLen = Math.max(1, centers[above + 1] - centers[above]);
      const f01 = clamp((line - centers[above]) / gapLen, 0, 1);
      /* the trick fills the middle 70% of the article interval */
      const t = clamp((f01 - 0.15) / 0.7, 0, 1);
      apply(pose(kind, t));
      if (label) {
        label.textContent = kind;
        const v = Math.min(seg(t, 0.26, 0.4), 1 - seg(t, 0.76, 0.88));
        label.style.opacity = (v * 0.95).toFixed(2);
      }
    }

    if (hudNum) {
      let current = 1;
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].getBoundingClientRect().top <= box.top + box.height * 0.4) current = i + 1;
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
  window.addEventListener('resize', () => {
    measure();
    schedule();
  });
  document.fonts?.ready.then(() => {
    measure();
    schedule();
  });

  measure();
  schedule();
}
