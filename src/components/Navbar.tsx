import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const NAV_ITEMS: { to: string; label: string; category?: string }[] = [
  { to: '/', label: 'হোম / সব টুলস', category: 'all' },
  { to: '/converter', label: 'বিজয় কনভার্টার' },
  { to: '/photo-resizer', label: 'পাসপোর্ট ও চাকরি ছবি রিসাইজার' },
  { to: '/age-calculator', label: 'বয়স ক্যালকুলেটর' },
  { to: '/amount-in-words', label: 'টাকা কথায়' }
];

export const Navbar: React.FC<NavbarProps> = ({ activeCategory = 'all', onSelectCategory }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (item: { to: string; category?: string }) =>
    item.to === '/'
      ? location.pathname === '/' && activeCategory === 'all'
      : location.pathname === item.to;

  const handleNavClick = (item: { category?: string }) => {
    if (item.category && onSelectCategory) {
      onSelectCategory(item.category);
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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => handleNavClick(item)}
              className={`px-3 py-1.5 transition-colors font-medium ${
                isActive(item)
                  ? 'text-[#083f2a] border-b-2 border-[#0c5c3d] font-semibold'
                  : 'text-[#6b6255] hover:text-[#083f2a]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {/* Right side: Engine status */}
          <div className="flex items-center text-xs text-[#0c5c3d] font-sans pl-2 border-l border-[#d8cfb8] sm:border-l-0">
            <span className="w-2 h-2 rounded-full bg-[#0c5c3d] mr-1.5"></span>
            <span className="hidden sm:inline">১০০% ক্লায়েন্ট-সাইড ও নিরাপদ</span>
            <span className="sm:hidden text-[11px] font-medium">নিরাপদ টুলস</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            className="md:hidden ml-3 p-2 -mr-2 text-[#083f2a] hover:bg-[#e8e0cc] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-nav" className="md:hidden border-t border-[#d8cfb8] bg-[#fffdf7]">
          <ul className="max-w-7xl mx-auto px-4 sm:px-6 py-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => handleNavClick(item)}
                  className={`block px-2 py-3 border-b border-[#efe8d6] last:border-b-0 font-medium ${
                    isActive(item) ? 'text-[#083f2a] font-semibold' : 'text-[#6b6255]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
