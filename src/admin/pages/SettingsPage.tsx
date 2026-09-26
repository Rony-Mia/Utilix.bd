import React, { useState } from 'react';
import { Settings, RefreshCw, Download, CheckCircle2, Shield, Database, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [revalidating, setRevalidating] = useState(false);
  const [revalidateMsg, setRevalidateMsg] = useState<string | null>(null);

  const handleRevalidate = async () => {
    setRevalidating(true);
    setRevalidateMsg(null);
    try {
      const res = await fetch('/api/admin/cache/revalidate', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setRevalidateMsg('সাইটের ক্যাশ এবং কন্টেন্ট ইনডেক্স সফলভাবে রিভ্যালিডেট করা হয়েছে। পরিবর্তনগুলো লাইভ সাইটে তাৎক্ষণিক প্রতিফলিত হচ্ছে।');
      }
    } catch {}
    setRevalidating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0B5D3B]" />
          সিস্টেম সেটিংস ও ক্যাশ কন্ট্রোল (Settings & Cache)
        </h1>
        <p className="text-xs text-[#718279] mt-1">
          সার্ভার সাইড ক্যাশ রিভ্যালিডেশন, ব্যাকআপ ও প্ল্যাটফর্ম কনফিগারেশন।
        </p>
      </div>

      {revalidateMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{revalidateMsg}</span>
        </div>
      )}

      {/* Cache Revalidation Card */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D5E4DB]">
          <RefreshCw className="w-5 h-5 text-[#0B5D3B]" />
          <div>
            <h2 className="text-sm font-bold text-[#0F1F17]">অন-ডিমান্ড ক্যাশ রিভ্যালিডেশন (Cache Revalidate)</h2>
            <p className="text-[11px] text-[#718279]">
              কোনো কন্টেন্ট আপডেট করার পর সার্ভার মেমোরি বা এজ ক্যাশ রিফ্রেশ করতে এই বাটন চাপুন।
            </p>
          </div>
        </div>

        <p className="text-xs text-[#52635A] leading-relaxed">
          আর্টিকেল প্রকাশ, হোমপেজ ফিচার পরিবর্তন বা ক্যাটাগরি পরিবর্তনের পর সাধারণত অটোমেটিক ইনভ্যালিডেশন ঘটে। ম্যানুয়াল নিশ্চিতকরণের জন্য রিভ্যালিডেট করা যাবে।
        </p>

        <div>
          <button
            type="button"
            disabled={revalidating}
            onClick={handleRevalidate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${revalidating ? 'animate-spin' : ''}`} />
            <span>{revalidating ? 'রিভ্যালিডেট হচ্ছে...' : 'ক্যাশ রিভ্যালিডেট করুন'}</span>
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F1F17] pb-3 border-b border-[#D5E4DB] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#0B5D3B]" />
          সিস্টেম ও ফ্রেমওয়ার্ক তথ্য
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D5E4DB]">
            <span className="text-[#718279] block mb-1">সিএমএস আর্কিটেকচার</span>
            <span className="font-bold text-[#0F1F17]">Utools.bd Professional Headless CMS</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D5E4DB]">
            <span className="text-[#718279] block mb-1">কন্টেন্ট ডাটাবেজ ফরম্যাট</span>
            <span className="font-bold text-[#0F1F17]">JSON Filesystem Schema (Git/Deploy Safe)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D5E4DB]">
            <span className="text-[#718279] block mb-1">রেন্ডারিং ইঞ্জিন</span>
            <span className="font-bold text-[#0F1F17]">Vite + React 19 + Express Server SSR/Static</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D5E4DB]">
            <span className="text-[#718279] block mb-1">স্ট্যাটাস ও পরিবেশ</span>
            <span className="font-bold text-emerald-700">Production Ready • Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
