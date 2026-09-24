// Vercel Serverless Function — GET /api/callback
// Exchanges the GitHub OAuth code for an access token and posts it back to
// the Decap CMS popup window that initiated /api/auth.
export default async function handler(req: any, res: any) {
  const code = req.query?.code as string | undefined;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    res.status(400).send('Authorization code missing');
    return;
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Utools.bd-CMS-Auth',
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      res.status(401).send(`Authentication failed: ${data.error_description || data.error || 'Unknown error'}`);
      return;
    }

    const payload = JSON.stringify({ token, provider: 'github' });
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!doctype html>
      <html><body>
      <script>
        (function () {
          function receiveMessage(e) {
            window.opener.postMessage('authorization:github:success:${payload}', e.origin);
          }
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      </script>
      </body></html>
    `);
  } catch (err: any) {
    res.status(500).send('OAuth exchange error: ' + (err?.message || 'unknown error'));
  }
}
