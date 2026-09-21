/**
 * Parallax engine — one shared, batched scroll/pointer loop for the whole site.
 *
 * How it works
 *  - A "scene" (section) registers itself. While it is near the viewport the engine writes a single
 *    CSS variable `--p` on its <ParallaxStage> (the layers container, not the content): -1 (scene still below the viewport) … 0 (scene centred) … +1 (scene gone above).
 *  - Layers inside the scene are plain elements whose CSS `transform` is computed from `--p` with calc().
 *    So the browser does the maths on the compositor-friendly `transform`; JS only writes one number.
 *  - A "pointer scene" additionally gets `--mx` / `--my` (-1…1, eased) for mouse depth on desktop.
 *  - The site-wide backdrop element gets `--drift-a`, `--drift-b`, `--dot-shift` (never `<html>`: a variable changed
 *    on the root would restyle the whole page every frame).
 *
 * Cost control: one passive scroll listener, one rAF per frame, only scenes that IntersectionObserver
 * says are (nearly) visible are measured, all reads happen before all writes (no layout thrash).
 * Nothing runs for `prefers-reduced-motion: reduce` (or on low-end / Data-Saver devices) — layers simply stay in
 * their resting composition.
 * Nothing touches `window` during render, so prerender/hydration are unaffected.
 */

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

interface SceneEntry {
  el: HTMLElement;
  /** element that receives --p (the layers container, so content subtrees never restyle on scroll) */
  stage: HTMLElement;
  visible: boolean;
  /** last progress written, to skip redundant style updates */
  last: number;
}

const scenes = new Set<SceneEntry>();
let io: IntersectionObserver | null = null;
let rafId = 0;
let listening = false;
const backdrops = new Set<HTMLElement>();
let reduced = false;
let reducedMq: MediaQueryList | null = null;

/**
 * Weak phones and Data-Saver users get the static composition instead of scroll effects
 * (Chrome exposes deviceMemory / saveData; other browsers simply skip this check).
 */
function isLowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) ||
    (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) ||
    nav.connection?.saveData === true
  );
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function frame() {
  rafId = 0;
  if (reduced) return;

  const vh = window.innerHeight;
  const scrollY = window.scrollY;

  // ── read phase ──
  const updates: Array<[SceneEntry, number]> = [];
  scenes.forEach((s) => {
    if (!s.visible) return;
    const r = s.el.getBoundingClientRect();
    const range = vh / 2 + r.height / 2;
    const p = Math.round(clamp((vh / 2 - (r.top + r.height / 2)) / range, -1, 1) * 2000) / 2000;
    if (p !== s.last) updates.push([s, p]);
  });

  // ── write phase ──
  for (const [s, p] of updates) {
    s.last = p;
    s.stage.style.setProperty('--p', String(p));
  }

  // The backdrop's variables are written on the backdrop element itself (3 small divs) — never on <html>,
  // because a custom property changed on the root would restyle every element on the page each frame.
  if (backdrops.size > 0) {
    const drift = {
      '--scroll': `${scrollY.toFixed(1)}px`,
      '--drift-a': `${(Math.sin(scrollY / 700) * 90).toFixed(1)}px`,
      '--drift-b': `${(Math.cos(scrollY / 900) * 70).toFixed(1)}px`,
      '--dot-shift': `${(-(scrollY * 0.03) % 24).toFixed(2)}px`,
    };
    backdrops.forEach((el) => {
      for (const [k, v] of Object.entries(drift)) el.style.setProperty(k, v);
    });
  }
}

function requestFrame() {
  if (rafId || reduced) return;
  rafId = requestAnimationFrame(frame);
}

function resetVars() {
  scenes.forEach((s) => {
    s.stage.style.removeProperty('--p');
    s.last = NaN;
  });
  backdrops.forEach((el) => {
    ['--scroll', '--drift-a', '--drift-b', '--dot-shift'].forEach((k) => el.style.removeProperty(k));
  });
}

function ensureListening() {
  if (listening || !isBrowser()) return;
  listening = true;

  reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowEnd = isLowEndDevice();
  reduced = reducedMq.matches || lowEnd;
  reducedMq.addEventListener('change', (e) => {
    reduced = e.matches || lowEnd;
    if (reduced) resetVars();
    else requestFrame();
  });

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame, { passive: true });

  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const s of scenes) {
          if (s.el !== entry.target) continue;
          s.visible = entry.isIntersecting;
          // promote layers to compositor layers only while the scene is on/near screen
          if (entry.isIntersecting) s.stage.setAttribute('data-active', '');
          else s.stage.removeAttribute('data-active');
        }
      }
      requestFrame();
    },
    { rootMargin: '25% 0px 25% 0px' },
  );
  scenes.forEach((s) => io!.observe(s.el));
}

/** Register a section as a parallax scene. Returns an unregister function. */
export function registerScene(el: HTMLElement): () => void {
  if (!isBrowser()) return () => {};
  ensureListening();
  const stage = el.querySelector<HTMLElement>('[data-px-stage]') ?? el;
  const entry: SceneEntry = { el, stage, visible: true, last: NaN };
  stage.setAttribute('data-active', '');
  scenes.add(entry);
  io?.observe(el);
  requestFrame();
  return () => {
    scenes.delete(entry);
    io?.unobserve(el);
    stage.style.removeProperty('--p');
    stage.removeAttribute('data-active');
  };
}

/** The site-wide fixed backdrop publishes its drift variables on its own element. */
export function registerBackdrop(el: HTMLElement): () => void {
  if (!isBrowser()) return () => {};
  ensureListening();
  backdrops.add(el);
  requestFrame();
  return () => {
    backdrops.delete(el);
    ['--scroll', '--drift-a', '--drift-b', '--dot-shift'].forEach((k) => el.style.removeProperty(k));
  };
}

/** Eased mouse depth (`--mx`, `--my` in -1…1). Desktop pointers only; a no-op on touch and for reduced motion. */
export function registerPointerScene(el: HTMLElement): () => void {
  if (!isBrowser()) return () => {};
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLowEndDevice()) return () => {};

  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let raf = 0;

  const loop = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    el.style.setProperty('--mx', x.toFixed(4));
    el.style.setProperty('--my', y.toFixed(4));
    if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(loop);
    else raf = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
    ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    kick();
  };
  const onLeave = () => {
    tx = 0;
    ty = 0;
    kick();
  };

  el.addEventListener('pointermove', onMove, { passive: true });
  el.addEventListener('pointerleave', onLeave, { passive: true });
  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    if (raf) cancelAnimationFrame(raf);
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
  };
}
