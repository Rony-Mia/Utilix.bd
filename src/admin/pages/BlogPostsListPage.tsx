import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  CheckCircle2,
  FileEdit,
  Clock,
  Archive,
  Star,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Sparkles,
  Home
} from 'lucide-react';
import { BlogPost, CategoryItem } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const BlogPostsListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search & Sort & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [homepageFilter, setHomepageFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Multi-select bulk state
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDangerous: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDangerous: false,
    onConfirm: () => {}
  });

  // Fetch categories for dropdown
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch posts with query params
  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams({
      q: searchQuery,
      status: statusFilter,
      category: categoryFilter,
      homepage: homepageFilter,
      featured: featuredFilter,
      sort: sortBy,
      page: String(currentPage),
      limit: '10'
    });

    fetch(`/api/admin/posts?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPosts(data.posts || []);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.total || 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, statusFilter, categoryFilter, homepageFilter, featuredFilter, sortBy, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSlugs(posts.map(p => p.slug));
    } else {
      setSelectedSlugs([]);
    }
  };

  const handleToggleSelect = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const executeBulkAction = async (action: string, categoryVal?: string) => {
    if (selectedSlugs.length === 0) return;

    if (action === 'delete') {
      setConfirmModal({
        isOpen: true,
        title: 'সিলেক্টেড আর্টিকেল ডিলিট নিশ্চিত করুন',
        message: `আপনি কি নিশ্চিত যে নির্বাচিত ${selectedSlugs.length} টি আর্টিকেল স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।`,
        isDangerous: true,
        onConfirm: async () => {
          setIsBulkLoading(true);
          await fetch('/api/admin/posts/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', slugs: selectedSlugs })
          });
          setSelectedSlugs([]);
          setIsBulkLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          fetchPosts();
        }
      });
      return;
    }

    setIsBulkLoading(true);
    try {
      await fetch('/api/admin/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          slugs: selectedSlugs,
          category: categoryVal
        })
      });
      setSelectedSlugs([]);
      fetchPosts();
    } catch {}
    setIsBulkLoading(false);
  };

  const handleDeleteSingle = (slug: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'আর্টিকেল ডিলিট করুন',
      message: `"${title}" আর্টিকেলটি স্থায়ীভাবে মুছে ফেলতে চান? এর সাথে যুক্ত লিংক ও সম্পর্কিত রেফারেন্স পরিবর্তিত হতে পারে।`,
      isDangerous: true,
      onConfirm: async () => {
        await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        fetchPosts();
      }
    });
  };

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight">
            ব্লগ পোস্ট ম্যানেজমেন্ট (Blog Posts)
          </h1>
          <p className="text-xs text-[#718279] mt-1">
            মোট {toBn(totalCount)} টি আর্টিকেল পাওয়া গেছে
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন আর্টিকেল লিখুন
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-4 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718279]" />
            <input
              type="text"
              placeholder="আর্টিকেলের শিরোনাম, স্লাগ, বা ট্যাগ দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
            >
              <option value="all">সব ক্যাটাগরি (All Categories)</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
            >
              <option value="updated">সর্বশেষ আপডেট (Recently Updated)</option>
              <option value="newest">নতুন প্রকাশিত (Newest)</option>
              <option value="oldest">পুরাতন (Oldest)</option>
              <option value="title_asc">শিরোনাম A–Z</option>
              <option value="title_desc">শিরোনাম Z–A</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D5E4DB]/60 text-xs">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[#718279] mr-1.5 font-medium">স্ট্যাটাস:</span>
            {[
              { id: 'all', label: 'সব (All)' },
              { id: 'published', label: 'প্রকাশিত' },
              { id: 'draft', label: 'ড্রাফট' },
              { id: 'scheduled', label: 'শিডিউলড' },
              { id: 'archived', label: 'আর্কাইভড' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#0B5D3B] text-white shadow-2xs'
                    : 'bg-[#F4F7F5] text-[#52635A] hover:bg-[#EAEFEA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Homepage & Featured Filter Pills */}
          <div className="flex items-center gap-2">
            <select
              value={homepageFilter}
              onChange={(e) => {
                setHomepageFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 rounded-lg border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
            >
              <option value="all">হোমপেজ: সব</option>
              <option value="homepage">হোমপেজে আছে</option>
              <option value="not_homepage">হোমপেজে নেই</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 rounded-lg border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
            >
              <option value="all">ফিচার্ড: সব</option>
              <option value="featured">শুধুমাত্র ফিচার্ড</option>
              <option value="not_featured">ফিচার্ড নয়</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedSlugs.length > 0 && (
        <div className="bg-[#0F1F17] text-white p-3.5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0B5D3B] text-white font-bold text-xs">
              {toBn(selectedSlugs.length)} টি সিলেক্টেড
            </span>
            <span className="text-xs text-white/70 hidden sm:inline">
              একসাথে পরিবর্তন করতে একশন নির্বাচন করুন:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => executeBulkAction('publish')}
              disabled={isBulkLoading}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              প্রকাশ করুন
            </button>
            <button
              onClick={() => executeBulkAction('unpublish')}
              disabled={isBulkLoading}
              className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              ড্রাফট করুন
            </button>
            <button
              onClick={() => executeBulkAction('showOnHomepage')}
              disabled={isBulkLoading}
              className="px-3 py-1.5 rounded-xl bg-[#243A2F] hover:bg-[#344D3F] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              হোমপেজে যোগ
            </button>
            <button
              onClick={() => executeBulkAction('markFeatured')}
              disabled={isBulkLoading}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Star className="w-3 h-3 fill-white" /> ফিচার্ড করুন
            </button>
            <button
              onClick={() => executeBulkAction('delete')}
              disabled={isBulkLoading}
              className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> ডিলিট
            </button>
            <button
              onClick={() => setSelectedSlugs([])}
              className="p-1.5 text-white/60 hover:text-white rounded-lg cursor-pointer"
              title="নির্বাচন বাতিল"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#52635A] font-semibold border-b border-[#D5E4DB]">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={posts.length > 0 && selectedSlugs.length === posts.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-[#0B5D3B] focus:ring-[#0B5D3B] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5">শিরোনাম ও স্লাগ (Title & Slug)</th>
                <th className="px-4 py-3.5">ক্যাটাগরি</th>
                <th className="px-4 py-3.5">স্ট্যাটাস</th>
                <th className="px-4 py-3.5">হোমপেজ / ফিচার্ড</th>
                <th className="px-4 py-3.5">সর্বশেষ আপডেট</th>
                <th className="px-6 py-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5E4DB]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#718279]">
                    আর্টিকেল লোড হচ্ছে...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#718279]">
                    কোনো আর্টিকেল পাওয়া যায়নি। ফিল্টার পরিবর্তন করুন অথবা নতুন পোস্ট লিখুন।
                  </td>
                </tr>
              ) : (
                posts.map(post => {
                  const isChecked = selectedSlugs.includes(post.slug);
                  const postStatus = post.status || (post.published === false ? 'draft' : 'published');
                  return (
                    <tr
                      key={post.slug}
                      className={`hover:bg-[#F8FAF9] transition-colors ${
                        isChecked ? 'bg-[#E6F4EC]/30' : ''
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(post.slug)}
                          className="w-4 h-4 rounded text-[#0B5D3B] focus:ring-[#0B5D3B] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 max-w-sm sm:max-w-md">
                        <Link
                          to={`/admin/posts/edit/${post.slug}`}
                          className="font-bold text-[#0F1F17] hover:text-[#0B5D3B] transition-colors block leading-snug line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-[#718279] font-mono truncate max-w-xs">
                            /blog/{post.slug}
                          </span>
                          {post.readTime && (
                            <span className="text-[10px] text-[#8A9C91]">
                              • {post.readTime}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#FEF3D0] text-[#B45309] font-medium text-[11px] whitespace-nowrap">
                          {post.category || 'অনির্ধারিত'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(postStatus)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {post.homepageFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> ফিচার্ড (#{post.homepageOrder || 1})
                          </span>
                        ) : post.showOnHomepage ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B5D3B]">
                            <Home className="w-3 h-3" /> হোমপেজ (#{post.homepageOrder || 1})
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8A9C91]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-[#52635A]">
                        {post.updatedDate || post.date}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <Link
                          to={`/admin/posts/edit/${post.slug}`}
                          className="px-3 py-1.5 rounded-xl bg-[#EAEFEA] hover:bg-[#D5E4DB] text-[#0F1F17] font-bold text-xs transition-colors inline-block"
                        >
                          এডিট
                        </Link>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#718279] hover:text-[#0B5D3B] transition-colors inline-block align-middle"
                          title="লাইভ প্রিভিউ"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingle(post.slug, post.title)}
                          className="p-1.5 text-[#718279] hover:text-red-600 transition-colors inline-block align-middle cursor-pointer"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#D5E4DB] bg-[#F8FAF9] flex items-center justify-between text-xs text-[#52635A]">
          <div>
            পৃষ্ঠা {toBn(currentPage)} / {toBn(totalPages)} (মোট {toBn(totalCount)} টি আর্টিকেল)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#D5E4DB] bg-white disabled:opacity-40 hover:bg-[#F0F4F2] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#0B5D3B] text-white shadow-2xs'
                    : 'bg-white border border-[#D5E4DB] text-[#0F1F17] hover:bg-[#F0F4F2]'
                }`}
              >
                {toBn(p)}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#D5E4DB] bg-white disabled:opacity-40 hover:bg-[#F0F4F2] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#D5E4DB] shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#0F1F17]">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-[#52635A] leading-relaxed mb-6">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-semibold text-[#52635A] hover:bg-[#F0F4F2] rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
              >
                হ্যাঁ, নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
