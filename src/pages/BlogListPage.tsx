import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, ArrowRight, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { ALL_BLOG_POSTS } from '../utils/blog.ts';
import { toBn } from '../utils/bnDigits.ts';

export const BlogListPage: React.FC = () => {
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
        <link rel="canonical" href="https://utools.bd/blog" />
      </Helmet>

      <main className="min-h-screen bg-[#FAFAF7] text-[#0F1F17] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-[#4A5A52] flex items-center space-x-2">
            <Link to="/" className="hover:text-[#0B5D3B] transition-colors">
              হোম
            </Link>
            <span>/</span>
            <span className="text-[#0B5D3B] font-medium">ব্লগ ও গাইড</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EC] text-[#0B5D3B] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#0B5D3B]" />
              <span>ইউটিলিটি ও টেক গাইড</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1F17] tracking-tight">
              ব্লগ ও প্রয়োজনীয় নির্দেশিকা
            </h1>
            <p className="text-sm sm:text-base text-[#4A5A52] max-w-2xl">
              চাকরির প্রস্তুতি, সরকারি নিয়মাবলী, বাংলা ফন্ট রূপান্তর ও ডিজিটাল জীবন সহজ করার বাস্তবসম্মত গাইডলাইন।
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {ALL_BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-[#D5E4DB] hover:border-[#0B5D3B]/40 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#4A5A52]">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3D0] text-[#B45309] font-medium text-[11px]">
                        <Tag className="w-3 h-3" />
                        <span>{post.category}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#4A5A52]" />
                      <span>{toBn(post.date)}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#0F1F17] leading-snug hover:text-[#0B5D3B] transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4A5A52] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D5E4DB]/60 space-y-3">
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

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5D3B] hover:text-[#084A2E] group transition-colors"
                  >
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};
