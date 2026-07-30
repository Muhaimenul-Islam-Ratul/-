import React, { useState } from 'react';
import {
  UserCheck,
  UserX,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  X,
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function DebtTracker({
  debts = [],
  onAddDebt,
  onUpdateDebtPayment,
  onDeleteDebt,
  currency = '৳'
}) {
  const [activeSubTab, setActiveSubTab] = useState('given'); // 'given' (পাবো) vs 'taken' (দেবো)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentModalDebt, setPaymentModalDebt] = useState(null);

  // Form states
  const [personName, setPersonName] = useState('');
  const [debtType, setDebtType] = useState('given'); // 'given' or 'taken'
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  // Payment Form state
  const [addedPayment, setAddedPayment] = useState('');

  const handleSaveDebt = (e) => {
    e.preventDefault();
    if (!personName || !totalAmount) return;

    const newDebt = {
      id: `debt_${Date.now()}`,
      personName,
      type: debtType,
      totalAmount: Number(totalAmount),
      paidAmount: 0,
      dueDate: dueDate || '',
      note: note || '',
      status: 'pending'
    };

    onAddDebt(newDebt);
    setPersonName('');
    setTotalAmount('');
    setDueDate('');
    setNote('');
    setIsAddModalOpen(false);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!paymentModalDebt || !addedPayment) return;

    const added = Number(addedPayment);
    const newPaid = Number(paymentModalDebt.paidAmount || 0) + added;
    const isFullyPaid = newPaid >= Number(paymentModalDebt.totalAmount);

    onUpdateDebtPayment({
      debtId: paymentModalDebt.id,
      newPaidAmount: newPaid,
      status: isFullyPaid ? 'paid' : 'pending'
    });

    setAddedPayment('');
    setPaymentModalDebt(null);
  };

  // Calculations
  const totalGivenPending = debts
    .filter(d => d.type === 'given' && d.status !== 'paid')
    .reduce((sum, d) => sum + (Number(d.totalAmount) - Number(d.paidAmount || 0)), 0);

  const totalTakenPending = debts
    .filter(d => d.type === 'taken' && d.status !== 'paid')
    .reduce((sum, d) => sum + (Number(d.totalAmount) - Number(d.paidAmount || 0)), 0);

  const filteredDebts = debts.filter(d => d.type === activeSubTab);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            দেনা-পাওনা ট্র্যাকার
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">ধার-দেনা ম্যানেজমেন্ট</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            কাউকে ধার দিয়েছেন বা কারো কাছ থেকে টাকা নিয়েছেন? সব হিসেব এক জায়গায় রাখুন।
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-brand transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ধার এন্ট্রি করুন</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">মোট পাওনা টাকা (ধার দিয়েছি)</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {formatCurrency(totalGivenPending, currency)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">মোট দেনা টাকা (ধার নিয়েছি)</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {formatCurrency(totalTakenPending, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveSubTab('given')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'given'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ধার দিয়েছি (পাবো)
        </button>
        <button
          onClick={() => setActiveSubTab('taken')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'taken'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ধার নিয়েছি (দেবো)
        </button>
      </div>

      {/* Debt Item List */}
      <div className="space-y-3">
        {filteredDebts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">কোনো ট্র্যাকিং তথ্য পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">নতুন ধারের তথ্য যোগ করতে ওপরের বাটনে চাপুন</p>
          </div>
        ) : (
          filteredDebts.map((item) => {
            const due = Number(item.totalAmount) - Number(item.paidAmount || 0);
            const progress = Math.round(((item.paidAmount || 0) / item.totalAmount) * 100);
            const isPaid = item.status === 'paid' || due <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    isPaid ? 'bg-slate-100 text-slate-500' : (item.type === 'given' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')
                  }`}>
                    {isPaid ? <CheckCircle2 className="w-5 h-5" /> : (item.type === 'given' ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.personName}</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isPaid ? 'পরিশোধিত' : 'বকেয়া'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.note || (item.type === 'given' ? 'ধার দেওয়া হয়েছে' : 'ধার নেওয়া হয়েছে')}
                      {item.dueDate ? ` • ফেরত তারিখ: ${item.dueDate}` : ''}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-48 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${isPaid ? 'bg-emerald-500' : 'bg-brand-500'}`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">মোট: {formatCurrency(item.totalAmount, currency)}</p>
                    <p className={`text-base font-black ${isPaid ? 'text-slate-400 line-through' : (item.type === 'given' ? 'text-emerald-600' : 'text-rose-600')}`}>
                      বাকি: {formatCurrency(due, currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isPaid && (
                      <button
                        onClick={() => setPaymentModalDebt(item)}
                        className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold text-xs rounded-xl transition-all"
                      >
                        জমা যোগ
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteDebt(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Debt Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">নতুন ধার এন্ট্রি</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDebt} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ধারের ধরন</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDebtType('given')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      debtType === 'given'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    ধার দিয়েছি (পাবো)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtType('taken')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      debtType === 'taken'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    ধার নিয়েছি (দেবো)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যক্তির নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রহিম (বন্ধু), আরিফ ভাই"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পরিমাণ ({currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফেরত দেওয়ার তারিখ (ঐচ্ছিক)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোট বা বিষয়</label>
                <input
                  type="text"
                  placeholder="যেমন: জরুরি কেনাকাটার জন্য নিয়েছিল"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
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

      {/* Record Payment Modal */}
      {paymentModalDebt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {paymentModalDebt.personName} - জমা যোগ করুন
              </h3>
              <button onClick={() => setPaymentModalDebt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                <p><strong>মোট পরিমােশ:</strong> {formatCurrency(paymentModalDebt.totalAmount, currency)}</p>
                <p><strong>ইতিমধ্যে শোধ করা হয়েছে:</strong> {formatCurrency(paymentModalDebt.paidAmount || 0, currency)}</p>
                <p className="text-brand-600 font-bold">
                  <strong>এখন বকেয়া বাকি:</strong> {formatCurrency(paymentModalDebt.totalAmount - (paymentModalDebt.paidAmount || 0), currency)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নতুন জমার পরিমাণ ({currency})</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={addedPayment}
                  onChange={(e) => setAddedPayment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalDebt(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg"
                >
                  জমা রেকর্ড করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
