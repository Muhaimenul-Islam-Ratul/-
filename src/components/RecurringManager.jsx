import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function RecurringManager({
  recurring = [],
  categories = [],
  wallets = [],
  onAddRecurring,
  onDeleteRecurring,
  onProcessDueRecurring,
  currency = '৳'
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c.name; });

  const walletMap = {};
  wallets.forEach(w => { walletMap[w.id] = w.name; });

  const handleSaveRecurring = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newRec = {
      id: `rec_${Date.now()}`,
      title,
      amount: Number(amount),
      type,
      categoryId: categoryId || categories[0]?.id || 'cat_other_exp',
      walletId: walletId || wallets[0]?.id || 'wallet_cash',
      frequency,
      dayOfMonth: Number(dayOfMonth) || 1,
      lastProcessedDate: ''
    };

    onAddRecurring(newRec);
    setTitle('');
    setAmount('');
    setIsAddModalOpen(false);
  };

  const totalMonthlyRecurringExpense = recurring
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const totalMonthlyRecurringIncome = recurring
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-purple-400/30">
            সাবস্ক্রিপশন ও রিঅ্যাকারিং এন্ট্রি
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">নিয়মিত ফিক্সড খরচ ও আয়</h2>
          <p className="text-purple-100 text-xs sm:text-sm mt-1">
            বাসা ভাড়া, ইন্টারনেট বিল, মেস চার্জ ও ফিক্সড স্যালারি স্বয়ংক্রিয়ভাবে ট্র্যাকিংয়ে রাখুন।
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onProcessDueRecurring}
            className="flex-1 md:flex-initial bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>ডিউ এন্ট্রিগুলো প্রসেস করুন</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-initial bg-white text-purple-700 hover:bg-purple-50 font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Summary Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">মাসিক নির্ধারিত ফিক্সড খরচ</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {formatCurrency(totalMonthlyRecurringExpense, currency)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">মাসিক নির্ধারিত ফিক্সড আয় (স্যালারি)</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {formatCurrency(totalMonthlyRecurringIncome, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurring.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-slate-100 space-y-2">
            <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">কোনো সাবস্ক্রিপশন আইটেম নেই</p>
            <p className="text-xs text-slate-400">নতুন ফিক্সড বিল বা আয় তৈরি করতে ওপরের বাটনে চাপুন</p>
          </div>
        ) : (
          recurring.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                  item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  <Repeat className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    প্রতি মাসের <strong>{item.dayOfMonth}</strong> তারিখ • {categoryMap[item.categoryId] || 'সাধারণ'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ওয়ালেট: {walletMap[item.walletId] || 'ডিফল্ট ক্যাশ'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className={`text-base font-black ${item.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount, currency)}
                  </p>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    মাসিক
                  </span>
                </div>

                <button
                  onClick={() => onDeleteRecurring(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">নতুন রিঅ্যাকারিং এন্ট্রি</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecurring} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">এন্ট্রির শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বাসা ভাড়া, নেটফ্লিক্স বিল"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">টাইপ</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="expense">খরচ (Expense)</option>
                    <option value="income">আয় (Income)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পরিমাণ ({currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মাসের কত তারিখ?</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডিফল্ট ওয়ালেট</label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
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
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
