import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ConverterPage } from './pages/ConverterPage.tsx';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f4efe4] text-[#14231c]">
        {/* Top Navbar */}
        <Navbar
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => setSelectedCategory(cat)}
                  onOpenTerms={() => setShowTermsModal(true)}
                />
              }
            />
            <Route path="/converter" element={<ConverterPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating / Direct Terms of Use Modal when triggered from Trust section */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-[#fffdf7] border border-[#d8cfb8] max-w-lg w-full p-6 relative rounded-none">
              <h3 className="text-lg font-serif font-bold text-[#083f2a] mb-2 pb-2 border-b border-[#d8cfb8]">
                ব্যবহারের নিয়ম ও তথ্যের নিরাপত্তা নির্দেশিকা
              </h3>
              <div className="text-xs sm:text-sm text-[#14231c] leading-relaxed space-y-3">
                <p>
                  <strong>১. শতভাগ ক্লায়েন্ট-সাইড প্রসেসিং:</strong> ইউটিলিক্স (Utilix.bd)-এর প্রতিটি ইউটিলিটি টুল সম্পূর্ণ ক্লায়েন্ট-সাইড মেমোরিতে পরিচালিত হয়। আপনার টাইপকৃত কোনো টেক্সট, হিসাবের তথ্য বা আপলোডকৃত ফাইল কোনো বাহ্যিক সার্ভার বা ক্লাউড স্টোরেজে জমা হয় না।
                </p>
                <p>
                  <strong>২. উন্মুক্ত ও স্বাধীন ব্যবহার:</strong> ব্যক্তিগত, শিক্ষা ও দাপ্তরিক কাজের উদ্দেশ্যে এই টুলসমূহ বিনামূল্যে ব্যবহার করা যাবে।
                </p>
                <p>
                  <strong>৩. ফলাফলের নির্ভুলতা:</strong> বাংলা যুক্তাক্ষর ও ফন্ট রূপান্তরের ক্ষেত্রে প্রচলিত সুতন্বীএমজে এবং ইউনিকোড স্ট্যান্ডার্ড সতর্কতার সাথে অনুসরণ করা হয়েছে।
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#d8cfb8] flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-1.5 bg-[#0c5c3d] text-[#fffdf7] text-xs font-medium hover:bg-[#083f2a] transition-colors cursor-pointer"
                >
                  সম্মত ও বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
