import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.tsx';

export interface RenderResult {
  html: string;
}

export function render(url: string): RenderResult {
  const helmetContext: Record<string, unknown> = {};
  const html = renderToString(
    <StaticRouter location={url}>
      <App helmetContext={helmetContext} />
    </StaticRouter>
  );
  return { html };
}
