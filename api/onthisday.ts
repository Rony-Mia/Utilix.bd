// Vercel Serverless Function — GET /api/onthisday?month=MM&day=DD
// Proxies Wikipedia's "On this day" feed for BanglaDateConverterPage.
// The frontend already falls back to calling Wikipedia directly if this
// 404s, so this endpoint was silently unused in production until now —
// restoring it avoids that extra failed request and the client-side CORS
// dependency on Wikipedia's API.
export default async function handler(req: any, res: any) {
  const month = String(req.query?.month || '').padStart(2, '0');
  const day = String(req.query?.day || '').padStart(2, '0');

  if (!month || !day || Number.isNaN(Number(month)) || Number.isNaN(Number(day))) {
    res.status(400).json({ error: 'Valid month and day parameters required (MM and DD)' });
    return;
  }

  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`;
    const response = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'Utools.bd (https://utools.bd; contact@utools.bd)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Wikipedia API responded with status ' + response.status });
      return;
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch historical events from Wikipedia' });
  }
}
