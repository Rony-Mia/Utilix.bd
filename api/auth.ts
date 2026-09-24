// Vercel Serverless Function — GET /api/auth
// Starts the GitHub OAuth flow for Decap CMS. This must live under /api
// because Vercel serves this project as a static site (dist/) and does not
// execute server.ts/dist/server.cjs; only files under /api are deployed as
// serverless functions.
export default function handler(req: any, res: any) {
  const host = req.headers.host || 'utools.bd';
  const proto = req.headers['x-forwarded-proto'] === 'http' ? 'http' : 'https';
  const redirectUri = `${proto}://${host}/api/callback`;
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    res.status(500).send(`
      <!doctype html>
      <html lang="bn">
        <head><meta charset="utf-8"><title>GitHub OAuth Credentials Missing</title></head>
        <body style="font-family:sans-serif;padding:2rem;text-align:center;line-height:1.6;">
          <h2>GitHub OAuth Credentials Missing</h2>
          <p>Decap CMS অ্যাডমিন ব্যবহারের জন্য Vercel Project Settings → Environment Variables-এ
          <code>GITHUB_CLIENT_ID</code> এবং <code>GITHUB_CLIENT_SECRET</code> সেট করতে হবে।</p>
        </body>
      </html>
    `);
    return;
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.writeHead(302, { Location: githubAuthUrl });
  res.end();
}
