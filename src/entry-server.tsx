import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

export interface RenderResult {
  html: string;
  helmet?: any;
}

export function render(url: string): RenderResult {
  const helmetContext: Record<string, unknown> = {};
  
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App helmetContext={helmetContext} />
      </StaticRouter>
    </HelmetProvider>
  );

  return {
    html,
    helmet: helmetContext.helmet
  };
}
