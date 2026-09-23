import React, { useEffect, useRef, useState } from 'react';
import { registerBackdrop } from './engine.ts';

/**
 * Site-wide fixed backdrop behind every page: two soft brand-coloured glows that drift as you scroll,
 * plus a faint dot grid. It lives outside <main>, so it never touches tool markup, and it is hidden in print.
 * Client-mounted to keep static SSR HTML minimal.
 */
export const SiteBackdrop: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMounted(true);
    if (ref.current) return registerBackdrop(ref.current);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="site-backdrop no-print pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {mounted && (
        <>
          <div
            className="absolute -top-48 -left-48 w-[640px] h-[640px] rounded-full will-change-transform"
            style={{
              background: 'radial-gradient(closest-side, rgba(11,93,59,0.10), rgba(230,244,236,0.55) 45%, transparent)',
              transform: 'translate3d(var(--drift-b, 0px), var(--drift-a, 0px), 0)',
            }}
          />
          <div
            className="absolute top-1/3 -right-56 w-[600px] h-[600px] rounded-full will-change-transform"
            style={{
              background: 'radial-gradient(closest-side, rgba(245,165,36,0.16), rgba(254,243,208,0.5) 45%, transparent)',
              transform: 'translate3d(calc(var(--drift-b, 0px) * -1), calc(var(--drift-a, 0px) * -0.8), 0)',
            }}
          />
          <div
            className="absolute inset-x-0 -top-6 h-[calc(100%+48px)] dot-grid opacity-40 will-change-transform"
            style={{ transform: 'translate3d(0, var(--dot-shift, 0px), 0)' }}
          />
        </>
      )}
    </div>
  );
};
