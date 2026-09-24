import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Sparkles, ExternalLink, Bookmark } from 'lucide-react';
import { getBlogPostBySlug, ALL_BLOG_POSTS } from '../utils/blog.ts';
import { toBn } from '../utils/bnDigits.ts';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Format simple markdown into paragraphs & headings
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#0F1F17] mt-6 mb-2">
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('1. ') || block.startsWith('- ')) {
        const items = block.split('\n').map((line) => line.replace(/^(\d+\.|\-)\s+/, ''));
        return (
          <ul key={idx} className="list-disc list-inside space-y-1.5 my-3 text-sm sm:text-base text-[#4A5A52] leading-relaxed">
            {items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
      }
      return (
        <p
          key={idx}
          className="text-sm sm:text-base text-[#4A5A52] leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(block) }}
        />
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#0F1F17]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  };

  return (
    <>
      <Helmet>
        <title>{`${post.title} — Utools.bd ব্লগ`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://utools.bd/blog/${post.slug}`} />
      </Helmet>

      <main className="min-h-screen bg-[#FAFAF7] text-[#0F1F17] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb & Back */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="text-xs text-[#4A5A52] flex items-center space-x-2">
              <Link to="/" className="hover:text-[#0B5D3B]">
                হোম
              </Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-[#0B5D3B]">
                ব্লগ
              </Link>
              <span>/</span>
              <span className="text-[#0B5D3B] font-medium truncate max-w-[200px] sm:max-w-none">
                {post.title}
              </span>
            </nav>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B5D3B] hover:text-[#084A2E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সকল ব্লগে ফিরুন</span>
            </Link>
          </div>

          {/* Article Header Card */}
          <article className="bg-white border border-[#D5E4DB] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="space-y-4 border-b border-[#D5E4DB] pb-6">
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
                {post.author && (
                  <span className="text-xs text-[#4A5A52] flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3.5xl font-extrabold text-[#0F1F17] tracking-tight leading-snug">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-[#4A5A52] leading-relaxed italic bg-[#F8FAF9] p-4 rounded-xl border border-[#D5E4DB]/60">
                "{post.excerpt}"
              </p>
            </div>

            {/* Related Tool Banner */}
            {post.relatedTool && post.relatedToolLabel && (
              <div className="p-4 bg-[#E6F4EC]/60 border border-[#0B5D3B]/20 rounded-2xl flex flex-wrap items-center justify-between gap-3">
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

            {/* Content Body */}
            <div className="prose max-w-none pt-2">
              {renderContent(post.content)}
            </div>
          </article>
        </div>
      </main>
    </>
  );
};
