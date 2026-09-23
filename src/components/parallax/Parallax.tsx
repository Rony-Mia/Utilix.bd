import React, { useEffect, useRef, useState } from 'react';
import { registerPointerScene, registerScene } from './engine.ts';

/**
 * <ParallaxScene>  – a section; put its decorative layers inside one <ParallaxStage> and its content after it.
 *                    The stage publishes the scene's scroll progress as the CSS variable `--p` (-1…1).
 * <ParallaxLayer>  – a decorative layer whose transform is derived from `--p` (and `--mx/--my` when the
 *                    scene has `pointer`). Positive `dist` = drifts down while scrolling (feels far away),
 *                    negative `dist` = rises faster than the page (feels close).
 *
 * Layers are purely decorative: aria-hidden, pointer-events none, resting composition = p = 0.
 */

interface SceneProps {
  as?: 'section' | 'div';
  /** also publish eased mouse position (--mx, --my) for depth on desktop */
  pointer?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** tells the cursor follower to use its light-on-dark colours inside this scene */
  'data-cursor-theme'?: 'dark';
  [key: `aria-${string}`]: string | undefined;
}

export const ParallaxScene: React.FC<SceneProps> = ({
  as: Tag = 'section',
  pointer = false,
  className = '',
  style,
  children,
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const offScene = registerScene(el);
    const offPointer = pointer ? registerPointerScene(el) : () => {};
    return () => {
      offScene();
      offPointer();
    };
  }, [pointer]);

  return (
    <Tag ref={ref as React.RefObject<never>} className={`relative overflow-hidden ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
};

/** Container for a scene's decorative layers. Rendered client-side only to eliminate decorative parallax bloat from static SSR HTML. */
export const ParallaxStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div data-px-stage="" aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {mounted ? children : null}
    </div>
  );
};

interface LayerProps {
  /** vertical travel in px across the scene's scroll range (−p…+p) */
  dist?: number;
  /** horizontal travel in px across the scroll range */
  x?: number;
  /** rotation in degrees across the scroll range */
  rot?: number;
  /** scale change across the scroll range (0.1 = ±10%) */
  scale?: number;
  /** mouse depth in px (needs `pointer` on the scene); positive follows the mouse, negative opposes it */
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ParallaxLayer: React.FC<LayerProps> = ({
  dist = 0,
  x = 0,
  rot = 0,
  scale = 0,
  depth = 0,
  className = '',
  style,
  children,
}) => {
  const tx = `calc(var(--p, 0) * ${x}px + var(--mx, 0) * ${depth}px)`;
  const ty = `calc(var(--p, 0) * ${dist}px + var(--my, 0) * ${depth * 0.7}px)`;
  const transform =
    `translate3d(${tx}, ${ty}, 0)` +
    (rot ? ` rotate(calc(var(--p, 0) * ${rot}deg))` : '') +
    (scale ? ` scale(calc(1 + var(--p, 0) * ${scale}))` : '');

  return (
    <div aria-hidden="true" className={`px-layer absolute pointer-events-none ${className}`} style={{ transform, ...style }}>
      {children}
    </div>
  );
};
