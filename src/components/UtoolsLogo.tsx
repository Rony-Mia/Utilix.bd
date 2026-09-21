import React from 'react';

interface UtoolsLogoProps {
  className?: string;
  size?: number | string;
  withBackground?: boolean;
}

/**
 * Utools.bd official circular monogram logo
 * Hand-crafted vector matching the green 'U' and orange 'T' monogram.
 * The viewBox is cropped to the artwork (it spans 200-800 of the original 0-1000 canvas, plus room for the
 * optional background circle) so the icon has no invisible margin and sits close to the wordmark.
 */
export const UtoolsLogo: React.FC<UtoolsLogoProps> = ({
  className = 'w-8 h-8',
  size,
  withBackground = false,
}) => {
  return (
    <svg
      viewBox="190 190 620 620"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Utools.bd লোগো"
    >
      {withBackground && (
        <circle cx="500" cy="500" r="310" fill="#FFFFFF" />
      )}
      {/* Green 'U' element */}
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
        fill="#0B5D3B"
      />

      {/* Orange 'T' element */}
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
