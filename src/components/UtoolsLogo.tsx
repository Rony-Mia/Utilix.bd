import React from 'react';

type LogoVariant = 'color' | 'reversed' | 'badge' | 'tile';

interface UtoolsLogoProps {
  className?: string;
  size?: number | string;
  /**
   * color    – green U + orange T on a light background (navbar). Default.
   * reversed – white U + orange T straight on a dark background (footer): no badge, no clipping.
   * badge    – colour logo centred in a white circle with breathing room.
   * tile     – colour logo centred in a white rounded square (app-icon look).
   */
  variant?: LogoVariant;
  /** @deprecated use variant="badge" */
  withBackground?: boolean;
}

/**
 * Utools.bd monogram: a green 'U' and an orange 'T'.
 *
 * The artwork spans 200-800 of the 0-1000 drawing canvas, so the viewBox is cropped to it — no invisible margin,
 * which keeps the icon tight to the wordmark. The badge/tile variants use a larger viewBox on purpose: the mark
 * is circular (radius 300), so a background of radius 310 clips it; 400 leaves ~25% padding.
 */
export const UtoolsLogo: React.FC<UtoolsLogoProps> = ({
  className = 'w-8 h-8',
  size,
  variant,
  withBackground = false,
}) => {
  const v: LogoVariant = variant ?? (withBackground ? 'badge' : 'color');
  const padded = v === 'badge' || v === 'tile';
  const uFill = v === 'reversed' ? '#FFFFFF' : '#0B5D3B';

  return (
    <svg
      viewBox={padded ? '100 100 800 800' : '190 190 620 620'}
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Utools.bd লোগো"
    >
      {v === 'badge' && <circle cx="500" cy="500" r="400" fill="#FFFFFF" />}
      {v === 'tile' && <rect x="100" y="100" width="800" height="800" rx="190" fill="#FFFFFF" />}
      {/* 'U' element */}
      <path
        d="M 345 243
           C 255 315 200 420 200 540
           C 200 685 305 798 500 800
           C 536 800 558 755 558 640
           L 558 375
           C 558 360 542 355 525 355
           L 460 355
           C 445 355 440 365 440 380
           L 440 600
           C 440 675 395 715 348 695
           C 305 675 285 615 285 530
           C 285 410 320 300 345 243
           Z"
        fill={uFill}
      />

      {/* 'T' element */}
      <path
        d="M 440 203
           C 460 201 480 200 500 200
           C 665 200 800 335 800 500
           L 700 415
           C 700 415 700 560 690 620
           C 675 710 635 770 572 795
           C 572 795 588 670 588 560
           L 588 385
           C 588 340 545 340 500 340
           L 440 340
           Z"
        fill="#F5A524"
      />
    </svg>
  );
};

export default UtoolsLogo;
