import { BlogPost, ArticleStatus } from '../utils/blog.ts';

export type { BlogPost, ArticleStatus };

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  articleCount?: number;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  articleCount?: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
  alt: string;
  title: string;
  caption?: string;
}

export interface RedirectItem {
  id: string;
  oldUrl: string;
  newUrl: string;
  type: number; // 301 or 302
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface RevisionItem {
  id: string;
  postSlug: string;
  timestamp: string;
  author: string;
  title: string;
  action: string;
  data?: Partial<BlogPost>;
}

export interface ToolRelationItem {
  id: string;
  refCode: string;
  title: string;
  link: string;
  category: string;
  linkedPostsCount: number;
  linkedPosts: Array<{ slug: string; title: string; status: string }>;
}

export interface DashboardStats {
  totalArticles: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  categories: number;
  tags: number;
  mediaFiles: number;
}
