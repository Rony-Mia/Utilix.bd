import nodemailer from 'nodemailer';

// Vercel Serverless Function — POST /api/contact
// Sends ContactPage.tsx submissions through Zoho Mail's SMTP relay, as
// contact@utools.bd (the mailbox already set up on Zoho for this domain).
// Must live under /api because Vercel serves this project as a static
// site and does not execute server.ts/dist/server.cjs.

const SUBJECT_LABELS: Record<string, string> = {
  general: 'সাধারণ মতামত / প্রশংসা',
  feature: 'নতুন টুলের প্রস্তাবনা',
  bug: 'ত্রুটি বা বাগ রিপোর্ট',
  partnership: 'সহযোগিতা / অংশীদারিত্ব',
  other: 'অন্যান্য',
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, subject, relatedTool, message, website } = req.body || {};

  // Honeypot: a real visitor never fills the hidden "website" field.
  // Silently report success without sending anything.
  if (typeof website === 'string' && website.trim() !== '') {
    res.status(200).json({ success: true });
    return;
  }

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !isValidEmail(email.trim()) ||
    typeof message !== 'string' || !message.trim()
  ) {
    res.status(400).json({ error: 'Valid name, email, and message are required.' });
    return;
  }

  const zohoUser = process.env.ZOHO_SMTP_USER;
  const zohoPass = process.env.ZOHO_SMTP_PASS;

  if (!zohoUser || !zohoPass) {
    res.status(500).json({ error: 'Email is not configured on the server yet.' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: { user: zohoUser, pass: zohoPass },
    });

    const subjectLabel = SUBJECT_LABELS[subject] || subject || 'সাধারণ';

    await transporter.sendMail({
      from: `"Utools.bd যোগাযোগ ফর্ম" <${zohoUser}>`,
      to: 'contact@utools.bd',
      replyTo: email.trim(),
      subject: `[Utools.bd Contact] ${subjectLabel} — ${name.trim()}`,
      text: [
        `নাম: ${name.trim()}`,
        `ইমেইল: ${email.trim()}`,
        `বিষয়: ${subjectLabel}`,
        `সম্পর্কিত টুল: ${relatedTool || 'none'}`,
        '',
        'বার্তা:',
        message.trim(),
      ].join('\n'),
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(502).json({ error: 'Email service error: ' + (err?.message || 'unknown') });
  }
}
