import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { RedirectItem } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const SeoRedirectsPage: React.FC = () => {
  const [redirects, setRedirects] = useState<RedirectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New redirect form
  const [oldUrl, setOldUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [redirType, setRedirType] = useState('301');

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchRedirects = () => {
    setLoading(true);
    fetch('/api/admin/redirects')
      .then(res => res.json())
      .then(data => {
        if (data && data.redirects) {
          setRedirects(data.redirects);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldUrl.trim() || !newUrl.trim()) return;

    setMessage(null);
    try {
      const res = await fetch('/api/admin/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldUrl: oldUrl.trim(),
          newUrl: newUrl.trim(),
          type: Number(redirType)
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'রিডাইরেক্ট সফলভাবে যোগ করা হয়েছে!', type: 'success' });
        setOldUrl('');
        setNewUrl('');
        fetchRedirects();
      } else {
        setMessage({ text: data.error || 'রিডাইরেক্ট যোগ করা সম্ভব হয়নি।', type: 'error' });
      }
    } catch {
      setMessage({ text: 'সার্ভারে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!confirm('আপনি কি এই রিডাইরেক্ট রুলটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/admin/redirects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'রিডাইরেক্ট রুল ডিলিট করা হয়েছে।', type: 'success' });
        fetchRedirects();
      }
    } catch {
      setMessage({ text: 'ডিলিট করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-[#0B5D3B]" />
          এসইও ও লিংক রিডাইরেক্ট ম্যানেজমেন্ট (SEO & Redirects)
        </h1>
        <p className="text-xs text-[#718279] mt-1">
          ইউআরএল বা স্লাগ পরিবর্তন হলে ব্রোকেন লিংক বা 404 রোধ করতে স্থায়ী ৩০১/৩০২ রিডাইরেক্ট পরিচালনা করুন।
        </p>
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

      {/* Add Redirect Form */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-[#0F1F17] mb-3">
          নতুন রিডাইরেক্ট রুল যোগ করুন
        </h2>
        <form onSubmit={handleCreateRedirect} className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
              পুরাতন লিংক (Old URL)
            </label>
            <input
              type="text"
              required
              value={oldUrl}
              onChange={(e) => setOldUrl(e.target.value)}
              placeholder="/blog/old-slug"
              className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
              নতুন লিংক (New URL)
            </label>
            <input
              type="text"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="/blog/new-slug"
              className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-1 flex flex-col justify-end">
            <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
              টাইপ
            </label>
            <select
              value={redirType}
              onChange={(e) => setRedirType(e.target.value)}
              className="px-2 py-2 rounded-xl border border-[#D5E4DB] text-xs font-mono"
            >
              <option value="301">301 (স্থায়ী)</option>
              <option value="302">302 (অস্থায়ী)</option>
            </select>
          </div>

          <div className="sm:col-span-7 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>রিডাইরেক্ট রুল তৈরি করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Redirects Table */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#D5E4DB] bg-[#F8FAF9] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#52635A]">
            সক্রিয় রিডাইরেক্ট রুলসমূহ ({toBn(redirects.length)} টি)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#52635A] font-semibold border-b border-[#D5E4DB]">
              <tr>
                <th className="px-6 py-3.5">পুরাতন পাথ (Old Path)</th>
                <th className="px-4 py-3.5"></th>
                <th className="px-6 py-3.5">নতুন গন্তব্য (Destination Path)</th>
                <th className="px-4 py-3.5">স্ট্যাটাস কোড</th>
                <th className="px-4 py-3.5">তৈরির তারিখ</th>
                <th className="px-6 py-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5E4DB]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#718279]">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : redirects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#718279]">
                    কোনো রিডাইরেক্ট রুল তৈরি করা হয়নি।
                  </td>
                </tr>
              ) : (
                redirects.map(redir => (
                  <tr key={redir.id} className="hover:bg-[#F8FAF9] transition-colors">
                    <td className="px-6 py-4 font-mono text-[#0F1F17]">
                      {redir.oldUrl}
                    </td>
                    <td className="px-4 py-4 text-[#718279]">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </td>
                    <td className="px-6 py-4 font-mono text-[#0B5D3B] font-semibold">
                      {redir.newUrl}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#E6F4EC] text-[#0B5D3B] font-mono text-[11px] font-bold">
                        {redir.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#52635A]">
                      {redir.createdAt ? new Date(redir.createdAt).toLocaleDateString('bn-BD') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRedirect(redir.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
