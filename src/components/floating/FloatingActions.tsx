import React from 'react';
import { ScrollToTopButton } from './ScrollToTopButton.tsx';

/**
 * Bottom-right floating action: back-to-top button.
 * z-20 keeps it above page content (z-10) but under the sticky header (z-30, so the mobile menu covers it)
 * and under modals (z-50). Hidden in print.
 */
export const FloatingActions: React.FC = () => (
  <aside
    aria-label="পৃষ্ঠার শীর্ষে যান"
    className="no-print fixed right-4 sm:right-6 z-20 flex flex-col items-end gap-3"
    style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
  >
    <ScrollToTopButton />
  </aside>
);
