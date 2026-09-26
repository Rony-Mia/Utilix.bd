import React, { useState, useEffect } from 'react';
import { Tags, Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { TagItem } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const TagsManagerPage: React.FC = () => {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [editModal, setEditModal] = useState<{ isOpen: boolean; tag: TagItem | null }>({
    isOpen: false,
    tag: null
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchTags = () => {
    setLoading(true);
    fetch('/api/admin/tags')
      .then(res => res.json())
      .then(data => {
        if (data && data.tags) {
          setTags(data.tags);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'ট্যাগ সফলভাবে তৈরি হয়েছে।', type: 'success' });
        setNewTagName('');
        fetchTags();
      } else {
        setMessage({ text: data.error || 'ট্যাগ তৈরি করা যায়নি।', type: 'error' });
      }
    } catch {
      setMessage({ text: 'সার্ভারে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.tag || !editModal.tag.name.trim()) return;

    try {
      const res = await fetch(`/api/admin/tags/${editModal.tag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editModal.tag.name.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'ট্যাগ সফলভাবে রিনেম করা হয়েছে এবং আর্টিকেলগুলোতে আপডেট হয়েছে।', type: 'success' });
        setEditModal({ isOpen: false, tag: null });
        fetchTags();
      } else {
        setMessage({ text: data.error || 'আপডেট ব্যর্থ হয়েছে।', type: 'error' });
      }
    } catch {
      setMessage({ text: 'আপডেট করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  const handleDeleteTag = async (tag: TagItem) => {
    if (!confirm(`আপনি কি "${tag.name}" ট্যাগটি মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch(`/api/admin/tags/${tag.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'ট্যাগ সফলভাবে ডিলিট করা হয়েছে।', type: 'success' });
        fetchTags();
      }
    } catch {
      setMessage({ text: 'ডিলিট করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  const filteredTags = tags.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
            <Tags className="w-6 h-6 text-[#0B5D3B]" />
            ট্যাগ ম্যানেজমেন্ট (Tags Management)
          </h1>
          <p className="text-xs text-[#718279] mt-1">
            ব্লগ আর্টিকেলের কি-ওয়ার্ড ট্যাগসমূহ পরিচালনা করুন।
          </p>
        </div>
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
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="ml-auto p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Add Tag & Search Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Add Tag Form */}
        <form onSubmit={handleCreateTag} className="bg-white p-4 rounded-2xl border border-[#D5E4DB] flex gap-2">
          <input
            type="text"
            required
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="নতুন ট্যাগের নাম লিখুন..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#D5E4DB] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>যোগ করুন</span>
          </button>
        </form>

        {/* Search Box */}
        <div className="bg-white p-4 rounded-2xl border border-[#D5E4DB] relative flex items-center">
          <Search className="w-4 h-4 text-[#718279] absolute left-7 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ট্যাগ সার্চ করুন..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#D5E4DB] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
          />
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-[#0F1F17] mb-4">
          বিদ্যমান ট্যাগসমূহ ({toBn(filteredTags.length)} টি)
        </h2>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#718279]">ট্যাগ লোড হচ্ছে...</div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#718279]">কোনো ট্যাগ পাওয়া যায়নি।</div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {filteredTags.map(tag => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-[#D5E4DB] bg-[#F8FAF9] hover:bg-white hover:border-[#0B5D3B]/40 transition-all text-xs"
              >
                <span className="font-bold text-[#0F1F17]">#{tag.name}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#E6F4EC] text-[#0B5D3B] text-[10px] font-bold">
                  {toBn(tag.articleCount ?? 0)}
                </span>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: true, tag: { ...tag } })}
                  className="p-1 text-[#718279] hover:text-[#0B5D3B] cursor-pointer"
                  title="রিনেম"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTag(tag)}
                  className="p-1 text-[#718279] hover:text-red-600 cursor-pointer"
                  title="ডিলিট"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Tag Modal */}
      {editModal.isOpen && editModal.tag && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#D5E4DB] shadow-2xl">
            <h3 className="font-bold text-base text-[#0F1F17] mb-3">ট্যাগ রিনেম করুন</h3>
            <form onSubmit={handleUpdateTag} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F1F17] mb-1">
                  নতুন ট্যাগের নাম
                </label>
                <input
                  type="text"
                  required
                  value={editModal.tag.name}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    tag: prev.tag ? { ...prev.tag, name: e.target.value } : null
                  }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs"
                />
                <p className="text-[10px] text-[#718279] mt-1">
                  নাম পরিবর্তন করলে এই ট্যাগযুক্ত সমস্ত আর্টিকেলে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, tag: null })}
                  className="px-4 py-2 text-xs font-semibold text-[#52635A] hover:bg-[#F0F4F2] rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0B5D3B] hover:bg-[#084A2E] rounded-xl cursor-pointer shadow-xs"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
