import React from 'react';

/** Jamdani-style diamond lattice, used as a tiled background on dark sections. */
export const JAMDANI_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M32 4 60 32 32 60 4 32Z M32 18 46 32 32 46 18 32Z' fill='none' stroke='%23ffffff' stroke-opacity='0.07' stroke-width='1'/%3E%3C/svg%3E\")";

/** Nested-diamond motif (a nod to jamdani weaving). Colour comes from `currentColor`. */
export const Diamond: React.FC<{ className?: string; filled?: boolean }> = ({ className = '', filled = true }) => (
  <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
    <path d="M100 6 194 100 100 194 6 100Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M100 40 160 100 100 160 40 100Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M100 72 128 100 100 128 72 100Z" stroke="currentColor" strokeWidth="1.5" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.25 : 0} />
  </svg>
);

export const Ring: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const SolidDiamond: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 1 23 12 12 23 1 12Z" fill="currentColor" />
  </svg>
);

/**
 * Soft river / paddy-field wave. Stretches to its box; `flip` mirrors it vertically so the same shape
 * can hang from the top edge of a section. Fill comes from `currentColor`.
 */
export const Wave: React.FC<{ className?: string; flip?: boolean; variant?: 0 | 1 | 2 }> = ({
  className = '',
  flip = false,
  variant = 0,
}) => {
  const paths = [
    'M0 90 C 180 30, 340 150, 520 90 S 860 30, 1040 90 S 1300 150, 1440 80 L1440 200 L0 200 Z',
    'M0 70 C 200 140, 380 20, 580 80 S 900 140, 1100 70 S 1340 20, 1440 90 L1440 200 L0 200 Z',
    'M0 100 C 160 40, 360 120, 560 70 S 920 20, 1120 80 S 1340 130, 1440 60 L1440 200 L0 200 Z',
  ];
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d={paths[variant]} fill="currentColor" />
    </svg>
  );
};
