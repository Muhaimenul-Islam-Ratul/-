import React from 'react';
import { Lock, LogIn, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function ProtectedGuard({ onOpenAuthModal, onGoHome, pageName = 'ড্যাশবোর্ড' }) {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-fade-in text-center space-y-6">
      
      {/* Icon Card */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl border-4 border-white">
        <Lock className="w-9 h-9 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>সুরক্ষিত ফাইন্যান্সিয়াল এরিয়া</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {pageName} দেখতে সাইন-ইন করুন 🔒
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          আপনার সকল জমা, খরচ ও ব্যালেন্সের তথ্য ১০০% গোপন ও নিরাপদ রাখতে আপনাকে নিজের আইডিতে লগইন করতে হবে।
        </p>
      </div>

      {/* Feature Bullet Points */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft text-left space-y-3">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
          <span>আপনার ডেটা শুধুমাত্র আপনার আইডিতেই সেভ থাকবে</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
          <span>অন্য কোনো ব্যবহারকারী আপনার হিসেব দেখতে পারবে না</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
          <span>ডিভাইসে লগইন স্থায়ী থাকবে যতক্ষণ না পর্যন্ত আপনি লগআউট করেন</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onOpenAuthModal}
          className="w-full sm:w-auto px-7 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl shadow-brand hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>লগইন / সাইন-আপ করুন</span>
        </button>

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </button>
      </div>

    </div>
  );
}
