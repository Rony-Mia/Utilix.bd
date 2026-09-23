import React from 'react';

/**
 * Shared SVG sprite symbols to eliminate redundant SVG path markup across repeated icons.
 * Embedded once in the DOM; referenced via <use href="#id" />.
 */
export const IconSprite: React.FC = () => (
  <svg style={{ display: 'none' }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Lucide ArrowRight */}
      <symbol id="icon-arrow-right" viewBox="0 0 24 24">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </symbol>
      {/* Lucide ChevronDown */}
      <symbol id="icon-chevron-down" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </symbol>
      {/* Lucide CheckCircle2 / CircleCheck */}
      <symbol id="icon-check-circle" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </symbol>
    </defs>
  </svg>
);

export interface SvgIconProps {
  name: 'arrow-right' | 'chevron-down' | 'check-circle';
  className?: string;
  style?: React.CSSProperties;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ name, className = 'w-4 h-4', style }) => (
  <svg
    className={`lucide shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={style}
  >
    <use href={`#icon-${name}`} />
  </svg>
);
