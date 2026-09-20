import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { SITE_UPDATES } from '../data/updates.ts';

export const ChangelogPage: React.FC = () => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'হোম',
        item: 'https://utilix.bd/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'আপডেট ও রিলিজ লগ',
        item: 'https://utilix.bd/changelog'
      }
    ]
  };

  const changelogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'আপডেট ও রিলিজ লগ — Utilix.bd',
    description:
      'Utilix.bd-এর প্রতিটি নতুন রিলিজ, টুল সংযোজন ও সিস্টেম উন্নয়নের ধারাবাহিক ইতিহাস।',
    url: 'https://utilix.bd/changelog'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      <Helmet>
        <title>আপডেট ও রিলিজ লগ (Changelog) — Utilix.bd</title>
        <meta
          name="description"
          content="ইউটিলিক্স প্ল্যাটফর্মের প্রতিটি নতুন রিলিজ, টুল সংযোজন ও সিস্টেম উন্নয়নের ধারাবাহিক ইতিহাস। জানুন নতুন কী এলো।"
        />
        <link rel="canonical" href="https://utilix.bd/changelog" />
        <meta property="og:title" content="আপডেট ও রিলিজ লগ (Changelog) — Utilix.bd" />
        <meta
          property="og:description"
          content="ইউটিলিক্স প্ল্যাটফর্মের প্রতিটি নতুন রিলিজ, টুল সংযোজন ও সিস্টেম উন্নয়নের ধারাবাহিক ইতিহাস।"
        />
        <meta property="og:url" content="https://utilix.bd/changelog" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(changelogSchema)}</script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#6b6255] font-sans">
        <Link to="/" className="hover:text-[#083f2a] transition-colors">
          হোম
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[#d8cfb8]" />
        <span className="text-[#083f2a] font-medium">আপডেট ও রিলিজ লগ</span>
      </nav>

      {/* Page Header */}
      <header className="border-b border-[#d8cfb8] pb-6 space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#fffdf7] border border-[#d8cfb8] text-xs font-semibold text-[#0c5c3d]">
          <Calendar className="w-3.5 h-3.5 text-[#0c5c3d]" />
          <span>রিলিজ ও ভার্সন হিস্ট্রি</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#083f2a] font-serif tracking-tight">
          সাম্প্রতিক আপডেট ও রিলিজ লগ
        </h1>

        <p className="text-sm sm:text-base text-[#6b6255] max-w-3xl leading-relaxed">
          Utilix.bd-কে আরও দ্রুত, সমৃদ্ধ ও ব্যবহারবান্ধব করে তুলতে আমরা নিয়মিত নতুন টুলস সংযোজন এবং বিদ্যমান ইউটিলিটির পারফরম্যান্স উন্নত করছি। এখানে আমাদের প্রতিটি প্রধান ভার্সনের পরিবর্তনের বিবরণ দেওয়া হলো।
        </p>
      </header>

      {/* Timeline / Updates List */}
      <div className="space-y-6">
        {SITE_UPDATES.map((update, index) => (
          <article
            key={update.id}
            className="bg-[#fffdf7] border border-[#d8cfb8] p-6 transition-all hover:border-[#0c5c3d]/60 relative"
          >
            {/* Top metadata bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#efe8d6]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#6b6255] font-medium bg-[#f4efe4] px-2.5 py-1 border border-[#d8cfb8]">
                  {update.date}
                </span>
                <span className="font-mono text-xs font-bold text-[#083f2a] bg-[#fffdf7] px-2 py-0.5 border border-[#d8cfb8]">
                  {update.version}
                </span>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-0.5 ${
                  update.badgeType === 'new'
                    ? 'bg-[#0c5c3d] text-[#fffdf7]'
                    : update.badgeType === 'update'
                    ? 'bg-[#083f2a] text-[#fffdf7]'
                    : 'bg-[#f4efe4] border border-[#d8cfb8] text-[#083f2a]'
                }`}
              >
                {update.badge}
              </span>
            </div>

            {/* Content body */}
            <div className="pt-4 space-y-2">
              <h2 className="text-lg font-bold text-[#083f2a] font-serif">
                {update.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#4a4237] leading-relaxed">
                {update.description}
              </p>
            </div>

            {/* Footer action button */}
            {update.toolLink && (
              <div className="pt-4 mt-4 border-t border-[#efe8d6] flex items-center justify-between">
                <Link
                  to={update.toolLink}
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#0c5c3d] hover:text-[#083f2a] group"
                >
                  <span>{update.toolName || 'টুল চালু করে দেখুন'}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-[11px] text-[#6b6255] font-mono">
                  # {SITE_UPDATES.length - index}
                </span>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Security & Client-Side Guarantee Callout */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 border border-[#d8cfb8] bg-[#f4efe4] flex items-center justify-center text-[#0c5c3d] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#083f2a] font-serif">
              ১০০% ক্লায়েন্ট-সাইড প্রযুক্তি নীতি
            </h3>
            <p className="text-xs text-[#6b6255] max-w-2xl leading-relaxed">
              নতুন ফিচার বা আপডেটের ক্ষেত্রেও আমাদের মূল প্রতিশ্রুতি অপরিবর্তিত: আপনার কোনো টেক্সট, ছবি বা ফাইল কখনোই আমাদের কোনো রিমোট সার্ভারে সংরক্ষিত হয় না।
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="shrink-0 px-4 py-2 bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          হোমে ফিরে যান
        </Link>
      </section>
    </div>
  );
};
