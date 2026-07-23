import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  History,
  Target,
  Settings as SettingsIcon,
  PlusCircle,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenAddModal, onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'daily', label: 'দৈনিক রিপোর্ট', icon: CalendarDays },
    { id: 'monthly', label: 'মাসিক রিপোর্ট', icon: BarChart3 },
    { id: 'history', label: 'সব হিসাব', icon: History },
    { id: 'budget', label: 'বাজেট ও লক্ষ্য', icon: Target },
    { id: 'settings', label: 'সেটিংস', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 p-4 space-y-1 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
          প্রধান মেনু
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                isActive
                  ? 'bg-brand-500 text-white font-semibold shadow-brand'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6 mt-auto">
          {currentUser ? (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-brand-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>লগইন করা আছে</span>
                  </p>
                </div>
              </div>
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
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-500 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
