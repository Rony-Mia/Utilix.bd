import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image as ImageIcon,
  Home,
  Wrench,
  Search,
  Globe,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext.tsx';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-[#0B5D3B] text-white shadow-xs shadow-[#0B5D3B]/20'
        : 'text-[#3E5246] hover:bg-[#EAEFEA] hover:text-[#0F1F17]'
    }`;

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="px-3.5 py-2">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0B5D3B] text-white flex items-center justify-center font-bold shadow-xs">
              U
            </div>
            <div>
              <span className="font-extrabold text-[#0F1F17] text-sm tracking-tight block">
                Utools.bd CMS
              </span>
              <span className="text-[10px] text-[#718279] block -mt-0.5">
                অ্যাডমিন কন্টেন্ট প্যানেল
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Groupings */}
        <nav className="space-y-5 px-1">
          {/* Main Dashboard */}
          <div>
            <NavLink
              to="/admin"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ড্যাশবোর্ড (Dashboard)</span>
            </NavLink>
          </div>

          {/* CONTENT */}
          <div>
            <span className="px-3.5 text-[10px] font-bold text-[#8A9C91] uppercase tracking-wider block mb-1.5">
              কন্টেন্ট (Content)
            </span>
            <div className="space-y-1">
              <NavLink
                to="/admin/posts"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <FileText className="w-4 h-4" />
                <span>ব্লগ পোস্ট (Blog Posts)</span>
              </NavLink>
              <NavLink
                to="/admin/categories"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <FolderTree className="w-4 h-4" />
                <span>ক্যাটাগরি (Categories)</span>
              </NavLink>
              <NavLink
                to="/admin/tags"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Tags className="w-4 h-4" />
                <span>ট্যাগসমূহ (Tags)</span>
              </NavLink>
              <NavLink
                to="/admin/media"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <ImageIcon className="w-4 h-4" />
                <span>মিডিয়া লাইব্রেরি (Media)</span>
              </NavLink>
            </div>
          </div>

          {/* HOMEPAGE */}
          <div>
            <span className="px-3.5 text-[10px] font-bold text-[#8A9C91] uppercase tracking-wider block mb-1.5">
              হোমপেজ (Homepage)
            </span>
            <div className="space-y-1">
              <NavLink
                to="/admin/homepage"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Home className="w-4 h-4" />
                <span>হোমপেজ ব্লগ কন্ট্রোল</span>
              </NavLink>
            </div>
          </div>

          {/* TOOLS */}
          <div>
            <span className="px-3.5 text-[10px] font-bold text-[#8A9C91] uppercase tracking-wider block mb-1.5">
              টুলস (Tools)
            </span>
            <div className="space-y-1">
              <NavLink
                to="/admin/tools"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Wrench className="w-4 h-4" />
                <span>টুল ও ব্লগ সম্পর্ক</span>
              </NavLink>
            </div>
          </div>

          {/* SEO & SYSTEM */}
          <div>
            <span className="px-3.5 text-[10px] font-bold text-[#8A9C91] uppercase tracking-wider block mb-1.5">
              এসইও ও সিস্টেম (SEO)
            </span>
            <div className="space-y-1">
              <NavLink
                to="/admin/seo"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Globe className="w-4 h-4" />
                <span>এসইও ও রিডাইরেক্ট</span>
              </NavLink>
              <NavLink
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Users className="w-4 h-4" />
                <span>ইউজার ও রোল</span>
              </NavLink>
              <NavLink
                to="/admin/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Settings className="w-4 h-4" />
                <span>সেটিংস ও ক্যাশ</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* User profile & footer */}
      <div className="pt-4 border-t border-[#D5E4DB] mt-6 space-y-2">
        <div className="px-3 py-2 bg-white rounded-xl border border-[#D5E4DB] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-[#E6F4EC] text-[#0B5D3B] flex items-center justify-center font-bold text-xs">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#0F1F17] block truncate">
                {user?.name || 'অ্যাডমিন'}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#0B5D3B] tracking-wider block">
                {user?.role || 'admin'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="লগআউট"
            className="p-1.5 text-[#718279] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="px-1 flex items-center justify-between text-[11px] text-[#718279]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0B5D3B] flex items-center gap-1 font-medium"
          >
            লাইভ সাইট <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/admin/decap.html"
            className="hover:text-[#0B5D3B] underline text-[10px]"
            title="Decap CMS (GitHub)"
          >
            Decap CMS
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col md:flex-row text-[#0F1F17] selection:bg-[#0B5D3B] selection:text-white font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-[#D5E4DB] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0B5D3B] text-white flex items-center justify-center font-bold text-xs">
            U
          </div>
          <span className="font-extrabold text-[#0F1F17] text-sm">Utools.bd CMS</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#52635A] hover:text-[#0B5D3B] rounded-lg border border-[#D5E4DB] text-xs font-semibold flex items-center gap-1"
          >
            লাইভ <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0F1F17] hover:bg-[#F0F4F2] rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex">
          <div className="w-72 bg-[#F8FAF9] h-full p-4 overflow-y-auto border-r border-[#D5E4DB] shadow-2xl">
            {navContent}
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#F8FAF9] border-r border-[#D5E4DB] p-5 flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        {navContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Status Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-[#D5E4DB] sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-[#52635A]">
            <Link to="/admin" className="hover:text-[#0B5D3B] font-medium">CMS</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8A9C91]" />
            <span className="font-semibold text-[#0F1F17]">কনটেন্ট ম্যানেজমেন্ট পোর্টাল</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-[#E6F4EC] text-[#0B5D3B] text-[11px] font-bold border border-[#0B5D3B]/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0B5D3B] animate-pulse" />
              সিস্টেম সক্রিয়
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5E4DB] text-xs font-semibold text-[#34443B] hover:bg-[#F0F4F2] transition-colors"
            >
              মূল ওয়েবসাইট দেখুন <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
