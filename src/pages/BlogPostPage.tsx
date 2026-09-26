import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Tag,
  Sparkles,
  ExternalLink,
  Clock,
  Share2,
  Check,
  BookOpen,
  ListOrdered,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { getBlogPostBySlug, getRelatedPosts, BlogPost } from '../utils/blog.ts';
import { toBn } from '../utils/bnDigits.ts';
import { ArticleRenderer } from '../components/blog/ArticleRenderer.tsx';
import { TOOLS } from '../data/tools.ts';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const [copied, setCopied] = useState(false);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedArticles = getRelatedPosts(post, 3);

  // Extract table of contents headings from markdown
  const headingMatches = Array.from(post.content.matchAll(/^##\s+(.+)$/gm));
  const tableOfContents = headingMatches.map((match) => {
    const text = match[1].trim();
    const id = text.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-');
    return { text, id };
  });

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://utools.bd/blog/${post.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Structured Data Schema for BlogPosting / Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://utools.bd/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://utools.bd/blog/${post.slug}`,
    },
    author: {
      '@type': 'Organization',
      name: post.author || 'Utools.bd এডিটোরিয়াল টিম',
      url: 'https://utools.bd/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Utools.bd',
      url: 'https://utools.bd',
      logo: {
        '@type': 'ImageObject',
        url: 'https://utools.bd/og-image.png?v=2',
      },
    },
    ...(post.image
      ? {
          image: {
            '@type': 'ImageObject',
            url: post.image.startsWith('http') ? post.image : `https://utools.bd${post.image}`,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'হোম',
        item: 'https://utools.bd/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ব্লগ ও গাইড',
        item: 'https://utools.bd/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://utools.bd/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{post.seoTitle ? `${post.seoTitle} — Utools.bd` : `${post.title} — Utools.bd ব্লগ`}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={post.canonicalUrl || `https://utools.bd/blog/${post.slug}`} />
        {post.image && (
          <meta
            property="og:image"
            content={post.image.startsWith('http') ? post.image : `https://utools.bd${post.image}`}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seoTitle || post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        {post.image && (
          <meta
            name="twitter:image"
            content={post.image.startsWith('http') ? post.image : `https://utools.bd${post.image}`}
          />
        )}
        <link rel="canonical" href={post.canonicalUrl || `https://utools.bd/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <main className="min-h-screen bg-[#FAFAF7] text-[#0F1F17] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb & Back */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="text-xs text-[#4A5A52] flex items-center space-x-2" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0B5D3B] transition-colors">
                হোম
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog" className="hover:text-[#0B5D3B] transition-colors">
                ব্লগ ও গাইড
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#0B5D3B] font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                {post.title}
              </span>
            </nav>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B5D3B] hover:text-[#084A2E] bg-white border border-[#D5E4DB] px-3 py-1.5 rounded-full shadow-xs hover:bg-[#F0F4F2] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সকল ব্লগে ফিরুন</span>
            </Link>
          </div>

          {/* Article Main Card */}
          <article className="bg-white border border-[#D5E4DB] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
            {/* Article Header */}
            <header className="space-y-4 border-b border-[#D5E4DB] pb-6">
              <div className="flex flex-wrap items-center gap-2">
                {post.category && (
                  <span className="px-3 py-1 bg-[#FEF3D0] text-[#B45309] text-xs font-semibold rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{post.category}</span>
                  </span>
                )}
                <span className="px-3 py-1 bg-[#E6F4EC] text-[#0B5D3B] text-xs font-semibold rounded-full flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{toBn(post.date)}</span>
                </span>
                {post.readTime && (
                  <span className="px-3 py-1 bg-[#F0F4F2] text-[#4A5A52] text-xs font-semibold rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{toBn(post.readTime)}</span>
                  </span>
                )}
                {post.author && (
                  <span className="text-xs text-[#4A5A52] flex items-center gap-1 ml-auto">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3.5xl lg:text-4xl font-extrabold text-[#0F1F17] tracking-tight leading-snug">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-[#4A5A52] leading-relaxed italic bg-[#F8FAF9] p-4 rounded-2xl border border-[#D5E4DB]/60">
                "{post.excerpt}"
              </p>

              {/* Share & Actions Row */}
              <div className="flex items-center justify-between pt-2 text-xs text-[#4A5A52]">
                {post.updatedDate && (
                  <span className="flex items-center gap-1 text-[11px] text-[#4A5A52]">
                    <RefreshCw className="w-3 h-3 text-[#0B5D3B]" />
                    <span>আপডেট: {toBn(post.updatedDate)}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5E4DB] bg-white hover:bg-[#F0F4F2] text-[#0B5D3B] text-xs font-semibold cursor-pointer transition-colors"
                  title="লেখাটি শেয়ার বা লিংক কপি করুন"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0B5D3B]" />
                      <span>লিংক কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>শেয়ার করুন</span>
                    </>
                  )}
                </button>
              </div>
            </header>

            {/* Featured Image Banner */}
            {post.image && (
              <figure className="overflow-hidden rounded-2xl border border-[#D5E4DB] bg-[#F0F4F2]">
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full aspect-[16/9] object-cover"
                />
                {post.imageAlt && (
                  <figcaption className="p-2 text-center text-xs text-[#4A5A52] bg-[#F8FAF9] border-t border-[#D5E4DB]/40">
                    {post.imageAlt}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Table of Contents (if 2+ H2 headings exist) */}
            {tableOfContents.length >= 2 && (
              <nav
                className="p-5 bg-[#F8FAF9] border border-[#D5E4DB] rounded-2xl space-y-3"
                aria-label="Table of contents"
              >
                <div className="flex items-center gap-2 text-[#084A2E] font-bold text-sm">
                  <ListOrdered className="w-4 h-4 text-[#0B5D3B]" />
                  <span>এই আর্টিকেলে যা যা রয়েছে:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  {tableOfContents.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#0B5D3B] font-mono shrink-0">{toBn(idx + 1)}.</span>
                      <a
                        href={`#${item.id}`}
                        className="text-[#4A5A52] hover:text-[#0B5D3B] hover:underline transition-colors"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Primary Related Tool Banner (if tool defined) */}
            {post.relatedTool && post.relatedToolLabel && (
              <div className="p-4 bg-[#E6F4EC]/60 border border-[#0B5D3B]/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#0B5D3B] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-[#0B5D3B] block">সরাসরি টুল ব্যবহার করুন</span>
                    <span className="text-sm font-bold text-[#0F1F17]">{post.relatedToolLabel}</span>
                  </div>
                </div>

                <Link
                  to={post.relatedTool}
                  className="px-4 py-2 bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>টুল ওপেন করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Shared Article Markdown Body */}
            <ArticleRenderer content={post.content} />

            {/* Article Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-[#D5E4DB] flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#4A5A52] font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> ট্যাগসমূহ:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#F0F4F2] text-[#084A2E] px-2.5 py-1 rounded-lg border border-[#D5E4DB]/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="space-y-4 pt-4" aria-labelledby="related-articles-heading">
              <div className="flex items-center justify-between">
                <h2
                  id="related-articles-heading"
                  className="text-xl sm:text-2xl font-bold text-[#0F1F17] tracking-tight flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-[#0B5D3B]" />
                  <span>সম্পর্কিত আরও লেখা</span>
                </h2>
                <Link
                  to="/blog"
                  className="text-xs font-bold text-[#0B5D3B] hover:text-[#084A2E] inline-flex items-center gap-1"
                >
                  <span>সকল লেখা</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedArticles.map((rel) => (
                  <article
                    key={rel.slug}
                    className="bg-white border border-[#D5E4DB] hover:border-[#0B5D3B]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      {rel.image && (
                        <Link
                          to={`/blog/${rel.slug}`}
                          className="block overflow-hidden rounded-xl bg-[#F0F4F2] aspect-[16/9] mb-2"
                          tabIndex={-1}
                        >
                          <img
                            src={rel.image}
                            alt={rel.imageAlt || rel.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </Link>
                      )}
                      {rel.category && (
                        <span className="text-[11px] font-semibold text-[#B45309] bg-[#FEF3D0] px-2 py-0.5 rounded-full inline-block">
                          {rel.category}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-[#0F1F17] line-clamp-2 hover:text-[#0B5D3B] transition-colors">
                        <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      <p className="text-xs text-[#4A5A52] line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#D5E4DB]/60 flex items-center justify-between text-xs">
                      <span className="font-mono text-[#4A5A52]">{toBn(rel.date)}</span>
                      <Link
                        to={`/blog/${rel.slug}`}
                        className="font-bold text-[#0B5D3B] hover:text-[#084A2E] inline-flex items-center gap-0.5"
                      >
                        <span>পড়ুন</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Useful Tools Quick Strip */}
          <section className="p-6 bg-white border border-[#D5E4DB] rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#0B5D3B]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F17]">
                  Utools.bd-এর অন্যান্য প্রয়োজনীয় ডিজিটাল টুলস
                </h3>
              </div>
              <Link to="/" className="text-xs font-bold text-[#0B5D3B] hover:underline">
                হোমপেজ দেখুন →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TOOLS.filter((t) => t.link).slice(0, 4).map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.link!}
                  className="p-3 rounded-xl bg-[#FAFAF7] hover:bg-[#E6F4EC] border border-[#D5E4DB]/80 text-xs font-semibold text-[#0F1F17] hover:text-[#0B5D3B] transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{tool.title}</span>
                  <ArrowRight className="w-3 h-3 text-[#0B5D3B] shrink-0 ml-1" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
