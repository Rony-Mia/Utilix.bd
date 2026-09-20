import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { TOOLS } from '../data/tools.ts';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

interface ToolLinkItem {
  to: string;
  label: string;
  description?: string;
}

interface NavCategory {
  id: string;
  label: string;
  categoryKey: string;
  items: ToolLinkItem[];
}

const CATEGORIES: NavCategory[] = [
  {
    id: 'text-tools',
    label: 'টেক্সট টুলস',
    categoryKey: 'text',
    items: [
      {
        to: '/converter',
        label: 'বিজয় ↔ ইউনিকোড কনভার্টার',
        description: 'সুতন্বীএমজে ও ইউনিকোড ফন্ট রূপান্তর',
      },
    ],
  },
  {
    id: 'image-tools',
    label: 'ইমেজ টুলস',
    categoryKey: 'image',
    items: [
      {
        to: '/photo-resizer',
        label: 'পাসপোর্ট ও চাকরির ছবি রিসাইজার',
        description: '৩০০×৩০০ ছবি ও ৩০০×৮০ স্বাক্ষর রিসাইজ',
      },
      {
        to: '/image-merger',
        label: 'ইমেজ মার্জার ও কোলাজ মেকার',
        description: 'A4 প্রিন্ট লেআউট, গ্রিড কোলাজ ও PDF',
      },
    ],
  },
  {
    id: 'calculator-tools',
    label: 'হিসাব ও ক্যালকুলেটর',
    categoryKey: 'calculator',
    items: [
      {
        to: '/age-calculator',
        label: 'বয়স ক্যালকুলেটর',
        description: 'চাকরির আবেদনের বয়স ও কোটা যাচাই',
      },
      {
        to: '/amount-in-words',
        label: 'টাকা কথায় রূপান্তরক',
        description: 'চেক ও দলিলের টাকার কথায় রূপান্তর',
      },
      {
        to: '/gpa-calculator',
        label: 'জিপিএ ও সিজিপিএ ক্যালকুলেটর',
        description: 'এসএসসি, এইচএসসি ও ভার্সিটি সিজিপিএ হিসাব',
      },
    ],
  },
  {
    id: 'document-tools',
    label: 'সিভি ও ডকুমেন্ট',
    categoryKey: 'document',
    items: [
      {
        to: '/pdf-merger',
        label: 'পিডিএফ মার্জার',
        description: 'একাধিক PDF ফাইল একত্র ও ফ্রি মার্জ',
      },
      {
        to: '/pdf-split',
        label: 'পিডিএফ স্প্লিটার',
        description: 'পেজ রেঞ্জ বা একক পেজে ভাগ ও ZIP ডাউনলোড',
      },
      {
        to: '/pdf-delete-pages',
        label: 'পিডিএফ পেজ ডিলিট',
        description: 'অপ্রয়োজনীয় বা অতিরিক্ত পৃষ্ঠা বাদ দিন',
      },
      {
        to: '/pdf-rotate',
        label: 'পিডিএফ রোটেট',
        description: 'উল্টো বা বাঁকা পৃষ্ঠা ৯০° বা ১৮০° ঘোরান',
      },
      {
        to: '/pdf-watermark-page-number',
        label: 'পিডিএফ ওয়াটারমার্ক ও পেজ নম্বর',
        description: 'কাস্টম টেক্সট/লোগো স্ট্যাম্প ও পৃষ্ঠা নম্বর যোগ',
      },
      {
        to: '/cv-builder',
        label: 'সিভি ও জীবনবৃত্তান্ত মেকার',
        description: 'সরকারি ও কর্পোরেট চাকরির ৫টি ফরম্যাটে CV তৈরি',
      },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onSelectCategory }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    'text-tools': true,
    'image-tools': true,
    'calculator-tools': true,
    'document-tools': true,
  });

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live filtered tools for header search
  const filteredNavTools = searchQuery.trim()
    ? TOOLS.filter((tool) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          tool.title.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.feature.toLowerCase().includes(q) ||
          (tool.refCode && tool.refCode.toLowerCase().includes(q))
        );
      })
    : [];

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdownId(null);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Click outside and escape key handling for desktop dropdowns & search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const isHomeActive = location.pathname === '/';

  const isCategoryActive = (cat: NavCategory) => {
    return cat.items.some((item) => location.pathname === item.to);
  };

  const isItemActive = (itemTo: string) => location.pathname === itemTo;

  // Desktop hover interactions with delay
  const handleMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdownId(id);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 180);
  };

  const handleCategoryClick = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleLinkClick = (categoryKey?: string) => {
    setOpenDropdownId(null);
    setMobileMenuOpen(false);
    if (categoryKey && onSelectCategory) {
      onSelectCategory(categoryKey);
    }
  };

  const toggleMobileCategory = (id: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <header className="w-full bg-[#f4efe4] border-b border-[#d8cfb8] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Tagline */}
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            onClick={() => handleLinkClick('all')}
            className="flex items-center space-x-2 group"
          >
            <span className="text-2xl font-bold tracking-tight text-[#083f2a] font-serif hover:text-[#0c5c3d] transition-colors">
              Utilix.bd
            </span>
          </Link>
          <span className="text-[#d8cfb8] hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm text-[#6b6255] hidden sm:inline-block font-sans">
            বাংলা ডিজিটাল ইউটিলিটি হাব
          </span>
        </div>

        {/* Center: Desktop Navigation with Category Dropdowns */}
        <nav
          ref={navContainerRef}
          aria-label="প্রধান নেভিগেশন"
          className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm"
        >
          {/* Home Link */}
          <Link
            to="/"
            onClick={() => handleLinkClick('all')}
            className={`px-3 py-2 transition-colors font-medium border-b-2 ${
              isHomeActive
                ? 'text-[#083f2a] border-[#0c5c3d] font-semibold'
                : 'text-[#6b6255] border-transparent hover:text-[#083f2a]'
            }`}
          >
            হোম
          </Link>

          {/* Category Dropdowns */}
          {CATEGORIES.map((category) => {
            const catActive = isCategoryActive(category);
            const isOpen = openDropdownId === category.id;

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id={`trigger-${category.id}`}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={`menu-${category.id}`}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-2 transition-colors font-medium flex items-center gap-1.5 cursor-pointer border-b-2 ${
                    catActive
                      ? 'text-[#083f2a] border-[#0c5c3d] font-semibold'
                      : isOpen
                      ? 'text-[#083f2a] border-transparent bg-[#e8e0cc]/40'
                      : 'text-[#6b6255] border-transparent hover:text-[#083f2a]'
                  }`}
                >
                  <span>{category.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6b6255] transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-[#083f2a]' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Panel */}
                {isOpen && (
                  <div
                    id={`menu-${category.id}`}
                    role="menu"
                    aria-labelledby={`trigger-${category.id}`}
                    className="absolute top-full left-0 mt-0.5 w-64 bg-[#fffdf7] border border-[#d8cfb8] shadow-lg py-1 z-50"
                  >
                    {category.items.map((tool) => {
                      const active = isItemActive(tool.to);
                      return (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          role="menuitem"
                          onClick={() => handleLinkClick(category.categoryKey)}
                          className={`block px-3.5 py-2.5 transition-colors border-b border-[#efe8d6] last:border-b-0 ${
                            active
                              ? 'bg-[#f4efe4] text-[#083f2a] font-semibold border-l-2 border-l-[#0c5c3d]'
                              : 'text-[#14231c] hover:bg-[#f4efe4] hover:text-[#083f2a]'
                          }`}
                        >
                          <div className="text-sm font-medium">{tool.label}</div>
                          {tool.description && (
                            <div className="text-[11px] text-[#6b6255] mt-0.5 font-medium">
                              {tool.description}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right side: Search + Engine status + Mobile Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Header Quick Search Widget */}
          <div ref={searchContainerRef} className="relative">
            {!searchOpen ? (
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                title="টুল অনুসন্ধান করুন"
                aria-label="টুল অনুসন্ধান করুন"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs text-[#6b6255] hover:text-[#083f2a] bg-[#fffdf7] border border-[#d8cfb8] hover:border-[#0c5c3d] transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#0c5c3d]" />
                <span className="hidden md:inline font-sans">টুল খুঁজুন...</span>
              </button>
            ) : (
              <div className="flex items-center bg-[#fffdf7] border border-[#0c5c3d] px-2 py-1 shadow-sm w-44 sm:w-60 md:w-72 transition-all">
                <Search className="w-3.5 h-3.5 text-[#0c5c3d] mr-1.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="টুল খুঁজুন (যেমন: সিভি, পিডিএফ)..."
                  className="w-full bg-transparent outline-none text-xs text-[#14231c] placeholder-[#8a7f70] font-sans"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  title="বন্ধ করুন"
                  className="text-[#6b6255] hover:text-[#c8342a] p-0.5 shrink-0 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Search Dropdown Results */}
            {searchOpen && searchQuery.trim() && (
              <div className="absolute right-0 top-full mt-1 w-72 sm:w-80 bg-[#fffdf7] border border-[#d8cfb8] shadow-xl z-50 max-h-80 overflow-y-auto">
                <div className="p-2 bg-[#f4efe4] border-b border-[#d8cfb8] text-[11px] font-medium text-[#6b6255] flex items-center justify-between">
                  <span>অনুসন্ধান ফলাফল</span>
                  <span>{filteredNavTools.length}টি টুল পাওয়া গেছে</span>
                </div>

                {filteredNavTools.length > 0 ? (
                  <div className="divide-y divide-[#efe8d6]">
                    {filteredNavTools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={tool.link || '/'}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="block p-2.5 hover:bg-[#f4efe4] transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#083f2a] group-hover:text-[#0c5c3d]">
                            {tool.title}
                          </span>
                          <ArrowRight className="w-3 h-3 text-[#0c5c3d] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#6b6255] line-clamp-1 mt-0.5">
                          {tool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#6b6255]">
                    "{searchQuery}" নামে কোনো টুল পাওয়া যায়নি।
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center text-xs text-[#0c5c3d] font-sans pl-2 border-l border-[#d8cfb8]">
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

      {/* Mobile Accordion Navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="মোবাইল নেভিগেশন"
          className="md:hidden border-t border-[#d8cfb8] bg-[#fffdf7]"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {/* Home Link */}
            <Link
              to="/"
              onClick={() => handleLinkClick('all')}
              className={`block px-3 py-2.5 font-medium text-sm transition-colors ${
                isHomeActive
                  ? 'bg-[#f4efe4] text-[#083f2a] font-semibold border-l-4 border-[#0c5c3d]'
                  : 'text-[#14231c] hover:bg-[#f4efe4] hover:text-[#083f2a]'
              }`}
            >
              হোম
            </Link>

            {/* Accordion Categories */}
            {CATEGORIES.map((category) => {
              const catActive = isCategoryActive(category);
              const isExpanded = !!mobileExpanded[category.id];

              return (
                <div
                  key={category.id}
                  className="border border-[#d8cfb8] bg-[#fffdf7] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileCategory(category.id)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                      catActive
                        ? 'bg-[#f4efe4]/70 text-[#083f2a] font-semibold'
                        : 'text-[#14231c] hover:bg-[#f4efe4]'
                    }`}
                  >
                    <span>{category.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6b6255] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#083f2a]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#efe8d6] bg-[#fffdf7]">
                      {category.items.map((tool) => {
                        const active = isItemActive(tool.to);
                        return (
                          <Link
                            key={tool.to}
                            to={tool.to}
                            onClick={() => handleLinkClick(category.categoryKey)}
                            className={`block px-4 py-2.5 text-sm border-b border-[#f4efe4] last:border-b-0 transition-colors ${
                              active
                                ? 'bg-[#f4efe4] text-[#083f2a] font-semibold pl-6 border-l-2 border-[#0c5c3d]'
                                : 'text-[#14231c] hover:bg-[#f4efe4] hover:text-[#083f2a] pl-6'
                            }`}
                          >
                            <div className="font-medium">{tool.label}</div>
                            {tool.description && (
                              <div className="text-[11px] text-[#6b6255] mt-0.5">
                                {tool.description}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

