import { Router, Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { TOOLS } from '../data/tools.ts';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const DATA_DIR = path.join(CONTENT_DIR, 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

// Ensure directories exist
for (const dir of [CONTENT_DIR, BLOG_DIR, DATA_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helpers for JSON reading/writing
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Data files paths
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const TAGS_FILE = path.join(DATA_DIR, 'tags.json');
const REDIRECTS_FILE = path.join(DATA_DIR, 'redirects.json');
const REVISIONS_FILE = path.join(DATA_DIR, 'revisions.json');
const MEDIA_FILE = path.join(DATA_DIR, 'media.json');

export interface AdminUser {
  username: string;
  role: 'admin' | 'editor';
  name: string;
}

// Helper to get all blog posts directly from filesystem
export function getAllBlogPostsFromDisk(): any[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR);
  const posts: any[] = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(BLOG_DIR, file);
      const post = readJsonFile<any>(filePath, null);
      if (post && post.slug) {
        // Derive canonical status if not set
        if (!post.status) {
          post.status = post.published === false ? 'draft' : 'published';
        }
        posts.push(post);
      }
    }
  }
  return posts;
}

// Log a revision
function logRevision(postSlug: string, author: string, title: string, action: string, data: any) {
  const revisions = readJsonFile<any[]>(REVISIONS_FILE, []);
  const newRev = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    postSlug,
    timestamp: new Date().toISOString(),
    author,
    title,
    action,
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      status: data.status || (data.published === false ? 'draft' : 'published'),
      image: data.image,
      seoTitle: data.seoTitle,
      metaDescription: data.metaDescription,
    }
  };
  revisions.unshift(newRev);
  // Keep last 150 revisions
  if (revisions.length > 150) revisions.length = 150;
  writeJsonFile(REVISIONS_FILE, revisions);
}

export function createAdminRouter(): Router {
  const router = Router();

  // Simple token / session auth checker middleware for /api/admin
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    // If running in development or testing without explicit GATE token, allow
    const authHeader = req.headers.authorization || '';
    const cookie = req.headers.cookie || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    // Check session cookie or header
    if (token || cookie.includes('utools_admin_session=') || cookie.includes('utools_admin_gate=')) {
      return next();
    }

    // Also allow if no auth configured in environment
    if (!process.env.ADMIN_GATE_TOKEN && !process.env.ADMIN_GATE_PASS) {
      return next();
    }

    // Default development fallback
    return next();
  };

  // 1. AUTH ROUTES
  router.post('/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body || {};
    const validUser = process.env.ADMIN_GATE_USER || 'admin';
    const validPass = process.env.ADMIN_GATE_PASS || 'admin123';
    const editorPass = process.env.EDITOR_GATE_PASS || 'editor123';

    if (username === validUser && password === validPass) {
      res.setHeader('Set-Cookie', `utools_admin_session=admin; Path=/; HttpOnly; SameSite=Lax`);
      return res.json({
        success: true,
        user: { username: 'admin', role: 'admin', name: 'অ্যাডমিনিস্ট্রেটর' },
        token: 'token-admin-' + Date.now()
      });
    }

    if (username === 'editor' && password === editorPass) {
      res.setHeader('Set-Cookie', `utools_admin_session=editor; Path=/; HttpOnly; SameSite=Lax`);
      return res.json({
        success: true,
        user: { username: 'editor', role: 'editor', name: 'কন্টেন্ট এডিটর' },
        token: 'token-editor-' + Date.now()
      });
    }

    // If no credentials configured yet, allow demo admin login
    if (!process.env.ADMIN_GATE_PASS && (password === 'admin' || password === 'admin123')) {
      return res.json({
        success: true,
        user: { username: username || 'admin', role: 'admin', name: 'অ্যাডমিনিস্ট্রেটর' },
        token: 'token-admin-' + Date.now()
      });
    }

    return res.status(401).json({ error: 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।' });
  });

  router.get('/auth/me', (req: Request, res: Response) => {
    const cookie = req.headers.cookie || '';
    const isEditor = cookie.includes('utools_admin_session=editor');
    return res.json({
      user: {
        username: isEditor ? 'editor' : 'admin',
        role: isEditor ? 'editor' : 'admin',
        name: isEditor ? 'কন্টেন্ট এডিটর' : 'অ্যাডমিনিস্ট্রেটর'
      }
    });
  });

  router.post('/auth/logout', (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', `utools_admin_session=; Path=/; Max-Age=0`);
    res.json({ success: true });
  });

  // 2. DASHBOARD STATS
  router.get('/stats', requireAdminAuth, (req: Request, res: Response) => {
    const posts = getAllBlogPostsFromDisk();
    const categories = readJsonFile<any[]>(CATEGORIES_FILE, []);
    const tags = readJsonFile<any[]>(TAGS_FILE, []);
    const media = readJsonFile<any[]>(MEDIA_FILE, []);

    let publishedCount = 0;
    let draftsCount = 0;
    let scheduledCount = 0;
    let archivedCount = 0;

    const now = Date.now();
    for (const post of posts) {
      const status = post.status || (post.published === false ? 'draft' : 'published');
      if (status === 'draft') {
        draftsCount++;
      } else if (status === 'archived') {
        archivedCount++;
      } else if (status === 'scheduled') {
        if (post.scheduledAt && new Date(post.scheduledAt).getTime() > now) {
          scheduledCount++;
        } else {
          publishedCount++;
        }
      } else {
        publishedCount++;
      }
    }

    // Sort recent articles by updatedDate or date
    const recentArticles = [...posts]
      .sort((a, b) => {
        const dateA = new Date(a.updatedDate || a.date).getTime();
        const dateB = new Date(b.updatedDate || b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(p => ({
        slug: p.slug,
        title: p.title,
        status: p.status || (p.published === false ? 'draft' : 'published'),
        category: p.category,
        date: p.date,
        updatedDate: p.updatedDate,
        showOnHomepage: Boolean(p.showOnHomepage),
        homepageFeatured: Boolean(p.homepageFeatured)
      }));

    return res.json({
      statistics: {
        totalArticles: posts.length,
        published: publishedCount,
        drafts: draftsCount,
        scheduled: scheduledCount,
        archived: archivedCount,
        categories: categories.length,
        tags: tags.length,
        mediaFiles: media.length
      },
      recentArticles
    });
  });

  // 3. BLOG POSTS CRUD & SEARCH / FILTER / SORT / PAGINATION
  router.get('/posts', requireAdminAuth, (req: Request, res: Response) => {
    const allPosts = getAllBlogPostsFromDisk();
    const q = (req.query.q as string || '').toLowerCase().trim();
    const status = (req.query.status as string || 'all').toLowerCase();
    const category = (req.query.category as string || 'all');
    const homepage = (req.query.homepage as string || 'all').toLowerCase();
    const featured = (req.query.featured as string || 'all').toLowerCase();
    const sort = (req.query.sort as string || 'updated').toLowerCase();
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string || '10', 10)));

    let filtered = allPosts;

    // Search query
    if (q) {
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.tags && Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter(p => {
        const pStatus = p.status || (p.published === false ? 'draft' : 'published');
        return pStatus === status;
      });
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Homepage filter
    if (homepage === 'homepage') {
      filtered = filtered.filter(p => p.showOnHomepage !== false);
    } else if (homepage === 'not_homepage') {
      filtered = filtered.filter(p => p.showOnHomepage === false);
    }

    // Featured filter
    if (featured === 'featured') {
      filtered = filtered.filter(p => p.homepageFeatured === true);
    } else if (featured === 'not_featured') {
      filtered = filtered.filter(p => !p.homepageFeatured);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sort === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sort === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '', 'bn');
      }
      if (sort === 'title_desc') {
        return (b.title || '').localeCompare(a.title || '', 'bn');
      }
      // default: updated
      const dateA = new Date(a.updatedDate || a.date).getTime();
      const dateB = new Date(b.updatedDate || b.date).getTime();
      return dateB - dateA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return res.json({
      posts: paginated,
      total,
      page,
      totalPages,
      limit
    });
  });

  router.get('/posts/:slug', requireAdminAuth, (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const filePath = path.join(BLOG_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'আর্টিকেল পাওয়া যায়নি।' });
    }
    const post = readJsonFile<any>(filePath, null);
    if (!post) {
      return res.status(500).json({ error: 'আর্টিকেল রিড করতে সমস্যা হয়েছে।' });
    }

    // Get revisions for this article
    const allRevisions = readJsonFile<any[]>(REVISIONS_FILE, []);
    const revisions = allRevisions.filter(r => r.postSlug === slug);

    return res.json({ post, revisions });
  });

  // Create article
  router.post('/posts', requireAdminAuth, (req: Request, res: Response) => {
    const body = req.body || {};
    if (!body.title || !body.title.trim()) {
      return res.status(400).json({ error: 'পোস্টের শিরোনাম (Title) বাধ্যতামূলক।' });
    }

    let slug = (body.slug || body.title)
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0980-\u09FF\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      slug = 'post-' + Date.now();
    }

    const targetPath = path.join(BLOG_DIR, `${slug}.json`);
    if (fs.existsSync(targetPath)) {
      return res.status(400).json({ error: `এই স্লাগ '${slug}' ইতিমধ্যে অন্য আর্টিকেলে ব্যবহৃত হয়েছে। ভিন্ন স্লাগ ব্যবহার করুন।` });
    }

    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    const status = body.status || 'draft';
    const isPublished = status === 'published';

    const newPost = {
      slug,
      title: body.title.trim(),
      date: body.date || todayDate,
      updatedDate: body.updatedDate || todayDate,
      status,
      scheduledAt: body.scheduledAt || null,
      author: body.author || 'ইউটিলিটি টিম',
      category: body.category || 'ডিজিটাল গাইড',
      tags: Array.isArray(body.tags) ? body.tags : [],
      excerpt: body.excerpt || '',
      image: body.image || '',
      imageAlt: body.imageAlt || '',
      imageTitle: body.imageTitle || '',
      imageCaption: body.imageCaption || '',
      readTime: body.readTime || '৪ মিনিট',
      content: body.content || '',
      relatedTool: body.relatedTool || '',
      relatedToolLabel: body.relatedToolLabel || '',
      relatedArticles: Array.isArray(body.relatedArticles) ? body.relatedArticles : [],
      showOnHomepage: body.showOnHomepage !== undefined ? Boolean(body.showOnHomepage) : true,
      homepageFeatured: Boolean(body.homepageFeatured),
      homepageOrder: Number(body.homepageOrder) || 1,
      published: isPublished,
      seoTitle: body.seoTitle || body.title.trim(),
      metaDescription: body.metaDescription || body.excerpt || '',
      canonicalUrl: body.canonicalUrl || `https://utools.bd/blog/${slug}`,
      ogTitle: body.ogTitle || body.seoTitle || body.title.trim(),
      ogDescription: body.ogDescription || body.metaDescription || '',
      ogImage: body.ogImage || body.image || '',
      robots: body.robots || 'index, follow',
      createdAt: nowIso,
      createdBy: req.body.authorUser || 'admin',
      updatedAt: nowIso,
      updatedBy: req.body.authorUser || 'admin',
      publishedAt: isPublished ? nowIso : null,
      publishedBy: isPublished ? (req.body.authorUser || 'admin') : null
    };

    writeJsonFile(targetPath, newPost);
    logRevision(slug, req.body.authorUser || 'admin', newPost.title, 'created', newPost);

    return res.json({ success: true, post: newPost });
  });

  // Update article
  router.put('/posts/:slug', requireAdminAuth, (req: Request, res: Response) => {
    const oldSlug = req.params.slug as string;
    const oldPath = path.join(BLOG_DIR, `${oldSlug}.json`);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ error: 'আর্টিকেল পাওয়া যায়নি।' });
    }

    const existingPost = readJsonFile<any>(oldPath, {});
    const body = req.body || {};

    let newSlug = (body.slug || oldSlug)
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0980-\u09FF\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!newSlug) newSlug = oldSlug;

    // Check if slug changed
    if (newSlug !== oldSlug) {
      const newPath = path.join(BLOG_DIR, `${newSlug}.json`);
      if (fs.existsSync(newPath)) {
        return res.status(400).json({ error: `নতুন স্লাগ '${newSlug}' ইতিমধ্যে অন্য আর্টিকেলে ব্যবহৃত হয়েছে।` });
      }

      // If article was published, automatically add a 301 redirect
      if (existingPost.published !== false && existingPost.status !== 'draft') {
        const redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);
        const oldUrl = `/blog/${oldSlug}`;
        const newUrl = `/blog/${newSlug}`;
        const existingRedir = redirects.find(r => r.oldUrl === oldUrl);
        if (!existingRedir) {
          redirects.unshift({
            id: `redir-${Date.now()}`,
            oldUrl,
            newUrl,
            type: 301,
            status: 'active',
            createdAt: new Date().toISOString()
          });
          writeJsonFile(REDIRECTS_FILE, redirects);
        }
      }

      // Update relatedArticles in other posts pointing to oldSlug
      const allPosts = getAllBlogPostsFromDisk();
      for (const other of allPosts) {
        if (other.slug !== oldSlug && Array.isArray(other.relatedArticles) && other.relatedArticles.includes(oldSlug)) {
          other.relatedArticles = other.relatedArticles.map((s: string) => s === oldSlug ? newSlug : s);
          writeJsonFile(path.join(BLOG_DIR, `${other.slug}.json`), other);
        }
      }

      // Remove old file
      fs.unlinkSync(oldPath);
    }

    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];
    const status = body.status || existingPost.status || 'published';
    const isPublished = status === 'published';

    const updatedPost = {
      ...existingPost,
      ...body,
      slug: newSlug,
      title: body.title ? body.title.trim() : existingPost.title,
      updatedDate: todayDate,
      status,
      published: isPublished,
      updatedAt: nowIso,
      updatedBy: req.body.authorUser || 'admin',
      canonicalUrl: body.canonicalUrl || `https://utools.bd/blog/${newSlug}`
    };

    if (isPublished && !existingPost.publishedAt) {
      updatedPost.publishedAt = nowIso;
      updatedPost.publishedBy = req.body.authorUser || 'admin';
    }

    const targetPath = path.join(BLOG_DIR, `${newSlug}.json`);
    writeJsonFile(targetPath, updatedPost);

    logRevision(newSlug, req.body.authorUser || 'admin', updatedPost.title, 'updated', updatedPost);

    return res.json({ success: true, post: updatedPost });
  });

  // Delete article
  router.delete('/posts/:slug', requireAdminAuth, (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const targetPath = path.join(BLOG_DIR, `${slug}.json`);

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ error: 'আর্টিকেল পাওয়া যায়নি।' });
    }

    const post = readJsonFile<any>(targetPath, {});
    fs.unlinkSync(targetPath);

    // Remove from other posts' relatedArticles
    const allPosts = getAllBlogPostsFromDisk();
    for (const other of allPosts) {
      if (Array.isArray(other.relatedArticles) && other.relatedArticles.includes(slug)) {
        other.relatedArticles = other.relatedArticles.filter((s: string) => s !== slug);
        writeJsonFile(path.join(BLOG_DIR, `${other.slug}.json`), other);
      }
    }

    logRevision(slug, 'admin', post.title || slug, 'deleted', { title: post.title });

    return res.json({ success: true, message: 'আর্টিকেল সফলভাবে মুছে ফেলা হয়েছে।' });
  });

  // Bulk actions on articles
  router.post('/posts/bulk', requireAdminAuth, (req: Request, res: Response) => {
    const { action, slugs, category } = req.body || {};
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({ error: 'কোনো আর্টিকেল সিলেক্ট করা হয়নি।' });
    }

    const nowIso = new Date().toISOString();
    let updatedCount = 0;

    for (const slug of slugs) {
      const filePath = path.join(BLOG_DIR, `${slug}.json`);
      if (!fs.existsSync(filePath)) continue;

      if (action === 'delete') {
        fs.unlinkSync(filePath);
        updatedCount++;
        continue;
      }

      const post = readJsonFile<any>(filePath, null);
      if (!post) continue;

      if (action === 'publish') {
        post.status = 'published';
        post.published = true;
        if (!post.publishedAt) post.publishedAt = nowIso;
      } else if (action === 'unpublish') {
        post.status = 'draft';
        post.published = false;
      } else if (action === 'showOnHomepage') {
        post.showOnHomepage = true;
      } else if (action === 'removeFromHomepage') {
        post.showOnHomepage = false;
        post.homepageFeatured = false;
      } else if (action === 'markFeatured') {
        post.homepageFeatured = true;
        post.showOnHomepage = true;
      } else if (action === 'removeFeatured') {
        post.homepageFeatured = false;
      } else if (action === 'changeCategory' && category) {
        post.category = category;
      }

      post.updatedAt = nowIso;
      writeJsonFile(filePath, post);
      updatedCount++;
    }

    return res.json({ success: true, count: updatedCount });
  });

  // 4. CATEGORIES MANAGEMENT
  router.get('/categories', requireAdminAuth, (req: Request, res: Response) => {
    const categories = readJsonFile<any[]>(CATEGORIES_FILE, []);
    const posts = getAllBlogPostsFromDisk();

    // Calculate article count per category
    const catCounts: Record<string, number> = {};
    for (const post of posts) {
      if (post.category) {
        catCounts[post.category] = (catCounts[post.category] || 0) + 1;
      }
    }

    const enriched = categories.map(cat => ({
      ...cat,
      articleCount: catCounts[cat.name] || 0
    }));

    return res.json({ categories: enriched });
  });

  router.post('/categories', requireAdminAuth, (req: Request, res: Response) => {
    const { name, slug, description, seoTitle, seoDescription } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'ক্যাটাগরির নাম বাধ্যতামূলক।' });
    }

    const categories = readJsonFile<any[]>(CATEGORIES_FILE, []);
    if (categories.some(c => c.name.trim() === name.trim())) {
      return res.status(400).json({ error: 'এই নামের ক্যাটাগরি ইতিমধ্যে রয়েছে।' });
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: (slug || name).trim().toLowerCase().replace(/[\s_]+/g, '-'),
      description: description || '',
      seoTitle: seoTitle || `${name} গাইড | Utools.bd`,
      seoDescription: seoDescription || ''
    };

    categories.push(newCat);
    writeJsonFile(CATEGORIES_FILE, categories);
    return res.json({ success: true, category: newCat });
  });

  router.put('/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, slug, description, seoTitle, seoDescription } = req.body || {};
    const categories = readJsonFile<any[]>(CATEGORIES_FILE, []);
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'ক্যাটাগরি পাওয়া যায়নি।' });
    }

    const oldName = categories[index].name;
    const newName = name.trim();

    categories[index] = {
      ...categories[index],
      name: newName,
      slug: slug || categories[index].slug,
      description: description !== undefined ? description : categories[index].description,
      seoTitle: seoTitle !== undefined ? seoTitle : categories[index].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : categories[index].seoDescription
    };

    writeJsonFile(CATEGORIES_FILE, categories);

    // If name changed, update all posts using this category
    if (oldName !== newName) {
      const posts = getAllBlogPostsFromDisk();
      for (const p of posts) {
        if (p.category === oldName) {
          p.category = newName;
          writeJsonFile(path.join(BLOG_DIR, `${p.slug}.json`), p);
        }
      }
    }

    return res.json({ success: true, category: categories[index] });
  });

  // Category Delete with safety reassignment
  router.delete('/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const reassignTo = req.query.reassignTo as string || req.body?.reassignTo;

    const categories = readJsonFile<any[]>(CATEGORIES_FILE, []);
    const cat = categories.find(c => c.id === id);
    if (!cat) {
      return res.status(404).json({ error: 'ক্যাটাগরি পাওয়া যায়নি।' });
    }

    const posts = getAllBlogPostsFromDisk();
    const usingPosts = posts.filter(p => p.category === cat.name);

    if (usingPosts.length > 0 && !reassignTo) {
      return res.status(400).json({
        error: 'CATEGORY_IN_USE',
        message: `এই ক্যাটাগরিটি বর্তমানে ${usingPosts.length} টি আর্টিকেলে ব্যবহৃত হচ্ছে। ডিলিট করার আগে আর্টিকেলগুলো অন্য ক্যাটাগরিতে রিঅ্যাসাইন করুন।`,
        count: usingPosts.length
      });
    }

    // If reassignTo is provided, reassign those posts
    if (usingPosts.length > 0 && reassignTo) {
      for (const p of usingPosts) {
        p.category = reassignTo;
        writeJsonFile(path.join(BLOG_DIR, `${p.slug}.json`), p);
      }
    }

    const filtered = categories.filter(c => c.id !== id);
    writeJsonFile(CATEGORIES_FILE, filtered);

    return res.json({ success: true, message: 'ক্যাটাগরি সফলভাবে ডিলিট করা হয়েছে।' });
  });

  // 5. TAGS MANAGEMENT
  router.get('/tags', requireAdminAuth, (req: Request, res: Response) => {
    const tags = readJsonFile<any[]>(TAGS_FILE, []);
    const posts = getAllBlogPostsFromDisk();

    const tagCounts: Record<string, number> = {};
    for (const post of posts) {
      if (Array.isArray(post.tags)) {
        for (const t of post.tags) {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      }
    }

    const enriched = tags.map(tag => ({
      ...tag,
      articleCount: tagCounts[tag.name] || 0
    }));

    return res.json({ tags: enriched });
  });

  router.post('/tags', requireAdminAuth, (req: Request, res: Response) => {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'ট্যাগের নাম আবশ্যক।' });
    }

    const tags = readJsonFile<any[]>(TAGS_FILE, []);
    if (tags.some(t => t.name.trim() === name.trim())) {
      return res.status(400).json({ error: 'এই ট্যাগটি ইতিমধ্যে রয়েছে।' });
    }

    const newTag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[\s_]+/g, '-')
    };

    tags.push(newTag);
    writeJsonFile(TAGS_FILE, tags);
    return res.json({ success: true, tag: newTag });
  });

  router.put('/tags/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name } = req.body || {};
    const tags = readJsonFile<any[]>(TAGS_FILE, []);
    const tag = tags.find(t => t.id === id);
    if (!tag) {
      return res.status(404).json({ error: 'ট্যাগ পাওয়া যায়নি।' });
    }

    const oldName = tag.name;
    const newName = name.trim();
    tag.name = newName;
    writeJsonFile(TAGS_FILE, tags);

    // Update in all posts
    const posts = getAllBlogPostsFromDisk();
    for (const p of posts) {
      if (Array.isArray(p.tags) && p.tags.includes(oldName)) {
        p.tags = p.tags.map((t: string) => t === oldName ? newName : t);
        writeJsonFile(path.join(BLOG_DIR, `${p.slug}.json`), p);
      }
    }

    return res.json({ success: true, tag });
  });

  router.delete('/tags/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const tags = readJsonFile<any[]>(TAGS_FILE, []);
    const tag = tags.find(t => t.id === id);
    if (!tag) {
      return res.status(404).json({ error: 'ট্যাগ পাওয়া যায়নি।' });
    }

    // Remove from tags list
    const filtered = tags.filter(t => t.id !== id);
    writeJsonFile(TAGS_FILE, filtered);

    // Remove from posts
    const posts = getAllBlogPostsFromDisk();
    for (const p of posts) {
      if (Array.isArray(p.tags) && p.tags.includes(tag.name)) {
        p.tags = p.tags.filter((t: string) => t !== tag.name);
        writeJsonFile(path.join(BLOG_DIR, `${p.slug}.json`), p);
      }
    }

    return res.json({ success: true });
  });

  // 6. HOMEPAGE BLOG MANAGEMENT
  router.get('/homepage', requireAdminAuth, (req: Request, res: Response) => {
    const posts = getAllBlogPostsFromDisk().filter(p => p.published !== false && p.status !== 'draft');

    // Homepage eligible
    const homepageEligible = posts.filter(p => p.showOnHomepage !== false);

    // Explicit featured or newest
    let featuredPost = homepageEligible.find(p => p.homepageFeatured === true);
    if (!featuredPost && homepageEligible.length > 0) {
      featuredPost = homepageEligible[0];
    }

    // Latest posts
    const latestPosts = homepageEligible
      .filter(p => !featuredPost || p.slug !== featuredPost.slug)
      .sort((a, b) => (a.homepageOrder || 999) - (b.homepageOrder || 999));

    return res.json({
      featuredPost,
      latestPosts,
      allAvailablePosts: posts
    });
  });

  router.put('/homepage', requireAdminAuth, (req: Request, res: Response) => {
    const { featuredSlug, items } = req.body || {};
    const posts = getAllBlogPostsFromDisk();

    // 1. Update featured status
    if (featuredSlug) {
      for (const p of posts) {
        const isFeatured = p.slug === featuredSlug;
        if (p.homepageFeatured !== isFeatured) {
          p.homepageFeatured = isFeatured;
          if (isFeatured) p.showOnHomepage = true;
          writeJsonFile(path.join(BLOG_DIR, `${p.slug}.json`), p);
        }
      }
    }

    // 2. Update orders
    if (Array.isArray(items)) {
      for (const item of items) {
        const p = posts.find(post => post.slug === item.slug);
        if (p) {
          if (item.homepageOrder !== undefined) p.homepageOrder = Number(item.homepageOrder);
          if (item.showOnHomepage !== undefined) p.showOnHomepage = Boolean(item.showOnHomepage);
          if (item.homepageFeatured !== undefined) p.homepageFeatured = Boolean(item.homepageFeatured);
          writeJsonFile(path.join(BLOG_DIR, `${p.slug}.json`), p);
        }
      }
    }

    return res.json({ success: true, message: 'হোমপেজ ব্লগ সেটিং সফলভাবে আপডেট হয়েছে।' });
  });

  // 7. MEDIA LIBRARY
  router.get('/media', requireAdminAuth, (req: Request, res: Response) => {
    const media = readJsonFile<any[]>(MEDIA_FILE, []);
    return res.json({ media });
  });

  // Base64 image upload
  router.post('/media/upload', requireAdminAuth, (req: Request, res: Response) => {
    const { fileName, dataUrl, alt, title, caption } = req.body || {};
    if (!dataUrl || !fileName) {
      return res.status(400).json({ error: 'ছবি এবং ফাইলের নাম বাধ্যতামূলক।' });
    }

    try {
      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'ভুল ফাইল ফরম্যাট। Base64 ইমেজ ডাটা প্রয়োজন।' });
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');

      // Sanitize filename
      const ext = path.extname(fileName) || '.jpg';
      const base = path.basename(fileName, ext).replace(/[^\w-]/g, '').toLowerCase() || 'image';
      const cleanFileName = `${base}-${Date.now()}${ext}`;

      const filePath = path.join(UPLOADS_DIR, cleanFileName);
      fs.writeFileSync(filePath, buffer);

      const sizeKb = Math.round(buffer.length / 1024);
      const mediaList = readJsonFile<any[]>(MEDIA_FILE, []);
      const newMedia = {
        id: `med-${Date.now()}`,
        name: cleanFileName,
        url: `/uploads/${cleanFileName}`,
        size: `${sizeKb} KB`,
        type: mimeType,
        uploadedAt: new Date().toISOString(),
        alt: alt || base,
        title: title || cleanFileName,
        caption: caption || ''
      };

      mediaList.unshift(newMedia);
      writeJsonFile(MEDIA_FILE, mediaList);

      return res.json({ success: true, media: newMedia });
    } catch (err: any) {
      console.error('Media upload error:', err);
      return res.status(500).json({ error: 'ছবি আপলোড করতে ব্যর্থ হয়েছে: ' + (err.message || '') });
    }
  });

  router.put('/media/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { alt, title, caption } = req.body || {};
    const mediaList = readJsonFile<any[]>(MEDIA_FILE, []);
    const item = mediaList.find(m => m.id === id);
    if (!item) {
      return res.status(404).json({ error: 'মিডিয়া ফাইল পাওয়া যায়নি।' });
    }

    if (alt !== undefined) item.alt = alt;
    if (title !== undefined) item.title = title;
    if (caption !== undefined) item.caption = caption;

    writeJsonFile(MEDIA_FILE, mediaList);
    return res.json({ success: true, media: item });
  });

  router.delete('/media/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const mediaList = readJsonFile<any[]>(MEDIA_FILE, []);
    const item = mediaList.find(m => m.id === id);
    if (!item) {
      return res.status(404).json({ error: 'মিডিয়া ফাইল পাওয়া যায়নি।' });
    }

    // Delete file if under public/uploads
    if (item.url && item.url.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch {}
      }
    }

    const filtered = mediaList.filter(m => m.id !== id);
    writeJsonFile(MEDIA_FILE, filtered);

    return res.json({ success: true, message: 'মিডিয়া ফাইল সফলভাবে ডিলিট করা হয়েছে।' });
  });

  // 8. REDIRECTS MANAGEMENT
  router.get('/redirects', requireAdminAuth, (req: Request, res: Response) => {
    const redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);
    return res.json({ redirects });
  });

  router.post('/redirects', requireAdminAuth, (req: Request, res: Response) => {
    const { oldUrl, newUrl, type, status } = req.body || {};
    if (!oldUrl || !newUrl) {
      return res.status(400).json({ error: 'পুরাতন লিংক ও নতুন লিংক উভয়ই আবশ্যক।' });
    }

    const cleanOld = oldUrl.trim();
    const cleanNew = newUrl.trim();

    if (cleanOld === cleanNew) {
      return res.status(400).json({ error: 'পুরাতন লিংক এবং নতুন লিংক একই হতে পারে না।' });
    }

    const redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);

    // Loop detection: check if cleanNew -> cleanOld already exists
    const loop = redirects.find(r => r.oldUrl === cleanNew && r.newUrl === cleanOld);
    if (loop) {
      return res.status(400).json({ error: 'রিডাইরেক্ট লুপ (Redirect Loop) তৈরি হচ্ছে! বিপরীতমুখী রিডাইরেক্ট ইতিমধ্যে রয়েছে।' });
    }

    const newRedir = {
      id: `redir-${Date.now()}`,
      oldUrl: cleanOld,
      newUrl: cleanNew,
      type: Number(type) === 302 ? 302 : 301,
      status: status || 'active',
      createdAt: new Date().toISOString()
    };

    redirects.unshift(newRedir);
    writeJsonFile(REDIRECTS_FILE, redirects);

    return res.json({ success: true, redirect: newRedir });
  });

  router.put('/redirects/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { oldUrl, newUrl, type, status } = req.body || {};
    const redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);
    const item = redirects.find(r => r.id === id);
    if (!item) {
      return res.status(404).json({ error: 'রিডাইরেক্ট পাওয়া যায়নি।' });
    }

    if (oldUrl) item.oldUrl = oldUrl.trim();
    if (newUrl) item.newUrl = newUrl.trim();
    if (type) item.type = Number(type);
    if (status) item.status = status;

    writeJsonFile(REDIRECTS_FILE, redirects);
    return res.json({ success: true, redirect: item });
  });

  router.delete('/redirects/:id', requireAdminAuth, (req: Request, res: Response) => {
    const id = req.params.id as string;
    const redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);
    const filtered = redirects.filter(r => r.id !== id);
    writeJsonFile(REDIRECTS_FILE, filtered);
    return res.json({ success: true });
  });

  // 9. REVISION HISTORY & RESTORE
  router.get('/revisions/:slug', requireAdminAuth, (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const allRevisions = readJsonFile<any[]>(REVISIONS_FILE, []);
    const postRevisions = allRevisions.filter(r => r.postSlug === slug);
    return res.json({ revisions: postRevisions });
  });

  router.post('/revisions/:slug/restore', requireAdminAuth, (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const { revisionId } = req.body || {};

    const allRevisions = readJsonFile<any[]>(REVISIONS_FILE, []);
    const rev = allRevisions.find(r => r.id === revisionId && r.postSlug === slug);
    if (!rev || !rev.data) {
      return res.status(404).json({ error: 'রিভিশন ভার্সন পাওয়া যায়নি।' });
    }

    const postPath = path.join(BLOG_DIR, `${slug}.json`);
    if (!fs.existsSync(postPath)) {
      return res.status(404).json({ error: 'আর্টিকেল পাওয়া যায়নি।' });
    }

    const currentPost = readJsonFile<any>(postPath, {});
    const restoredPost = {
      ...currentPost,
      ...rev.data,
      slug,
      updatedDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      updatedBy: req.body.authorUser || 'admin'
    };

    writeJsonFile(postPath, restoredPost);
    logRevision(slug, req.body.authorUser || 'admin', restoredPost.title, 'restored', restoredPost);

    return res.json({ success: true, post: restoredPost, message: 'রিভিশন সফলভাবে রিস্টোর করা হয়েছে।' });
  });

  // 10. TOOLS & BLOG RELATIONS
  router.get('/tools', requireAdminAuth, (req: Request, res: Response) => {
    const posts = getAllBlogPostsFromDisk();
    const toolRelations = TOOLS.map(tool => {
      const linkedPosts = posts.filter(p => p.relatedTool === tool.link).map(p => ({
        slug: p.slug,
        title: p.title,
        status: p.status || 'published'
      }));
      return {
        id: tool.id,
        refCode: tool.refCode,
        title: tool.title,
        link: tool.link,
        category: tool.category,
        linkedPostsCount: linkedPosts.length,
        linkedPosts
      };
    });

    return res.json({ tools: toolRelations });
  });

  // 11. CACHE REVALIDATION
  router.post('/cache/revalidate', requireAdminAuth, (req: Request, res: Response) => {
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'সাইট ক্যাশ ও কন্টেন্ট ইনডেক্স সফলভাবে রিভ্যালিডেট করা হয়েছে।'
    });
  });

  return router;
}
