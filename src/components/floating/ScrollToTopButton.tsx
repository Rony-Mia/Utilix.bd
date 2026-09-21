import React, { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** easeInOutCubic: gentle start, quick middle, soft landing */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Back-to-top button.
 *  - appears after scrolling down; its ring shows how far through the page you are
 *  - on click it glides to the top with an eased animation (duration grows with distance, max 1.3 s),
 *    the arrow keeps rising and the ring unwinds as you travel up
 *  - any wheel / touch / key / pointer input cancels the glide so it never fights the user
 *  - reduced motion: jumps instantly. Nothing touches `window` during render (prerender-safe).
 */
export const ScrollToTopButton: React.FC = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const stopGlide = useRef<(() => void) | null>(null);

  // visibility + progress ring (one rAF-throttled passive listener; writes only when a value changed)
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    let raf = 0;
    let lastVisible: boolean | null = null;
    let lastProgress = -1;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.round(clamp(max > 0 ? y / max : 0, 0, 1) * 500) / 500;
      const visible = y > Math.max(400, window.innerHeight * 0.6);
      if (progress !== lastProgress) {
        lastProgress = progress;
        btn.style.setProperty('--sp', String(progress));
      }
      if (visible !== lastVisible) {
        lastVisible = visible;
        btn.setAttribute('data-visible', String(visible));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      stopGlide.current?.();
    };
  }, []);

  const goTop = () => {
    const btn = btnRef.current;
    const start = window.scrollY;
    if (start <= 0) return;

    stopGlide.current?.(); // a second click restarts from wherever we are

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      btn?.blur();
      return;
    }

    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto'; // the stylesheet's smooth scrolling would fight our per-frame steps
    btn?.setAttribute('data-launching', '');

    const duration = clamp(450 + Math.sqrt(start) * 16, 600, 1300);
    const t0 = performance.now();
    let frame = 0;
    let cancelled = false;

    const events: Array<keyof WindowEventMap> = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const cancel = () => {
      cancelled = true;
    };
    const finish = () => {
      cancelAnimationFrame(frame);
      events.forEach((e) => window.removeEventListener(e, cancel));
      html.style.scrollBehavior = previousBehavior;
      btn?.removeAttribute('data-launching');
      stopGlide.current = null;
    };
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    stopGlide.current = finish;

    const step = (now: number) => {
      const t = clamp((now - t0) / duration, 0, 1);
      window.scrollTo(0, Math.round(start * (1 - ease(t))));
      if (t < 1 && !cancelled) frame = requestAnimationFrame(step);
      else {
        finish();
        if (t >= 1) btn?.blur();
      }
    };
    frame = requestAnimationFrame(step);
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={goTop}
      aria-label="পেজের উপরে যান"
      title="উপরে যান"
      data-visible="false"
      className="stt"
    >
      <svg className="stt-ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="stt-track" cx="26" cy="26" r="23" />
        <circle className="stt-progress" cx="26" cy="26" r="23" />
      </svg>
      <span className="stt-arrow">
        <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
      </span>
    </button>
  );
};
