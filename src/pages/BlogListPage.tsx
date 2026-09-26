import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkles,
  Tag,
  ExternalLink,
  Search,
  Clock,
  Wrench,
  RotateCcw,
} from 'lucide-react';
import { ALL_BLOG_POSTS, getAllCategories, BlogPost } from '../utils/blog.ts';
import { toBn } from '../utils/bnDigits.ts';
import { TOOLS } from '../data/tools.ts';

export const BlogListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return [{ name: 'all', label: 'সকল ক্যাটাগরি' }, ...getAllCategories().map((c) => ({ name: c.name, label: c.name }))];
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return ALL_BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTitle = post.title.toLowerCase().includes(q);
      const inExcerpt = post.excerpt.toLowerCase().includes(q);
      const inCategory = post.category?.toLowerCase().includes(q);
      const inTags = post.tags?.some((t) => t.toLowerCase().includes(q));

      return inTitle || inExcerpt || inCategory || inTags;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);

  // SEO ItemList Schema for rich blog collection snippet
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: ALL_BLOG_POSTS.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://utools.bd/blog/${post.slug}`,
      name: post.title,
    })),
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
    ],
  };

  return (
    <>
      <Helmet>
        <title>ব্লগ ও গাইড — Utools.bd</title>
        <meta
          name="description"
          content="চাকরির আবেদন, ছবি রিসাইজ, বাংলা টাইপিং, সরকারি সার্কুলার ও ডিজিটাল ইউটিলিটি সংক্রান্ত প্রয়োজনীয় আর্টিকেল ও গাইড।"
        />
        <meta property="og:title" content="ব্লগ ও গাইড — Utools.bd" />
        <meta
          property="og:description"
          content="চাকরির আবেদন, ছবি রিসাইজ, বাংলা টাইপিং ও ডিজিটাল ইউটিলিটি সংক্রান্ত তথ্যবহুল গাইড ও টিপস।"
        />
        <meta property="og:url" content="https://utools.bd/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://utools.bd/og-image.png?v=2" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ব্লগ ও গাইড — Utools.bd" />
        <meta
          name="twitter:description"
          content="চাকরির আবেদন, ছবি রিসাইজ, বাংলা টাইপিং ও ডিজিটাল ইউটিলিটি সংক্রান্ত তথ্যবহুল গাইড ও টিপস।"
        />
        <meta name="twitter:image" content="https://utools.bd/og-image.png?v=2" />
        <link rel="canonical" href="https://utools.bd/blog" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <main className="min-h-screen bg-[#FAFAF7] text-[#0F1F17] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-[#4A5A52] flex items-center space-x-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B5D3B] transition-colors">
              হোম
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0B5D3B] font-medium" aria-current="page">
              ব্লগ ও গাইড
            </span>
          </nav>

          {/* Hero Header */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EC] text-[#0B5D3B] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#0B5D3B]" />
              <span>ইউটিলিটি ও টেক গাইড</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-4.5xl font-extrabold text-[#0F1F17] tracking-tight">
              ব্লগ ও প্রয়োজনীয় নির্দেশিকা
            </h1>
            <p className="text-sm sm:text-base text-[#4A5A52] max-w-2xl leading-relaxed">
              চাকরির প্রস্তুতি, সরকারি নিয়মাবলী, বাংলা ফন্ট রূপান্তর ও ডিজিটাল জীবন সহজ করার বাস্তবসম্মত গাইডলাইন।
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="bg-white border border-[#D5E4DB] p-4 sm:p-5 rounded-3xl shadow-xs space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#4A5A52] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ব্লগ খুঁজুন (যেমন: ছবি রিসাইজ, বাংলা সন, জিপিএ, ইউনিকোড)..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#F8FAF9] border border-[#D5E4DB] rounded-2xl focus:outline-hidden focus:border-[#0B5D3B] focus:ring-1 focus:ring-[#0B5D3B] text-[#0F1F17] placeholder-[#4A5A52]/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#4A5A52] hover:text-[#0F1F17]"
                  title="অনুসন্ধান মুছুন"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#D5E4DB]/60">
              <span className="text-xs font-semibold text-[#4A5A52] mr-1 hidden sm:inline">ক্যাটাগরি:</span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-xs'
                        : 'bg-[#F8FAF9] text-[#4A5A52] border-[#D5E4DB] hover:bg-[#E6F4EC] hover:text-[#0B5D3B]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results feedback if searching */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center justify-between text-xs text-[#4A5A52] px-1">
              <span>
                ফিল্টার ফলাফল: <strong>{toBn(filteredPosts.length)}</strong> টি আর্টিকেল পাওয়া গেছে
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-1 text-[#0B5D3B] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>সব রিসেট করুন</span>
              </button>
            </div>
          )}

          {/* Zero results placeholder */}
          {filteredPosts.length === 0 && (
            <div className="bg-white border border-[#D5E4DB] rounded-3xl p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-[#0B5D3B]/40 mx-auto" />
              <h3 className="text-lg font-bold text-[#0F1F17]">কোনো আর্টিকেল পাওয়া যায়নি</h3>
              <p className="text-xs sm:text-sm text-[#4A5A52] max-w-sm mx-auto">
                আপনার অনুসন্ধানের সাথে মিলে এমন কোনো গাইড পাওয়া যায়নি। অন্য কীওয়ার্ড বা ক্যাটাগরি নির্বাচন করে চেষ্টা করুন।
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 px-4 py-2 bg-[#0B5D3B] text-white text-xs font-semibold rounded-xl hover:bg-[#084A2E]"
              >
                সকল ব্লগ দেখুন
              </button>
            </div>
          )}

          {/* Featured Article in Blog List (Only when viewing all and no search) */}
          {!searchQuery && selectedCategory === 'all' && featuredPost && (
            <article className="group bg-white border border-[#D5E4DB] hover:border-[#0B5D3B]/40 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="md:col-span-6 overflow-hidden rounded-2xl bg-[#F0F4F2] aspect-[16/10] block"
                  tabIndex={-1}
                >
                  {featuredPost.image ? (
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.imageAlt || featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E6F4EC] to-[#D5E4DB] text-[#0B5D3B]">
                      <BookOpen className="w-16 h-16 opacity-40" />
                    </div>
                  )}
                </Link>

                <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {featuredPost.category && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D0] text-[#B45309] font-medium text-[11px]">
                          {featuredPost.category}
                        </span>
                      )}
                      <span className="font-mono text-[#4A5A52] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{toBn(featuredPost.date)}</span>
                      </span>
                      {featuredPost.readTime && (
                        <span className="text-[#4A5A52] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{toBn(featuredPost.readTime)}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F17] leading-snug hover:text-[#0B5D3B] transition-colors">
                      <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#4A5A52] leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5D3B] hover:text-[#084A2E] group/link transition-colors"
                    >
                      <span>সম্পূর্ণ গাইডটি পড়ুন</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Grid of Articles */}
          {filteredPosts.length > 0 && (
            <div className="space-y-4">
              {!searchQuery && selectedCategory === 'all' && (
                <h2 className="text-lg sm:text-xl font-bold text-[#0F1F17] tracking-tight">
                  অন্যান্য আর্টিকেলসমূহ
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(searchQuery || selectedCategory !== 'all' ? filteredPosts : listPosts).map((post) => (
                  <article
                    key={post.slug}
                    className="group bg-white border border-[#D5E4DB] hover:border-[#0B5D3B]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Image */}
                      <Link
                        to={`/blog/${post.slug}`}
                        className="block overflow-hidden rounded-xl bg-[#F0F4F2] aspect-[16/9]"
                        tabIndex={-1}
                      >
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E6F4EC] to-[#D5E4DB] text-[#0B5D3B]">
                            <BookOpen className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                      </Link>

                      {/* Category & Time */}
                      <div className="flex items-center justify-between text-xs text-[#4A5A52]">
                        {post.category && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3D0] text-[#B45309] font-medium text-[11px]">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{post.category}</span>
                          </span>
                        )}
                        {post.readTime && (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#4A5A52]">
                            <Clock className="w-3 h-3" />
                            <span>{toBn(post.readTime)}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-[#0F1F17] leading-snug line-clamp-2 hover:text-[#0B5D3B] transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-[#4A5A52] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#D5E4DB]/60 space-y-2.5">
                      {post.relatedTool && post.relatedToolLabel && (
                        <div className="text-[11px] text-[#4A5A52] bg-[#F0F4F2] px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                          <span>সম্পর্কিত টুল:</span>
                          <Link
                            to={post.relatedTool}
                            className="font-semibold text-[#0B5D3B] hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>{post.relatedToolLabel}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#4A5A52] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#4A5A52]" />
                          <span>{toBn(post.date)}</span>
                        </span>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-[#0B5D3B] hover:text-[#084A2E] group/link transition-colors"
                        >
                          <span>পড়ুন</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Related Tools Bottom Strip */}
          <section className="p-6 bg-white border border-[#D5E4DB] rounded-3xl space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#0B5D3B]" />
                <h2 className="text-sm sm:text-base font-bold text-[#0F1F17]">
                  Utools.bd-এর ফ্রি ডিজিটাল ইউটিলিটি টুলস
                </h2>
              </div>
              <Link to="/" className="text-xs font-bold text-[#0B5D3B] hover:underline">
                সকল টুলস দেখুন →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TOOLS.filter((t) => t.link).slice(0, 8).map((tool) => (
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
