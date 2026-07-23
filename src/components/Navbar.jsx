import React from 'react';
import { Plus, Search, Sparkles, RefreshCw, Wallet } from 'lucide-react';

export default function Navbar({
  activeTab,
  onOpenAddModal,
  onLoadDemoData,
  onOpenSearch,
  currency,
  totalBalance
}) {
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
