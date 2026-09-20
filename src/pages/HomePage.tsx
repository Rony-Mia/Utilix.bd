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
          PHASE 1 REDESIGN: HERO SECTION
          ========================================================================= */}
      <section className="pt-4 sm:pt-8 pb-14 sm:pb-24">
        {/* Mobile: stack right-column visual ABOVE headline (compressed to Bijoy mockup only) */}
        <div className="lg:hidden mb-8 w-full max-w-sm mx-auto">
          <div className="bg-[#FFFFFF] border border-[#E3DCC8] rounded-[8px] p-3 shadow-[0_2px_8px_rgba(13,40,24,0.04)]">
            <div className="flex items-center justify-between border-b border-[#E3DCC8] pb-2 mb-2.5">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E3DCC8]"></span>
                <span className="w-2 h-2 rounded-full bg-[#E3DCC8]"></span>
                <span className="w-2 h-2 rounded-full bg-[#E3DCC8]"></span>
              </div>
              <div className="text-[11px] font-sans font-medium text-[#5C6F63]">
                বিজয় ↔ ইউনিকোড
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D2818]" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#FAF6EC] p-2 rounded-[4px] border border-[#E3DCC8]/60 font-mono text-[#5C6F63]">
                <div className="text-[9px] text-[#5C6F63]/80 mb-1 font-sans">ANSI (বিজয়)</div>
                <div>Avgvi †mvbvj evsjv,</div>
                <div>Avwg †Zvgvq fv‡jvevwm|</div>
              </div>
              <div className="bg-[#FFFFFF] p-2 rounded-[4px] border border-[#E3DCC8]/60 text-[#0D2818]">
                <div className="text-[9px] text-[#5C6F63]/80 mb-1 font-sans">ইউনিকোড (বাংলা)</div>
                <div>আমার সোনার বাংলা,</div>
                <div>আমি তোমায় ভালোবাসি।</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop 2-column asymmetric layout (55/45 split, left-aligned) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (55% -> 7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            <h1 className="font-tiro text-[36px] sm:text-[48px] lg:text-[60px] font-normal text-[#0D2818] leading-[1.08] tracking-normal">
              প্রতিদিনের কাজ, <br className="hidden sm:inline" />
              একটু সহজ করে দিই।
            </h1>

            <p className="text-[16px] sm:text-[18px] text-[#5C6F63] font-normal leading-[1.7] max-w-xl">
              বিজয় থেকে ইউনিকোড, সিভি থেকে PDF — বাংলাদেশের জন্য বানানো টুলস, সম্পূর্ণ বিনামূল্যে।
            </p>

            {/* Three Understated Text Links (NOT buttons, NOT pills) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-6 pt-2">
              <Link
                to="/converter"
                className="inline-flex items-center text-[15px] sm:text-[16px] text-[#0D2818] font-medium group transition-colors hover:text-[#0D2818]/80"
              >
                <span>বিজয় → ইউনিকোড কনভার্ট করুন</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#0D2818]" />
              </Link>

              <Link
                to="/cv-builder"
                className="inline-flex items-center text-[15px] sm:text-[16px] text-[#0D2818] font-medium group transition-colors hover:text-[#0D2818]/80"
              >
                <span>সিভি তৈরি করুন</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#0D2818]" />
              </Link>

              <Link
                to="/pdf-merger"
                className="inline-flex items-center text-[15px] sm:text-[16px] text-[#0D2818] font-medium group transition-colors hover:text-[#0D2818]/80"
              >
                <span>PDF মার্জ করুন</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#0D2818]" />
              </Link>
            </div>
          </div>

          {/* Right Column (45% -> 5 cols, Desktop Signature Visual Element) */}
          <div className="hidden lg:block lg:col-span-5 relative py-6 select-none">
            {/* Layered Composition Container on plain #FAF6EC background */}
            <div className="relative w-full max-w-[420px] mx-auto h-[320px]">
              {/* Mockup 2 (Behind / Right): CV Builder Preview */}
              <div
                className="absolute right-0 top-2 w-[250px] bg-[#FFFFFF] border border-[#E3DCC8] rounded-[8px] p-3.5 shadow-[0_2px_8px_rgba(13,40,24,0.04)] rotate-3 transition-transform"
                style={{ zIndex: 1 }}
              >
                <div className="flex items-center justify-between border-b border-[#E3DCC8] pb-2 mb-3">
                  <div className="text-[11px] font-medium text-[#5C6F63]">
                    সিভি প্রিভিউ (A4)
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2818]"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-10 bg-[#FAF6EC] border border-[#E3DCC8] rounded-[2px] shrink-0 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#5C6F63]/50" />
                    </div>
                    <div className="space-y-1.5 w-full">
                      <div className="h-2.5 w-24 bg-[#0D2818]/80 rounded-[2px]"></div>
                      <div className="h-2 w-16 bg-[#5C6F63]/40 rounded-[2px]"></div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-[#FAF6EC]">
                    <div className="h-1.5 w-full bg-[#5C6F63]/25 rounded-[1px]"></div>
                    <div className="h-1.5 w-4/5 bg-[#5C6F63]/20 rounded-[1px]"></div>
                    <div className="h-1.5 w-3/4 bg-[#5C6F63]/15 rounded-[1px]"></div>
                  </div>

                  <div className="pt-2 border-t border-[#FAF6EC] space-y-1.5">
                    <div className="h-2 w-16 bg-[#0D2818]/60 rounded-[2px]"></div>
                    <div className="h-1.5 w-full bg-[#5C6F63]/20 rounded-[1px]"></div>
                    <div className="h-1.5 w-5/6 bg-[#5C6F63]/15 rounded-[1px]"></div>
                  </div>

                  <div className="text-[9px] text-[#5C6F63]/60 text-right pt-1 font-mono">
                    A4 • পৃষ্ঠা ১/১
                  </div>
                </div>
              </div>

              {/* Mockup 1 (Front / Left): Bijoy ↔ Unicode Converter */}
              <div
                className="absolute left-0 top-16 w-[310px] bg-[#FFFFFF] border border-[#E3DCC8] rounded-[8px] p-3.5 shadow-[0_2px_8px_rgba(13,40,24,0.04)] -rotate-1 transition-transform"
                style={{ zIndex: 2 }}
              >
                <div className="flex items-center justify-between border-b border-[#E3DCC8] pb-2 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E3DCC8]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#E3DCC8]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#E3DCC8]"></span>
                  </div>
                  <div className="text-[11px] font-sans font-medium text-[#0D2818]">
                    বিজয় ↔ ইউনিকোড
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D2818]" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#FAF6EC] p-2.5 rounded-[4px] border border-[#E3DCC8]/60 font-mono text-[#5C6F63] space-y-1">
                    <div className="text-[9px] text-[#5C6F63]/80 font-sans">সুতন্বীএমজে (ANSI)</div>
                    <div className="truncate">Avgvi †mvbvj evsjv,</div>
                    <div className="truncate">Avwg †Zvgvq fv‡jvevwm|</div>
                  </div>

                  <div className="bg-[#FFFFFF] p-2.5 rounded-[4px] border border-[#E3DCC8]/60 text-[#0D2818] space-y-1">
                    <div className="text-[9px] text-[#5C6F63]/80 font-sans">ইউনিকোড (বাংলা)</div>
                    <div className="truncate">আমার সোনার বাংলা,</div>
                    <div className="truncate">আমি তোমায় ভালোবাসি।</div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#FAF6EC] flex items-center justify-between text-[10px] text-[#5C6F63]">
                  <span>লাইভ রূপান্তর সম্পন্ন</span>
                  <span className="text-[#0D2818] font-medium">১০০% সঠিক</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 1 REDESIGN: FEATURED TOOLS SECTION
          ========================================================================= */}
      <section className="py-12 sm:py-20 space-y-8">
        <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#0D2818] font-sans">
          যা দিয়ে বেশিরভাগ মানুষ শুরু করে
        </h2>

        {/* Asymmetric layout: 1 Large Block (60%) + 2 Smaller Stacked Blocks (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Large Block (Roughly 60% -> 7 cols): বিজয় ↔ ইউনিকোড কনভার্টার with subtle #FAF6EC background */}
          <div className="lg:col-span-7 bg-[#FAF6EC] rounded-[8px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Real Miniature Live-Style Preview (2-3 lines of text) */}
              <div className="bg-[#FFFFFF] border border-[#E3DCC8] rounded-[6px] p-4 space-y-3 shadow-[0_1px_3px_rgba(13,40,24,0.02)]">
                <div className="flex items-center justify-between text-[12px] text-[#5C6F63] border-b border-[#FAF6EC] pb-2">
                  <span className="font-mono">সুতন্বীএমজে (বিজয় ANSI)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0D2818]" />
                  <span className="font-medium text-[#0D2818]">ইউনিকোড (বাংলা)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px] leading-relaxed">
                  <div className="bg-[#FAF6EC]/60 p-3 rounded-[4px] font-mono text-[#5C6F63] border border-[#E3DCC8]/40">
                    <p className="line-clamp-3">
                      Avgvi †mvbvj evsjv, Avwg †Zvgvq fv‡jvevwm| wPiw`b †Zvgvi AvKvk, †Zvgvi evZvm, Avgvi cÖv‡Y evRvq euvwk...
                    </p>
                  </div>
                  <div className="bg-[#FFFFFF] p-3 rounded-[4px] text-[#0D2818] border border-[#E3DCC8]/60">
                    <p className="line-clamp-3">
                      আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি...
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#0D2818] font-sans">
                  বিজয় ↔ ইউনিকোড কনভার্টার
                </h3>
                <p className="text-[15px] text-[#5C6F63] leading-[1.7] mt-1.5">
                  পুরোনো সুতন্বীএমজে ফন্টের টাইপিং এক ক্লিকে আধুনিক ইউনিকোডে রূপান্তর করুন নিমিষেই।
                </p>
              </div>
            </div>

            <div>
              <Link
                to="/converter"
                className="inline-flex items-center text-[15px] font-medium text-[#0D2818] group hover:text-[#0D2818]/80 transition-colors"
              >
                <span>টুল খুলুন</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#0D2818]" />
              </Link>
            </div>
          </div>

          {/* Two Smaller Blocks Stacked (Roughly 40% -> 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Smaller Block 1: সিভি মেকার (Typography + arrow only, no visual preview) */}
            <div className="bg-[#FFFFFF] rounded-[8px] p-6 sm:p-7 flex flex-col justify-between border border-[#E3DCC8] hover:border-[#0D2818]/30 transition-colors space-y-4">
              <div>
                <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#0D2818] font-sans">
                  সিভি ও জীবনবৃত্তান্ত মেকার
                </h3>
                <p className="text-[14px] sm:text-[15px] text-[#5C6F63] leading-[1.7] mt-1.5">
                  সরকারি চাকরি ও কর্পোরেট ফরম্যাটে পরিচ্ছন্ন বাংলা ও ইংরেজি সিভি তৈরি ও সরাসরি PDF ডাউনলোড।
                </p>
              </div>

              <div>
                <Link
                  to="/cv-builder"
                  className="inline-flex items-center text-[15px] font-medium text-[#0D2818] group hover:text-[#0D2818]/80 transition-colors"
                >
                  <span>টুল খুলুন</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#0D2818]" />
                </Link>
              </div>
            </div>

            {/* Smaller Block 2: PDF মার্জার (Includes a tiny icon-sized preview) */}
            <div className="bg-[#FFFFFF] rounded-[8px] p-6 sm:p-7 flex flex-col justify-between border border-[#E3DCC8] hover:border-[#0D2818]/30 transition-colors space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#0D2818] font-sans">
                    PDF মার্জার
                  </h3>
                  <p className="text-[14px] sm:text-[15px] text-[#5C6F63] leading-[1.7] mt-1.5">
                    একাধিক পিডিএফ ফাইলকে ক্রমানুসারে সাজিয়ে মুহূর্তেই একত্র করে একক ফাইলে রূপান্তর করুন।
                  </p>
                </div>

                {/* Tiny icon-sized preview showing 2 merging sheets */}
                <div className="w-10 h-10 rounded-[6px] bg-[#FAF6EC] border border-[#E3DCC8] flex items-center justify-center shrink-0">
                  <div className="relative w-5 h-6">
                    <div className="absolute left-0 top-0 w-4 h-5 bg-[#FFFFFF] border border-[#E3DCC8] rounded-[1px]"></div>
                    <div className="absolute right-0 bottom-0 w-4 h-5 bg-[#FFFFFF] border border-[#0D2818]/40 rounded-[1px] shadow-[0_1px_2px_rgba(13,40,24,0.06)] flex items-center justify-center">
                      <span className="text-[7px] font-mono text-[#0D2818] font-bold">PDF</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to="/pdf-merger"
                  className="inline-flex items-center text-[15px] font-medium text-[#0D2818] group hover:text-[#0D2818]/80 transition-colors"
                >
                  <span>টুল খুলুন</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#0D2818]" />
                </Link>
              </div>
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
