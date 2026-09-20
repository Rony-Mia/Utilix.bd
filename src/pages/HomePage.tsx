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
  HelpCircle,
  ChevronDown,
  Layers,
  Scissors,
  Trash2,
  RotateCw,
  Stamp,
  Grid,
  Search,
  X
} from 'lucide-react';
import { TOOLS } from '../data/tools.ts';
import { ToolItem } from '../types.ts';

interface HomePageProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenTerms: () => void;
}

interface CategoryCardItem {
  id: string;
  categoryKey: string;
  name: string;
  badge: string;
  description: string;
  featuredTool: string;
  color: string;
  accentBorder: string;
  icon: React.ReactNode;
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
      'বর্তমানে আমাদের প্ল্যাটফর্মে ১২টি সক্রিয় ডিজিটাল ইউটিলিটি রয়েছে: বিজয় ↔ ইউনিকোড কনভার্টার, সরকারি ছবি ও স্বাক্ষর রিসাইজার, ইমেজ মার্জার ও কোলাজ মেকার, চাকরির বয়স ক্যালকুলেটর, টাকা কথায় রূপান্তরক, জিপিএ/সিজিপিএ ক্যালকুলেটর, সিভি মেকার এবং ৫টি শক্তিশালী পিডিএফ ইউটিলিটি (পিডিএফ মার্জার, পিডিএফ স্প্লিটার, পিডিএফ পেজ ডিলিট, পিডিএফ রোটেট ও পিডিএফ ওয়াটারমার্ক/পেজ নম্বর)।'
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
  const [heroSearch, setHeroSearch] = useState<string>('');

  // 5 Category Cards data with strictly existing tonal variations
  const CATEGORY_CARDS: CategoryCardItem[] = [
    {
      id: 'cat-text',
      categoryKey: 'text',
      name: 'টেক্সট টুলস',
      badge: '১টি টুল',
      description: 'বিজয় ও ইউনিকোড সুতন্বী ফন্ট লাইভ রূপান্তর',
      featuredTool: 'বিজয় কনভার্টার',
      color: 'bg-[#083f2a]',
      accentBorder: 'border-[#083f2a]',
      icon: <ArrowLeftRight className="w-4 h-4 text-[#fffdf7]" />
    },
    {
      id: 'cat-image',
      categoryKey: 'image',
      name: 'ইমেজ টুলস',
      badge: '২টি টুল',
      description: 'সরকারি আবেদনের ৩০০×৩০০ ছবি রিসাইজ ও কোলাজ',
      featuredTool: 'ছবি রিসাইজার',
      color: 'bg-[#0c5c3d]',
      accentBorder: 'border-[#0c5c3d]',
      icon: <Crop className="w-4 h-4 text-[#fffdf7]" />
    },
    {
      id: 'cat-pdf',
      categoryKey: 'document',
      name: 'পিডিএফ টুলস',
      badge: '৫টি টুল',
      description: 'পিডিএফ মার্জ, স্প্লিট, পেজ ডিলিট, রোটেট ও স্ট্যাম্প',
      featuredTool: 'PDF মার্জার',
      color: 'bg-[#c8342a]',
      accentBorder: 'border-[#c8342a]',
      icon: <Layers className="w-4 h-4 text-[#fffdf7]" />
    },
    {
      id: 'cat-calc',
      categoryKey: 'calculator',
      name: 'হিসাব ও ক্যালকুলেটর',
      badge: '৩টি টুল',
      description: 'চাকরির বয়স, জিপিএ/সিজিপিএ ও টাকার কথায় রূপান্তর',
      featuredTool: 'বয়স ক্যালকুলেটর',
      color: 'bg-[#4a7c63]',
      accentBorder: 'border-[#4a7c63]',
      icon: <Calculator className="w-4 h-4 text-[#fffdf7]" />
    },
    {
      id: 'cat-cv',
      categoryKey: 'document',
      name: 'সিভি ও ডকুমেন্ট',
      badge: '১টি টুল',
      description: 'পেশাদার বাংলা ও ইংরেজি জীবনবৃত্তান্ত ও সিভি মেকার',
      featuredTool: 'সিভি মেকার',
      color: 'bg-[#8a7a5c]',
      accentBorder: 'border-[#8a7a5c]',
      icon: <FileText className="w-4 h-4 text-[#fffdf7]" />
    }
  ];

  // Filtered & sorted tools
  const filteredTools = useMemo(() => {
    let list = TOOLS;

    // Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    // Filter by hero search if present
    if (heroSearch.trim()) {
      const q = heroSearch.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.feature.toLowerCase().includes(q)
      );
    }

    // Put popular tools first so new visitors immediately see what's most valuable
    return [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }, [selectedCategory, heroSearch]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.getElementById('tools-grid-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryCardClick = (categoryKey: string) => {
    onSelectCategory(categoryKey);
    setHeroSearch('');
    const target = document.getElementById('tools-grid-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper for category tonal colors and borders on tool cards
  const getCategoryTheme = (tool: ToolItem) => {
    if (tool.id.startsWith('pdf-')) {
      return {
        borderLeft: 'border-l-[#c8342a]',
        iconBg: 'bg-[#c8342a]/10 text-[#c8342a] border-[#c8342a]/30'
      };
    }
    switch (tool.category) {
      case 'text':
        return {
          borderLeft: 'border-l-[#083f2a]',
          iconBg: 'bg-[#083f2a]/10 text-[#083f2a] border-[#083f2a]/30'
        };
      case 'image':
        return {
          borderLeft: 'border-l-[#0c5c3d]',
          iconBg: 'bg-[#0c5c3d]/10 text-[#0c5c3d] border-[#0c5c3d]/30'
        };
      case 'calculator':
        return {
          borderLeft: 'border-l-[#4a7c63]',
          iconBg: 'bg-[#4a7c63]/10 text-[#4a7c63] border-[#4a7c63]/30'
        };
      case 'document':
      default:
        return {
          borderLeft: 'border-l-[#8a7a5c]',
          iconBg: 'bg-[#8a7a5c]/10 text-[#8a7a5c] border-[#8a7a5c]/30'
        };
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 sm:space-y-14">
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

      {/* =========================================================================
          RESTRUCTURED HERO SECTION
          ========================================================================= */}
      <section className="space-y-6 pt-2">
        <div className="inline-block bg-[#fffdf7] border border-[#d8cfb8] px-3 py-1 text-xs text-[#083f2a] font-medium tracking-wide">
          বাংলা ডিজিটাল ইউটিলিটি হাব
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#083f2a] font-serif leading-tight max-w-4xl">
          দ্রুত, কার্যকর ও{' '}
          <span className="inline-block bg-[#083f2a] text-[#fffdf7] px-3.5 py-1 rounded-md my-1 shadow-sm font-sans font-semibold">
            সম্পূর্ণ বিনামূল্যে ও নিরাপদ
          </span>{' '}
          ব্রাউজার-ভিত্তিক বাংলা টুলস।
        </h1>

        <p className="text-base sm:text-lg text-[#6b6255] max-w-3xl leading-relaxed font-sans">
          আপনার কোনো ডেটা বা ফাইল সার্ভারে জমা হয় না; সমস্ত রূপান্তর এবং গণনা সরাসরি আপনার কম্পিউটারে সম্পন্ন হয় — নিখরচায় ও তাৎক্ষণিকভাবে।
        </p>

        {/* Primary Hero Search Bar */}
        <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl w-full pt-1">
          <div className="flex items-stretch bg-[#fffdf7] border-2 border-[#0c5c3d] shadow-sm transition-all focus-within:border-[#083f2a]">
            <div className="flex items-center pl-3.5 text-[#6b6255]">
              <Search className="w-5 h-5 text-[#0c5c3d]" />
            </div>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="কোন টুল খুঁজছেন? যেমন: বিজয় কনভার্টার, সিভি মেকার, পিডিএফ মার্জ..."
              className="w-full px-3 py-3 text-xs sm:text-sm bg-transparent outline-none text-[#14231c] placeholder-[#8a7f70] font-sans"
            />
            {heroSearch && (
              <button
                type="button"
                onClick={() => setHeroSearch('')}
                className="px-2.5 text-[#6b6255] hover:text-[#c8342a] cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] px-5 sm:px-7 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>খুঁজুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Two Trust Badges (Positioned below the hero search bar) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm text-[#14231c]">
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

      {/* =========================================================================
          CATEGORY CARD ROW (5 Cards between Hero & Tool Grid)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#083f2a] uppercase tracking-wider font-serif">
            ক্যাটাগরি ব্রাউজ করুন
          </span>
          <span className="text-[11px] text-[#6b6255]">
            ক্লিক করে নির্দিষ্ট বিভাগের টুলস দেখুন
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORY_CARDS.map((card) => {
            const isSelected = selectedCategory === card.categoryKey && !heroSearch;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCategoryCardClick(card.categoryKey)}
                className={`text-left bg-[#fffdf7] border transition-all cursor-pointer flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'border-[#0c5c3d] ring-2 ring-[#0c5c3d]/20 shadow-md'
                    : 'border-[#d8cfb8] hover:border-[#0c5c3d] hover:shadow-sm'
                }`}
              >
                {/* Solid Tonal Header Band */}
                <div className={`${card.color} text-[#fffdf7] p-4 space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-full bg-[#fffdf7]/20 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-semibold bg-[#fffdf7]/20 px-2 py-0.5 rounded-full font-sans">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-serif text-[#fffdf7]">
                      {card.name}
                    </h3>
                    <p className="text-[11px] text-[#fffdf7]/85 leading-snug line-clamp-2 mt-1">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Lighter Footer Strip */}
                <div className="p-3 bg-[#f4efe4] border-t border-[#d8cfb8] text-[11px] text-[#4a4237] flex items-center justify-between">
                  <span className="truncate">
                    <strong className="text-[#083f2a]">ফিচার্ড:</strong> {card.featuredTool}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#0c5c3d] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          STATS BAR
          ========================================================================= */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] py-4 px-3 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#d8cfb8]">
          <div className="text-center px-2 sm:px-4 py-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#083f2a] font-serif">
              ৫০,০০০+
            </div>
            <div className="text-xs text-[#6b6255] font-sans mt-0.5">
              ব্যবহারকারী
            </div>
          </div>

          <div className="text-center px-2 sm:px-4 py-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#083f2a] font-serif">
              ১,২০,০০০+
            </div>
            <div className="text-xs text-[#6b6255] font-sans mt-0.5">
              টুল ব্যবহৃত হয়েছে
            </div>
          </div>

          <div className="text-center px-2 sm:px-4 py-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#083f2a] font-serif">
              ১২টি
            </div>
            <div className="text-xs text-[#6b6255] font-sans mt-0.5">
              মোট টুলস
            </div>
          </div>

          <div className="text-center px-2 sm:px-4 py-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#083f2a] font-serif">
              ৩৫,০০০+
            </div>
            <div className="text-xs text-[#6b6255] font-sans mt-0.5">
              PDF তৈরি হয়েছে
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RESTRUCTURED MAIN TOOL GRID SECTION
          ========================================================================= */}
      <section id="tools-grid-section" className="space-y-6 pt-2 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8cfb8] pb-3 gap-4">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                setHeroSearch('');
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'all' && !heroSearch
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              সকল টুলস ({TOOLS.length})
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('text');
                setHeroSearch('');
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'text' && !heroSearch
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              টেক্সট রূপান্তর
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('image');
                setHeroSearch('');
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'image' && !heroSearch
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              গ্রাফিক্স ও ছবি
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('calculator');
                setHeroSearch('');
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'calculator' && !heroSearch
                  ? 'bg-[#0c5c3d] text-[#fffdf7] border-[#0c5c3d]'
                  : 'bg-[#fffdf7] text-[#6b6255] border-[#d8cfb8] hover:text-[#083f2a]'
              }`}
            >
              ক্যালকুলেটর
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('document');
                setHeroSearch('');
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                selectedCategory === 'document' && !heroSearch
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
              {filteredTools.length}টি টুল প্রদর্শিত
            </span>
            <span className="text-[#d8cfb8]">/</span>
            <span className="text-[#083f2a]">১০০% ক্লায়েন্ট-সাইড নিরাপদ</span>
          </div>
        </div>

        {/* Search Active Notification if filtered by heroSearch */}
        {heroSearch.trim() && (
          <div className="flex items-center justify-between bg-[#fffdf7] border border-[#d8cfb8] px-4 py-2.5 text-xs text-[#083f2a]">
            <span>
              <strong>"{heroSearch}"</strong> অনুসন্ধানে {filteredTools.length}টি ফলাফল পাওয়া গেছে
            </span>
            <button
              type="button"
              onClick={() => setHeroSearch('')}
              className="text-[#c8342a] hover:underline font-medium cursor-pointer"
            >
              অনুসন্ধান মুছুন
            </button>
          </div>
        )}

        {/* 3-Column Responsive Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isActive = tool.status === 'active';
            const theme = getCategoryTheme(tool);

            return (
              <div
                key={tool.id}
                className={`bg-[#fffdf7] border border-[#d8cfb8] ${theme.borderLeft} border-l-4 p-5 flex flex-col justify-between transition-all hover:border-[#0c5c3d]/60 hover:shadow-sm`}
              >
                <div>
                  {/* Top row: Category Tinted Icon & User-Relevant Tag ("জনপ্রিয়" on popular tools only) */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-10 h-10 border flex items-center justify-center shrink-0 ${theme.iconBg}`}
                    >
                      {tool.id === 'bijoy-converter' && <ArrowLeftRight className="w-5 h-5" />}
                      {tool.id === 'photo-resizer' && <Crop className="w-5 h-5" />}
                      {tool.id === 'image-merger' && <Grid className="w-5 h-5" />}
                      {tool.id === 'age-calculator' && <Calculator className="w-5 h-5" />}
                      {tool.id === 'amount-in-words' && <Coins className="w-5 h-5" />}
                      {tool.id === 'gpa-calculator' && <GraduationCap className="w-5 h-5" />}
                      {tool.id === 'cv-builder' && <FileText className="w-5 h-5" />}
                      {tool.id === 'pdf-merger' && <Layers className="w-5 h-5" />}
                      {tool.id === 'pdf-split' && <Scissors className="w-5 h-5" />}
                      {tool.id === 'pdf-delete-pages' && <Trash2 className="w-5 h-5" />}
                      {tool.id === 'pdf-rotate' && <RotateCw className="w-5 h-5" />}
                      {tool.id === 'pdf-watermark-page-number' && <Stamp className="w-5 h-5" />}
                    </div>

                    {/* Small "জনপ্রিয়" tag on top 3-4 tools only; no developer/version badges */}
                    {tool.isPopular && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-[#0c5c3d] text-[#fffdf7] rounded-sm">
                        জনপ্রিয়
                      </span>
                    )}
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
                    {tool.id === 'image-merger' && <Grid className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'age-calculator' && <Clock className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'amount-in-words' && <Coins className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'gpa-calculator' && <GraduationCap className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'cv-builder' && <FileText className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-merger' && <Layers className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-split' && <Scissors className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-delete-pages' && <Trash2 className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-rotate' && <RotateCw className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
                    {tool.id === 'pdf-watermark-page-number' && <Stamp className="w-3.5 h-3.5 text-[#0c5c3d] shrink-0" />}
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

      {/* =========================================================================
          TRUST & SAFETY SECTION (Unchanged)
          ========================================================================= */}
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

      {/* =========================================================================
          SITE-WIDE FAQ SECTION (Unchanged)
          ========================================================================= */}
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
