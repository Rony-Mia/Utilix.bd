import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found in DOM');
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Check if we have SSR-rendered content (hydration)
const hasSSRContent = container.hasChildNodes() && container.innerHTML.trim().length > 0;

if (hasSSRContent) {
  // Hydrate if SSR content exists
  hydrateRoot(container, app);
} else {
  // Fallback to CSR if no SSR content
  createRoot(container).render(app);
}
