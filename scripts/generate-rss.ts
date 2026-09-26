import fs from 'node:fs';
import path from 'node:path';

interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category?: string;
  author?: string;
  published?: boolean;
}

export function generateRssFeed(): string {
  const blogDir = path.resolve(process.cwd(), 'content/blog');
  const posts: PostData[] = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.json'));
    for (const f of files) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(blogDir, f), 'utf-8'));
        if (raw.published !== false && raw.slug && raw.title) {
          posts.push(raw);
        }
      } catch (err) {
        console.warn(`[rss] Skipping invalid blog file: ${f}`, err);
      }
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const siteOrigin = 'https://utools.bd';
  const nowRfc822 = new Date().toUTCString();

  const itemsXml = posts
    .map((post) => {
      const link = `${siteOrigin}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const categoryTag = post.category ? `\n      <category><![CDATA[${post.category}]]></category>` : '';
      const authorTag = post.author ? `\n      <author>contact@utools.bd (${post.author})</author>` : '';

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>${categoryTag}${authorTag}
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[Utools.bd ব্লগ ও গাইড]]></title>
    <link>${siteOrigin}/blog</link>
    <description><![CDATA[সরকারি চাকরির আবেদন, ছবি রিসাইজ, বাংলা টাইপিং, শিক্ষা ও ডিজিটাল জীবন সহজ করার বাস্তবসম্মত গাইডলাইন।]]></description>
    <language>bn</language>
    <lastBuildDate>${nowRfc822}</lastBuildDate>
    <atom:link href="${siteOrigin}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;
}

// When run directly as a script
if (process.argv[1]?.endsWith('generate-rss.ts')) {
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');

  const xml = generateRssFeed();

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'rss.xml'), xml, 'utf-8');
    console.log('[rss] Written to dist/rss.xml');
  }
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), xml, 'utf-8');
    console.log('[rss] Written to public/rss.xml');
  }
}
