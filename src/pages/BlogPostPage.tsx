import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Sparkles, ExternalLink, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, ALL_BLOG_POSTS } from '../utils/blog.ts';
import { toBn } from '../utils/bnDigits.ts';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, children, ...props }) => (
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1F17] mt-8 mb-4 tracking-tight" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ node, children, ...props }) => (
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F17] mt-8 mb-3 pt-2 border-b border-[#D5E4DB]/40 pb-2" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ node, children, ...props }) => (
                    <h3 className="text-lg sm:text-xl font-bold text-[#0F1F17] mt-6 mb-2" {...props}>
                      {children}
                    </h3>
                  ),
                  h4: ({ node, children, ...props }) => (
                    <h4 className="text-base sm:text-lg font-bold text-[#0F1F17] mt-4 mb-2" {...props}>
                      {children}
                    </h4>
                  ),
                  p: ({ node, children, ...props }) => (
                    <p className="text-sm sm:text-base text-[#4A5A52] leading-relaxed my-3" {...props}>
                      {children}
                    </p>
                  ),
                  strong: ({ node, children, ...props }) => (
                    <strong className="font-bold text-[#0F1F17]" {...props}>
                      {children}
                    </strong>
                  ),
                  em: ({ node, children, ...props }) => (
                    <em className="italic" {...props}>
                      {children}
                    </em>
                  ),
                  ul: ({ node, children, ...props }) => (
                    <ul className="list-disc list-outside ml-5 space-y-1.5 my-3 text-sm sm:text-base text-[#4A5A52] leading-relaxed" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ node, children, ...props }) => (
                    <ol className="list-decimal list-outside ml-5 space-y-1.5 my-3 text-sm sm:text-base text-[#4A5A52] leading-relaxed" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ node, children, ...props }) => (
                    <li className="pl-1" {...props}>
                      {children}
                    </li>
                  ),
                  a: ({ node, href, children, ...props }) => {
                    const isInternal =
                      href &&
                      (href.startsWith('/') ||
                        href.startsWith('https://utools.bd') ||
                        href.startsWith('http://utools.bd'));
                    const cleanHref = href
                      ? href.replace(/^https?:\/\/utools\.bd/, '') || '/'
                      : '#';

                    if (isInternal) {
                      return (
                        <Link
                          to={cleanHref}
                          className="font-medium text-[#0B5D3B] hover:text-[#084A2E] underline decoration-[#0B5D3B]/40 hover:decoration-[#084A2E] transition-colors"
                          {...props}
                        >
                          {children}
                        </Link>
                      );
                    }

                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#0B5D3B] hover:text-[#084A2E] underline decoration-[#0B5D3B]/40 hover:decoration-[#084A2E] transition-colors inline-flex items-center gap-1"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  blockquote: ({ node, children, ...props }) => (
                    <blockquote className="border-l-4 border-[#0B5D3B] bg-[#F8FAF9] pl-4 py-2 my-4 rounded-r-lg italic text-[#4A5A52]" {...props}>
                      {children}
                    </blockquote>
                  ),
                  pre: ({ node, children, ...props }) => (
                    <pre className="bg-[#0F1F17] text-[#FAFAF7] p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono" {...props}>
                      {children}
                    </pre>
                  ),
                  code: ({ node, className, children, ...props }) => (
                    <code className={className ? className : "px-1.5 py-0.5 bg-[#F0F4F2] text-[#0B5D3B] rounded text-xs font-mono"} {...props}>
                      {children}
                    </code>
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-[#D5E4DB]" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </>
  );
};
