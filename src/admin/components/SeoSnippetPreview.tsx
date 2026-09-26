import React, { useState } from 'react';
import { Smartphone, Monitor, Globe, Share2 } from 'lucide-react';

interface SeoSnippetPreviewProps {
  title: string;
  slug: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const SeoSnippetPreview: React.FC<SeoSnippetPreviewProps> = ({
  title,
  slug,
  description,
  canonicalUrl,
  ogImage
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [previewTab, setPreviewTab] = useState<'google' | 'social'>('google');

  const displayTitle = title ? `${title} | Utools.bd` : 'পোস্টের শিরোনাম | Utools.bd';
  const displayUrl = canonicalUrl || `https://utools.bd/blog/${slug || 'example-article-slug'}`;
  const displaySnippet = description || 'এখানে মেটা ডেসক্রিপশনের বিবরণ প্রদর্শিত হবে যা সার্চ ইঞ্জিন রেজাল্ট পেজে ব্যবহারকারী দেখতে পাবেন...';

  return (
    <div className="bg-white rounded-2xl border border-[#D5E4DB] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D5E4DB] mb-4">
        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7F5] rounded-xl">
          <button
            type="button"
            onClick={() => setPreviewTab('google')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              previewTab === 'google'
                ? 'bg-white text-[#0B5D3B] shadow-xs'
                : 'text-[#52635A] hover:text-[#0F1F17]'
            }`}
          >
            Google সার্চ প্রিভিউ
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('social')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              previewTab === 'social'
                ? 'bg-white text-[#0B5D3B] shadow-xs'
                : 'text-[#52635A] hover:text-[#0F1F17]'
            }`}
          >
            সোশ্যাল / OG প্রিভিউ
          </button>
        </div>

        {/* Device toggle for Google preview */}
        {previewTab === 'google' && (
          <div className="flex items-center gap-1 text-xs text-[#718279]">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'desktop' ? 'bg-[#E6F4EC] text-[#0B5D3B]' : 'hover:bg-[#F0F4F2]'
              }`}
              title="ডেস্কটপ ভিউ"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'mobile' ? 'bg-[#E6F4EC] text-[#0B5D3B]' : 'hover:bg-[#F0F4F2]'
              }`}
              title="মোবাইল ভিউ"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {previewTab === 'google' ? (
        <div
          className={`p-4 rounded-xl border border-[#E5E9E7] bg-[#FAFCFB] font-sans ${
            device === 'mobile' ? 'max-w-md mx-auto shadow-sm' : ''
          }`}
        >
          {/* Breadcrumb / URL */}
          <div className="flex items-center gap-2 mb-1 text-xs">
            <div className="w-5 h-5 rounded-full bg-[#E6F4EC] flex items-center justify-center text-[#0B5D3B] text-[10px] font-bold">
              U
            </div>
            <div className="truncate">
              <span className="font-medium text-[#202124]">Utools.bd</span>
              <span className="text-[#5f6368] mx-1">›</span>
              <span className="text-[#5f6368] truncate">{displayUrl}</span>
            </div>
          </div>

          {/* Clickable blue title */}
          <h3 className="text-[#1a0dab] hover:underline cursor-pointer text-base sm:text-lg font-medium leading-snug tracking-normal mb-1">
            {displayTitle}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
            {displaySnippet}
          </p>
        </div>
      ) : (
        /* Social / Facebook Card preview */
        <div className="max-w-lg mx-auto rounded-xl border border-[#D5E4DB] overflow-hidden shadow-xs bg-white">
          {ogImage ? (
            <div className="aspect-1.91/1 bg-[#F0F4F2] overflow-hidden">
              <img
                src={ogImage}
                alt="OG Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-1.91/1 bg-[#F0F4F2] flex items-center justify-center text-xs text-[#718279]">
              কোনো ফিচার্ড বা ওজি ইমেজ সিলেক্ট করা হয়নি
            </div>
          )}
          <div className="p-3.5 bg-[#F8FAF9] border-t border-[#D5E4DB]">
            <p className="text-[10px] uppercase font-bold text-[#718279] tracking-wider mb-0.5">
              utools.bd
            </p>
            <h4 className="text-sm font-bold text-[#0F1F17] leading-snug line-clamp-1 mb-1">
              {displayTitle}
            </h4>
            <p className="text-xs text-[#52635A] line-clamp-2 leading-relaxed">
              {displaySnippet}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
