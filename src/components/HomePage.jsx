import React from 'react';
import {
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wallet,
  TrendingDown,
  Users,
  Repeat,
  FileText,
  Smartphone,
  CheckCircle2,
  PieChart,
  Target,
  HelpCircle,
  Zap,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onNavigateTab, onOpenAuthModal }) {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-400 border border-brand-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>১০০% ফ্রি ও প্রাইভেট পার্সোনাল ফাইন্যান্স ট্র্যাকার</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-100">
              আপনার কষ্টার্জিত টাকার <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">
                সঠিক হিসাব ও সহজ ব্যবস্থাপনা
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              দৈনিক আয়-ব্যয় লেখা, বিকাশ ও ব্যাংক ওয়ালেট ট্র্যাকিং, দেনা-পাওনার হিসাব এবং স্মার্ট এআই পরামর্শ নিয়ে আপনার আর্থিক জীবনকে করুন সুশৃঙ্খল।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-2xl shadow-brand hover:scale-105 transition-all flex items-center justify-center gap-2.5"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>ড্যাশবোর্ডে প্রবেশ করুন →</span>
              </button>

              {!currentUser && (
                <button
                  onClick={onOpenAuthModal}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>বিনামূল্যে অ্যাকাউন্ট খুলুন</span>
                </button>
              )}
            </div>

            {/* Quick stats badges */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>মাল্টি-ওয়ালেট সাপোর্ট</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>এআই বাজেট পরামর্শ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>বাংলা PDF রিপোর্ট</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img
                src="/images/hero.png"
                alt="Personal Finance Graphic"
                className="relative rounded-3xl shadow-2xl border border-slate-700/60 max-w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Why Money Management Matters Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">
            কেন হিসাব রাখা জরুরি?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            টাকা ম্যানেজ করার গুরুত্ব ও প্রয়োজনীয়তা
          </h2>
          <p className="text-sm text-slate-500">
            মাস শেষে টাকা কোথায় শেষ হয় তা না জানা অনেকেরই বড় সমস্যা। সঠিক ট্র্যাকিং আপনার আর্থিক স্বাধীনতা নিশ্চিত করে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">অপ্রয়োজনীয় খরচ রোধ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              দৈনিক নাস্তা, অনাকাঙ্ক্ষিত শপিং বা মেস বিলের ছোট ছোট অপচয় চিহ্নিত করে প্রতি মাসে ১৫-২০% টাকা বাঁচানো সম্ভব।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">সঞ্চয়ের লক্ষ্য অর্জন</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              নতুন ল্যাপটপ, ফ্যামিলি ট্যুর বা ৩ মাসের ইমার্জেন্সি ফান্ড গড়ে তোলার জন্য নিখুঁত সেভিংস গোল ট্র্যাকিং।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">দেনা-পাওনামুক্ত জীবন</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              কাউকে ধার দেওয়া টাকা বা ধার নেওয়া পাওনার স্পষ্ট হিসেব রেখে সম্পর্ক ও অর্থনীতি দুটোই ভালো রাখা।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">আর্থিক মানসিক শান্তি</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার ব্যালেন্স এবং বকেয়া বিল চোখের সামনে থাকায় ভবিষ্যৎ পরিকল্পনা নেওয়া সহজ হয় ও মানসিক দুশ্চিন্তা কমে।
            </p>
          </div>
        </div>
      </section>

      {/* How to Use Section (3 Easy Steps) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            সহজ ৩টি ধাপ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            কীভাবে ব্যবহার করবেন "আমার টাকার হিসাব"?
          </h2>
          <p className="text-sm text-slate-500">
            কোনো জটিলতা ছাড়াই মাত্র কয়েক সেকেন্ডে আপনার দৈনন্দিন ট্র্যাকিং শুরু করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-500 text-white font-black text-xs flex items-center justify-center">
              ১
            </span>
            <h3 className="text-base font-bold text-slate-900">ওয়ালেট ব্যালেন্স সেট করুন</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার পকেটের ক্যাশ টাকা, বিকাশ, নগদ ও ব্যাংক অ্যাকাউন্টে বর্তমানে কত টাকা আছে তা শুরুতে লিখে ফেলুন।
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-500 text-white font-black text-xs flex items-center justify-center">
              ২
            </span>
            <h3 className="text-base font-bold text-slate-900">দৈনিক আয় ও খরচ লিখুন</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              প্রতিবার খরচ করার পর **"+ খরচ যোগ"** বাটন চেপে টাকার পরিমাণ ও ক্যাটাগরি বেছে হিসাব ইনপুট দিন।
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-500 text-white font-black text-xs flex items-center justify-center">
              ৩
            </span>
            <h3 className="text-base font-bold text-slate-900">স্মার্ট রিপোর্ট ও পরামর্শ দেখুন</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              সিস্টেম স্বয়ংক্রিয়ভাবে গ্রাফ বিশ্লেষণ ও এআই টিপস তৈরি করবে। ১-ক্লিকে বাংলা PDF রিপোর্ট ডাউনলোড করুন।
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Banner with Generated Asset */}
      <section className="bg-gradient-to-r from-brand-600 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 flex justify-center">
            <img
              src="/images/features.png"
              alt="Features Graphic"
              className="rounded-2xl shadow-xl border border-white/20 max-w-full h-auto object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">
              সব আধুনিক ফিচার এখন আপনার হাতের মুঠোয়
            </h2>
            <p className="text-brand-100 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
              বিকাশ-ব্যাংক ট্রান্সফার থেকে শুরু করে ধার-দেনা ট্র্যাকিং এবং PWA মোবাইল অ্যাপ সাপোর্ট—সবই পাচ্ছেন একদম বিনামূল্যে!
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-200" />
                <span>ক্যাশ/বিকাশ/ব্যাংক ওয়ালেট</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-200" />
                <span>ধার-দেনা ট্র্যাকার</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-2">
                <Repeat className="w-4 h-4 text-amber-200" />
                <span>অটো সাবস্ক্রিপশন</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-200" />
                <span>PWA মোবাইল অ্যাপ</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-6 py-3 bg-white text-brand-600 hover:bg-brand-50 font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                এখনই শুরু করুন →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Security & Privacy Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ১০০% গোপনীয়তা ও তথ্য সুরক্ষা
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              আপনার কোনো ফাইনান্সিয়াল ডেটা অন্য কারো সাথে শেয়ার করা হয় না। প্রতিটি ইউজারের ডেটা সম্পূর্ণ এনক্রিপ্টেড ও প্রাইভেট থাকে।
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md shrink-0"
        >
          ড্যাশবোর্ড ডেমো দেখুন
        </button>
      </section>

    </div>
  );
}
