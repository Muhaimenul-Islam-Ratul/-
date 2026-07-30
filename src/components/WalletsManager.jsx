import React, { useState } from 'react';
import {
  Wallet,
  Smartphone,
  Building2,
  Banknote,
  CreditCard,
  Plus,
  ArrowRightLeft,
  Edit2,
  Trash2,
  Check,
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatCurrency, toBnDigits } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function WalletsManager({
  wallets = [],
  onAddWallet,
  onUpdateWallet,
  onDeleteWallet,
  onTransferMoney,
  currency = '৳'
}) {
  const { lang, t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // New Wallet state
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState('mobile');
  const [walletColor, setWalletColor] = useState('#F74B00');
  const [initialBalance, setInitialBalance] = useState('');

  // Transfer State
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');

  const getWalletIcon = (type) => {
    switch (type) {
      case 'cash': return Banknote;
      case 'mobile': return Smartphone;
      case 'bank': return Building2;
      case 'card': return CreditCard;
      default: return Wallet;
    }
  };

  const handleSaveWallet = (e) => {
    e.preventDefault();
    if (!walletName || !initialBalance) return;

    const newWallet = {
      id: `wallet_${Date.now()}`,
      name: walletName,
      type: walletType,
      color: walletColor,
      initialBalance: Number(initialBalance),
      icon: walletType === 'cash' ? 'Banknote' : (walletType === 'bank' ? 'Building2' : 'Smartphone')
    };

    onAddWallet(newWallet);
    setWalletName('');
    setInitialBalance('');
    setIsAddModalOpen(false);
  };

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    if (!fromWalletId || !toWalletId || !transferAmount || fromWalletId === toWalletId) {
      alert(lang === 'en' ? 'Select valid source and destination wallets and amount!' : 'সঠিক উৎস ও গন্তব্য ওয়ালেট এবং পরিমাণ নির্বাচন করুন!');
      return;
    }

    onTransferMoney({
      fromWalletId,
      toWalletId,
      amount: Number(transferAmount),
      note: transferNote || 'অ্যাকাউন্ট ফান্ড ট্রান্সফার'
    });

    setTransferAmount('');
    setTransferNote('');
    setIsTransferModalOpen(false);
  };

  const totalWalletBalance = wallets.reduce((sum, w) => sum + Number(w.initialBalance || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-100 bg-white/10 px-3 py-1 rounded-full">
            {lang === 'en' ? 'MULTIPLE WALLET MANAGEMENT' : 'মাল্টিপল ওয়ালেট ম্যানেজমেন্ট'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">{t('walletsTitle', 'অ্যাকাউন্ট ও ওয়ালেটস')}</h2>
          <p className="text-brand-100 text-xs sm:text-sm mt-1">
            {t('walletsDesc', 'আপনার ক্যাশ টাকা, বিকাশ, নগদ ও ব্যাংক ব্যালেন্স আলাদা ট্র্যাক রাখুন')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex-1 md:flex-initial bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{t('fundTransfer', 'ফান্ড ট্রান্সফার')}</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-initial bg-white text-brand-600 hover:bg-brand-50 font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newWallet', 'নতুন ওয়ালেট')}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400">{t('totalWalletBalance', 'সকল ওয়ালেটের মোট সঞ্চিত ব্যালেন্স')}</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(totalWalletBalance, currency, lang)}</p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl inline-block whitespace-nowrap">
            {lang === 'en' ? `Total Wallets: ${toBnDigits(wallets.length, lang)}` : `মোট ওয়ালেট: ${toBnDigits(wallets.length, lang)} টি`}
          </span>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wallets.map((w) => {
          const IconComponent = getWalletIcon(w.type);
          return (
            <div
              key={w.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: w.color || '#F74B00' }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDeleteWallet(w.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{w.name}</p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {formatCurrency(w.initialBalance, currency)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                <span>ধরন: {w.type === 'cash' ? 'ক্যাশ' : (w.type === 'bank' ? 'ব্যাংক' : 'মোবাইল')}</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  অ্যাক্টিভ
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Wallet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">নতুন ওয়ালেট যুক্ত করুন</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ওয়ালেটের নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সিটি ব্যাংক কার্ড, উপায় ওয়ালেট"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">টাইপ</label>
                  <select
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="mobile">মোবাইল ব্যাংকিং (বিকাশ/নগদ)</option>
                    <option value="cash">ক্যাশ (Cash in hand)</option>
                    <option value="bank">ব্যাংক অ্যাকাউন্ট</option>
                    <option value="card">ক্রেডিট/ডেবিট কার্ড</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শুরু ব্যালেন্স ({currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কালার থিম</label>
                <div className="flex gap-2">
                  {['#F74B00', '#10B981', '#E2136E', '#2563EB', '#8B5CF6', '#F59E0B'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setWalletColor(c)}
                      className={`w-7 h-7 rounded-full border-2 ${walletColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-brand"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Money Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">অ্যাকাউন্ট ফান্ড ট্রান্সফার</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কোন ওয়ালেট থেকে? (From)</label>
                <select
                  value={fromWalletId}
                  onChange={(e) => setFromWalletId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatCurrency(w.initialBalance, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কোন ওয়ালেটে পাঠাবেন? (To)</label>
                <select
                  value={toWalletId}
                  onChange={(e) => setToWalletId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatCurrency(w.initialBalance, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ট্রান্সফার পরিমাণ ({currency})</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোট বা কারণ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: ব্যাংক থেকে ক্যাশ তোলা"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-brand flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>ট্রান্সফার করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
