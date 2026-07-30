import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingDown,
  TrendingUp,
  Clock,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  formatCurrency,
  formatBnDate,
  getTodayString,
  toBnDigits,
  formatBnTime
} from '../utils/formatters';
import CategoryIcon from './CategoryIcon';
import { exportTransactionsPDF } from '../utils/pdfExporter';

export default function DailyReport({
  transactions,
  categories,
  currency,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction
}) {
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  // Date Navigation handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getTodayString());
  };

  // Filter transactions for selected date
  const dayTransactions = transactions.filter(t => t.date === selectedDate);
  const dayExpense = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const dayIncome = dayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const netDayBalance = dayIncome - dayExpense;

  // Category breakdown calculation for expenses
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  const categoryBreakdown = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const catExpense = dayTransactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const percentage = dayExpense > 0 ? (catExpense / dayExpense) * 100 : 0;
      return {
        ...cat,
        amount: catExpense,
        percentage
      };
    })
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Date Navigation Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="আগের দিন"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <CalendarIcon className="w-4 h-4 text-brand-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="পরের দিন"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {selectedDate !== getTodayString() && (
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
            >
              আজ
            </button>
          )}

          <button
            onClick={() => exportTransactionsPDF({
              transactions: dayTransactions,
              categories,
              title: `দৈনিক ফাইনান্সিয়াল স্টেটমেন্ট (${selectedDate})`,
              dateRangeStr: formatBnDate(selectedDate),
              currency
            })}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            📄 PDF রিপোর্ট
          </button>
        </div>

        <div className="text-center sm:text-right">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {formatBnDate(selectedDate)}
          </h2>
          <p className="text-xs text-slate-500">
            আজকের মোট প্রাপ্তি ও খরচের সম্পূর্ণ খতিয়ান
          </p>
        </div>
      </div>

      {/* Day Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Expense */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            দিনের মোট খরচ
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(dayExpense, currency)}
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            দিনের মোট আয়
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {formatCurrency(dayIncome, currency)}
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            দিনের নিট ব্যালেন্স
          </div>
          <div className={`text-xl font-bold mt-1 ${netDayBalance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {formatCurrency(netDayBalance, currency)}
          </div>
        </div>

      </div>

      {/* Category Breakdown Progress Section */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            ক্যাটাগরি ভিত্তিক খরচের অনুপাত
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="text-slate-800 font-semibold">{cat.name}</span>
                  </div>
                  <div className="text-slate-600">
                    {formatCurrency(cat.amount, currency)} ({toBnDigits(cat.percentage.toFixed(1))}%)
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Transactions List for Day */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">
            ট্রানজেকশন টাইমলাইন (সময়সহ)
          </h3>
          <button
            onClick={() => onOpenAddModal('expense', selectedDate)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>এই দিনে যোগ করুন</span>
          </button>
        </div>

        {dayTransactions.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-sm text-slate-400">এই তারিখে কোন হিসাব লেখা হয়নি।</p>
            <button
              onClick={() => onOpenAddModal('expense', selectedDate)}
              className="mt-3 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
            >
              + নতুন হিসাব লিখুন
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dayTransactions.map((item) => {
              const category = categoryMap[item.categoryId] || {
                name: 'অন্যান্য',
                icon: 'MoreHorizontal',
                color: '#64748B',
                bgColor: '#F1F5F9'
              };
              const isIncome = item.type === 'income';

              return (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: category.bgColor, color: category.color }}
                    >
                      <CategoryIcon name={category.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.note || category.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-600">{category.name}</span>
                        {item.time && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatBnTime(item.time)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-base font-bold block ${
                          isIncome ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
                      </span>
                    </div>

                    {/* Action icons */}
                    <div className="opacity-80 sm:opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(item)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                        title="এডিট"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
