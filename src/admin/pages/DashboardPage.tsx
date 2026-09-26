import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Clock,
  Archive,
  FolderTree,
  Tags,
  Image as ImageIcon,
  Plus,
  Home,
  Globe,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Star,
  Eye,
  AlertCircle
} from 'lucide-react';
import { DashboardStats } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats(data.statistics);
          setRecentArticles(data.recentArticles || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EC] text-[#0B5D3B] border border-[#0B5D3B]/20">
            <CheckCircle2 className="w-3 h-3" /> প্রকাশিত
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> শিডিউলড
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <Archive className="w-3 h-3" /> আর্কাইভড
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <FileEdit className="w-3 h-3" /> ড্রাফট
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B5D3B] to-[#084A2E] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E6F4EC]" />
            Utools.bd কন্টেন্ট ড্যাশবোর্ড
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            স্বাগতম, অ্যাডমিন প্যানেলে
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-2 leading-relaxed">
            ব্লগ আর্টিকেল তৈরি, সম্পাদনা, শিডিউলিং, ক্যাটাগরি, হোমপেজ ডিসপ্লে ও এসইও মেটাডাটা এক জায়গা থেকেই সহজেই ম্যানেজ করুন।
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0B5D3B] text-xs font-bold hover:bg-[#F4F8F5] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              নতুন ব্লগ পোস্ট তৈরি করুন
            </Link>
            <Link
              to="/admin/homepage"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs transition-colors border border-white/20"
            >
              <Home className="w-4 h-4" />
              হোমপেজ ব্লগ কন্ট্রোল
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#0F1F17]">কনটেন্ট পরিসংখ্যান (Content Statistics)</h2>
          <span className="text-xs text-[#718279]">রিয়েল-টাইম ডাটাবেজ তথ্য</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Total Articles */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">মোট আর্টিকেল</span>
              <FileText className="w-4 h-4 text-[#0B5D3B]" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#0F1F17]">
              {loading ? '...' : toBn(stats?.totalArticles ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">ব্লগ ও গাইড সমগ্র</span>
          </div>

          {/* Published */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">প্রকাশিত (Published)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {loading ? '...' : toBn(stats?.published ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">লাইভ সাইটে দৃশ্যমান</span>
          </div>

          {/* Drafts */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">ড্রাফট (Drafts)</span>
              <FileEdit className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {loading ? '...' : toBn(stats?.drafts ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">অপ্রকাশিত খসড়া</span>
          </div>

          {/* Scheduled */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">শিডিউলড (Scheduled)</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">
              {loading ? '...' : toBn(stats?.scheduled ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">নির্ধারিত সময়ে প্রকাশ</span>
          </div>

          {/* Archived */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">আর্কাইভড</span>
              <Archive className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-700">
              {loading ? '...' : toBn(stats?.archived ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">সংরক্ষিত পোস্ট</span>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">ক্যাটাগরি</span>
              <FolderTree className="w-4 h-4 text-[#0B5D3B]" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#0F1F17]">
              {loading ? '...' : toBn(stats?.categories ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">কনটেন্ট গ্রুপ</span>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">ট্যাগসমূহ</span>
              <Tags className="w-4 h-4 text-[#0B5D3B]" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#0F1F17]">
              {loading ? '...' : toBn(stats?.tags ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">কি-ওয়ার্ড ট্যাগ</span>
          </div>

          {/* Media Files */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5E4DB] shadow-2xs">
            <div className="flex items-center justify-between text-[#718279] mb-2">
              <span className="text-xs font-semibold">মিডিয়া ফাইল</span>
              <ImageIcon className="w-4 h-4 text-[#0B5D3B]" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#0F1F17]">
              {loading ? '...' : toBn(stats?.mediaFiles ?? 0)}
            </p>
            <span className="text-[11px] text-[#8A9C91] mt-1 block">ছবি ও সম্পদ</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs">
        <h2 className="text-base font-bold text-[#0F1F17] mb-4">কুইক একশন (Quick Actions)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/posts/new"
            className="p-3.5 rounded-xl border border-[#D5E4DB] hover:border-[#0B5D3B] hover:bg-[#F8FAF9] flex flex-col items-center text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#0F1F17]">নতুন পোস্ট</span>
            <span className="text-[10px] text-[#718279]">ব্লগ আর্টিকেল লিখুন</span>
          </Link>

          <Link
            to="/admin/media"
            className="p-3.5 rounded-xl border border-[#D5E4DB] hover:border-[#0B5D3B] hover:bg-[#F8FAF9] flex flex-col items-center text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#0F1F17]">মিডিয়া লাইব্রেরি</span>
            <span className="text-[10px] text-[#718279]">ছবি আপলোড ও ম্যানেজ</span>
          </Link>

          <Link
            to="/admin/categories"
            className="p-3.5 rounded-xl border border-[#D5E4DB] hover:border-[#0B5D3B] hover:bg-[#F8FAF9] flex flex-col items-center text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FolderTree className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#0F1F17]">ক্যাটাগরি</span>
            <span className="text-[10px] text-[#718279]">বিভাগ সাজান</span>
          </Link>

          <Link
            to="/admin/tags"
            className="p-3.5 rounded-xl border border-[#D5E4DB] hover:border-[#0B5D3B] hover:bg-[#F8FAF9] flex flex-col items-center text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Tags className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#0F1F17]">ট্যাগসমূহ</span>
            <span className="text-[10px] text-[#718279]">কি-ওয়ার্ড ম্যানেজমেন্ট</span>
          </Link>

          <Link
            to="/admin/homepage"
            className="p-3.5 rounded-xl border border-[#D5E4DB] hover:border-[#0B5D3B] hover:bg-[#F8FAF9] flex flex-col items-center text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#0F1F17]">হোমপেজ ব্লগ</span>
            <span className="text-[10px] text-[#718279]">ফিচার্ড ও ক্রম নির্ধারণ</span>
          </Link>

          <Link
            to="/admin/seo"
            className="p-3.5 rounded-xl border border-[#D5E4DB] hover:border-[#0B5D3B] hover:bg-[#F8FAF9] flex flex-col items-center text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#0F1F17]">এসইও সেটিংস</span>
            <span className="text-[10px] text-[#718279]">রিডাইরেক্ট ও সাইটম্যাপ</span>
          </Link>
        </div>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-[#D5E4DB] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F1F17]">সাম্প্রতিক আর্টিকেল (Recent Articles)</h2>
            <p className="text-xs text-[#718279] mt-0.5">সর্বশেষ আপডেট হওয়া ৫টি ব্লগ পোস্ট</p>
          </div>
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3B] hover:text-[#084A2E] transition-colors"
          >
            সব দেখুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#52635A] font-semibold border-b border-[#D5E4DB]">
              <tr>
                <th className="px-6 py-3.5">শিরোনাম (Title)</th>
                <th className="px-4 py-3.5">ক্যাটাগরি</th>
                <th className="px-4 py-3.5">স্ট্যাটাস</th>
                <th className="px-4 py-3.5">হোমপেজ / ফিচার্ড</th>
                <th className="px-4 py-3.5">তারিখ</th>
                <th className="px-6 py-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5E4DB]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#718279]">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#718279]">
                    কোনো আর্টিকেল পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                recentArticles.map(article => (
                  <tr key={article.slug} className="hover:bg-[#F8FAF9] transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0F1F17] max-w-xs sm:max-w-sm truncate">
                      <Link
                        to={`/admin/posts/edit/${article.slug}`}
                        className="hover:text-[#0B5D3B] transition-colors block truncate"
                      >
                        {article.title}
                      </Link>
                      <span className="text-[10px] text-[#718279] font-mono block">
                        /blog/{article.slug}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FEF3D0] text-[#B45309] font-medium text-[11px]">
                        {article.category || 'অনির্ধারিত'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {article.homepageFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> ফিচার্ড
                          </span>
                        ) : article.showOnHomepage ? (
                          <span className="text-[11px] font-semibold text-[#0B5D3B]">
                            ✓ হোমপেজ
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8A9C91]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#52635A]">
                      {article.updatedDate || article.date}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/posts/edit/${article.slug}`}
                        className="px-2.5 py-1 rounded-lg bg-[#EAEFEA] hover:bg-[#D5E4DB] text-[#0F1F17] font-semibold text-[11px] transition-colors inline-block"
                      >
                        এডিট
                      </Link>
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#718279] hover:text-[#0B5D3B] transition-colors inline-block align-middle"
                        title="লাইভ দেখুন"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
