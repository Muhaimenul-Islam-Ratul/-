import React, { useState } from 'react';
import { Plus, Search, Sparkles, RefreshCw, Wallet, User, LogOut, LogIn, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeTab,
  onOpenAddModal,
  onLoadDemoData,
  onOpenSearch,
  onOpenAuthModal,
  currency,
  totalBalance
}) {
  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const tabTitles = {
    dashboard: 'ড্যাশবোর্ড',
    daily: 'দৈনিক রিপোর্ট',
    monthly: 'মাসিক রিপোর্ট',
    history: 'সব হিসাব (হিস্ট্রি)',
    budget: 'বাজেট ও লক্ষ্য',
    settings: 'সেটিংস'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Active Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500 text-white font-bold text-xl shadow-brand">
              ৳
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                আমার টাকার হিসাব
              </h1>
              <p className="text-xs font-medium text-brand-600 sm:hidden">
                {tabTitles[activeTab]}
              </p>
            </div>
          </div>

          {/* Center search shortcut button */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm px-4 py-2 rounded-full transition-colors w-64 border border-slate-200/60"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate">হিসাব বা নোট খুঁজুন...</span>
          </button>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Demo Data button */}
            <button
              onClick={onLoadDemoData}
              title="রিপোর্ট দেখতে ডেমো ডেটা লোড করুন"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold transition-colors border border-brand-200/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ডেমো ডেটা</span>
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-28 truncate">
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fade-in">
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.displayName || 'ইউজার প্রোফাইল'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200"
              >
                <LogIn className="w-4 h-4 text-brand-600" />
                <span>লগইন / সাইন-আপ</span>
              </button>
            )}

            {/* Quick Add Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-brand transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">নতুন জমা/খরচ</span>
              <span className="sm:hidden">যুক্ত করুন</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
