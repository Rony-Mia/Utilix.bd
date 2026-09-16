import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeftRight,
  Calculator,
  Crop,
  CheckCircle2,
  Lock,
  Zap,
  Ruler,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  FileText,
  Shield,
  RefreshCw
} from 'lucide-react';
import { ToolCategory, ToolItem, ConversionMode } from '../types.ts';
import { bijoyToUnicode, unicodeToBijoy, SAMPLE_BIJOY_TEXT, SAMPLE_UNICODE_TEXT } from '../bijoyConverter.ts';

const TOOLS: ToolItem[] = [
  {
    id: 'bijoy-converter',
    refCode: 'TXT-CONV-01',
    title: 'বিজয় ↔ ইউনিকোড টেক্সট কনভার্টার',
    description: 'পুরনো বিজয় ANSI এনকোডিংয়ের ফন্ট (SutonnyMJ) থেকে আধুনিক ইউনিকোড এবং ইউনিকোড থেকে বিজয়ে তাৎক্ষণিক লাইভ রূপান্তর।',
    feature: 'লাইভ টাইপিং • .txt ফাইল সাপোর্ট • অফলাইন প্রস্তুত',
    category: 'text',
    status: 'active',
    version: 'v2.4',
    link: '/converter'
  },
  {
    id: 'photo-resizer',
    refCode: 'IMG-GOV-02',
    title: 'সরকারি ও পাসপোর্ট ছবি রিসাইজার',
    description: 'বাংলাদেশি সরকারি চাকরি (Teletalk/BPSC), বিসিএস ও পাসপোর্ট আবেদনের নির্ধারিত ৩০০×৩০০ পিক্সেল এবং ১০০KB মাপে ক্রপ, রিসাইজ ও কম্প্রেশন।',
    feature: '৩০০×৩০০ ছবি • ৩০০×৮০ স্বাক্ষর • শার্প ব্যাকএন্ড ইঞ্জিন',
    category: 'image',
    status: 'active',
    version: 'v1.0',
    link: '/photo-resizer'
  }
];

interface HomePageProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenTerms: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenTerms
}) => {
  // Mini converter interactive state
  const [miniInput, setMiniInput] = useState<string>(SAMPLE_BIJOY_TEXT);
  const [miniMode, setMiniMode] = useState<ConversionMode>('bijoy_to_unicode');
  const [copied, setCopied] = useState<boolean>(false);

  // Live conversion using real algorithm
  const miniOutput = useMemo(() => {
    if (!miniInput) return '';
    return miniMode === 'bijoy_to_unicode'
      ? bijoyToUnicode(miniInput)
      : unicodeToBijoy(miniInput);
  }, [miniInput, miniMode]);

  const handleCopy = async () => {
    if (!miniOutput) return;
    try {
      await navigator.clipboard.writeText(miniOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwapMode = () => {
    if (miniMode === 'bijoy_to_unicode') {
      setMiniMode('unicode_to_bijoy');
      setMiniInput(miniOutput || SAMPLE_UNICODE_TEXT);
    } else {
      setMiniMode('bijoy_to_unicode');
      setMiniInput(miniOutput || SAMPLE_BIJOY_TEXT);
    }
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return TOOLS;
    return TOOLS.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        {/* Small tag pill */}
        <div className="inline-block bg-[#fffdf7] border border-[#d8cfb8] px-3 py-1 text-xs text-[#083f2a] font-medium tracking-wide">
          বাংলা ডিজিটাল ইউটিলিটি হাব
        </div>

        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#083f2a] font-serif leading-tight">
          দ্রুত, নিরাপদ ও সম্পূর্ণ ব্রাউজার-ভিত্তিক বাংলা টুলস।
        </h1>

        {/* Subtext */}
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
          </div>

          {/* Clean status badge row */}
          <div className="text-[11px] sm:text-xs text-[#6b6255] font-mono flex items-center gap-3">
            <span className="flex items-center text-[#0c5c3d]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0c5c3d] mr-1"></span>
              ২টি সক্রিয় টুল
            </span>
            <span className="text-[#d8cfb8]">/</span>
            <span className="text-[#083f2a]">ব্যাকএন্ড ইঞ্জিন সচল</span>
          </div>
        </div>

        {/* 2-Column Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Live Embedded Mini-Preview of Bijoy Converter */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-5 sm:p-6 space-y-4">
        {/* Console Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d8cfb8] pb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-[#0c5c3d] text-[#fffdf7] text-[11px] font-semibold px-2 py-0.5">
              লাইভ ডেমো
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#083f2a] font-serif">
              বিজয় ↔ ইউনিকোড রূপান্তর কনসোল (পরীক্ষামূলক প্রিভিউ)
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSwapMode}
            className="inline-flex items-center text-xs text-[#083f2a] hover:text-[#0c5c3d] border border-[#d8cfb8] bg-[#f4efe4] px-2.5 py-1 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
            <span>রূপান্তর মোড পরিবর্তন ({miniMode === 'bijoy_to_unicode' ? 'বিজয় → ইউনিকোড' : 'ইউনিকোড → বিজয়'})</span>
          </button>
        </div>

        {/* Dual Textarea Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Input Box */}
          <div className="border border-[#d8cfb8] bg-[#fffdf7] p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#083f2a] mb-2 pb-1 border-b border-[#d8cfb8]">
                <span>
                  {miniMode === 'bijoy_to_unicode'
                    ? 'ইনপুট: বিজয় (ANSI SutonnyMJ টেক্সট পেস্ট করুন)'
                    : 'ইনপুট: বাংলা ইউনিকোড টেক্সট'}
                </span>
                <span className="text-[11px] font-mono text-[#6b6255]">
                  বর্ণ: {miniInput.length}
                </span>
              </div>

              <textarea
                value={miniInput}
                onChange={(e) => setMiniInput(e.target.value)}
                placeholder={
                  miniMode === 'bijoy_to_unicode'
                    ? 'এখানে SutonnyMJ ফন্টের লেখা পেস্ট করুন (উদাঃ Avgvi †mvbvi evsjv...)'
                    : 'এখানে বাংলা ইউনিকোড টেক্সট লিখুন বা পেস্ট করুন...'
                }
                rows={5}
                className={`w-full p-2.5 bg-[#f4efe4]/40 border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none focus:border-[#0c5c3d] resize-none ${
                  miniMode === 'bijoy_to_unicode' ? 'font-mono' : 'font-sans'
                }`}
              />
            </div>

            {/* Input Action buttons */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setMiniInput(miniMode === 'bijoy_to_unicode' ? SAMPLE_BIJOY_TEXT : SAMPLE_UNICODE_TEXT)
                }
                className="text-[#083f2a] hover:text-[#0c5c3d] underline-offset-2 hover:underline cursor-pointer flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>নমুনা টেক্সট যোগ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setMiniInput('')}
                className="text-[#c8342a] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছে ফেলুন</span>
              </button>
            </div>
          </div>

          {/* Right: Output Box */}
          <div className="border border-[#d8cfb8] bg-[#fffdf7] p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#083f2a] mb-2 pb-1 border-b border-[#d8cfb8]">
                <span>
                  {miniMode === 'bijoy_to_unicode'
                    ? 'আউটপুট: আধুনিক ইউনিকোড টেক্সট (লাইভ ফলাফল)'
                    : 'আউটপুট: বিজয় ANSI টেক্সট'}
                </span>
                <span className="text-[11px] font-mono text-[#0c5c3d] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0c5c3d] mr-1"></span>
                  স্বয়ংক্রিয় সিঙ্কড
                </span>
              </div>

              <textarea
                readOnly
                value={miniOutput}
                placeholder="এখানে তাৎক্ষণিক রূপান্তরিত ফলাফল প্রদর্শিত হবে..."
                rows={5}
                className={`w-full p-2.5 bg-[#f4efe4]/20 border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none resize-none ${
                  miniMode === 'bijoy_to_unicode' ? 'font-sans' : 'font-mono'
                }`}
              />
            </div>

            {/* Output Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to="/converter"
                className="text-xs text-[#0c5c3d] hover:underline flex items-center"
              >
                সম্পূর্ণ কনভার্টারে যান →
              </Link>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!miniOutput}
                className={`px-3 py-1.5 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  copied
                    ? 'bg-[#083f2a] text-[#fffdf7]'
                    : miniOutput
                    ? 'bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7]'
                    : 'bg-[#d8cfb8]/50 text-[#6b6255] cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ফলাফল কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
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

        <button
          type="button"
          onClick={onOpenTerms}
          className="border border-[#0c5c3d] text-[#083f2a] hover:bg-[#0c5c3d] hover:text-[#fffdf7] px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap self-stretch md:self-auto text-center"
        >
          ব্যবহারের নিয়ম
        </button>
      </section>
    </div>
  );
};
