import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, FileText, CheckCircle2, Image as ImageIcon, FileBox, Calculator, HelpCircle } from 'lucide-react';
import { TOOLS } from '../data/tools.ts';
import { toBn } from '../utils/bnDigits.ts';
import { UtoolsLogo } from './UtoolsLogo';

const linkClass =
  'flex items-center group text-white/60 hover:text-[#F5A524] transition-colors';
const dotClass =
  'w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#F5A524] mr-2 shrink-0 transition-colors';

export const Footer: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  const imageTools = [
    { to: '/photo-resizer', label: 'পাসপোর্ট ও সরকারি ছবি রিসাইজার' },
    { to: '/bulk-photo-resizer', label: 'বাল্ক ফটো রিসাইজার (Bulk Resizer)' },
    { to: '/heic-converter', label: 'HEIC → JPG/PNG কনভার্টার' },
    { to: '/background-remover', label: 'AI ব্যাকগ্রাউন্ড রিমুভার' },
    { to: '/image-merger', label: 'ইমেজ মার্জার ও কোলাজ মেকার' },
    { to: '/qr-generator', label: 'কাস্টম QR কোড জেনারেটর' },
  ];

  const pdfDocumentTools = [
    { to: '/pdf-merger', label: 'পিডিএফ মার্জার (PDF Merger)' },
    { to: '/pdf-split', label: 'পিডিএফ স্প্লিটার (PDF Splitter)' },
    { to: '/pdf-delete-pages', label: 'পিডিএফ পেজ ডিলিট' },
    { to: '/pdf-rotate', label: 'পিডিএফ রোটেট (Rotate Pages)' },
    { to: '/pdf-watermark-page-number', label: 'পিডিএফ ওয়াটারমার্ক ও পেজ নম্বর' },
    { to: '/cv-builder', label: 'সিভি ও জীবনবৃত্তান্ত মেকার (CV)' },
  ];

  const textCalcTools = [
    { to: '/converter', label: 'বিজয় ↔ ইউনিকোড কনভার্টার' },
    { to: '/age-calculator', label: 'সরকারি চাকরির বয়স ক্যালকুলেটর' },
    { to: '/amount-in-words', label: 'টাকা → কথায় কনভার্টার' },
    { to: '/gpa-calculator', label: 'জিপিএ ও সিজিপিএ ক্যালকুলেটর' },
    { to: '/land-converter', label: 'জমির মাপ কনভার্টার' },
  ];

  return (
    <>
      <footer data-cursor-theme="dark" className="relative z-10 w-full mt-20 bg-[#0F1F17] text-white/60 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 sm:pb-8">
          {/* Brand row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <UtoolsLogo className="w-8 h-8 shrink-0" withBackground />
                <span className="text-lg font-bold text-white font-latin">
                  Utools<span className="text-[#F5A524]">.bd</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 bg-white/10 text-white/80 font-semibold rounded-full">
                  {toBn(TOOLS.length)}টি ফ্রি টুলস
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                বাংলা ডিজিটাল ইউটিলিটি হাব — বাংলাদেশি চাকরিপ্রার্থী, শিক্ষার্থী, প্রফেশনাল ও সাধারণ মানুষের জন্য সম্পূর্ণ ফ্রি, নিরাপদ ও ব্রাউজার-ভিত্তিক ডিজিটাল টুলবক্স।
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#E6F4EC] bg-white/[0.07] border border-white/10 px-3.5 py-2 shrink-0 self-start md:self-auto rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#F5A524] shrink-0" />
              <span className="font-medium">১০০% ক্লায়েন্ট-সাইড প্রসেসিং • কোনো ফাইল সার্ভারে যায় না</span>
            </div>
          </div>

          {/* Categorized link grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 border-b border-white/10">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <ImageIcon className="w-4 h-4 text-[#F5A524] shrink-0" />
                <h3 className="text-sm font-semibold font-serif">ইমেজ ও ফটো টুলস</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {imageTools.map((tool) => (
                  <li key={tool.to}>
                    <Link to={tool.to} className={linkClass}>
                      <span className={dotClass}></span>
                      <span className="leading-snug">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <FileBox className="w-4 h-4 text-[#F5A524] shrink-0" />
                <h3 className="text-sm font-semibold font-serif">পিডিএফ ও ডকুমেন্ট</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {pdfDocumentTools.map((tool) => (
                  <li key={tool.to}>
                    <Link to={tool.to} className={linkClass}>
                      <span className={dotClass}></span>
                      <span className="leading-snug">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <Calculator className="w-4 h-4 text-[#F5A524] shrink-0" />
                <h3 className="text-sm font-semibold font-serif">টেক্সট ও হিসাব</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {textCalcTools.map((tool) => (
                  <li key={tool.to}>
                    <Link to={tool.to} className={linkClass}>
                      <span className={dotClass}></span>
                      <span className="leading-snug">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important links & support */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <HelpCircle className="w-4 h-4 text-[#F5A524] shrink-0" />
                <h3 className="text-sm font-semibold font-serif">গুরুত্বপূর্ণ লিংক</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className={linkClass}>
                    <span className={dotClass}></span>
                    <span>আমাদের সম্পর্কে (About Us)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className={linkClass}>
                    <span className={dotClass}></span>
                    <span>গোপনীয়তা নীতি (Privacy Policy)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={linkClass}>
                    <span className={dotClass}></span>
                    <span>যোগাযোগ ও প্রতিক্রিয়া (Contact)</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className={`${linkClass} text-left cursor-pointer`}
                  >
                    <span className={dotClass}></span>
                    <span>ব্যবহারের শর্তাবলী (Terms)</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-3 sm:pr-20">
            <p>© {new Date().getFullYear()} Utools.bd — সর্বস্বত্ব সংরক্ষিত। সম্পূর্ণ ব্রাউজার-ভিত্তিক ও অফলাইন প্রস্তুত।</p>
            <p>দ্রুত, নিরাপদ ও নির্ভরযোগ্য বাংলা অনলাইন টুলবক্স</p>
          </div>
        </div>
      </footer>

      {/* Terms of Use Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F17]/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ব্যবহারের নিয়ম ও শর্তাবলী"
        >
          <div className="bg-white border border-[#D5E4DB] max-w-lg w-full p-6 relative rounded-2xl shadow-[0_24px_64px_rgba(11,93,59,0.18)] text-[#0F1F17]">
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-[#4A5A52] hover:text-[#084A2E] p-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#084A2E]">
                <FileText className="w-5 h-5 text-[#0B5D3B]" />
                <h3 className="text-lg font-serif font-bold">ব্যবহারের নিয়ম ও শর্তাবলী (Terms of Use)</h3>
              </div>
              <div className="text-xs sm:text-sm text-[#0F1F17] leading-relaxed space-y-2 border-t border-[#D5E4DB] pt-3">
                <p>
                  Utools.bd-এর প্রতিটি ইউটিলিটি টুল বাংলা টেক্সট রূপান্তর, ছবি সাইজিং ও গণনার কাজে সার্বজনীন সহায়তার উদ্দেশ্যে সরবরাহ করা হয়েছে।
                </p>
                <p>
                  ১. রূপান্তরের ফলাফল সম্পূর্ণ ক্লায়েন্ট-সাইড অ্যালগরিদমের মাধ্যমে উৎপন্ন হয়। অফিসিয়াল বা গুরুত্বপূর্ণ নথিতে ব্যবহারের পূর্বে ফলাফল নিরীক্ষা করে নেওয়ার পরামর্শ দেওয়া হয়।
                </p>
                <p>
                  ২. ইউটুলস ব্যবহার ব্যক্তিগত, প্রাতিষ্ঠানিক ও বাণিজ্যিক কাজের জন্য সম্পূর্ণ বিনামূল্যে উন্মুক্ত।
                </p>
                <p>
                  ৩. আপনার ডেটার নিরাপত্তা সম্পূর্ণ নিশ্চিত কারণ কোনো তথ্য কোনো সার্ভারে স্থানান্তরিত হয় না।
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#D5E4DB] flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-[#0B5D3B] text-white text-sm font-medium hover:bg-[#084A2E] transition-colors cursor-pointer"
              >
                বুঝেছি, বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
