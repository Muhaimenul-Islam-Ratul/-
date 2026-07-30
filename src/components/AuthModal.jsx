import React, { useState } from 'react';
import { X, Lock, Mail, User, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onShowToast }) {
  const { signup, login, loginWithGoogle } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
        onShowToast('সফলভাবে সাইন-ইন করা হয়েছে!');
      } else {
        await signup(email, password, displayName);
        onShowToast('নতুন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'অথেনটিকেশন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onShowToast('Google-এর মাধ্যমে আসল জিমেইল দিয়ে সাইন-ইন সম্পন্ন হয়েছে!');
      onClose();
    } catch (err) {
      console.error('Google Sign-in Catch:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('⚠️ Firebase Console-এ amar-takar-hisab.vercel.app ডোমেইনটি Authorized Domain হিসেবে যুক্ত করা প্রয়োজন। অথবা আপনি নিচে আপনার আসল জিমেইল ইমেইল ও পাসওয়ার্ড লিখেও সাইন-ইন করতে পারেন।');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('গুগল সাইন-ইন উইন্ডো বন্ধ করা হয়েছে। পুনরায় চেষ্টা করুন।');
      } else {
        setErrorMsg('গুগল দিয়ে সাইন ইন ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার আসল জিমেইল আইডি ও পাসওয়ার্ড দিয়ে নিচে রেজিস্ট্রেশন/লগইন করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 font-bold text-2xl flex items-center justify-center mx-auto shadow-sm">
            ৳
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-2">
            {isLoginTab ? 'আমার টাকার হিসাবে সাইন-ইন করুন' : 'নতুন একাউন্ট খুলুন'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            আপনার হিসাব শুধুমাত্র আপনার কাছেই সুরক্ষিত থাকবে
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition-all ${
              isLoginTab ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            লগইন (Login)
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition-all ${
              !isLoginTab ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            রেজিস্ট্রেশন (Register)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs font-medium rounded-xl border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                আপনার নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: সাইফুল ইসলাম"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ইমেইল অ্যাড্রেস
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-brand transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoginTab ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isLoginTab ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-slate-400 font-semibold">অথবা</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google দিয়ে সাইন ইন করুন</span>
        </button>

        <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>আপনার ডেটা সম্পূর্ণ এনক্রিপ্টেড ও প্রাইভেট</span>
        </div>

      </div>
    </div>
  );
}
