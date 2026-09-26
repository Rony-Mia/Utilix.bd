import React, { useState, useEffect } from 'react';
import {
  Home,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { BlogPost } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const HomepageBlogManagerPage: React.FC = () => {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [allAvailablePosts, setAllAvailablePosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchHomepageData = () => {
    setLoading(true);
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFeaturedPost(data.featuredPost || null);
          setLatestPosts(data.latestPosts || []);
          setAllAvailablePosts(data.allAvailablePosts || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const handleSaveHomepage = async () => {
    setSaving(true);
    setMessage(null);

    const items = [
      ...(featuredPost
        ? [{ slug: featuredPost.slug, homepageOrder: 1, showOnHomepage: true, homepageFeatured: true }]
        : []),
      ...latestPosts.map((p, idx) => ({
        slug: p.slug,
        homepageOrder: idx + 2,
        showOnHomepage: true,
        homepageFeatured: false
      }))
    ];

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featuredSlug: featuredPost?.slug,
          items
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('হোমপেজ ব্লগ কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
        fetchHomepageData();
      }
    } catch {}
    setSaving(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...latestPosts];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setLatestPosts(newArr);
  };

  const moveDown = (index: number) => {
    if (index === latestPosts.length - 1) return;
    const newArr = [...latestPosts];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setLatestPosts(newArr);
  };

  const handleRemoveFromHomepage = (slug: string) => {
    setLatestPosts(prev => prev.filter(p => p.slug !== slug));
  };

  const handleAddPostToHomepage = (slug: string) => {
    if (!slug) return;
    const postToAdd = allAvailablePosts.find(p => p.slug === slug);
    if (!postToAdd) return;
    if (latestPosts.some(p => p.slug === slug) || featuredPost?.slug === slug) return;
    setLatestPosts(prev => [...prev, postToAdd]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
            <Home className="w-6 h-6 text-[#0B5D3B]" />
            হোমপেজ ব্লগ সেকশন কন্ট্রোল
          </h1>
          <p className="text-xs text-[#718279] mt-1">
            হোমপেজে কোন আর্টিকেলটি বড় ফিচার্ড কার্ড হিসেবে থাকবে এবং কোনগুলো তালিকায় কোন ক্রমে থাকবে তা নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSaveHomepage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-xs text-[#718279]">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: Featured Article Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5E4DB]">
              <h2 className="text-sm font-bold text-[#0F1F17] flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                মূল ফিচার্ড আর্টিকেল (Featured)
              </h2>
            </div>

            {featuredPost ? (
              <div className="rounded-xl border border-[#D5E4DB] overflow-hidden bg-[#F8FAF9] shadow-xs">
                {featuredPost.image && (
                  <div className="aspect-16/9 bg-[#E6F4EC] overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#FEF3D0] text-[#B45309] text-[10px] font-bold">
                    {featuredPost.category || 'ফিচার্ড'}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#0F1F17] leading-snug line-clamp-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-[11px] text-[#52635A] line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#718279] italic">
                কোনো ফিচার্ড পোস্ট নির্বাচিত নেই।
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                ফিচার্ড পোস্ট পরিবর্তন করুন:
              </label>
              <select
                value={featuredPost?.slug || ''}
                onChange={(e) => {
                  const slug = e.target.value;
                  const selected = allAvailablePosts.find(p => p.slug === slug);
                  if (selected) {
                    // Remove from latest posts if present
                    setLatestPosts(prev => prev.filter(p => p.slug !== slug));
                    setFeaturedPost(selected);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
              >
                <option value="">নির্বাচন করুন...</option>
                {allAvailablePosts.map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Latest Articles on Homepage (Reorder & Remove) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D5E4DB]">
              <div>
                <h2 className="text-sm font-bold text-[#0F1F17]">
                  হোমপেজ সাম্প্রতিক আর্টিকেল তালিকা (Latest Articles)
                </h2>
                <p className="text-[11px] text-[#718279]">
                  হোমপেজের ডান পাশের তালিকায় ৩–৬টি আর্টিকেল ক্রমানুসারে সাজান।
                </p>
              </div>

              {/* Add post dropdown */}
              <div className="flex items-center gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    handleAddPostToHomepage(e.target.value);
                    e.target.value = '';
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
                >
                  <option value="" disabled>+ হোমপেজে আর্টিকেল যোগ করুন</option>
                  {allAvailablePosts
                    .filter(p => p.slug !== featuredPost?.slug && !latestPosts.some(lp => lp.slug === p.slug))
                    .map(p => (
                      <option key={p.slug} value={p.slug}>
                        {p.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {latestPosts.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#718279]">
                হোমপেজ তালিকায় কোনো আর্টিকেল যোগ করা হয়নি। উপরের ড্রপডাউন থেকে আর্টিকেল যোগ করুন।
              </div>
            ) : (
              <div className="space-y-2.5">
                {latestPosts.map((post, index) => (
                  <div
                    key={post.slug}
                    className="p-3.5 rounded-xl border border-[#D5E4DB] bg-[#F8FAF9] flex items-center justify-between gap-3 hover:border-[#0B5D3B]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#E6F4EC] text-[#0B5D3B] font-bold text-xs flex items-center justify-center shrink-0">
                        {toBn(index + 1)}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#0F1F17] block truncate">
                          {post.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-[#718279]">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-[#D5E4DB] bg-white hover:bg-[#EAEFEA] disabled:opacity-30 cursor-pointer"
                        title="উপরে নিন"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === latestPosts.length - 1}
                        className="p-1.5 rounded-lg border border-[#D5E4DB] bg-white hover:bg-[#EAEFEA] disabled:opacity-30 cursor-pointer"
                        title="নিচে নামান"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromHomepage(post.slug)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                        title="হোমপেজ থেকে বাদ দিন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
