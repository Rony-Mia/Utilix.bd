import React, { useEffect, useRef } from 'react';

/**
 * Dot + ring cursor follower (desktop mouse only).
 *
 * - A small dot sits exactly on the pointer; a larger ring trails it with easing.
 * - Over links / buttons / other clickable things the ring grows and softly fills; pressing shrinks it.
 * - It hides itself over text fields, selects and canvases, where the native cursor must stay unobstructed.
 * - On elements marked data-cursor-theme="dark" it switches to light/amber colours.
 * - The real system cursor is never hidden, so nothing can be lost or mis-clicked because of this effect.
 *
 * Off for touch devices, `prefers-reduced-motion: reduce`, and print. Nothing touches `window` during render
 * (prerender/hydration safe): the markup is static and all state is toggled through data-* attributes in effects.
 */

const INTERACTIVE =
  'a[href], button:not(:disabled), summary, [role="button"], [role="menuitem"], label[for], ' +
  'input[type="checkbox"], input[type="radio"], input[type="range"], input[type="file"], [data-cursor="hover"]';

const HIDE_OVER =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="button"]):not([type="submit"]):not([type="color"]), ' +
  'textarea, select, canvas, iframe, [contenteditable=""], [contenteditable="true"], [data-cursor="off"]';

export const CursorFollower: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0;
    let ty = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let placed = false;

    const tick = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
      raf = Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const show = () => root.setAttribute('data-show', '');
    const hide = () => root.removeAttribute('data-show');

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        hide();
        return;
      }
      tx = e.clientX;
      ty = e.clientY;
      if (!placed) {
        rx = tx;
        ry = ty;
        placed = true;
      }
      show();
      kick();
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      if (t.closest(HIDE_OVER)) root.setAttribute('data-state', 'hidden');
      else if (t.closest(INTERACTIVE)) root.setAttribute('data-state', 'hover');
      else root.setAttribute('data-state', 'idle');
      root.setAttribute('data-theme', t.closest('[data-cursor-theme="dark"]') ? 'dark' : 'light');
    };

    const onDown = () => root.setAttribute('data-down', '');
    const onUp = () => root.removeAttribute('data-down');
    const onLeave = () => hide();

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('blur', onLeave);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      if (raf) cancelAnimationFrame(raf);
      root.removeAttribute('data-show');
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="cursor-follower no-print" data-state="idle" data-theme="light">
      <div ref={ringRef} className="cf-pos">
        <div className="cf-ring" />
      </div>
      <div ref={dotRef} className="cf-pos">
        <div className="cf-dot" />
      </div>
    </div>
  );
};
