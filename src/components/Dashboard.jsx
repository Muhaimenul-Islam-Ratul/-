import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Clock
} from 'lucide-react';
import { formatCurrency, formatBnDateShort, getTodayString, toBnDigits, formatBnTime } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({
  transactions,
  categories,
  currency,
  onOpenAddModal,
  onNavigateTab
}) {
  const todayStr = getTodayString();
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // KPI Calculations
  const todayTransactions = transactions.filter(t => t.date === todayStr);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  const monthExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount);
  }, 0);

  // Category map helper
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  // Last 7 days data for Mini Weekly Trend Graph
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayExp = transactions
      .filter(t => t.date === dateStr && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const dayName = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'][d.getDay()];
    last7Days.push({
      dateStr,
      label: dayName,
      shortDate: formatBnDateShort(dateStr),
      amount: dayExp
    });
  }

  // Mini Chart Config
  const chartData = {
    labels: last7Days.map(d => d.label),
    datasets: [
      {
        label: 'দৈনিক খরচ',
        data: last7Days.map(d => d.amount),
        borderColor: '#F74B00',
        backgroundColor: 'rgba(247, 75, 0, 0.08)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#F74B00',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `খরচ: ${formatCurrency(context.raw, currency)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Hind Siliguri', size: 12 }, color: '#64748B' }
      },
      y: {
        display: false,
        beginAtZero: true
      }
    }
  };

  // Smart Insights Generation
  const highestExpenseCategory = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const total = monthTransactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { ...cat, total };
    })
    .sort((a, b) => b.total - a.total)[0];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            আজকের ফাইন্যান্স সামারি 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            দৈনিক আয়-ব্যয়ের নির্ভরযোগ্য হিসাব ও বিশ্লেষণের একনজরে রিপোর্ট
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-brand transition-all flex items-center justify-center gap-2"
          >
            <TrendingDown className="w-4 h-4" />
            <span>+ খরচ যোগ</span>
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>+ আয় যোগ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              আজকের খরচ
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(todayExpense, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              আজ মোট {toBnDigits(todayTransactions.filter(t => t.type === 'expense').length)} টি খরচ
            </p>
          </div>
        </div>

        {/* Today Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              আজকের আয়
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(todayIncome, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              আজ মোট {toBnDigits(todayTransactions.filter(t => t.type === 'income').length)} টি আয়
            </p>
          </div>
        </div>

        {/* Current Total Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              বর্তমান মোট ব্যালেন্স
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {formatCurrency(totalBalance, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              সর্বমোট সর্বশেষ সঞ্চয় স্থিতিসমূহ
            </p>
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              এই মাসের মোট খরচ
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(monthExpense, currency)}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <span>আয়: {formatCurrency(monthIncome, currency)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Section: Weekly Trend & Smart Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Mini-Graph (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>সাপ্তাহিক খরচের ট্রেন্ড</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">
                  গত ৭ দিন
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রতিদিনের মোট খরচের ঊর্ধ্বগতি বা নিম্নগতি পর্যবেক্ষণ
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('monthly')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>বিস্তারিত রিপোর্ট</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-44 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Smart Insight Card (1 Col) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                স্মার্ট ইনসাইট
              </span>
            </div>

            {highestExpenseCategory && highestExpenseCategory.total > 0 ? (
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-slate-100 leading-snug">
                  সবচেয়ে বেশি খরচ হয়েছে{' '}
                  <span className="text-brand-400">{highestExpenseCategory.name}</span> ক্যাটাগরিতে!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  এই মাসে আপনি {highestExpenseCategory.name} খাতে মোট{' '}
                  <strong className="text-white">{formatCurrency(highestExpenseCategory.total, currency)}</strong> খরচ করেছেন।
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold text-slate-100">
                  নিয়মিত হিসাব রাখুন
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  প্রতিদিনের খরচ ও জমা সঠিকভাবে লিখে রাখুন, সিস্টেম স্বয়ংক্রিয়ভাবে আপনাকে বাজেট পরামর্শ প্রদান করবে।
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-700/60 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>মাসিক নিট সঞ্চয়:</span>
            <span className="font-bold text-emerald-400 text-sm">
              {formatCurrency(monthIncome - monthExpense, currency)}
            </span>
          </div>
        </div>

      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              সাম্প্রতিক ট্রানজেকশন তালিকা
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              সর্বশেষ ৫টি জমা ও খরচের রেকর্ড
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>সব হিসাব দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">কোন ট্রানজেকশন পাওয়া যায়নি।</p>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="mt-3 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
            >
              + প্রথম খরচ যোগ করুন
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((item) => {
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
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: category.bgColor, color: category.color }}
                    >
                      <CategoryIcon name={category.icon} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.note || category.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-600">{category.name}</span>
                        <span>•</span>
                        <span>{formatBnDateShort(item.date)}</span>
                        {item.time && (
                          <>
                            <span>•</span>
                            <span>{formatBnTime(item.time)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-bold block ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {isIncome ? 'আয়' : 'খরচ'}
                    </span>
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
