import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  Scissors,
  RotateCw,
  Trash2,
  Crop,
  FileText,
  Stamp,
  FileImage
} from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PdfToolLayoutProps {
  // SEO Props
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  schemas?: object[];

  // Header Props
  refCode: string;
  badgeText: string;
  h1: string;
  introText: string;

  // Body
  children: ReactNode;

  // SEO & FAQ
  deepDiveTitle?: string;
  deepDiveContent?: ReactNode;
  featuresTitle?: string;
  featuresGrid?: ReactNode;
  howToSteps?: Array<{ stepNum: string; title: string; desc: string }>;
  faqs?: FaqItem[];
  customFaqContent?: ReactNode;
  currentToolId: 'pdf-merger' | 'pdf-split' | 'pdf-delete-pages' | 'pdf-rotate' | 'pdf-watermark-page-number' | 'image-to-pdf';
}

export const PdfToolLayout: React.FC<PdfToolLayoutProps> = ({
  title,
  metaDescription,
  canonicalUrl,
  ogTitle,
  ogDescription,
  schemas = [],
  refCode,
  badgeText,
  h1,
  introText,
  children,
  deepDiveTitle,
  deepDiveContent,
  featuresTitle,
  featuresGrid,
  howToSteps,
  faqs,
  customFaqContent,
  currentToolId,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={ogTitle || title} />
        <meta property="og:description" content={ogDescription || metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://utilix.bd/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle || title} />
        <meta name="twitter:description" content={ogDescription || metaDescription} />
        <meta name="twitter:image" content="https://utilix.bd/og-image.png" />
        {schemas.map((schema, idx) => (
          <script key={idx} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* Top Breadcrumb & Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#d8cfb8]">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="border border-[#d8cfb8] bg-[#fffdf7] hover:bg-[#f4efe4] px-3 py-1.5 text-xs text-[#083f2a] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমপেজে ফিরুন</span>
          </Link>
          <span className="text-xs text-[#6b6255] font-mono">REF: {refCode}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-[#083f2a] bg-[#fffdf7] border border-[#d8cfb8] px-3.5 py-1.5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#0c5c3d]" />
          <span>১০০% ক্লায়েন্ট-সাইড • কোনো আপলোড নেই • সম্পূর্ণ বিনামূল্যে</span>
        </div>
      </div>

      {/* Page Heading & Intro */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-medium text-[#0c5c3d] bg-[#0c5c3d]/10 px-2.5 py-1 border border-[#0c5c3d]/20">
          <span>{badgeText}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#083f2a] font-serif tracking-tight">
          {h1}
        </h1>
        <p className="text-sm sm:text-base text-[#4a4237] max-w-4xl leading-relaxed">
          {introText}
        </p>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div>{children}</div>

      {/* Deep Dive Guide Section (if provided) */}
      {deepDiveContent && (
        <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 sm:p-8 space-y-4 leading-relaxed text-[#14231c]">
          {deepDiveTitle && (
            <div className="border-b border-[#d8cfb8] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#083f2a] font-serif">
                {deepDiveTitle}
              </h2>
            </div>
          )}
          <div className="text-xs sm:text-sm text-[#4a4237] space-y-4">
            {deepDiveContent}
          </div>
        </section>
      )}

      {/* Features Grid (if provided) */}
      {featuresGrid && (
        <section className="space-y-4">
          {featuresTitle && (
            <h2 className="text-lg sm:text-xl font-bold text-[#083f2a] font-serif flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#0c5c3d]" />
              <span>{featuresTitle}</span>
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuresGrid}
          </div>
        </section>
      )}

      {/* Step-by-Step Guide */}
      {howToSteps && howToSteps.length > 0 && (
        <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 sm:p-7 space-y-5">
          <h2 className="text-lg sm:text-xl font-bold text-[#083f2a] font-serif border-b border-[#d8cfb8] pb-3">
            ব্যবহারের সহজ নিয়মাবলী (ধাপে ধাপে)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs sm:text-sm text-[#14231c]">
            {howToSteps.map((step, idx) => (
              <div key={idx} className="border border-[#d8cfb8] p-4 bg-[#f4efe4]/30 space-y-2">
                <div className="text-xs font-mono font-bold text-[#0c5c3d] bg-[#fffdf7] border border-[#d8cfb8] w-7 h-7 flex items-center justify-center">
                  {step.stepNum}
                </div>
                <h3 className="font-bold text-[#083f2a]">{step.title}</h3>
                <p className="text-xs text-[#4a4237] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {(faqs && faqs.length > 0) || customFaqContent ? (
        <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#d8cfb8] pb-3">
            <HelpCircle className="w-5 h-5 text-[#0c5c3d]" />
            <h2 className="text-base sm:text-xl font-bold text-[#083f2a] font-serif">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQ)
            </h2>
          </div>

          {customFaqContent ? (
            customFaqContent
          ) : (
            <div className="space-y-6 text-xs sm:text-sm text-[#14231c] leading-relaxed">
              {faqs?.map((faq, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h3 className="font-bold text-[#083f2a] text-sm sm:text-base">
                    {faq.question}
                  </h3>
                  <p className="text-[#4a4237]">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {/* Cross-Link Section: "আরও দরকারি পিডিএফ ও ইউটিলিটি টুলস" */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d8cfb8] pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#0c5c3d]" />
            <h2 className="text-base sm:text-lg font-bold text-[#083f2a] font-serif">
              Utilix.bd-এর অন্যান্য দরকারি পিডিএফ ও ডকুমেন্ট টুলস
            </h2>
          </div>
          <Link
            to="/"
            className="text-xs text-[#0c5c3d] hover:text-[#083f2a] font-semibold flex items-center space-x-1"
          >
            <span>সকল টুল এক্সপ্লোর করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Tool 1: PDF Merger */}
          {currentToolId !== 'pdf-merger' && (
            <div className="border border-[#d8cfb8] bg-[#fffdf7] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-[#f4efe4] text-[#083f2a] px-2 py-0.5">
                    ডকুমেন্ট
                  </span>
                  <span className="text-[11px] font-mono text-[#6b6255]">DOC-PDF-01</span>
                </div>
                <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                  পিডিএফ মার্জার (PDF Merger)
                </h3>
                <p className="text-[#4a4237] leading-relaxed">
                  একাধিক পিডিএফ ফাইলকে একটি একক ফাইলে ক্রমানুসারে মার্জ ও সাজান। কোনো পেজ লিমিট নেই।
                </p>
              </div>
              <Link
                to="/pdf-merger"
                className="inline-flex items-center justify-center px-3 py-2 bg-[#f4efe4] text-[#083f2a] font-medium hover:bg-[#d8cfb8] transition-colors border border-[#d8cfb8]"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
                <span>মার্জারে যান</span>
              </Link>
            </div>
          )}

          {/* Tool 2: PDF Splitter */}
          {currentToolId !== 'pdf-split' && (
            <div className="border border-[#d8cfb8] bg-[#fffdf7] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-[#f4efe4] text-[#083f2a] px-2 py-0.5">
                    ডকুমেন্ট
                  </span>
                  <span className="text-[11px] font-mono text-[#6b6255]">DOC-PDF-02</span>
                </div>
                <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                  পিডিএফ স্প্লিটার (PDF Splitter)
                </h3>
                <p className="text-[#4a4237] leading-relaxed">
                  নির্দিষ্ট পেজ রেঞ্জ আলাদা করুন অথবা প্রতি পেজকে আলাদা পিডিএফ করে ZIP ডাউনলোড করুন।
                </p>
              </div>
              <Link
                to="/pdf-split"
                className="inline-flex items-center justify-center px-3 py-2 bg-[#f4efe4] text-[#083f2a] font-medium hover:bg-[#d8cfb8] transition-colors border border-[#d8cfb8]"
              >
                <Scissors className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
                <span>স্প্লিটারে যান</span>
              </Link>
            </div>
          )}

          {/* Tool 3: PDF Delete Pages */}
          {currentToolId !== 'pdf-delete-pages' && (
            <div className="border border-[#d8cfb8] bg-[#fffdf7] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-[#f4efe4] text-[#083f2a] px-2 py-0.5">
                    ডকুমেন্ট
                  </span>
                  <span className="text-[11px] font-mono text-[#6b6255]">DOC-PDF-03</span>
                </div>
                <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                  পিডিএফ পেজ ডিলিট (Delete Pages)
                </h3>
                <p className="text-[#4a4237] leading-relaxed">
                  অপ্রয়োজনীয় বা অতিরিক্ত পৃষ্ঠাগুলো সিলেক্ট করে এক ক্লিকে বাদ দিন এবং পরিষ্কার ফাইল নিন।
                </p>
              </div>
              <Link
                to="/pdf-delete-pages"
                className="inline-flex items-center justify-center px-3 py-2 bg-[#f4efe4] text-[#083f2a] font-medium hover:bg-[#d8cfb8] transition-colors border border-[#d8cfb8]"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
                <span>পেজ মুছুন</span>
              </Link>
            </div>
          )}

          {/* Tool 4: PDF Rotate */}
          {currentToolId !== 'pdf-rotate' && (
            <div className="border border-[#d8cfb8] bg-[#fffdf7] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-[#f4efe4] text-[#083f2a] px-2 py-0.5">
                    ডকুমেন্ট
                  </span>
                  <span className="text-[11px] font-mono text-[#6b6255]">DOC-PDF-04</span>
                </div>
                <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                  পিডিএফ রোটেট (PDF Rotate)
                </h3>
                <p className="text-[#4a4237] leading-relaxed">
                  স্ক্যান করা উল্টো বা বাঁকা পিডিএফ পৃষ্ঠাগুলোকে ৯০° বা ১৮০° ঘুরিয়ে সোজা ও দৃষ্টিগোচর করুন।
                </p>
              </div>
              <Link
                to="/pdf-rotate"
                className="inline-flex items-center justify-center px-3 py-2 bg-[#f4efe4] text-[#083f2a] font-medium hover:bg-[#d8cfb8] transition-colors border border-[#d8cfb8]"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
                <span>রোটেটরে যান</span>
              </Link>
            </div>
          )}

          {/* Tool 5: PDF Watermark & Page Number */}
          {currentToolId !== 'pdf-watermark-page-number' && (
            <div className="border border-[#d8cfb8] bg-[#fffdf7] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-[#f4efe4] text-[#083f2a] px-2 py-0.5">
                    ডকুমেন্ট
                  </span>
                  <span className="text-[11px] font-mono text-[#6b6255]">DOC-PDF-05</span>
                </div>
                <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                  পিডিএফ ওয়াটারমার্ক ও পেজ নম্বর
                </h3>
                <p className="text-[#4a4237] leading-relaxed">
                  ডকুমেন্টে টেক্সট বা লোগো ওয়াটারমার্ক এবং পৃষ্ঠা নম্বর (বাংলা/ইংরেজি) বসিয়ে ফাইল সুরক্ষিত করুন।
                </p>
              </div>
              <Link
                to="/pdf-watermark-page-number"
                className="inline-flex items-center justify-center px-3 py-2 bg-[#f4efe4] text-[#083f2a] font-medium hover:bg-[#d8cfb8] transition-colors border border-[#d8cfb8]"
              >
                <Stamp className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
                <span>ওয়াটারমার্ক টুলে যান</span>
              </Link>
            </div>
          )}

          {/* Tool 6: Image to PDF Converter */}
          {currentToolId !== 'image-to-pdf' && (
            <div className="border border-[#d8cfb8] bg-[#fffdf7] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-[#f4efe4] text-[#083f2a] px-2 py-0.5">
                    ডকুমেন্ট
                  </span>
                  <span className="text-[11px] font-mono text-[#6b6255]">DOC-PDF-06</span>
                </div>
                <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                  ইমেজ টু PDF কনভার্টার
                </h3>
                <p className="text-[#4a4237] leading-relaxed">
                  একাধিক ছবি (JPG/PNG/WebP) থেকে সহজে A4 বা কাস্টম সাইজের গোছানো PDF ডকুমেন্ট তৈরি করুন।
                </p>
              </div>
              <Link
                to="/image-to-pdf"
                className="inline-flex items-center justify-center px-3 py-2 bg-[#f4efe4] text-[#083f2a] font-medium hover:bg-[#d8cfb8] transition-colors border border-[#d8cfb8]"
              >
                <FileImage className="w-3.5 h-3.5 mr-1.5 text-[#0c5c3d]" />
                <span>ইমেজ টু PDF এ যান</span>
              </Link>
            </div>
          )}

          {/* Additional related: Photo Resizer or CV Builder */}
          <div className="border border-[#0c5c3d]/20 bg-[#0c5c3d]/5 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-[#0c5c3d] text-[#fffdf7] px-2 py-0.5">
                  ফিচার্ড
                </span>
                <span className="text-[11px] font-mono text-[#6b6255]">IMG-GOV-02</span>
              </div>
              <h3 className="font-bold text-[#083f2a] font-serif text-sm">
                ছবি ও স্বাক্ষর রিসাইজার
              </h3>
              <p className="text-[#4a4237] leading-relaxed">
                সরকারি ও বিসিএস আবেদনের জন্য ৩০০×৩০০ ছবি এবং ৩০০×৮০ স্বাক্ষর নিখুঁত ক্রপ ও অপ্টিমাইজেশন।
              </p>
            </div>
            <Link
              to="/photo-resizer"
              className="inline-flex items-center justify-center px-3 py-2 bg-[#0c5c3d] text-[#fffdf7] font-medium hover:bg-[#083f2a] transition-colors"
            >
              <Crop className="w-3.5 h-3.5 mr-1.5" />
              <span>ছবি রিসাইজার</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
