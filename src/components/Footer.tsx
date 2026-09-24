import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, FileText, CheckCircle2, Image as ImageIcon, FileBox, Calculator, HelpCircle } from 'lucide-react';
import { TOOLS } from '../data/tools.ts';
import { toBn } from '../utils/bnDigits.ts';
import { UtoolsLogo } from './UtoolsLogo';
import footerContent from '../../content/global/footer.json';

const linkClass =
  'flex items-center group text-white/60 hover:text-[#F5A524] transition-colors';
const dotClass =
  'w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#F5A524] mr-2 shrink-0 transition-colors';

export const Footer: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  const imageTools = footerContent.imageTools;
  const pdfDocumentTools = footerContent.pdfDocumentTools;
  const textCalcTools = footerContent.textCalcTools;
  const importantLinks = footerContent.importantLinks;

  return (
    <>
      <footer data-cursor-theme="dark" className="relative z-10 w-full mt-20 bg-[#0F1F17] text-white/60 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 sm:pb-8">
          {/* Brand row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <UtoolsLogo className="w-8 h-8 shrink-0" variant="reversed" />
                <span className="text-lg font-bold text-white font-latin">
                  Utools<span className="text-[#F5A524]">.bd</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 bg-white/10 text-white/80 font-semibold rounded-full">
                  {toBn(TOOLS.length)}টি ফ্রি টুলস
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {footerContent.brandDescription}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#E6F4EC] bg-white/[0.07] border border-white/10 px-3.5 py-2 shrink-0 self-start md:self-auto rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#F5A524] shrink-0" />
              <span className="font-medium">{footerContent.privacyBadge}</span>
            </div>
          </div>

          {/* Categorized link grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 border-b border-white/10">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <ImageIcon className="w-4 h-4 text-[#F5A524] shrink-0" />
                <h3 className="text-sm font-semibold font-serif">{footerContent.imageToolsHeading}</h3>
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
                <h3 className="text-sm font-semibold font-serif">{footerContent.pdfDocumentHeading}</h3>
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
                <h3 className="text-sm font-semibold font-serif">{footerContent.textCalcHeading}</h3>
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
                <h3 className="text-sm font-semibold font-serif">{footerContent.importantLinksHeading}</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {importantLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      <span className={dotClass}></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className={`${linkClass} text-left cursor-pointer`}
                  >
                    <span className={dotClass}></span>
                    <span>{footerContent.termsLabel}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-3 sm:pr-20">
            <p>© {new Date().getFullYear()} Utools.bd — {footerContent.copyrightText}</p>
            <p>{footerContent.slogan}</p>
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
