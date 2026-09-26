import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { getHomepageBlogData } from '../../utils/blog.ts';
import { toBn } from '../../utils/bnDigits.ts';
import homeContent from '../../../content/pages/home.json';

export const HomeBlogSection: React.FC = () => {
  const { featuredPost, latestPosts } = getHomepageBlogData();

  // If there are no published articles to display, omit section
  if (!featuredPost && latestPosts.length === 0) {
    return null;
  }

  const badgeText = homeContent.blogHeading?.badge || 'ব্লগ';
  const headingText = homeContent.blogHeading?.title || 'সাম্প্রতিক লেখা';
  const subtitleText =
    homeContent.blogHeading?.subtitle ||
    'দৈনন্দিন কাজ, শিক্ষা, প্রযুক্তি, হিসাব ও প্রয়োজনীয় ডিজিটাল বিষয়ে সহজ ভাষায় দরকারি গাইড।';

  return (
    <section className="py-20 lg:py-24 bg-[#FAFAF7]" aria-labelledby="blog-section-heading">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D5E4DB]">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E6F4EC] text-[#0B5D3B]">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{badgeText}</span>
            </span>
            <h2
              id="blog-section-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F1F17] tracking-tight"
            >
              {headingText}
            </h2>
            <p className="text-sm sm:text-base text-[#4A5A52] max-w-2xl leading-relaxed">
              {subtitleText}
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 self-start md:self-end px-5 py-2.5 rounded-full text-sm font-bold bg-white hover:bg-[#E6F4EC] text-[#0B5D3B] border border-[#0B5D3B]/20 hover:border-[#0B5D3B]/40 shadow-xs transition-colors shrink-0"
          >
            <span>সব লেখা দেখুন</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* FEATURED ARTICLE                                         */}
        {/* ======================================================== */}
        {featuredPost && (
          <article className="group bg-white border border-[#D5E4DB] hover:border-[#0B5D3B]/40 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs hover:shadow-md transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Large Featured Image */}
              <div className="lg:col-span-6 overflow-hidden rounded-2xl bg-[#F0F4F2] aspect-[16/10] relative">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="block w-full h-full"
                  aria-label={featuredPost.title}
                >
                  {featuredPost.image ? (
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.imageAlt || featuredPost.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E6F4EC] to-[#D5E4DB] text-[#0B5D3B]">
                      <BookOpen className="w-16 h-16 opacity-40" />
                    </div>
                  )}
                </Link>
              </div>

              {/* Right Column: Editorial Details */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Category */}
                  {featuredPost.category && (
                    <div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3D0] text-[#B45309]">
                        <Tag className="w-3 h-3" />
                        <span>{featuredPost.category}</span>
                      </span>
                    </div>
                  )}

                  {/* Article Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F1F17] leading-snug tracking-tight hover:text-[#0B5D3B] transition-colors">
                    <Link to={`/blog/${featuredPost.slug}`} className="focus:outline-hidden">
                      {featuredPost.title}
                    </Link>
                  </h3>

                  {/* Short Excerpt */}
                  <p className="text-sm sm:text-base text-[#4A5A52] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  {/* Published Date & Reading Time */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#4A5A52]">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#0B5D3B]" />
                      <span>{toBn(featuredPost.date)}</span>
                    </span>
                    <span className="text-[#8FA599]">•</span>
                    {featuredPost.readTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0B5D3B]" />
                        <span>{toBn(featuredPost.readTime)} পড়ুন</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B5D3B] hover:text-[#084A2E] group/link transition-colors"
                  >
                    <span>বিস্তারিত পড়ুন</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  {featuredPost.relatedTool && featuredPost.relatedToolLabel && (
                    <Link
                      to={featuredPost.relatedTool}
                      className="text-xs text-[#4A5A52] hover:text-[#0B5D3B] bg-[#F0F4F2] px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      টুল: <span className="underline">{featuredPost.relatedToolLabel}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}

        {/* ======================================================== */}
        {/* LATEST ARTICLES                                          */}
        {/* ======================================================== */}
        {latestPosts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F17] tracking-tight">
                সর্বশেষ লেখা
              </h2>
              <span className="text-xs text-[#4A5A52]">
                মোট {toBn(latestPosts.length)} টি সাম্প্রতিক গাইড
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-white border border-[#D5E4DB] hover:border-[#0B5D3B]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* IMAGE */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block overflow-hidden rounded-xl bg-[#F0F4F2] aspect-[16/9] relative"
                      tabIndex={-1}
                      aria-label={post.title}
                    >
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.imageAlt || post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E6F4EC] to-[#D5E4DB] text-[#0B5D3B]">
                          <BookOpen className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                    </Link>

                    {/* Category · Reading Time */}
                    <div className="flex items-center gap-2 text-xs text-[#4A5A52]">
                      {post.category && (
                        <span className="font-semibold text-[#0B5D3B]">
                          {post.category}
                        </span>
                      )}
                      {post.category && post.readTime && (
                        <span className="text-[#8FA599]">•</span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-[#4A5A52]">
                          <Clock className="w-3 h-3 text-[#4A5A52]" />
                          <span>{toBn(post.readTime)}</span>
                        </span>
                      )}
                    </div>

                    {/* ARTICLE TITLE */}
                    <h3 className="text-base font-bold text-[#0F1F17] leading-snug line-clamp-2 hover:text-[#0B5D3B] transition-colors">
                      <Link to={`/blog/${post.slug}`} className="focus:outline-hidden">
                        {post.title}
                      </Link>
                    </h3>

                    {/* Short Excerpt */}
                    <p className="text-xs sm:text-sm text-[#4A5A52] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Published Date & পড়ুন → */}
                  <div className="pt-3 border-t border-[#D5E4DB]/60 flex items-center justify-between text-xs">
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
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
