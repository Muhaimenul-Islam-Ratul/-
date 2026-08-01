import React from 'react';
import {
  Home,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  History,
  Target,
  Settings as SettingsIcon,
  Wallet,
  Users,
  Repeat,
  LogIn,
  LogOut,
  ShieldCheck,
  Lock,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenAuthModal, onOpenProfileModal }) {
  const { currentUser, logout } = useAuth();
  const { lang, t } = useLanguage();
  
  const navItems = [
    { id: 'home', labelKey: 'navHome', fallback: 'হোম পেজ', icon: Home, isPublic: true },
    { id: 'dashboard', labelKey: 'navDashboard', fallback: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'wallets', labelKey: 'navWallets', fallback: 'ওয়ালেট ও ব্যাংক', icon: Wallet },
    { id: 'daily', labelKey: 'navDaily', fallback: 'দৈনিক রিপোর্ট', icon: CalendarDays },
    { id: 'monthly', labelKey: 'navMonthly', fallback: 'মাসিক রিপোর্ট', icon: BarChart3 },
    { id: 'history', labelKey: 'navHistory', fallback: 'সব হিসাব', icon: History },
    { id: 'budget', labelKey: 'navBudget', fallback: 'বাজেট ও লক্ষ্য', icon: Target },
    { id: 'debts', labelKey: 'navDebts', fallback: 'ধার-দেনা', icon: Users },
    { id: 'recurring', labelKey: 'navRecurring', fallback: 'সাবস্ক্রিপশন', icon: Repeat },
    { id: 'settings', labelKey: 'navSettings', fallback: 'সেটিংস', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 p-4 space-y-1 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
          {t('mainMenu', lang === 'en' ? 'MAIN MENU' : 'প্রধান মেনু')}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = t(item.labelKey, item.fallback);

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left group ${
                isActive
                  ? 'bg-brand-500 text-white font-semibold shadow-brand'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{label}</span>
              </div>
            </button>
          );
        })}

        <div className="pt-6 mt-auto">
          {currentUser ? (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2">
              <button
                onClick={onOpenProfileModal}
                className="w-full flex items-center gap-2 min-w-0 text-left hover:bg-slate-100 p-1 rounded-xl transition-colors group"
                title="নিকনেম ও ছবি পরিবর্তন করুন"
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-brand-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600">
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-brand-600 font-semibold flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>প্রোফাইল এডিট</span>
                  </p>
                </div>
              </button>

              <button
                onClick={logout}
                className="w-full py-1.5 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট (Logout)</span>
              </button>
            </div>
          ) : (
            <div className="bg-brand-50/80 rounded-2xl p-3.5 border border-brand-100 text-center space-y-2">
              <p className="text-xs font-bold text-slate-900">
                নিজের প্রোফাইলে সেভ রাখুন
              </p>
              <p className="text-[11px] text-slate-500">
                আলাদা আইডি দিয়ে নিজের হিসাব প্রাইভেট রাখতে সাইন-ইন করুন
              </p>
              <button
                onClick={onOpenAuthModal}
                className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-brand transition-all flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন / সাইন-আপ</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-lg px-2 py-1 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-brand-500 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 leading-tight">{t(item.labelKey, item.fallback)}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
