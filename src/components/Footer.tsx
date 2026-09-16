import React, { useState } from 'react';
import { Shield, X, Mail, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | 'contact' | null>(null);

  return (
    <>
      <footer className="w-full border-t border-[#d8cfb8] bg-[#f4efe4] mt-20 text-[#6b6255] text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#d8cfb8]">
            {/* Brand & Tagline */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#083f2a] font-serif">Utilix.bd — ইউটিলিক্স</span>
              </div>
              <p className="text-xs text-[#6b6255] mt-1 font-sans">
                বাংলা ডিজিটাল ইউটিলিটি হাব • সর্বস্বত্ব সংরক্ষিত
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setModalType('privacy')}
                className="hover:text-[#083f2a] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                গোপনীয়তা নীতি
              </button>
              <span className="text-[#d8cfb8]">•</span>
              <button
                type="button"
                onClick={() => setModalType('terms')}
                className="hover:text-[#083f2a] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                শর্তাবলী
              </button>
              <span className="text-[#d8cfb8]">•</span>
              <button
                type="button"
                onClick={() => setModalType('contact')}
                className="hover:text-[#083f2a] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                যোগাযোগ
              </button>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b6255]">
            <p>© Utilix.bd — সম্পূর্ণ ব্রাউজার-ভিত্তিক, আপনার ডেটা সার্ভারে যায় না</p>
            <p className="mt-2 sm:mt-0 font-sans">দ্রুত ও নির্ভরযোগ্য বাংলা টেক্সট প্রসেসিং</p>
          </div>
        </div>
      </footer>

      {/* Reusable Modal for Terms, Privacy, Contact */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[#fffdf7] border border-[#d8cfb8] max-w-lg w-full p-6 relative rounded-none">
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-[#6b6255] hover:text-[#083f2a] p-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'privacy' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#083f2a]">
                  <Shield className="w-5 h-5 text-[#0c5c3d]" />
                  <h3 className="text-lg font-serif font-bold">গোপনীয়তা নীতি (Privacy Policy)</h3>
                </div>
                <div className="text-xs sm:text-sm text-[#14231c] leading-relaxed space-y-2 border-t border-[#d8cfb8] pt-3">
                  <p>
                    Utilix.bd ব্যবহারকারীর তথ্যের সর্বোচ্চ গোপনীয়তা নিশ্চিত করতে ডিজাইন করা হয়েছে।
                  </p>
                  <p>
                    • আমাদের সিস্টেমে কোনো অ্যাকাউন্ট তৈরির বাধ্যবাধকতা নেই।
                  </p>
                  <p>
                    • ইনপুট করা টেক্সট বা ফাইল আপনার নিজস্ব ব্রাউজারের জাভাস্ক্রিপ্ট র‍্যামে প্রক্রিয়া করা হয়।
                  </p>
                  <p>
                    • কোনো তথ্য বাহ্যিক ডেটাবেজে প্রেরণ, লগ বা সংরক্ষণ করা হয় না।
                  </p>
                </div>
              </div>
            )}

            {modalType === 'terms' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#083f2a]">
                  <FileText className="w-5 h-5 text-[#0c5c3d]" />
                  <h3 className="text-lg font-serif font-bold">ব্যবহারের নিয়ম ও শর্তাবলী (Terms of Use)</h3>
                </div>
                <div className="text-xs sm:text-sm text-[#14231c] leading-relaxed space-y-2 border-t border-[#d8cfb8] pt-3">
                  <p>
                    Utilix.bd-এর প্রতিটি ইউটিলিটি টুল বাংলা টেক্সট রূপান্তর ও গণনার কাজে সার্বজনীন সহায়তার উদ্দেশ্যে সরবরাহ করা হয়েছে।
                  </p>
                  <p>
                    ১. রূপান্তরের ফলাফল সম্পূর্ণ স্বয়ংক্রিয় অ্যালগরিদমের মাধ্যমে উৎপন্ন হয়। অফিসিয়াল বা গুরুত্বপূর্ণ নথিতে ব্যবহারের পূর্বে ফলাফল একবার নিরীক্ষা করে নেওয়ার পরামর্শ দেওয়া হয়।
                  </p>
                  <p>
                    ২. ইউটিলিক্স ব্যবহার সম্পূর্ণ ব্যক্তিগত ও বাণিজ্যিক কাজের জন্য উন্মুক্ত।
                  </p>
                </div>
              </div>
            )}

            {modalType === 'contact' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#083f2a]">
                  <Mail className="w-5 h-5 text-[#0c5c3d]" />
                  <h3 className="text-lg font-serif font-bold">যোগাযোগ (Contact)</h3>
                </div>
                <div className="text-xs sm:text-sm text-[#14231c] leading-relaxed space-y-2 border-t border-[#d8cfb8] pt-3">
                  <p>
                    Utilix.bd সম্পর্কে যেকোনো মতামত, ভুলত্রুটি সংশোধন বা নতুন টুল প্রস্তাবনার জন্য যোগাযোগ করতে পারেন:
                  </p>
                  <p className="font-mono text-[#0c5c3d] bg-[#f4efe4] p-2 border border-[#d8cfb8]">
                    contact@utilix.bd
                  </p>
                  <p className="text-xs text-[#6b6255]">
                    আমরা নিয়মিত ব্যবহারকারীদের মতামত পর্যালোচনা করে থাকি।
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-[#d8cfb8] flex justify-end">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-[#0c5c3d] text-[#fffdf7] text-xs font-medium hover:bg-[#083f2a] transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
