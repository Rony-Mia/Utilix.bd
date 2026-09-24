import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { getToolIconByLink } from '../data/toolIcons.tsx';
import { UtoolsLogo } from './UtoolsLogo';
import navbarContent from '../../content/global/navbar.json';

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

const CATEGORIES: NavCategory[] = navbarContent.categories;

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

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdownId(null);
  }, [location.pathname]);

  // Click outside and escape key handling for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
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
    <header className="glass sticky top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={() => handleLinkClick('all')}
          className="flex items-center gap-2 shrink-0 rounded-lg"
          aria-label="Utools.bd — হোম"
        >
          <UtoolsLogo className="w-7 h-7 shrink-0" />
          <span className="text-lg font-bold tracking-tight text-[#0B5D3B] font-latin">
            Utools<span className="text-[#F5A524]">.bd</span>
          </span>
          <span className="hidden xl:inline text-[#D5E4DB] pl-1">|</span>
          <span className="hidden xl:inline text-sm text-[#4A5A52] whitespace-nowrap">
            {navbarContent.tagline}
          </span>
        </Link>

        {/* Center: Desktop Navigation with Category Dropdowns */}
        <nav
          ref={navContainerRef}
          aria-label="প্রধান নেভিগেশন"
          className="hidden lg:flex items-center gap-1 text-sm shrink-0"
        >
          <Link
            to="/"
            onClick={() => handleLinkClick('all')}
            className={`px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap shrink-0 ${
              isHomeActive
                ? 'text-[#0B5D3B] bg-[#E6F4EC] font-semibold'
                : 'text-[#4A5A52] hover:text-[#0B5D3B] hover:bg-[#E6F4EC]/60'
            }`}
          >
            {navbarContent.homeLabel}
          </Link>

          <Link
            to="/blog"
            onClick={() => handleLinkClick()}
            className={`px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap shrink-0 ${
              location.pathname.startsWith('/blog')
                ? 'text-[#0B5D3B] bg-[#E6F4EC] font-semibold'
                : 'text-[#4A5A52] hover:text-[#0B5D3B] hover:bg-[#E6F4EC]/60'
            }`}
          >
            {navbarContent.blogLabel}
          </Link>

          {CATEGORIES.map((category) => {
            const catActive = isCategoryActive(category);
            const isOpen = openDropdownId === category.id;

            return (
              <div
                key={category.id}
                className="relative shrink-0"
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
                  className={`px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                    catActive
                      ? 'text-[#0B5D3B] bg-[#E6F4EC] font-semibold'
                      : isOpen
                      ? 'text-[#0B5D3B] bg-[#E6F4EC]/60'
                      : 'text-[#4A5A52] hover:text-[#0B5D3B] hover:bg-[#E6F4EC]/60'
                  }`}
                >
                  <span className="whitespace-nowrap">{category.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Panel */}
                {isOpen && (
                  <div
                    id={`menu-${category.id}`}
                    role="menu"
                    aria-labelledby={`trigger-${category.id}`}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                  >
                    <div className="w-80 bg-white border border-[#0B5D3B]/12 rounded-2xl shadow-[0_24px_64px_rgba(11,93,59,0.14)] p-3">
                      <p className="px-2 pb-2 text-xs font-semibold text-[#0B5D3B]">
                        {category.label}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {category.items.map((tool) => {
                          const active = isItemActive(tool.to);
                          const Icon = getToolIconByLink(tool.to);
                          return (
                            <Link
                              key={tool.to}
                              to={tool.to}
                              role="menuitem"
                              onClick={() => handleLinkClick(category.categoryKey)}
                              className={`flex items-start gap-3 rounded-xl px-2.5 py-2 transition-colors ${
                                active
                                  ? 'bg-[#E6F4EC] text-[#084A2E]'
                                  : 'text-[#0F1F17] hover:bg-[#E6F4EC]'
                              }`}
                            >
                              <span className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center">
                                <Icon className="w-4 h-4" />
                              </span>
                              <span className="min-w-0">
                                <span className={`block text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                                  {tool.label}
                                </span>
                                {tool.description && (
                                  <span className="block text-xs text-[#4A5A52] mt-0.5 leading-snug">
                                    {tool.description}
                                  </span>
                                )}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right side: CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center text-xs text-[#0B5D3B] whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#0B5D3B] mr-1.5" aria-hidden="true"></span>
            <span>১০০% ক্লায়েন্ট-সাইড ও নিরাপদ</span>
          </div>

          <Link
            to="/#tools"
            className="btn-shine hidden lg:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white whitespace-nowrap shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0B5D3B, #0D7048)',
              boxShadow: '0 4px 12px rgba(11,93,59,0.3)',
            }}
          >
            সব টুলস দেখুন
          </Link>

          <div className="lg:hidden flex items-center text-[11px] font-medium text-[#0B5D3B]">
            <span className="w-2 h-2 rounded-full bg-[#0B5D3B] mr-1.5" aria-hidden="true"></span>
            <span>নিরাপদ টুলস</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            className="lg:hidden p-2 -mr-2 text-[#0B5D3B] hover:bg-[#E6F4EC] transition-colors cursor-pointer"
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
          className="lg:hidden absolute top-full left-0 right-0 w-full border-t border-[#0B5D3B]/10 bg-[#FAFAF7] max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl z-50"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => handleLinkClick('all')}
              className={`block px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isHomeActive
                  ? 'bg-[#E6F4EC] text-[#084A2E] font-semibold'
                  : 'text-[#0F1F17] hover:bg-[#E6F4EC]'
              }`}
            >
              {navbarContent.homeLabel}
            </Link>

            <Link
              to="/blog"
              onClick={() => handleLinkClick()}
              className={`block px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                location.pathname.startsWith('/blog')
                  ? 'bg-[#E6F4EC] text-[#084A2E] font-semibold'
                  : 'text-[#0F1F17] hover:bg-[#E6F4EC]'
              }`}
            >
              {navbarContent.blogLabel}
            </Link>

            {CATEGORIES.map((category) => {
              const catActive = isCategoryActive(category);
              const isExpanded = !!mobileExpanded[category.id];

              return (
                <div
                  key={category.id}
                  className="border border-[#0B5D3B]/10 bg-white rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileCategory(category.id)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                      catActive
                        ? 'bg-[#E6F4EC]/70 text-[#084A2E] font-semibold'
                        : 'text-[#0F1F17] hover:bg-[#E6F4EC]/60'
                    }`}
                  >
                    <span>{category.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#4A5A52] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#084A2E]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#0B5D3B]/10 bg-white p-1.5">
                      {category.items.map((tool) => {
                        const active = isItemActive(tool.to);
                        const Icon = getToolIconByLink(tool.to);
                        return (
                          <Link
                            key={tool.to}
                            to={tool.to}
                            onClick={() => handleLinkClick(category.categoryKey)}
                            className={`flex items-start gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-colors ${
                              active
                                ? 'bg-[#E6F4EC] text-[#084A2E] font-semibold'
                                : 'text-[#0F1F17] hover:bg-[#E6F4EC]'
                            }`}
                          >
                            <span className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium">{tool.label}</span>
                              {tool.description && (
                                <span className="block text-xs text-[#4A5A52] mt-0.5">
                                  {tool.description}
                                </span>
                              )}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              to="/#tools"
              onClick={() => handleLinkClick('all')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0B5D3B, #0D7048)' }}
            >
              সব টুলস দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
