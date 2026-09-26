export type ArticleStatus = 'published' | 'draft' | 'scheduled' | 'archived';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updatedDate?: string;
  status?: ArticleStatus;
  scheduledAt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  excerpt: string;
  image?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  readTime?: string;
  content: string;
  relatedTool?: string;
  relatedToolLabel?: string;
  relatedArticles?: string[];
  showOnHomepage?: boolean;
  homepageFeatured?: boolean;
  homepageOrder?: number;
  published?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  publishedAt?: string;
  publishedBy?: string;
}

// Eagerly import all blog posts from /content/blog/*.json at build time
const blogModules = import.meta.glob<{ default: BlogPost } | BlogPost>(
  '../../content/blog/*.json',
  { eager: true }
);

/** Determines if a post is publicly visible according to publishing & scheduling logic */
export function isPostPubliclyVisible(post: BlogPost): boolean {
  if (post.published === false) return false;
  if (post.status === 'draft' || post.status === 'archived') return false;
  if (post.status === 'scheduled' && post.scheduledAt) {
    const scheduledTime = new Date(post.scheduledAt).getTime();
    if (!isNaN(scheduledTime) && Date.now() < scheduledTime) {
      return false;
    }
  }
  return true;
}

// All raw posts (including drafts and scheduled) for admin inspection
export const RAW_BLOG_POSTS: BlogPost[] = Object.values(blogModules)
  .map((mod: any) => (mod.default ? mod.default : mod))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// All publicly published posts, sorted by date (newest first)
export const ALL_BLOG_POSTS: BlogPost[] = RAW_BLOG_POSTS.filter(isPostPubliclyVisible);

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return ALL_BLOG_POSTS.find((p) => p.slug === slug);
}

/**
 * Returns the homepage blog section data:
 * - 1 Featured article (controlled via CMS fields: showOnHomepage=true, homepageFeatured=true, homepageOrder)
 * - 3–6 Latest articles (excluding the featured one, controlled by showOnHomepage=true, homepageOrder)
 */
export function getHomepageBlogData(): {
  featuredPost: BlogPost | null;
  latestPosts: BlogPost[];
} {
  // Articles eligible for homepage (showOnHomepage !== false)
  const homepageEligible = ALL_BLOG_POSTS.filter((p) => p.showOnHomepage !== false);

  if (homepageEligible.length === 0) {
    return { featuredPost: null, latestPosts: [] };
  }

  // 1. Find the featured article:
  // First, look for an article explicitly marked homepageFeatured === true
  const explicitlyFeatured = homepageEligible
    .filter((p) => p.homepageFeatured === true)
    .sort((a, b) => {
      const orderA = a.homepageOrder ?? 999;
      const orderB = b.homepageOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const featuredPost: BlogPost =
    explicitlyFeatured[0] ||
    // Fallback: newest eligible article
    homepageEligible[0];

  // 2. Find latest articles (excluding the featured one)
  const latestPosts: BlogPost[] = homepageEligible
    .filter((p) => p.slug !== featuredPost.slug)
    .sort((a, b) => {
      const orderA = a.homepageOrder ?? 999;
      const orderB = b.homepageOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 6); // Up to 6 articles

  return { featuredPost, latestPosts };
}

/**
 * Get related articles for a given post.
 * Uses manual relatedArticles (slugs) if provided,
 * otherwise falls back to category/tag matching, excluding current post.
 */
export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  const others = ALL_BLOG_POSTS.filter((p) => p.slug !== currentPost.slug);

  // If manual related slugs exist in post
  if (currentPost.relatedArticles && currentPost.relatedArticles.length > 0) {
    const manualMatches = currentPost.relatedArticles
      .map((slug) => others.find((p) => p.slug === slug))
      .filter((p): p is BlogPost => Boolean(p));

    if (manualMatches.length >= limit) {
      return manualMatches.slice(0, limit);
    }

    // Fill remaining with category matches
    const manualSlugs = new Set(manualMatches.map((m) => m.slug));
    const autoMatches = others.filter(
      (p) =>
        !manualSlugs.has(p.slug) &&
        (p.category === currentPost.category ||
          (p.tags && currentPost.tags && p.tags.some((t) => currentPost.tags?.includes(t))))
    );

    return [...manualMatches, ...autoMatches].slice(0, limit);
  }

  // Automatic fallback: category match first
  const categoryMatches = others.filter((p) => p.category === currentPost.category);
  if (categoryMatches.length >= limit) {
    return categoryMatches.slice(0, limit);
  }

  const categorySlugs = new Set(categoryMatches.map((m) => m.slug));
  const remaining = others.filter((p) => !categorySlugs.has(p.slug));

  return [...categoryMatches, ...remaining].slice(0, limit);
}

/**
 * Get all unique categories with their post counts
 */
export function getAllCategories(): Array<{ name: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const post of ALL_BLOG_POSTS) {
    if (post.category) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}
