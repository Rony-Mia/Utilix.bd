import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeCategory = 'all', onSelectCategory }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  return (
    <header className="w-full bg-[#f4efe4] border-b border-[#d8cfb8] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Tagline */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold tracking-tight text-[#083f2a] font-serif hover:text-[#0c5c3d] transition-colors">
              Utilix.bd
            </span>
          </Link>
          <span className="text-[#d8cfb8] hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm text-[#6b6255] hidden sm:inline-block font-sans">
            বাংলা ডিজিটাল ইউটিলিটি হাব
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm">
          {isHome ? (
            <>
              <button
                type="button"
                onClick={() => handleCategoryClick('all')}
                className={`px-3 py-1.5 transition-colors font-medium cursor-pointer ${
                  activeCategory === 'all'
                    ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                সব টুলস
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('text')}
                className={`px-3 py-1.5 transition-colors font-medium cursor-pointer ${
                  activeCategory === 'text'
                    ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                টেক্সট টুলস
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('image')}
                className={`px-3 py-1.5 transition-colors font-medium cursor-pointer ${
                  activeCategory === 'image'
                    ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                ইমেজ টুলস
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('calc')}
                className={`px-3 py-1.5 transition-colors font-medium cursor-pointer ${
                  activeCategory === 'calc'
                    ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                হিসাব ও ক্যালকুলেটর
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="px-3 py-1.5 text-[#6b6255] hover:text-[#083f2a] transition-colors font-medium"
              >
                সব টুলস
              </Link>
              <Link
                to="/converter"
                className="px-3 py-1.5 text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold transition-colors"
              >
                টেক্সট টুলস (কনভার্টার)
              </Link>
              <Link
                to="/"
                className="px-3 py-1.5 text-[#6b6255] hover:text-[#083f2a] transition-colors font-medium"
              >
                ইমেজ টুলস
              </Link>
              <Link
                to="/"
                className="px-3 py-1.5 text-[#6b6255] hover:text-[#083f2a] transition-colors font-medium"
              >
                হিসাব ও ক্যালকুলেটর
              </Link>
            </>
          )}
        </nav>

        {/* Right side: Browser processing status */}
        <div className="flex items-center text-xs text-[#0c5c3d] font-sans pl-2 border-l border-[#d8cfb8] sm:border-l-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#0c5c3d] mr-2 shrink-0 animate-pulse"></span>
          <span className="hidden sm:inline">সম্পূর্ণ ব্রাউজার-ভিত্তিক, আপনার ডেটা সার্ভারে যায় না</span>
          <span className="sm:hidden text-[11px] font-medium">ব্রাউজার-ভিত্তিক প্রসেসিং</span>
        </div>
      </div>
    </header>
  );
};
