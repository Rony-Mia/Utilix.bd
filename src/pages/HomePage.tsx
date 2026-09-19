import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ArrowLeftRight,
  Calculator,
  Crop,
  CheckCircle2,
  Lock,
  Zap,
  Image as ImageIcon,
  FileText,
  Shield,
  Clock,
  Coins,
  GraduationCap,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Calendar,
  Layers,
  Scissors,
  Trash2,
  RotateCw
} from 'lucide-react';
import { TOOLS } from '../data/tools.ts';
import { SITE_UPDATES } from '../data/updates.ts';

interface HomePageProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenTerms: () => void;
}

const FAQS = [
  {
    question: 'Utilix.bd কি সম্পূর্ণ ফ্রি ব্যবহার করা যায়?',
    answer:
      'হ্যাঁ, Utilix.bd-এর প্রতিটি টুল ১০০% বিনামূল্যে ব্যবহারযোগ্য। কোনো গোপন চার্জ, সাবস্ক্রিপশন ফি বা সাইন-আপ করার প্রয়োজন নেই। শিক্ষার্থী, চাকরিপ্রার্থী ও পেশাজীবী যে কেউ যেকোনো সময় এটি অবাধে ব্যবহার করতে পারেন।'
  },
  {
    question: 'আমার ডেটা, ছবি বা ব্যক্তিগত তথ্য কি কোথাও সংরক্ষিত হয়?',
    answer:
      'না, একেবারেই নয়। Utilix.bd-এর সমস্ত টুল ক্লায়েন্ট-সাইড প্রযুক্তিতে নির্মিত। আপনার টাইপ করা লেখা, হিসাব বা আপলোড করা ছবি সরাসরি আপনার ব্রাউজারের মেমোরিতে (RAM) প্রসেস হয় এবং কোনো সার্ভারে স্থানান্তরিত বা সংরক্ষিত হয় না।'
  },
  {
    question: 'Utilix.bd-তে বর্তমানে কী কী টুল পাওয়া যায়?',
    answer:
      'বর্তমানে আমাদের প্ল্যাটফর্মে ১০টি সক্রিয় ডিজিটাল ইউটিলিটি রয়েছে: বিজয় ↔ ইউনিকোড কনভার্টার, সরকারি ছবি ও স্বাক্ষর রিসাইজার, চাকরির বয়স ক্যালকুলেটর, টাকা কথায় রূপান্তরক, জিপিএ/সিজিপিএ ক্যালকুলেটর, সিভি মেকার এবং ৪টি শক্তিশালী পিডিএফ ইউটিলিটি (পিডিএফ মার্জার, পিডিএফ স্প্লিটার, পিডিএফ পেজ ডিলিট ও পিডিএফ রোটেট)।'
  },
  {
    question: 'ইন্টারনেট সংযোগ ছাড়া অফলাইনে কি এই টুলগুলো কাজ করে?',
    answer:
      'হ্যাঁ, ওয়েবসাইটটি একবার আপনার ব্রাউজারে লোড হয়ে গেলে ইন্টারনেট সংযোগ বিচ্ছিন্ন হলেও আপনি সব টুল পুরোপুরি ব্যবহার করতে পারবেন। কারণ এর কোনো ফিচারই দূরবর্তী সার্ভার কলের ওপর নির্ভরশীল নয়।'
  },
  {
    question: 'নতুন কোনো টুল কি ভবিষ্যতে যোগ হবে বা ব্যবহারকারী প্রস্তাব করতে পারবেন?',
    answer:
      'হ্যাঁ, আমরা প্রতিনিয়ত ব্যবহারকারীদের বাস্তব চাহিদা পর্যালোচনা করে নতুন নতুন বাংলা ডিজিটাল ইউটিলিটি টুল যোগ করছি। আপনার যদি কোনো বিশেষ টুলের প্রস্তাবনা বা মতামত থাকে, তবে আমাদের "যোগাযোগ" পেজ বা contact@utilix.bd ইমেইলের মাধ্যমে সরাসরি জানাতে পারেন।'
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenTerms
}) => {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Filtered tools
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return TOOLS;
    return TOOLS.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  // Schema.org Structured Data
  const siteAndOrgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://utilix.bd/#organization',
        name: 'Utilix.bd',
        url: 'https://utilix.bd',
        logo: 'https://utilix.bd/og-image.png',
        description:
          'বাংলা ডিজিটাল ইউটিলিটি হাব — সম্পূর্ণ ব্রাউজার-ভিত্তিক ও নিরাপদ বাংলাদেশি অনলাইন টুলস।'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://utilix.bd/#website',
        url: 'https://utilix.bd',
        name: 'Utilix.bd',
        description: 'প্রয়োজনীয় বাংলা ডিজিটাল ইউটিলিটি হাব',
        inLanguage: 'bn-BD',
        publisher: {
          '@id': 'https://utilix.bd/#organization'
        }
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-14">
      <Helmet>
        <title>Utilix.bd — প্রয়োজনীয় বাংলা ডিজিটাল ইউটিলিটি হাব</title>
        <meta
          name="description"
          content="বাংলা ডিজিটাল ইউটিলিটি হাব — সম্পূর্ণ ব্রাউজারে অফলাইন-ফার্স্ট বিজয় ↔ ইউনিকোড কনভার্টার, সরকারি ছবি ও স্বাক্ষর রিসাইজার, চাকরির বয়স ক্যালকুলেটর, জিপিএ ক্যালকুলেটর, সিভি মেকার এবং টাকা কথায় কনভার্টার।"
        />
        <link rel="canonical" href="https://utilix.bd/" />
        <meta property="og:title" content="Utilix.bd — প্রয়োজনীয় বাংলা ডিজিটাল ইউটিলিটি হাব" />
        <meta
          property="og:description"
          content="বাংলা ডিজিটাল ইউটিলিটি হাব — সম্পূর্ণ ব্রাউজারে অফলাইন-ফার্স্ট বিজয় ↔ ইউনিকোড কনভার্টার, ছবি ও স্বাক্ষর রিসাইজার, চাকরির বয়স ক্যালকুলেটর, জিপিএ ক্যালকুলেটর এবং টাকা কথায় কনভার্টার।"
        />
        <meta property="og:url" content="https://utilix.bd/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://utilix.bd/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Utilix.bd — প্রয়োজনীয় বাংলা ডিজিটাল ইউটিলিটি হাব" />
        <meta
          name="twitter:description"
          content="বাংলা ডিজিটাল ইউটিলিটি হাব — সম্পূর্ণ ব্রাউজারে অফলাইন-ফার্স্ট বিজয় ↔ ইউনিকোড কনভার্টার, ছবি ও স্বাক্ষর রিসাইজার, চাকরির বয়স ক্যালকুলেটর, জিপিএ ক্যালকুলেটর এবং টাকা কথায় কনভার্টার।"
        />
        <meta name="twitter:image" content="https://utilix.bd/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(siteAndOrgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="space-y-4">
        <div className="inline-block bg-[#fffdf7] border border-[#d8cfb8] px-3 py-1 text-xs text-[#083f2a] font-medium tracking-wide">
          বাংলা ডিজিটাল ইউটিলিটি হাব
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#083f2a] font-serif leading-tight">
          দ্রুত, নিরাপদ ও সম্পূর্ণ ব্রাউজার-ভিত্তিক বাংলা টুলস।
        </h1>

        <p className="text-base sm:text-lg text-[#6b6255] max-w-3xl leading-relaxed font-sans">
          আপনার কোনো ডেটা বা ফাইল সার্ভারে জমা হয় না; সমস্ত রূপান্তর এবং গণনা সরাসরি আপনার কম্পিউটারে সম্পন্ন হয় — নিখরচায় ও তাৎক্ষণিকভাবে।
        </p>

        {/* Two Trust Badges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-[#14231c]">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#0c5c3d] shrink-0" />
            <span>কোনো লগইন প্রয়োজন নেই</span>
          </div>
          <span className="text-[#d8cfb8] hidden sm:inline">•</span>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#0c5c3d] shrink-0" />
            <span>সম্পূর্ণ ব্যক্তিগত ও ব্রাউজার-ভিত্তিক প্রসেসিং</span>
          </div>
        </div>
      </section>

      {/* Introductory Paragraph */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-5 sm:p-6 text-xs sm:text-sm text-[#4a4237] leading-relaxed space-y-2">
        <div className="flex items-center space-x-2 text-[#083f2a] font-bold font-serif text-sm sm:text-base">
          <Sparkles className="w-4 h-4 text-[#0c5c3d]" />
          <span>একটি ঠিকানায় আপনার সব প্রয়োজনীয় বাংলা টুলস</span>
        </div>
        <p>
          Utilix.bd হলো বাংলাদেশি চাকরিপ্রার্থী, শিক্ষার্থী ও পেশাজীবীদের জন্য নির্মিত একটি উন্মুক্ত ও নিরাপদ প্ল্যাটফর্ম। সরকারি চাকরির টেলিটক পোর্টালে (Teletalk/BPSC) ৩oo×৩oo ছবি ও স্বাক্ষর রিসাইজ, সার্কুলারের বয়স ও কোটা গণনা, পুরোনো বিজয় (SutonnyMJ) লেখা থেকে ইউনিকোডে রূপান্তর, ব্যাংক চেক ও দলিলের টাকার কথায় রূপান্তর, শিক্ষা বোর্ডের এসএসসি/এইচএসসি ও বিশ্ববিদ্যালয়ের সিজিপিএ হিসাব এবং মানসম্মত সিভি তৈরি—দৈনন্দিন সব জটিল কাজ এখন ঝামেলাহীনভাবে সম্পন্ন করুন কোনো সার্ভার আপলোড ছাড়াই।
        </p>
      </section>

      {/* Filter Tabs & Grid Counters */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8cfb8] pb-3 gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              সকল টুলস ({TOOLS.length})
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('text')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'text'
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              টেক্সট রূপান্তর
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('image')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'image'
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              গ্রাফিক্স ও ছবি
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('calculator')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'calculator'
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              ক্যালকুলেটর
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('document')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'document'
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              সিভি ও ডকুমেন্ট
            </button>
          </div>

          {/* Status badge row */}
          <div className="text-[11px] sm:text-xs text-[#6b6255] font-mono flex items-center gap-3">
            <span className="flex items-center text-[#0c5c3d]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0c5c3d] mr-1"></span>
              {TOOLS.length}টি সক্রিয় টুল
            </span>
            <span className="text-[#d8cfb8]">/</span>
            <span className="text-[#083f2a]">১০০% ক্লায়েন্ট-সাইড নিরাপদ</span>
          </div>
        </div>

        {/* 3-Column Responsive Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isActive = tool.status === 'active';

            return (
              <div
                key={tool.id}
                className="bg-[#fffdf7] border border-[#d8cfb8] p-5 flex flex-col justify-between transition-colors hover:border-[#0c5c3d]/50"
              >
                <div>
                  {/* Top row: Icon & Status Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 border border-[#d8cfb8] bg-[#f4efe4] flex items-center justify-center text-[#0c5c3d]">
                      {tool.id === 'bijoy-converter' && <ArrowLeftRight className="w-5 h-5" />}
                      {tool.id === 'photo-resizer' && <Crop className="w-5 h-5" />}
                      {tool.id === 'age-calculator' && <Calculator className="w-5 h-5" />}
                      {tool.id === 'amount-in-words' && <Coins className="w-5 h-5" />}
                      {tool.id === 'gpa-calculator' && <GraduationCap className="w-5 h-5" />}
                      {tool.id === 'cv-builder' && <FileText className="w-5 h-5" />}
                      {tool.id === 'pdf-merger' && <Layers className="w-5 h-5" />}
                      {tool.id === 'pdf-split' && <Scissors className="w-5 h-5" />}
                      {tool.id === 'pdf-delete-pages' && <Trash2 className="w-5 h-5" />}
                      {tool.id === 'pdf-rotate' && <RotateCw className="w-5 h-5" />}
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#0c5c3d] text-[#fffdf7]">
                      সক্রিয় টুল {tool.version && `(${tool.version})`}
                    </span>
                  </div>

                  {/* Ref code */}
                  <div className="text-[11px] font-mono text-[#6b6255] tracking-wider mb-1">
                    REF: {tool.refCode}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#083f2a] font-serif mb-2">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#6b6255] leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Feature line with icon */}
                  <div className="border border-[#d8cfb8] bg-[#f4efe4]/60 p-2 text-xs text-[#14231c] flex items-center space-x-2 mb-6">
                    {tool.id === 'bijoy-converter' && <Zap className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'photo-resizer' && <ImageIcon className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'age-calculator' && <Clock className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'amount-in-words' && <Coins className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'gpa-calculator' && <GraduationCap className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'cv-builder' && <FileText className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-merger' && <Layers className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-split' && <Scissors className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-delete-pages' && <Trash2 className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-rotate' && <RotateCw className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    <span className="truncate">{tool.feature}</span>
                  </div>
                </div>

                {/* Card Action Button */}
                <div>
                  {isActive && tool.link && (
                    <Link
                      to={tool.link}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#0c5c3d] text-[#fffdf7] text-sm font-medium hover:bg-[#083f2a] transition-colors cursor-pointer group"
                    >
                      <span>টুল চালু করুন</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Updates & Release Log Section */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d8cfb8] pb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#0c5c3d]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#083f2a] font-serif">
              সাম্প্রতিক আপডেট ও রিলিজ লগ
            </h2>
          </div>
          <span className="text-xs text-[#6b6255]">
            নিয়মিত হালনাগাদ ও নতুন ফিচার সংযোজন
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SITE_UPDATES.map((update) => (
            <div
              key={update.id}
              className="border border-[#d8cfb8] bg-[#f4efe4]/40 p-4 space-y-2 flex flex-col justify-between hover:border-[#0c5c3d]/60 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#6b6255]">{update.date}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[11px] text-[#083f2a] font-medium bg-[#fffdf7] px-1.5 py-0.5 border border-[#d8cfb8]">
                      {update.version}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 ${
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
                </div>

                <h3 className="text-sm font-bold text-[#083f2a] font-serif">
                  {update.title}
                </h3>
                <p className="text-xs text-[#4a4237] leading-relaxed">
                  {update.description}
                </p>
              </div>

              {update.toolLink && (
                <div className="pt-2">
                  <Link
                    to={update.toolLink}
                    className="inline-flex items-center text-xs font-semibold text-[#0c5c3d] hover:text-[#083f2a] hover:underline"
                  >
                    <span>{update.toolName || 'টুল দেখুন'}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 border border-[#d8cfb8] bg-[#f4efe4] flex items-center justify-center text-[#0c5c3d] shrink-0">
            <Shield className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#083f2a] font-serif">
              কেন ইউটিলিক্স সম্পূর্ণ নিরাপদ?
            </h3>
            <p className="text-xs sm:text-sm text-[#6b6255] max-w-3xl leading-relaxed">
              আমাদের প্রতিটি টুল ক্লায়েন্ট-সাইড জাভাস্ক্রিপ্টে নির্মিত। আপনি যা লিখবেন বা আপলোড করবেন তা কখনোই কোনো রিমোট সার্ভার বা ডেটাবেজে স্থানান্তরিত হয় না। ইন্টারনেট সংযোগ বিচ্ছিন্ন করলেও পাতাটি সমান দক্ষতায় কার্যকর থাকে।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto">
          <Link
            to="/about"
            className="border border-[#0c5c3d] text-[#083f2a] hover:bg-[#0c5c3d] hover:text-[#fffdf7] px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors text-center"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            to="/privacy-policy"
            className="bg-[#0c5c3d] text-[#fffdf7] hover:bg-[#083f2a] px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors text-center"
          >
            গোপনীয়তা নীতি
          </Link>
        </div>
      </section>

      {/* Site-Wide FAQ Section */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 space-y-6">
        <div className="border-b border-[#d8cfb8] pb-3 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-[#0c5c3d]" />
          <h2 className="text-lg sm:text-xl font-bold text-[#083f2a] font-serif">
            সাধারণ প্রশ্নোত্তর (Frequently Asked Questions)
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="border border-[#d8cfb8] bg-[#f4efe4]/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#083f2a] hover:text-[#0c5c3d] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6b6255] transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? 'rotate-180 text-[#0c5c3d]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#4a4237] leading-relaxed border-t border-[#d8cfb8]/60 pt-3 bg-[#fffdf7]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
