type TrickKind = 'spin' | 'flip' | 'grab' | 'method' | 'rodeo';

const TRICKS: { kind: TrickKind; label: string }[] = [
  { kind: 'spin', label: '360° spin' },
  { kind: 'flip', label: 'Backflip' },
  { kind: 'grab', label: 'Indy grab' },
  { kind: 'method', label: 'Method air' },
  { kind: 'rodeo', label: 'Rodeo 720' },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function initSnowScene(): void {
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  if (!stage) return;

  const sticky = stage.querySelector<HTMLElement>('[data-sticky]');
  const feed = stage.querySelector<HTMLElement>('[data-feed]');
  const riderBody = stage.querySelector<SVGGElement>('[data-rider-body]');
  const board = stage.querySelector<SVGGElement>('[data-board]');
  const shadow = stage.querySelector<HTMLElement>('[data-shadow]');
  const label = stage.querySelector<HTMLElement>('[data-trick-label]');
  const hint = stage.querySelector<HTMLElement>('[data-hint]');
  const rails = Array.from(stage.querySelectorAll<HTMLElement>('[data-rail]'));
  const gates = Array.from(stage.querySelectorAll<HTMLElement>('[data-gate]'));
  const hudNum = stage.querySelector<HTMLElement>('[data-hud-num]');
  const hudFill = stage.querySelector<HTMLElement>('[data-hud-fill]');
  const sprays = Array.from(stage.querySelectorAll<HTMLElement>('[data-spray-dot]'));

  if (!sticky || !feed) return;

  const cards = Array.from(feed.querySelectorAll<HTMLElement>('[data-card]'));
  if (!cards.length) return;

  const n = cards.length;
  const desktopMq = window.matchMedia('(min-width: 960px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  let enabled = false;
  let H = 0;
  let feedW = 0;
  let scrollable = 1;
  let cardSizes: { w: number; h: number }[] = [];
  let rafId = 0;
  let tint = 0;

  /* ---------------------------------------------------------------
     Mobile / fallback: plain card grid with a soft reveal
     --------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  cards.forEach((card) => revealObserver.observe(card));

  function measure(): void {
    H = sticky!.clientHeight || window.innerHeight;
    feedW = feed!.clientWidth || window.innerWidth * 0.52;
    scrollable = Math.max(1, stage!.offsetHeight - window.innerHeight);
    cardSizes = cards.map((card) => ({ w: card.offsetWidth, h: card.offsetHeight }));
  }

  function resetCards(): void {
    for (const card of cards) {
      card.style.transform = '';
      card.style.opacity = '';
      card.style.willChange = '';
    }
  }

  /* ---------------------------------------------------------------
     Frame
     --------------------------------------------------------------- */
  function frame(): void {
    rafId = 0;
    if (!enabled) return;

    const rect = stage!.getBoundingClientRect();
    const p = clamp(-rect.top / scrollable, 0, 1);
    const s = p * n;

    for (let i = 0; i < n; i++) {
      const card = cards[i];
      const { w, h } = cardSizes[i] ?? { w: 400, h: 200 };
      const d = s - i;

      const centerY = H * 0.55 - (d - 0.5) * H * 0.92;
      const x = Math.max(28, (feedW - w) / 2) + (d - 0.5) * 26;
      const y = centerY - h / 2;
      const rot = clamp(-(d - 0.5) * 3.4, -6, 6);
      const sc = 1 - Math.min(0.07, Math.abs(d - 0.5) * 0.07);
      const opacity =
        clamp((d + 0.16) / 0.3, 0, 1) * clamp((0.98 - d) / 0.22, 0, 1);

      card.style.willChange = 'transform, opacity';
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
    }

    /* trail speed lines */
    const railOffset = (-rect.top * 0.85) % 40;
    for (const rail of rails) {
      rail.style.backgroundPositionY = `${railOffset.toFixed(1)}px`;
    }

    /* gate markers sweeping past — speed cue */
    if (gates.length) {
      const gap = H / (gates.length - 1);
      const gateOffset = ((-rect.top * 0.85) % gap + gap) % gap;
      gates.forEach((gate, i) => {
        gate.style.transform = `translateY(${(gateOffset + i * gap - gap).toFixed(1)}px)`;
      });
    }

    /* progress HUD */
    if (hudNum) {
      const current = Math.min(n, Math.floor(s) + 1);
      hudNum.textContent = String(Math.max(1, current)).padStart(2, '0');
    }
    if (hudFill) {
      hudFill.style.width = `${(p * 100).toFixed(1)}%`;
    }

    /* rider: idle sway + trick between the gates */
    const reduceMotion = motionMq.matches;
    const sr = s + 0.5;
    const idx = Math.max(0, Math.floor(sr));
    const u = sr - idx;
    const trickActive = !reduceMotion && idx > 0 && idx % 2 === 0;
    const from = 0.3;
    const to = 0.7;
    const tt = trickActive ? clamp((u - from) / (to - from), 0, 1) : 0;
    const e = easeInOut(tt);
    const air = Math.sin(Math.PI * tt);

    const trick = TRICKS[Math.floor(idx / 2) % TRICKS.length];
    let rot = 4 * Math.sin(s * 1.7);
    let scale = 1;
    let ty = 0;
    let boardRot = 4 * Math.sin(s * 2.1);

    if (tt > 0) {
      switch (trick.kind) {
        case 'spin':
          rot += 360 * e;
          ty = -10 * air;
          break;
        case 'flip':
          rot += 180 * e;
          scale += 0.18 * air;
          ty = -22 * air;
          break;
        case 'grab':
          boardRot += 30 * air;
          scale -= 0.06 * air;
          ty = -14 * air;
          break;
        case 'method':
          rot -= 26 * air;
          boardRot += -16 * air;
          ty = -18 * air;
          break;
        case 'rodeo':
          rot += 360 * e;
          boardRot += 22 * air;
          ty = -20 * air;
          break;
      }
    }

    const tx = 9 * Math.sin(sr * 2.4);

    if (riderBody) {
      riderBody.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      riderBody.style.transformOrigin = '110px 110px';
    }
    if (board) {
      board.style.transform = `rotate(${boardRot.toFixed(1)}deg)`;
      board.style.transformOrigin = '110px 110px';
    }
    if (shadow) {
      const shadowScale = 1 + 0.5 * air;
      shadow.style.transform = `scale(${shadowScale.toFixed(2)})`;
      shadow.style.opacity = (0.55 - 0.35 * air).toFixed(2);
    }
    if (label) {
      const visible = tt > 0.02 && tt < 0.98;
      label.textContent = trick.label;
      label.style.opacity = visible ? Math.min(1, Math.min(tt, 1 - tt) * 5).toFixed(2) : '0';
      label.style.transform = `translateY(${(6 - 6 * Math.min(1, tt * 2)).toFixed(1)}px)`;
    }
    sprays.forEach((dot, k) => {
      const ang = (k / sprays.length) * Math.PI * 2 - Math.PI * 0.5;
      const r = 22 + 46 * tt;
      dot.style.transform = `translate(${(Math.cos(ang) * r).toFixed(1)}px, ${(Math.sin(ang) * r).toFixed(1)}px) scale(${(0.9 - 0.6 * tt).toFixed(2)})`;
      dot.style.opacity = (air * 0.85).toFixed(2);
    });
    if (hint) {
      hint.style.opacity = p > 0.04 ? '0' : '0.9';
    }
  }

  function schedule(): void {
    if (rafId) return;
    rafId = requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------
     Mode switching
     --------------------------------------------------------------- */
  function applyMode(): void {
    // The scene is layout, not decoration: it stays on for any wide viewport.
    // `prefers-reduced-motion` only switches the tricks/sway off (see frame()).
    const shouldEnable = desktopMq.matches;

    if (shouldEnable === enabled) {
      if (enabled) {
        measure();
        schedule();
      }
      return;
    }

    enabled = shouldEnable;
    document.documentElement.classList.toggle('scene-mode', enabled);
    stage!.classList.toggle('scene-on', enabled);

    if (enabled) {
      // flush layout so sticky/abs positioning is in effect before measuring
      measure();
      requestAnimationFrame(() => {
        measure();
        schedule();
      });
    } else {
      resetCards();
      if (label) label.style.opacity = '0';
      for (const dot of sprays) dot.style.opacity = '0';
      if (hint) hint.style.opacity = '';
    }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    applyMode();
    measure();
    schedule();
  });

  desktopMq.addEventListener('change', applyMode);
  motionMq.addEventListener('change', applyMode);

  // fonts loading shifts card heights — remeasure
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      measure();
      schedule();
    });
  }

  const ro = new ResizeObserver(() => {
    if (enabled) {
      measure();
      schedule();
    }
  });
  ro.observe(sticky);

  applyMode();
  measure();
  schedule();
}
