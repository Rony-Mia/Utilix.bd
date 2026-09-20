import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, X, Mail, FileText, ArrowRight, CheckCircle2, Image as ImageIcon, FileBox, Calculator, HelpCircle } from 'lucide-react';

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
  ];

  return (
    <>
      <footer className="w-full border-t border-[#d8cfb8] bg-[#f4efe4] mt-20 text-[#6b6255] text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Top Brand Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-[#d8cfb8] gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-[#083f2a] font-serif">
                  Utilix.bd — ইউটিলিক্স
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#e5dec9] text-[#083f2a] font-bold rounded-none border border-[#d8cfb8]">
                  ১৫+ ফ্রি টুলস
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4a4237] leading-relaxed">
                বাংলা ডিজিটাল ইউটিলিটি হাব — বাংলাদেশি চাকরিপ্রার্থী, শিক্ষার্থী, প্রফেশনাল ও সাধারণ মানুষের জন্য সম্পূর্ণ ফ্রি, নিরাপদ ও ব্রাউজার-ভিত্তিক ডিজিটাল টুলবক্স।
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#0c5c3d] bg-[#f9f6ef] border border-[#d8cfb8] px-3.5 py-2 shrink-0 self-start md:self-auto">
              <CheckCircle2 className="w-4 h-4 text-[#0c5c3d] shrink-0" />
              <span className="font-medium">১০০% ক্লায়েন্ট-সাইড প্রসেসিং • কোনো ফাইল সার্ভারে যায় না</span>
            </div>
          </div>

          {/* Categorized Mega-Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 border-b border-[#d8cfb8]">
            {/* Category 1: Image & Photo Tools */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-[#083f2a]">
                <ImageIcon className="w-4 h-4 text-[#0c5c3d] shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif">
                  ইমেজ ও ফটো টুলস
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                {imageTools.map((tool) => (
                  <li key={tool.to}>
                    <Link
                      to={tool.to}
                      className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                      <span className="leading-snug">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category 2: PDF & Document Tools */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-[#083f2a]">
                <FileBox className="w-4 h-4 text-[#0c5c3d] shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif">
                  পিডিএফ ও ডকুমেন্ট
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                {pdfDocumentTools.map((tool) => (
                  <li key={tool.to}>
                    <Link
                      to={tool.to}
                      className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                      <span className="leading-snug">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category 3: Text & Calculators */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-[#083f2a]">
                <Calculator className="w-4 h-4 text-[#0c5c3d] shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif">
                  টেক্সট ও হিসাব
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                {textCalcTools.map((tool) => (
                  <li key={tool.to}>
                    <Link
                      to={tool.to}
                      className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                      <span className="leading-snug">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category 4: Important Crawlable Links & Support */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-[#083f2a]">
                <HelpCircle className="w-4 h-4 text-[#0c5c3d] shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif">
                  গুরুত্বপূর্ণ লিংক
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                    <span>আমাদের সম্পর্কে (About Us)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                    <span>গোপনীয়তা নীতি (Privacy Policy)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                    <span>যোগাযোগ ও প্রতিক্রিয়া (Contact)</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="hover:text-[#083f2a] hover:underline transition-colors flex items-center group text-[#4a4237] text-left cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d8cfb8] group-hover:bg-[#0c5c3d] mr-2 shrink-0 transition-colors"></span>
                    <span>ব্যবহারের শর্তাবলী (Terms)</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b6255] gap-3">
            <p>© {new Date().getFullYear()} Utilix.bd — সর্বস্বত্ব সংরক্ষিত। সম্পূর্ণ ব্রাউজার-ভিত্তিক ও অফলাইন প্রস্তুত।</p>
            <p className="font-sans text-[#083f2a] font-medium">দ্রুত, নিরাপদ ও নির্ভরযোগ্য বাংলা অনলাইন টুলবক্স</p>
          </div>
        </div>
      </footer>

      {/* Terms of Use Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[#fffdf7] border border-[#d8cfb8] max-w-lg w-full p-6 relative rounded-none shadow-xl">
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-[#6b6255] hover:text-[#083f2a] p-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#083f2a]">
                <FileText className="w-5 h-5 text-[#0c5c3d]" />
                <h3 className="text-lg font-serif font-bold">ব্যবহারের নিয়ম ও শর্তাবলী (Terms of Use)</h3>
              </div>
              <div className="text-xs sm:text-sm text-[#14231c] leading-relaxed space-y-2 border-t border-[#d8cfb8] pt-3">
                <p>
                  Utilix.bd-এর প্রতিটি ইউটিলিটি টুল বাংলা টেক্সট রূপান্তর, ছবি সাইজিং ও গণনার কাজে সার্বজনীন সহায়তার উদ্দেশ্যে সরবরাহ করা হয়েছে।
                </p>
                <p>
                  ১. রূপান্তরের ফলাফল সম্পূর্ণ ক্লায়েন্ট-সাইড অ্যালগরিদমের মাধ্যমে উৎপন্ন হয়। অফিসিয়াল বা গুরুত্বপূর্ণ নথিতে ব্যবহারের পূর্বে ফলাফল নিরীক্ষা করে নেওয়ার পরামর্শ দেওয়া হয়।
                </p>
                <p>
                  ২. ইউটিলিক্স ব্যবহার ব্যক্তিগত, প্রাতিষ্ঠানিক ও বাণিজ্যিক কাজের জন্য সম্পূর্ণ বিনামূল্যে উন্মুক্ত।
                </p>
                <p>
                  ৩. আপনার ডেটার নিরাপত্তা সম্পূর্ণ নিশ্চিত কারণ কোনো তথ্য কোনো সার্ভারে স্থানান্তরিত হয় না।
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#d8cfb8] flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-1.5 bg-[#0c5c3d] text-[#fffdf7] text-xs font-medium hover:bg-[#083f2a] transition-colors cursor-pointer"
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
