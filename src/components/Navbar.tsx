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
          <Link
            to="/"
            onClick={() => handleCategoryClick('all')}
            className={`px-3 py-1.5 transition-colors font-medium ${
              location.pathname === '/' && activeCategory === 'all'
                ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                : 'text-[#6b6255] hover:text-[#083f2a]'
            }`}
          >
            হোম / সব টুলস
          </Link>
          <Link
            to="/converter"
            className={`px-3 py-1.5 transition-colors font-medium ${
              location.pathname === '/converter'
                ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                : 'text-[#6b6255] hover:text-[#083f2a]'
            }`}
          >
            বিজয় কনভার্টার
          </Link>
          <Link
            to="/photo-resizer"
            className={`px-3 py-1.5 transition-colors font-medium ${
              location.pathname === '/photo-resizer'
                ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                : 'text-[#6b6255] hover:text-[#083f2a]'
            }`}
          >
            পাসপোর্ট ও চাকরি ছবি রিসাইজার
          </Link>
          <Link
            to="/age-calculator"
            className={`px-3 py-1.5 transition-colors font-medium ${
              location.pathname === '/age-calculator'
                ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                : 'text-[#6b6255] hover:text-[#083f2a]'
            }`}
          >
            বয়স ক্যালকুলেটর
          </Link>
          <Link
            to="/amount-in-words"
            className={`px-3 py-1.5 transition-colors font-medium ${
              location.pathname === '/amount-in-words'
                ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                : 'text-[#6b6255] hover:text-[#083f2a]'
            }`}
          >
            টাকা কথায়
          </Link>
        </nav>

        {/* Right side: Engine status */}
        <div className="flex items-center text-xs text-[#0c5c3d] font-sans pl-2 border-l border-[#d8cfb8] sm:border-l-0">
          <span className="w-2 h-2 rounded-full bg-[#0c5c3d] mr-1.5"></span>
          <span className="hidden sm:inline">১০০% ক্লায়েন্ট-সাইড ও নিরাপদ</span>
          <span className="sm:hidden text-[11px] font-medium">নিরাপদ টুলস</span>
        </div>
      </div>
    </header>
  );
};
