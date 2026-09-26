import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';
import { CategoryItem } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const CategoriesManagerPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    category: Partial<CategoryItem> | null;
  }>({ isOpen: false, category: null });

  // Delete safety modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: CategoryItem | null;
    articleCount: number;
    reassignTo: string;
  }>({
    isOpen: false,
    category: null,
    articleCount: 0,
    reassignTo: ''
  });

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.category?.name) return;

    const isEdit = Boolean(editModal.category.id);
    const url = isEdit ? `/api/admin/categories/${editModal.category.id}` : '/api/admin/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModal.category)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({
          text: isEdit ? 'ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে।' : 'নতুন ক্যাটাগরি তৈরি করা হয়েছে।',
          type: 'success'
        });
        setEditModal({ isOpen: false, category: null });
        fetchCategories();
      } else {
        setMessage({ text: data.error || 'সংরক্ষণ ব্যর্থ হয়েছে।', type: 'error' });
      }
    } catch {
      setMessage({ text: 'সার্ভারের সাথে যোগাযোগে ব্যর্থ হয়েছে।', type: 'error' });
    }
  };

  const initiateDelete = (cat: CategoryItem) => {
    const count = cat.articleCount || 0;
    const otherCategories = categories.filter(c => c.id !== cat.id);
    const defaultReassign = otherCategories.length > 0 ? otherCategories[0].name : '';

    setDeleteModal({
      isOpen: true,
      category: cat,
      articleCount: count,
      reassignTo: defaultReassign
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.category) return;
    const cat = deleteModal.category;

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reassignTo: deleteModal.reassignTo })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'ক্যাটাগরি সফলভাবে ডিলিট করা হয়েছে।', type: 'success' });
        setDeleteModal({ isOpen: false, category: null, articleCount: 0, reassignTo: '' });
        fetchCategories();
      } else {
        setMessage({ text: data.message || data.error || 'ডিলিট করা যায়নি।', type: 'error' });
      }
    } catch {
      setMessage({ text: 'ডিলিট করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#0B5D3B]" />
            ক্যাটাগরি ম্যানেজমেন্ট (Categories)
          </h1>
          <p className="text-xs text-[#718279] mt-1">
            ওয়েবসাইটের সব ব্লগ ক্যাটাগরি, স্লাগ ও এসইও মেটাডাটা নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditModal({
            isOpen: true,
            category: { name: '', slug: '', description: '', seoTitle: '', seoDescription: '' }
          })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি তৈরি</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="ml-auto p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#718279]">
            ক্যাটাগরি লোড হচ্ছে...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#718279]">
            কোনো ক্যাটাগরি পাওয়া যায়নি।
          </div>
        ) : (
          categories.map(cat => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#D5E4DB] p-5 shadow-2xs hover:border-[#0B5D3B]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D0] text-[#B45309] text-[11px] font-bold">
                    {cat.slug}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B5D3B] bg-[#E6F4EC] px-2.5 py-0.5 rounded-full">
                    <FileText className="w-3 h-3" />
                    {toBn(cat.articleCount ?? 0)} টি আর্টিকেল
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-[#0F1F17] mb-1.5">{cat.name}</h3>
                <p className="text-xs text-[#52635A] line-clamp-2 leading-relaxed mb-4">
                  {cat.description || 'কোনো বিবরণ যোগ করা হয়নি।'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D5E4DB]/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: true, category: { ...cat } })}
                  className="px-3 py-1.5 rounded-lg border border-[#D5E4DB] bg-white hover:bg-[#F8FAF9] text-xs font-semibold text-[#0F1F17] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#0B5D3B]" /> এডিট
                </button>
                <button
                  type="button"
                  onClick={() => initiateDelete(cat)}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> ডিলিট
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#D5E4DB] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5E4DB] mb-4">
              <h3 className="font-bold text-base text-[#0F1F17]">
                {editModal.category?.id ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
              </h3>
              <button
                type="button"
                onClick={() => setEditModal({ isOpen: false, category: null })}
                className="text-[#718279] hover:text-[#0F1F17] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1">
                  ক্যাটাগরির নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editModal.category?.name || ''}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    category: { ...prev.category, name: e.target.value }
                  }))}
                  placeholder="যেমন: প্রযুক্তি ও গ্যাজেট"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1">
                  স্লাগ (URL Slug)
                </label>
                <input
                  type="text"
                  value={editModal.category?.slug || ''}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    category: { ...prev.category, slug: e.target.value }
                  }))}
                  placeholder="tech-guide"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1">
                  ক্যাটাগরি বিবরণ (Description)
                </label>
                <textarea
                  rows={3}
                  value={editModal.category?.description || ''}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    category: { ...prev.category, description: e.target.value }
                  }))}
                  placeholder="ক্যাটাগরির মূল বিষয়বস্তুর বিবরণ..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1">
                  এসইও টাইটেল (SEO Title)
                </label>
                <input
                  type="text"
                  value={editModal.category?.seoTitle || ''}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    category: { ...prev.category, seoTitle: e.target.value }
                  }))}
                  placeholder="প্রযুক্তি গাইড | Utools.bd"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#D5E4DB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, category: null })}
                  className="px-4 py-2 text-xs font-semibold text-[#52635A] hover:bg-[#F0F4F2] rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0B5D3B] hover:bg-[#084A2E] rounded-xl cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Safety & Reassignment Modal */}
      {deleteModal.isOpen && deleteModal.category && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-[#0F1F17]">ক্যাটাগরি ডিলিট সুরক্ষা</h3>
            </div>

            {deleteModal.articleCount > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <strong>সতর্কতা:</strong> এই ক্যাটাগরিটি বর্তমানে <strong>{toBn(deleteModal.articleCount)} টি আর্টিকেলে</strong> ব্যবহৃত হচ্ছে।
                  আর্টিকেলগুলোকে অনাথ (Orphaned) না করে নতুন একটি ক্যাটাগরিতে রিঅ্যাসাইন (Reassign) করুন:
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F1F17] mb-1.5">
                    আর্টিকেলগুলো কোন ক্যাটাগরিতে স্থানান্তরিত করবেন?
                  </label>
                  <select
                    value={deleteModal.reassignTo}
                    onChange={(e) => setDeleteModal(prev => ({ ...prev, reassignTo: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9]"
                  >
                    {categories
                      .filter(c => c.id !== deleteModal.category?.id)
                      .map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#52635A] leading-relaxed">
                আপনি কি নিশ্চিত যে "{deleteModal.category.name}" ক্যাটাগরিটি মুছে ফেলতে চান?
              </p>
            )}

            <div className="pt-3 border-t border-[#D5E4DB] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, category: null, articleCount: 0, reassignTo: '' })}
                className="px-4 py-2 text-xs font-semibold text-[#52635A] hover:bg-[#F0F4F2] rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer shadow-xs"
              >
                ডিলিট ও রিঅ্যাসাইন করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
