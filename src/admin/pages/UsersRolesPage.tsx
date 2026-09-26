import React from 'react';
import { Users, ShieldCheck, UserCheck, Key, Lock, Check } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.tsx';

export const UsersRolesPage: React.FC = () => {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-[#0B5D3B]" />
          ইউজার রোল ও অ্যাক্সেস পারমিশন (Users & Roles)
        </h1>
        <p className="text-xs text-[#718279] mt-1">
          অ্যাডমিন এবং এডিটর রোল অনুযায়ী অ্যাক্সেস কন্ট্রোল ও নিরাপত্তা পলিসি।
        </p>
      </div>

      {/* Current Logged In Profile */}
      <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center font-extrabold text-lg shadow-xs">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F1F17]">{user?.name}</h2>
            <div className="flex items-center gap-2 text-xs text-[#718279]">
              <span>ইউজারনেম: <code className="font-mono text-[#0B5D3B]">{user?.username}</code></span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#0B5D3B] font-bold text-[10px] uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Card */}
        <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#D5E4DB]">
            <ShieldCheck className="w-5 h-5 text-[#0B5D3B]" />
            <div>
              <h3 className="font-extrabold text-base text-[#0F1F17]">ADMIN (অ্যাডমিনিস্ট্রেটর)</h3>
              <span className="text-[11px] text-[#718279]">সম্পূর্ণ সিস্টেম অ্যাক্সেস</span>
            </div>
          </div>

          <p className="text-xs text-[#52635A] leading-relaxed">
            অ্যাডমিন অ্যাকাউন্টের মাধ্যমে সাইটের প্রতিটি কনফিগারেশন ও ডাটা পরিবর্তন সম্ভব।
          </p>

          <ul className="space-y-2 text-xs text-[#34443B]">
            {[
              'ব্লগ পোস্ট তৈরি, এডিট, শিডিউলিং ও স্থায়ী ডিলিট',
              'হোমপেজ ফিচার্ড পোস্ট ও ড্রাগ/ড্রপ ক্রম নির্ধারণ',
              'ক্যাটাগরি তৈরি, এডিট ও নিরাপদ রিঅ্যাসাইনমেন্ট',
              'ট্যাগ তৈরি, রিনেম ও ডিলিট',
              'মিডিয়া লাইব্রেরিতে ছবি আপলোড ও মুছে ফেলা',
              'ইউআরএল পরিবর্তন ও ৩০১ রিডাইরেক্ট রুল ম্যানেজমেন্ট',
              'সাইট ক্যাশ ক্লিয়ার ও রিভ্যালিডেশন'
            ].map((perm, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0B5D3B] shrink-0" />
                <span>{perm}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#D5E4DB]">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-base text-[#0F1F17]">EDITOR (কনটেন্ট এডিটর)</h3>
              <span className="text-[11px] text-[#718279]">কনটেন্ট এডিটিং অ্যাক্সেস</span>
            </div>
          </div>

          <p className="text-xs text-[#52635A] leading-relaxed">
            এডিটর কন্টেন্ট তৈরি ও সম্পাদনা করতে পারেন, তবে সিস্টেম সেটিংস সুরক্ষিত থাকে।
          </p>

          <ul className="space-y-2 text-xs text-[#34443B]">
            {[
              'নতুন আর্টিকেল তৈরি ও খসড়া (Draft) সংরক্ষণ',
              'বিদ্যমান আর্টিকেল সম্পাদনা ও প্রিভিউ দেখা',
              'আর্টিকেল প্রকাশ ও শিডিউলিং',
              'মিডিয়া লাইব্রেরি থেকে ছবি যুক্ত করা',
              'সম্পর্কিত টুল ও আর্টিকেলের লিংক যুক্ত করা'
            ].map((perm, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{perm}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
