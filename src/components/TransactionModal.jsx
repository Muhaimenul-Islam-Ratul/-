import React, { useState, useEffect, useRef } from 'react';
import { X, TrendingDown, TrendingUp, Calendar, Clock, FileText, Check, Wallet } from 'lucide-react';
import { getTodayString } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';
import { useLanguage } from '../context/LanguageContext';

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  categories = [],
  wallets = [],
  editingTransaction = null,
  initialType = 'expense',
  initialDate = ''
}) {
  const { lang, t } = useLanguage();
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || 'wallet_cash');
  const [date, setDate] = useState(initialDate || getTodayString());
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  // Reset and populate modal form fields whenever modal opens or editingTransaction changes
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type || 'expense');
        setAmount(editingTransaction.amount ? String(editingTransaction.amount) : '');
        setCategoryId(editingTransaction.categoryId || '');
        setWalletId(editingTransaction.walletId || (wallets[0]?.id || 'wallet_cash'));
        setDate(editingTransaction.date || getTodayString());
        setTime(editingTransaction.time || '');
        setNote(editingTransaction.note || '');
      } else {
        setType(initialType);
        setAmount('');
        setWalletId(wallets[0]?.id || 'wallet_cash');
        setDate(initialDate || getTodayString());
        
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setTime(timeStr);
        setNote('');

        const firstCat = categories.find(c => c.type === initialType);
        if (firstCat) {
          setCategoryId(firstCat.id);
        } else if (categories.length > 0) {
          setCategoryId(categories[0].id);
        }
      }
    }
  }, [isOpen, editingTransaction]);

  // When type toggles, auto switch to default category of that type
  const handleTypeChange = (newType) => {
    setType(newType);
    const firstCat = categories.find(c => c.type === newType);
    if (firstCat) {
      setCategoryId(firstCat.id);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(lang === 'en' ? 'Please enter a valid amount greater than 0!' : 'অনুগ্রহ করে ০ এর বেশি সঠিক টাকার পরিমাণ লিখুন!');
      return;
    }

    let targetCatId = categoryId;
    if (!targetCatId) {
      const firstMatch = filteredCategories[0] || categories[0];
      if (firstMatch) targetCatId = firstMatch.id;
    }

    if (!targetCatId) {
      alert(lang === 'en' ? 'Please select a category!' : 'অনুগ্রহ করে একটি ক্যাটাগরি বেছে নিন!');
      return;
    }

    onSave({
      id: editingTransaction ? editingTransaction.id : 'tx_' + Date.now(),
      amount: parsedAmount,
      type,
      categoryId: targetCatId,
      walletId: walletId || wallets[0]?.id || 'wallet_cash',
      date: date || getTodayString(),
      time: time || '12:00',
      note: note.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {editingTransaction 
              ? (lang === 'en' ? 'Edit Transaction' : 'হিসাব পরিবর্তন করুন') 
              : (lang === 'en' ? 'Add New Income / Expense' : 'নতুন জমা / খরচ যুক্ত করুন')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          
          {/* Type Toggle Buttons (Income vs Expense) */}
          <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                type === 'expense'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>{lang === 'en' ? 'Expense' : 'খরচ (Expense)'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{lang === 'en' ? 'Income' : 'আয় (Income)'}</span>
            </button>
          </div>

          {/* Amount Input & Wallet Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {lang === 'en' ? 'Amount (৳)' : 'টাকার পরিমাণ (৳)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-lg font-bold text-slate-400 pointer-events-none select-none">
                  ৳
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const bnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
                    const converted = raw.replace(/[০-৯]/g, m => bnMap[m] || m);
                    const cleaned = converted.replace(/[^0-9.]/g, '');
                    setAmount(cleaned);
                  }}
                  className="w-full pl-8 pr-3 py-2.5 text-lg font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'en' ? 'Wallet / Account' : 'কোন ওয়ালেট/অ্যাকাউন্ট?'}</span>
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 text-slate-800 font-bold"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Icon Grid Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {lang === 'en' ? 'Select Category' : 'ক্যাটাগরি বেছে নিন'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
              {filteredCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/80 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight truncate">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'en' ? 'Date' : 'তারিখ'}</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'en' ? 'Time' : 'সময়'}</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'en' ? 'Note / Description (Optional)' : 'নোট / বিবরণ (ঐচ্ছিক)'}</span>
            </label>
            <input
              type="text"
              placeholder={lang === 'en' ? 'e.g. Lunch, Electricity bill...' : 'যেমন: দুপুরের খাবার, ইলেকট্রিক বিল ইত্যাদি'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Footer Submit Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {lang === 'en' ? 'Cancel' : 'বাতিল'}
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-brand transition-all flex items-center gap-2 ${
                type === 'expense' ? 'bg-brand-500 hover:bg-brand-600' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingTransaction ? (lang === 'en' ? 'Save Changes' : 'পরিবর্তন সংরক্ষণ করুন') : (lang === 'en' ? 'Save Entry' : 'হিসাব যোগ করুন')}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
