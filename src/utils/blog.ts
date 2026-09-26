export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  category?: string;
  relatedTool?: string;
  relatedToolLabel?: string;
  content: string;
}

// Eagerly import all blog posts from /content/blog/*.json at build time
const blogModules = import.meta.glob<{ default: BlogPost } | BlogPost>(
  '../../content/blog/*.json',
  { eager: true }
);

export const ALL_BLOG_POSTS: BlogPost[] = Object.values(blogModules)
  .map((mod: any) => (mod.default ? mod.default : mod))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return ALL_BLOG_POSTS.find((p) => p.slug === slug);
}
