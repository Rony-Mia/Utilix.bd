import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  Tags,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Clock,
  History,
  Info,
  Wrench,
  Search,
  Plus,
  X,
  FileText,
  AlertTriangle,
  Star
} from 'lucide-react';
import { BlogPost, CategoryItem, TagItem, RevisionItem } from '../types.ts';
import { TOOLS } from '../../data/tools.ts';
import { LiveArticlePreviewModal } from '../components/LiveArticlePreviewModal.tsx';
import { MediaSelectorModal } from '../components/MediaSelectorModal.tsx';
import { SeoSnippetPreview } from '../components/SeoSnippetPreview.tsx';
import { useAdminAuth } from '../context/AdminAuthContext.tsx';

export const BlogPostEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();

  const isEditMode = Boolean(slug);

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    scheduledAt: '',
    author: 'ইউটিলিটি টিম',
    category: 'ডিজিタル গাইড',
    tags: [],
    excerpt: '',
    image: '',
    imageAlt: '',
    imageTitle: '',
    imageCaption: '',
    readTime: '৪ মিনিট',
    content: '',
    relatedTool: '',
    relatedToolLabel: '',
    relatedArticles: [],
    showOnHomepage: true,
    homepageFeatured: false,
    homepageOrder: 1,
    published: false,
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    robots: 'index, follow'
  });

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'publishing' | 'homepage' | 'related' | 'seo' | 'revisions'>('content');

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Initial load
  useEffect(() => {
    // Fetch categories
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});

    // Fetch all posts for Related Articles selection
    fetch('/api/admin/posts?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data && data.posts) {
          setAvailablePosts(data.posts);
        }
      })
      .catch(() => {});

    // If edit mode, fetch article by slug
    if (slug) {
      setLoading(true);
      fetch(`/api/admin/posts/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.post) {
            setFormData(data.post);
            setRevisions(data.revisions || []);
          } else {
            setMessage({ text: 'আর্টিকেল পাওয়া যায়নি।', type: 'error' });
          }
          setLoading(false);
        })
        .catch(() => {
          setMessage({ text: 'সার্ভার থেকে আর্টিকেল লোড করতে ব্যর্থ হয়েছে।', type: 'error' });
          setLoading(false);
        });
    }
  }, [slug]);

  // Auto-generate slug from title if new article and user hasn't typed custom slug
  const handleTitleChange = (newTitle: string) => {
    setFormData(prev => {
      const updated: Partial<BlogPost> = { ...prev, title: newTitle };
      if (!isEditMode && (!prev.slug || prev.slug.startsWith('post-'))) {
        const generatedSlug = newTitle
          .trim()
          .toLowerCase()
          .replace(/[^\w\u0980-\u09FF\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');
        updated.slug = generatedSlug;
      }
      if (!prev.seoTitle || prev.seoTitle === prev.title) {
        updated.seoTitle = newTitle.trim();
      }
      return updated;
    });
  };

  // Save handler (Draft or Published)
  const handleSave = async (targetStatus?: 'draft' | 'published' | 'scheduled' | 'archived') => {
    if (!formData.title || !formData.title.trim()) {
      setMessage({ text: 'আর্টিকেলের শিরোনাম (Title) দেওয়া আবশ্যক।', type: 'error' });
      setActiveTab('content');
      return;
    }

    setSaving(true);
    setMessage(null);

    const postStatus = targetStatus || formData.status || 'draft';
    const isPublished = postStatus === 'published';

    const payload = {
      ...formData,
      status: postStatus,
      published: isPublished,
      authorUser: user?.username || 'admin'
    };

    try {
      const endpoint = isEditMode ? `/api/admin/posts/${slug}` : '/api/admin/posts';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          text: isPublished
            ? 'আর্টিকেল সফলভাবে প্রকাশিত হয়েছে!'
            : 'আর্টিকেল সফলভাবে ড্রাফট হিসেবে সংরক্ষিত হয়েছে।',
          type: 'success'
        });

        // Update form state with returned post
        setFormData(data.post);

        // If newly created or slug changed, navigate to the edit URL
        if (!isEditMode || (data.post.slug && data.post.slug !== slug)) {
          navigate(`/admin/posts/edit/${data.post.slug}`, { replace: true });
        }
      } else {
        setMessage({ text: data.error || 'সংরক্ষণ ব্যর্থ হয়েছে।', type: 'error' });
      }
    } catch {
      setMessage({ text: 'সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।', type: 'error' });
    }
    setSaving(false);
  };

  // Tag helper
  const handleAddTag = () => {
    const val = newTagInput.trim();
    if (!val) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(val)) {
      setFormData(prev => ({ ...prev, tags: [...currentTags, val] }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  // Markdown quick format helper
  const insertMarkdown = (snippet: string) => {
    setFormData(prev => ({
      ...prev,
      content: (prev.content || '') + '\n' + snippet + '\n'
    }));
  };

  // Restore revision handler
  const handleRestoreRevision = async (revId: string) => {
    if (!slug) return;
    if (!confirm('আপনি কি এই পূর্ববর্তী ভার্সনটি রিস্টোর করতে চান? এটি বর্তমান কনটেন্ট প্রতিস্থাপন করবে।')) return;

    try {
      const res = await fetch(`/api/admin/revisions/${slug}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId: revId, authorUser: user?.username || 'admin' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData(data.post);
        setMessage({ text: 'পূর্ববর্তী ভার্সন সফলভাবে রিস্টোর হয়েছে।', type: 'success' });
      }
    } catch {
      setMessage({ text: 'রিস্টোর করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  // Validation Warnings Check (Non-blocking guidance)
  const validationWarnings: string[] = [];
  if (!formData.title) validationWarnings.push('আর্টিকেলের শিরোনাম ফাঁকা রয়েছে।');
  if (!formData.slug) validationWarnings.push('স্লাগ (URL Slug) দেওয়া হয়নি।');
  if (!formData.excerpt) validationWarnings.push('সংক্ষিপ্ত বিবরণ (Excerpt) ফাঁকা রয়েছে।');
  if (!formData.image) validationWarnings.push('ফিচার্ড ছবি (Featured Image) যুক্ত করা হয়নি।');
  if (!formData.seoTitle) validationWarnings.push('এসইও টাইটেল দেওয়া হয়নি।');
  if (!formData.metaDescription) validationWarnings.push('এসইও মেটা ডেসক্রিপশন ফাঁকা রয়েছে।');
  if (!formData.content || formData.content.trim().length < 50) validationWarnings.push('আর্টিকেল কনটেন্ট খুবই সংক্ষিপ্ত।');

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#718279]">
        আর্টিকেল এডিটর লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Sticky Action Header */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-4 shadow-sm sticky top-14 sm:top-16 z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="p-2 rounded-xl text-[#52635A] hover:bg-[#F0F4F2] transition-colors cursor-pointer"
            title="তালিকায় ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0F1F17] leading-tight line-clamp-1">
              {formData.title || (isEditMode ? 'আর্টিকেল এডিট' : 'নতুন আর্টিকেল তৈরি')}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-[#718279]">
              <span>স্ট্যাটাস:</span>
              <span className={`font-bold uppercase ${
                formData.status === 'published' ? 'text-emerald-700' :
                formData.status === 'scheduled' ? 'text-blue-700' : 'text-amber-700'
              }`}>
                {formData.status || 'draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D5E4DB] bg-white hover:bg-[#F8FAF9] text-xs font-bold text-[#34443B] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#0B5D3B]" />
            <span>প্রিভিউ (Preview)</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D5E4DB] bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>খসড়া সংরক্ষণ (Save Draft)</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(formData.status === 'scheduled' ? 'scheduled' : 'published')}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {saving
                ? 'সংরক্ষণ হচ্ছে...'
                : isEditMode && formData.published
                ? 'আপডেট করুন (Update)'
                : formData.status === 'scheduled'
                ? 'শিডিউল করুন (Schedule)'
                : 'প্রকাশ করুন (Publish)'}
            </span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-auto p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Validation Warnings (Non-blocking) */}
      {validationWarnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>পরামর্শ ও কনটেন্ট অপ্টিমাইজেশন অ্যালার্ট:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
            {validationWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Organized Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-2xl border border-[#D5E4DB] shadow-2xs">
        {[
          { id: 'content', label: '১. কনটেন্ট ও এডিটর' },
          { id: 'publishing', label: '২. পাবলিশিং ও শিডিউল' },
          { id: 'homepage', label: '৩. হোমপেজ সেটিংস' },
          { id: 'related', label: '৪. সম্পর্কিত টুল ও আর্টিকেল' },
          { id: 'seo', label: '৫. এসইও ও সোশ্যাল প্রিভিউ' },
          { id: 'revisions', label: '৬. রিভিশন হিস্ট্রি' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0B5D3B] text-white shadow-xs'
                : 'text-[#52635A] hover:bg-[#F0F4F2] hover:text-[#0F1F17]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                পোস্টের শিরোনাম (H1 Title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="বাংলা বা ইংরেজিতে পোস্টের আকর্ষণীয় শিরোনাম দিন..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5E4DB] text-sm font-semibold text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
              />
            </div>

            {/* Slug & URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                  স্লাগ (URL Slug) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#718279] font-mono">
                    /blog/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="bangla-date-rules"
                    className="w-full pl-16 pr-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs font-mono text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
                  />
                </div>
                {isEditMode && formData.published && (
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3 shrink-0" />
                    প্রকাশিত আর্টিকেলের স্লাগ পরিবর্তন করলে স্বয়ংক্রিয়ভাবে পুরাতন লিংকে ৩০১ রিডাইরেক্ট তৈরি হবে।
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                  ক্যাটাগরি (Category)
                </label>
                <select
                  value={formData.category || 'ডিজিটাল গাইড'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Author & Read Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                  লেখকের নাম (Author)
                </label>
                <input
                  type="text"
                  value={formData.author || 'ইউটিলিটি টিম'}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                  পড়ার আনুমানিক সময় (Read Time)
                </label>
                <input
                  type="text"
                  value={formData.readTime || '৪ মিনিট'}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
                />
              </div>
            </div>

            {/* Tags Management */}
            <div>
              <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                ট্যাগসমূহ (Tags)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-[#D5E4DB] bg-[#F8FAF9]">
                {(formData.tags || []).map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#D5E4DB] text-xs text-[#0F1F17] font-medium"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-[#718279] hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="ট্যাগ লিখে এন্টার দিন..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="px-2 py-1 text-xs bg-transparent focus:outline-none w-36"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2 py-1 bg-[#EAEFEA] hover:bg-[#D5E4DB] text-[11px] font-bold rounded-md cursor-pointer"
                  >
                    যোগ
                  </button>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0F1F17]">
                  সংক্ষিপ্ত বিবরণ (Excerpt / Summary)
                </label>
                <span className="text-[10px] text-[#718279]">
                  {(formData.excerpt || '').length} অক্ষর (প্রস্তাবিত: ১২০–১৬০)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="আর্টিকেলের সারাংশ লিখুন যা কার্ড এবং তালিকায় দেখা যাবে..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 leading-relaxed"
              />
            </div>

            {/* Featured Image Section */}
            <div className="p-4 rounded-xl border border-[#D5E4DB] bg-[#FAFCFB] space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0F1F17]">
                  ফিচার্ড ছবি (Featured Image)
                </label>
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B5D3B] text-white text-xs font-semibold hover:bg-[#084A2E] transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  মিডিয়া লাইব্রেরি থেকে বেছে নিন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-2">
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="ইমেজ URL (যেমন: /images/blog/photo.jpg)"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={formData.imageAlt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                    placeholder="ছবির অল্টারনেট টেক্সট (Image Alt Text - SEO এর জন্য)"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={formData.imageCaption || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageCaption: e.target.value }))}
                    placeholder="ছবির ক্যাপশন (ঐচ্ছিক)"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-white"
                  />
                </div>
                <div className="aspect-16/9 rounded-xl border border-[#D5E4DB] bg-[#F0F4F2] overflow-hidden flex items-center justify-center">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.imageAlt || 'Preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-[#718279]">ছবি সিলেক্ট করা নেই</span>
                  )}
                </div>
              </div>
            </div>

            {/* Markdown Content Editor */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold text-[#0F1F17]">
                  ব্লগ কনটেন্ট (Markdown Content) <span className="text-red-500">*</span>
                </label>
                {/* Formatting Quick Snippet Buttons */}
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  <span className="text-[#718279] mr-1">টুলবার:</span>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## উপশিরোনাম এখানে')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] font-semibold text-[#0B5D3B] cursor-pointer"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ছোট হেডিং')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] font-semibold text-[#0B5D3B] cursor-pointer"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**বোল্ড টেক্সট**')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] font-bold cursor-pointer"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*ইটালিক টেক্সট*')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] italic cursor-pointer"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- পয়েন্ট ১\n- পয়েন্ট ২')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] font-medium cursor-pointer"
                  >
                    লিস্ট
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('| কলাম ১ | কলাম ২ |\n|---|---|\n| ডাটা ১ | ডাটা ২ |')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] font-medium cursor-pointer"
                  >
                    টেবিল
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> গুরুত্বপূর্ণ নোট বা কোটেশন')}
                    className="px-2 py-0.5 rounded bg-[#EAEFEA] hover:bg-[#D5E4DB] font-medium cursor-pointer"
                  >
                    কোট
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[টুল ব্যবহার করুন →](https://utools.bd/converter)')}
                    className="px-2 py-0.5 rounded bg-[#0B5D3B] text-white font-semibold cursor-pointer"
                  >
                    টুল লিংক
                  </button>
                </div>
              </div>

              <textarea
                rows={16}
                required
                value={formData.content || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="এখানে সম্পূর্ণ আর্টিকেলটি মার্কডাউন (Markdown) ফরম্যাটে লিখুন..."
                className="w-full p-4 rounded-xl border border-[#D5E4DB] text-xs sm:text-sm font-mono text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISHING & SCHEDULING */}
      {activeTab === 'publishing' && (
        <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-6">
          <h2 className="text-sm font-bold text-[#0F1F17] border-b border-[#D5E4DB] pb-3">
            পাবলিশিং স্ট্যাটাস ও শিডিউলিং (Status & Schedule)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                আর্টিকেল স্ট্যাটাস (Article Status)
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => {
                  const s = e.target.value as any;
                  setFormData(prev => ({
                    ...prev,
                    status: s,
                    published: s === 'published'
                  }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E4DB] text-xs font-bold text-[#0F1F17] bg-[#F8FAF9]"
              >
                <option value="draft">DRAFT (খসড়া — সাধারণ ভিজিটর দেখতে পাবেন না)</option>
                <option value="published">PUBLISHED (প্রকাশিত — সকলের জন্য উন্মুক্ত)</option>
                <option value="scheduled">SCHEDULED (শিডিউলড — নির্ধারিত সময়ে স্বয়ংক্রিয় প্রকাশ)</option>
                <option value="archived">ARCHIVED (আর্কাইভড — সংরক্ষিত)</option>
              </select>
            </div>

            {/* Schedule Date & Time */}
            {formData.status === 'scheduled' && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <label className="block text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  প্রকাশের শিডিউল তারিখ ও সময় (Schedule Date & Time)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-blue-300 text-xs text-[#0F1F17] bg-white"
                />
                <p className="text-[11px] text-blue-800 mt-1.5">
                  নির্ধারিত সময়ের পূর্বে আর্টিকেলটি ব্লগ তালিকা, হোমপেজ বা সাইটম্যাপে দৃশ্যমান হবে না। নির্ধারিত সময়ে স্বয়ংক্রিয়ভাবে লাইভ হবে।
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
            <div>
              <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                প্রকাশের তারিখ (Published Date)
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                সর্বশেষ আপডেটের তারিখ (Updated Date)
              </label>
              <input
                type="date"
                value={formData.updatedDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, updatedDate: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOMEPAGE SETTINGS */}
      {activeTab === 'homepage' && (
        <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-6">
          <h2 className="text-sm font-bold text-[#0F1F17] border-b border-[#D5E4DB] pb-3">
            হোমপেজ প্রদর্শন সেটিংস (Homepage Visibility)
          </h2>

          <div className="space-y-4">
            {/* Show on Homepage Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#D5E4DB] bg-[#FAFCFB]">
              <div>
                <span className="text-xs font-bold text-[#0F1F17] block">
                  হোমপেজে প্রদর্শন করুন (Show on Homepage)
                </span>
                <span className="text-[11px] text-[#718279]">
                  অন থাকলে এই আর্টিকেলটি হোমপেজের 'ব্লগ ও গাইড' সেকশনে তালিকাভুক্ত হবে।
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.showOnHomepage !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, showOnHomepage: e.target.checked }))}
                className="w-5 h-5 rounded text-[#0B5D3B] focus:ring-[#0B5D3B] cursor-pointer"
              />
            </div>

            {/* Featured Article Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#D5E4DB] bg-[#FAFCFB]">
              <div>
                <span className="text-xs font-bold text-[#0F1F17] block flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  হোমপেজ মূল ফিচার্ড পোস্ট (Featured Article)
                </span>
                <span className="text-[11px] text-[#718279]">
                  অন থাকলে এটি হোমপেজের বাম পাশের বড় কার্ড হিসেবে প্রধান আকর্ষণ হিসেবে দেখানো হবে।
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(formData.homepageFeatured)}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  homepageFeatured: e.target.checked,
                  showOnHomepage: e.target.checked ? true : prev.showOnHomepage
                }))}
                className="w-5 h-5 rounded text-[#0B5D3B] focus:ring-[#0B5D3B] cursor-pointer"
              />
            </div>

            {/* Homepage Order */}
            <div className="p-4 rounded-xl border border-[#D5E4DB] bg-[#FAFCFB]">
              <label className="block text-xs font-bold text-[#0F1F17] mb-1">
                হোমপেজ ক্রম নম্বর (Homepage Order)
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={formData.homepageOrder || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, homepageOrder: parseInt(e.target.value, 10) || 1 }))}
                className="w-24 px-3 py-1.5 rounded-xl border border-[#D5E4DB] text-xs font-bold text-[#0F1F17]"
              />
              <span className="text-[11px] text-[#718279] ml-2">
                (১, ২, ৩... ক্রমানুসারে সাজানো হবে)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RELATED CONTENT */}
      {activeTab === 'related' && (
        <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-6">
          <h2 className="text-sm font-bold text-[#0F1F17] border-b border-[#D5E4DB] pb-3">
            সম্পর্কিত টুল ও আর্টিকেল (Related Content)
          </h2>

          {/* Related Tool Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
              সম্পর্কিত অনলাইন টুল নির্বাচন (Select Related Tool)
            </label>
            <p className="text-[11px] text-[#718279] mb-2">
              আর্টিকেলের ভেতরে পাঠকদের এই টুলটি ব্যবহার করার জন্য বিশেষ কল-টু-অ্যাকশন ব্যানার প্রদর্শিত হবে।
            </p>
            <select
              value={formData.relatedTool || ''}
              onChange={(e) => {
                const path = e.target.value;
                const tool = TOOLS.find(t => t.link === path);
                setFormData(prev => ({
                  ...prev,
                  relatedTool: path,
                  relatedToolLabel: tool ? tool.title : ''
                }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9]"
            >
              <option value="">কোনো সম্পর্কিত টুল নেই</option>
              {TOOLS.map(tool => (
                <option key={tool.id} value={tool.link}>
                  {tool.title} ({tool.link})
                </option>
              ))}
            </select>
            {formData.relatedTool && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#E6F4EC] border border-[#0B5D3B]/20 text-xs text-[#0B5D3B] flex items-center justify-between">
                <span>সিলেক্টেড টুল: <strong>{formData.relatedToolLabel || formData.relatedTool}</strong></span>
                <span className="font-mono text-[11px]">{formData.relatedTool}</span>
              </div>
            )}
          </div>

          {/* Related Articles Selector */}
          <div className="pt-4 border-t border-[#D5E4DB]">
            <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
              সম্পর্কিত অন্যান্য আর্টিকেল (Related Articles)
            </label>
            <p className="text-[11px] text-[#718279] mb-2">
              এই আর্টিকেলের নিচে প্রাসঙ্গিক ৩টি আর্টিকেলের কার্ড হিসেবে দেখানোর জন্য সিলেক্ট করুন:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-[#D5E4DB] rounded-xl bg-[#F8FAF9]">
              {availablePosts
                .filter(p => p.slug !== formData.slug)
                .map(post => {
                  const isSelected = (formData.relatedArticles || []).includes(post.slug);
                  return (
                    <div
                      key={post.slug}
                      onClick={() => {
                        const current = formData.relatedArticles || [];
                        const updated = isSelected
                          ? current.filter(s => s !== post.slug)
                          : [...current, post.slug];
                        setFormData(prev => ({ ...prev, relatedArticles: updated }));
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#0B5D3B] bg-[#E6F4EC] text-[#0B5D3B] font-bold'
                          : 'border-[#D5E4DB] bg-white text-[#34443B] hover:border-[#0B5D3B]/40'
                      }`}
                    >
                      <span className="truncate pr-2">{post.title}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-4 h-4 rounded text-[#0B5D3B]"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEO & PREVIEWS */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-[#0F1F17] border-b border-[#D5E4DB] pb-3">
              সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO Metadata)
            </h2>

            {/* SEO Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0F1F17]">
                  এসইও টাইটেল (SEO Title)
                </label>
                <span className={`text-[10px] font-semibold ${
                  (formData.seoTitle || '').length > 60 ? 'text-amber-600' : 'text-[#718279]'
                }`}>
                  {(formData.seoTitle || '').length} অক্ষর (প্রস্তাবিত: ৫০–৬০)
                </span>
              </div>
              <input
                type="text"
                value={formData.seoTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Google সার্চ রেজাল্টে যে শিরোনাম দেখাবে..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0F1F17]">
                  মেটা ডেসক্রিপশন (Meta Description)
                </label>
                <span className={`text-[10px] font-semibold ${
                  (formData.metaDescription || '').length > 160 ? 'text-amber-600' : 'text-[#718279]'
                }`}>
                  {(formData.metaDescription || '').length} অক্ষর (প্রস্তাবিত: ১৪০–১৬০)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="সার্চ ইঞ্জিনে আর্টিকেলের সংক্ষিপ্ত আকর্ষণীয় স্নাইপেট বিবরণ..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9] focus:bg-white"
              />
            </div>

            {/* Canonical URL & Robots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                  ক্যানোনিকাল লিংক (Canonical URL)
                </label>
                <input
                  type="text"
                  value={formData.canonicalUrl || `https://utools.bd/blog/${formData.slug || ''}`}
                  onChange={(e) => setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                  রোবটস মেটা ট্যাগ (Robots Indexing)
                </label>
                <select
                  value={formData.robots || 'index, follow'}
                  onChange={(e) => setFormData(prev => ({ ...prev, robots: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5E4DB] text-xs text-[#0F1F17] bg-[#F8FAF9]"
                >
                  <option value="index, follow">index, follow (সার্চ ইঞ্জিনে ইনডেক্স ও র‍্যাংক হবে)</option>
                  <option value="noindex, follow">noindex, follow (ইনডেক্স হবে না কিন্তু লিংক ফলো করবে)</option>
                  <option value="noindex, nofollow">noindex, nofollow (সম্পূর্ণ প্রাইভেট)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real SEO Preview Box */}
          <SeoSnippetPreview
            title={formData.seoTitle || formData.title || ''}
            slug={formData.slug || ''}
            description={formData.metaDescription || formData.excerpt || ''}
            canonicalUrl={formData.canonicalUrl}
            ogImage={formData.ogImage || formData.image}
          />
        </div>
      )}

      {/* TAB 6: REVISION HISTORY */}
      {activeTab === 'revisions' && (
        <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D5E4DB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F1F17] flex items-center gap-2">
                <History className="w-4 h-4 text-[#0B5D3B]" />
                আর্টিকেল রিভিশন হিস্ট্রি (Revision History)
              </h2>
              <p className="text-xs text-[#718279] mt-0.5">
                পূর্ববর্তী সংরক্ষিত সংস্করণগুলো দেখুন এবং নিরাপদে রিস্টোর করুন।
              </p>
            </div>
          </div>

          {revisions.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#718279]">
              কোনো পূর্ববর্তী রিভিশন লগ পাওয়া যায়নি। পরিবর্তন সেভ করার সাথে সাথে রিভিশন তৈরি হবে।
            </div>
          ) : (
            <div className="space-y-3">
              {revisions.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="p-4 rounded-xl border border-[#D5E4DB] bg-[#F8FAF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#0B5D3B]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#0F1F17]">
                        {rev.title || 'শিরোনামহীন'}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#0B5D3B] text-[10px] font-bold">
                          বর্তমান ভার্সন
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#718279] mt-1">
                      <span>সম্পাদক: {rev.author}</span>
                      <span>•</span>
                      <span>{new Date(rev.timestamp).toLocaleString('bn-BD')}</span>
                      <span>•</span>
                      <span className="capitalize font-mono">{rev.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D5E4DB] hover:bg-[#EAEFEA] text-xs font-bold text-[#0F1F17] transition-colors cursor-pointer"
                    >
                      রিস্টোর করুন (Restore)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Preview Modal (Using Shared ArticleRenderer) */}
      <LiveArticlePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={formData}
      />

      {/* Media Library Selector Modal */}
      <MediaSelectorModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(media) => {
          setFormData(prev => ({
            ...prev,
            image: media.url,
            imageAlt: media.alt,
            imageTitle: media.title,
            imageCaption: media.caption,
            ogImage: media.url
          }));
        }}
      />
    </div>
  );
};
