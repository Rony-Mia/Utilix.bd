import React from 'react';
import { X, ExternalLink, Calendar, User, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types.ts';
import { ArticleRenderer } from '../../components/blog/ArticleRenderer.tsx';

interface LiveArticlePreviewModalProps {
  post: Partial<BlogPost>;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveArticlePreviewModal: React.FC<LiveArticlePreviewModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#D5E4DB] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D5E4DB] bg-[#F8FAF9]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F4EC] text-[#0B5D3B] border border-[#0B5D3B]/20">
              <Sparkles className="w-3.5 h-3.5" />
              লাইভ আর্টিকেল প্রিভিউ
            </span>
            <span className="text-xs text-[#718279] hidden sm:inline">
              (এক্সেক্ট লাইভ সিঙ্গেল ব্লগ পেজ স্টাইলিং)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#718279] hover:text-[#0F1F17] hover:bg-[#E8EFEA] transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
          {/* Category & Date bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {post.category && (
              <span className="px-3 py-1 rounded-full font-bold bg-[#FEF3D0] text-[#B45309] border border-[#B45309]/20">
                {post.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium bg-[#F0F4F2] text-[#4A5A52]">
              <Calendar className="w-3.5 h-3.5 text-[#0B5D3B]" />
              {post.date || new Date().toISOString().split('T')[0]}
            </span>
            {post.readTime && (
              <span className="px-2.5 py-1 rounded-full bg-[#F0F4F2] text-[#4A5A52]">
                ⏱ {post.readTime}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[#52635A] ml-auto">
              <User className="w-3.5 h-3.5" />
              {post.author || 'ইউটিলিটি টিম'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F1F17] tracking-tight leading-snug">
            {post.title || 'শিরোনাম লিখুন...'}
          </h1>

          {/* Excerpt callout */}
          {post.excerpt && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#F4F8F5] border-l-4 border-[#0B5D3B] text-[#34443B] text-sm sm:text-base leading-relaxed italic">
              "{post.excerpt}"
            </div>
          )}

          {/* Related Tool Banner */}
          {post.relatedTool && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#E6F4EC] to-[#D5EBE0] border border-[#0B5D3B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#0B5D3B] uppercase tracking-wider block mb-1">
                  সম্পর্কিত অনলাইন টুল
                </span>
                <p className="text-sm font-bold text-[#0F1F17]">
                  {post.relatedToolLabel || post.relatedTool}
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B5D3B] text-white text-xs font-bold shadow-xs whitespace-nowrap">
                টুল ব্যবহার করুন <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}

          {/* Featured Image */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden border border-[#D5E4DB] shadow-xs">
              <img
                src={post.image}
                alt={post.imageAlt || post.title || 'Featured Image'}
                className="w-full max-h-[460px] object-cover"
              />
              {post.imageCaption && (
                <div className="px-4 py-2 bg-[#F8FAF9] text-xs text-[#718279] text-center border-t border-[#D5E4DB]">
                  {post.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Markdown Content rendered using shared ArticleRenderer */}
          <div className="pt-2 border-t border-[#D5E4DB]/60">
            {post.content ? (
              <ArticleRenderer content={post.content} />
            ) : (
              <div className="text-center py-12 text-[#718279] text-sm italic">
                এখানে আর্টিকেল কনটেন্ট দেখা যাবে। এডিটরে কনটেন্ট লিখুন।
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-[#D5E4DB] flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-[#718279]" />
              <span className="text-xs font-semibold text-[#52635A]">ট্যাগ:</span>
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#EAEFEA] text-[#243A2F] text-xs font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#D5E4DB] bg-[#F8FAF9] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B5D3B] text-white text-xs font-bold hover:bg-[#084A2E] transition-colors cursor-pointer"
          >
            প্রিভিউ বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
