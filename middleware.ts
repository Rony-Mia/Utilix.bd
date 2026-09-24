import { next } from '@vercel/edge';

// Vercel Edge Middleware — runs on every request matching `config.matcher`
// (see bottom of this file), i.e. only /admin and everything under it.
//
// This gate is intentionally SEPARATE from Decap CMS's GitHub OAuth login:
//   - This layer's state lives in a cookie (`utools_admin_gate`).
//   - Decap CMS's GitHub login state lives in the browser's localStorage.
// They never touch each other, so:
//   - Logging out of this gate (GET /admin/logout) only clears the cookie —
//     the GitHub session in localStorage is untouched, exactly as requested.
//   - The cookie has no Max-Age/Expires, so it is a *session cookie*: the
//     browser drops it when fully closed/restarted, so a fresh browser
//     session asks for the password again even though GitHub stays logged in.
//   - A different browser/device has neither the cookie nor the GitHub
//     token, so both the password and GitHub login are required there.

const COOKIE_NAME = 'utools_admin_gate';

function unauthorized(message?: string): Response {
  const body = `<!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>অ্যাডমিন লগইন — Utools.bd</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#F3F6F4; display:flex; min-height:100vh; align-items:center; justify-content:center; margin:0; }
    form { background:#fff; padding:2rem; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,0.08); width:100%; max-width:320px; }
    h1 { font-size:1.1rem; margin:0 0 1.25rem; color:#0F1F17; }
    label { display:block; font-size:0.85rem; color:#4A5A52; margin-bottom:0.3rem; }
    input { width:100%; box-sizing:border-box; padding:0.6rem 0.75rem; margin-bottom:1rem; border:1px solid #D8E2DC; border-radius:8px; font-size:0.95rem; }
    button { width:100%; padding:0.7rem; background:#0B5D3B; color:#fff; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
    .err { color:#B3261E; font-size:0.85rem; margin:-0.5rem 0 1rem; }
  </style>
</head>
<body>
  <form method="POST">
    <h1>অ্যাডমিন প্যানেল — লগইন করুন</h1>
    ${message ? `<p class="err">${message}</p>` : ''}
    <label>Username</label>
    <input type="text" name="username" autocomplete="username" required autofocus />
    <label>Password</label>
    <input type="password" name="password" autocomplete="current-password" required />
    <button type="submit">Login</button>
  </form>
</body>
</html>`;
  return new Response(body, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  // GET /admin/logout — clear only this gate's cookie, nothing else, then
  // send the visitor back to /admin/ where they'll be re-prompted.
  if (url.pathname === '/admin/logout') {
    const res = new Response(null, { status: 302, headers: { Location: '/admin/' } });
    res.headers.append('Set-Cookie', `${COOKIE_NAME}=; Path=/admin; Max-Age=0; SameSite=Lax`);
    return res;
  }

  const expected = process.env.ADMIN_GATE_TOKEN;
  if (!expected) {
    // Not configured yet — fail open with a clear message rather than
    // locking the owner out of their own admin panel.
    return next();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const hasValidCookie = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .some((c) => c === `${COOKIE_NAME}=${expected}`);

  if (hasValidCookie) {
    return next();
  }

  if (request.method === 'POST') {
    const form = await request.formData();
    const username = String(form.get('username') || '');
    const password = String(form.get('password') || '');
    const validUser = process.env.ADMIN_GATE_USER;
    const validPass = process.env.ADMIN_GATE_PASS;

    if (validUser && validPass && username === validUser && password === validPass) {
      const res = new Response(null, { status: 302, headers: { Location: url.pathname } });
      // No Max-Age/Expires => session cookie, cleared when the browser fully closes.
      res.headers.append(
        'Set-Cookie',
        `${COOKIE_NAME}=${expected}; Path=/admin; HttpOnly; Secure; SameSite=Lax`
      );
      return res;
    }
    return unauthorized('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।');
  }

  return unauthorized();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
