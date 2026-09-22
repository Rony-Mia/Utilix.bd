import React from 'react';
import { ScrollToTopButton } from './ScrollToTopButton.tsx';
import { WhatsAppButton } from './WhatsAppButton.tsx';

/**
 * Bottom-right stack shown on every page: back-to-top above, WhatsApp below.
 * z-20 keeps it above page content (z-10) but under the sticky header (z-30, so the mobile menu covers it)
 * and under modals (z-50). Hidden in print.
 */
export const FloatingActions: React.FC = () => (
  <aside
    aria-label="দ্রুত যোগাযোগ"
    className="no-print fixed right-4 sm:right-6 z-20 flex flex-col items-end gap-3"
    style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
  >
    <ScrollToTopButton />
    <WhatsAppButton />
  </aside>
);
