import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
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
        description: 'সুতন্বীএমজে ও ইউনিকোড ফন্ট লাইভ রূপান্তর',
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
        label: 'সরকারি ও পাসপোর্ট ছবি রিসাইজার',
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
    id: 'pdf-tools',
    label: 'পিডিএফ টুলস',
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
        description: 'পেজ রেঞ্জ বা একক পেজে ভাগ ও ডাউনলোড',
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
        description: 'কাস্টম টেক্সট স্ট্যাম্প ও পৃষ্ঠা নম্বর যোগ',
      },
    ],
  },
  {
    id: 'calc-tools',
    label: 'হিসাব ও ক্যালকুলেটর',
    categoryKey: 'calculator',
    items: [
      {
        to: '/age-calculator',
        label: 'বয়স ক্যালকুলেটর',
        description: 'চাকরির আবেদনের বয়স ও কোটা হিসাব',
      },
      {
        to: '/amount-in-words',
        label: 'টাকা কথায় রূপান্তরক',
        description: 'চেক ও দলিলের টাকার কথায় রূপান্তর',
      },
      {
        to: '/gpa-calculator',
        label: 'জিপিএ ও সিজিপিএ ক্যালকুলেটর',
        description: 'এসএসসি, এইচএসসি ও ভার্সিটি সিজিপিএ',
      },
    ],
  },
  {
    id: 'doc-tools',
    label: 'সিভি ও ডকুমেন্ট',
    categoryKey: 'document',
    items: [
      {
        to: '/cv-builder',
        label: 'সিভি ও জীবনবৃত্তান্ত মেকার',
        description: 'পেশাদার বাংলা ও ইংরেজি CV তৈরি',
      },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onSelectCategory }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
  const [paletteQuery, setPaletteQuery] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const paletteInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll listener: transparent over hero, becomes #FFFFFF with 1px border on scroll past hero
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false);
        setOpenDropdownId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus palette input on open
  useEffect(() => {
    if (paletteOpen) {
      setTimeout(() => paletteInputRef.current?.focus(), 60);
    } else {
      setPaletteQuery('');
    }
  }, [paletteOpen]);

  // Close menus when route changes
  useEffect(() => {
    setOpenDropdownId(null);
    setPaletteOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Filtered tools for Command Palette
  const filteredTools = paletteQuery.trim()
    ? TOOLS.filter((tool) => {
        const q = paletteQuery.toLowerCase().trim();
        return (
          tool.title.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.feature.toLowerCase().includes(q)
        );
      })
    : TOOLS;

  const isCategoryActive = (cat: NavCategory) => {
    return cat.items.some((item) => location.pathname === item.to);
  };

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

  const handleLinkClick = (categoryKey?: string) => {
    setOpenDropdownId(null);
    setMobileMenuOpen(false);
    if (categoryKey && onSelectCategory) {
      onSelectCategory(categoryKey);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'text':
        return 'টেক্সট টুলস';
      case 'image':
        return 'ইমেজ টুলস';
      case 'calculator':
        return 'হিসাব ও ক্যালকুলেটর';
      case 'document':
        return 'সিভি ও ডকুমেন্ট';
      default:
        return 'টুল';
    }
  };

  return (
    <>
      <header
        className={`w-full sticky top-0 z-30 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E3DCC8]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: "Utilix.bd" wordmark, Tiro Bangla, 22px */}
          <div className="flex items-center">
            <Link
              to="/"
              onClick={() => handleLinkClick('all')}
              className="font-tiro text-[22px] font-normal text-[#0D2818] hover:text-[#0D2818]/80 transition-opacity"
            >
              Utilix.bd
            </Link>
          </div>

          {/* Center: Desktop Navigation Mega Menu (re-styled with thin 1px underline on hover, no chevron icons) */}
          <nav
            ref={navContainerRef}
            aria-label="প্রধান নেভিগেশন"
            className="hidden lg:flex items-center space-x-6 text-[14px]"
          >
            {CATEGORIES.map((category) => {
              const catActive = isCategoryActive(category);
              const isOpen = openDropdownId === category.id;

              return (
                <div
                  key={category.id}
                  className="relative py-4"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdownId((prev) =>
                        prev === category.id ? null : category.id
                      )
                    }
                    className={`relative py-1 text-[14px] font-medium transition-colors cursor-pointer text-[#0D2818] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#0D2818] after:transition-all after:duration-200 ${
                      isOpen || catActive
                        ? 'after:w-full'
                        : 'after:w-0 hover:after:w-full'
                    }`}
                  >
                    <span>{category.label}</span>
                  </button>

                  {/* Dropdown Panel */}
                  {isOpen && (
                    <div
                      role="menu"
                      className="absolute top-full left-0 mt-0 w-64 bg-[#FFFFFF] border border-[#E3DCC8] rounded-[6px] py-1.5 z-50 shadow-[0_4px_16px_rgba(13,40,24,0.04)]"
                    >
                      {category.items.map((tool) => {
                        const active = location.pathname === tool.to;
                        return (
                          <Link
                            key={tool.to}
                            to={tool.to}
                            role="menuitem"
                            onClick={() => handleLinkClick(category.categoryKey)}
                            className={`block px-3.5 py-2 transition-colors border-b border-[#FAF6EC] last:border-b-0 ${
                              active
                                ? 'bg-[#FAF6EC] text-[#0D2818] font-medium'
                                : 'text-[#0D2818] hover:bg-[#FAF6EC]'
                            }`}
                          >
                            <div className="text-[13px] font-medium text-[#0D2818]">
                              {tool.label}
                            </div>
                            {tool.description && (
                              <div className="text-[12px] text-[#5C6F63] mt-0.5 leading-snug">
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

          {/* Right: Search Trigger Pill with ⌘K badge & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="টুল অনুসন্ধান করুন"
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#5C6F63] hover:text-[#0D2818] bg-[#FFFFFF] border border-[#E3DCC8] rounded-full transition-all cursor-pointer hover:border-[#0D2818]/40 shadow-[0_1px_2px_rgba(13,40,24,0.02)]"
            >
              <Search className="w-3.5 h-3.5 text-[#5C6F63]" />
              <span className="font-sans">খুঁজুন...</span>
              <kbd className="text-[11px] font-sans font-medium text-[#B54A3C] bg-[#FAF6EC] px-1.5 py-0.5 rounded border border-[#E3DCC8]">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
              className="lg:hidden p-1.5 text-[#0D2818] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E3DCC8] rounded-[6px] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <div className="space-y-1 w-5">
                  <span className="block w-5 h-0.5 bg-[#0D2818]"></span>
                  <span className="block w-4 h-0.5 bg-[#0D2818]"></span>
                  <span className="block w-5 h-0.5 bg-[#0D2818]"></span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="মোবাইল নেভিগেশন"
            className="lg:hidden border-t border-[#E3DCC8] bg-[#FFFFFF] px-4 py-4 space-y-4"
          >
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="text-[13px] font-medium text-[#5C6F63] pb-1 border-b border-[#FAF6EC]">
                  {cat.label}
                </div>
                <div className="space-y-1 pt-1">
                  {cat.items.map((tool) => (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={() => handleLinkClick(cat.categoryKey)}
                      className="block py-1.5 text-[14px] text-[#0D2818] hover:text-[#0D2818]/70"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}
      </header>

      {/* Full Command-Palette-Style Overlay */}
      {paletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#0D2818]/30 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#FFFFFF] border border-[#E3DCC8] rounded-[8px] shadow-[0_16px_36px_rgba(13,40,24,0.12)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-[#E3DCC8]">
              <Search className="w-4 h-4 text-[#5C6F63] mr-2.5 shrink-0" />
              <input
                ref={paletteInputRef}
                type="text"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="টুলের নাম খুঁজুন (যেমন: বিজয়, সিভি, PDF)..."
                className="w-full bg-transparent outline-none text-[15px] text-[#0D2818] placeholder-[#5C6F63]/70 font-sans"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="p-1 text-[#5C6F63] hover:text-[#0D2818] cursor-pointer"
                title="বন্ধ করুন"
              >
                <kbd className="text-[11px] font-sans text-[#5C6F63] bg-[#FAF6EC] px-1.5 py-0.5 rounded border border-[#E3DCC8]">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Filtered Tools List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#FAF6EC]">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      if (tool.link) {
                        navigate(tool.link);
                        setPaletteOpen(false);
                      }
                    }}
                    className="w-full text-left p-2.5 hover:bg-[#FAF6EC] rounded-[6px] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-[14px] font-medium text-[#0D2818] flex items-center gap-2">
                        <span>{tool.title}</span>
                        <span className="text-[12px] font-medium text-[#5C6F63] bg-[#FAF6EC] border border-[#E3DCC8] px-1.5 py-0.2 rounded">
                          {getCategoryLabel(tool.category)}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#5C6F63] line-clamp-1 mt-0.5">
                        {tool.description}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0D2818] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-[14px] text-[#5C6F63]">
                  "{paletteQuery}" নামে কোনো টুল পাওয়া যায়নি।
                </div>
              )}
            </div>

            {/* Palette Footer */}
            <div className="px-4 py-2 bg-[#FAF6EC] border-t border-[#E3DCC8] text-[12px] text-[#5C6F63] flex items-center justify-between">
              <span>{filteredTools.length}টি টুল তালিকাভুক্ত</span>
              <span>ব্যবহার করতে এন্টার চাপুন বা ক্লিক করুন</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
