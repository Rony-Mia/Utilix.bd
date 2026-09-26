import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthUser {
  username: string;
  role: 'admin' | 'editor';
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: 'admin' | 'editor') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Check localStorage cache for session persistence
    try {
      const cached = localStorage.getItem('utools_admin_user');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth session from server on mount
  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          localStorage.setItem('utools_admin_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {});
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('utools_admin_user', JSON.stringify(data.user));
        setIsSubmitting(false);
        return true;
      } else {
        setErrorMsg(data.error || 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।');
        setIsSubmitting(false);
        return false;
      }
    } catch {
      setErrorMsg('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setIsSubmitting(false);
      return false;
    }
  };

  const logout = () => {
    fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    localStorage.removeItem('utools_admin_user');
  };

  const hasRole = (requiredRole: 'admin' | 'editor') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  };

  // If not authenticated, render login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4 selection:bg-[#0B5D3B] selection:text-white">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B5D3B] text-white shadow-lg shadow-[#0B5D3B]/20 mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight">Utools.bd CMS</h1>
            <p className="text-sm text-[#4A5A52] mt-1">কন্টেন্ট ম্যানেজমেন্ট সিস্টেম ও অ্যাডমিন পোর্টাল</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-[#D5E4DB] shadow-xl p-8 sm:p-10">
            <h2 className="text-lg font-bold text-[#0F1F17] mb-2">লগইন করুন</h2>
            <p className="text-xs text-[#52635A] mb-6">
              ব্লগ পোস্ট, ক্যাটাগরি ও সাইট কন্টেন্ট পরিচালনা করতে আপনার অ্যাকাউন্টে প্রবেশ করুন।
            </p>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                login(usernameInput, passwordInput);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#0F1F17] mb-1.5">
                  ইউজারনেম (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718279]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin অথবা editor"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D5E4DB] text-sm text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/30 focus:border-[#0B5D3B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#0F1F17]">
                    পাসওয়ার্ড (Password)
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718279]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D5E4DB] text-sm text-[#0F1F17] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/30 focus:border-[#0B5D3B] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0B5D3B] hover:bg-[#084A2E] text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                  {isSubmitting ? (
                    <span>যাচাই হচ্ছে...</span>
                  ) : (
                    <>
                      <span>লগইন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 p-3 bg-[#E6F4EC]/60 rounded-xl border border-[#0B5D3B]/10 text-[11px] text-[#2D4537] leading-relaxed">
                <strong>ডিফল্ট ক্রেডেনশিয়াল:</strong><br />
                • অ্যাডমিন: <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#0B5D3B]">admin</code> / <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#0B5D3B]">admin123</code><br />
                • এডিটর: <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#0B5D3B]">editor</code> / <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#0B5D3B]">editor123</code>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <a
              href="/"
              className="text-xs text-[#52635A] hover:text-[#0B5D3B] transition-colors inline-flex items-center gap-1 font-medium"
            >
              ← Utools.bd মূল ওয়েবসাইটে ফিরে যান
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
