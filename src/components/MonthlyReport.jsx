import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Award,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import {
  formatCurrency,
  bnMonths,
  toBnDigits,
  formatBnDateShort
} from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MonthlyReport({ transactions, categories, currency }) {
  // Current Selected Month Year State (YYYY-MM)
  const today = new Date();
  const currentMonthDefault = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthDefault);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${yStr}-${mStr}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${yStr}-${mStr}`);
  };

  // Parse Month Title e.g. "জুলাই ২০২৬"
  const [yearNum, monthNum] = selectedMonth.split('-').map(Number);
  const monthNameBn = bnMonths[monthNum - 1];
  const yearBn = toBnDigits(yearNum);

  // Previous Month YYYY-MM calculation for MoM comparison
  const prevMonthDate = new Date(yearNum, monthNum - 2, 1);
  const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthNameBn = bnMonths[prevMonthDate.getMonth()];

  // Current Month Data
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
  const monthExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const netSavings = monthIncome - monthExpense;

  // Previous Month Data
  const prevMonthTransactions = transactions.filter(t => t.date.startsWith(prevMonthStr));
  const prevMonthExpense = prevMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const prevMonthIncome = prevMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Highest Spending Day Calculation
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const dailyExpensesMap = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${selectedMonth}-${String(d).padStart(2, '0')}`;
    dailyExpensesMap[dayStr] = 0;
  }
  currentMonthTransactions.forEach(t => {
    if (t.type === 'expense' && dailyExpensesMap[t.date] !== undefined) {
      dailyExpensesMap[t.date] += Number(t.amount);
    }
  });

  let maxSpendingDay = '';
  let maxSpendingAmount = 0;
  Object.entries(dailyExpensesMap).forEach(([day, amount]) => {
    if (amount > maxSpendingAmount) {
      maxSpendingAmount = amount;
      maxSpendingDay = day;
    }
  });

  // Daily Trend Chart Data
  const dailyLabels = Array.from({ length: daysInMonth }, (_, i) => toBnDigits(i + 1));
  const dailyDataPoints = Array.from({ length: daysInMonth }, (_, i) => {
    const dayStr = `${selectedMonth}-${String(i + 1).padStart(2, '0')}`;
    return dailyExpensesMap[dayStr] || 0;
  });

  const dailyTrendData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'দৈনিক খরচ',
        data: dailyDataPoints,
        backgroundColor: 'rgba(247, 75, 0, 0.75)',
        hoverBackgroundColor: '#F74B00',
        borderRadius: 6,
      }
    ]
  };

  const dailyTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => `${toBnDigits(items[0].label)} ${monthNameBn}`,
          label: (context) => `খরচ: ${formatCurrency(context.raw, currency)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Hind Siliguri', size: 11 }, color: '#64748B' }
      },
      y: {
        grid: { color: '#F1F5F9' },
        ticks: { font: { family: 'Hind Siliguri', size: 11 }, color: '#64748B' }
      }
    }
  };

  // Category Distribution (Pie/Donut Chart)
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  const categoryTotals = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const catExpense = currentMonthTransactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        ...cat,
        amount: catExpense
      };
    })
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryTotals[0];

  const donutData = {
    labels: categoryTotals.map(c => c.name),
    datasets: [
      {
        data: categoryTotals.map(c => c.amount),
        backgroundColor: categoryTotals.map(c => c.color || '#F74B00'),
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Hind Siliguri', size: 12 }, padding: 14, usePointStyle: true }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${formatCurrency(context.raw, currency)}`
        }
      }
    },
    cutout: '68%'
  };

  // MoM Comparison Chart Data
  const momData = {
    labels: ['আয়', 'খরচ', 'নিট সঞ্চয়'],
    datasets: [
      {
        label: `${monthNameBn}`,
        data: [monthIncome, monthExpense, netSavings],
        backgroundColor: '#F74B00',
        borderRadius: 6
      },
      {
        label: `${prevMonthNameBn}`,
        data: [prevMonthIncome, prevMonthExpense, prevMonthIncome - prevMonthExpense],
        backgroundColor: '#CBD5E1',
        borderRadius: 6
      }
    ]
  };

  const momOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Hind Siliguri', size: 12 }, usePointStyle: true }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw, currency)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Hind Siliguri', size: 12 } } },
      y: { grid: { color: '#F1F5F9' }, ticks: { font: { family: 'Hind Siliguri', size: 11 } } }
    }
  };

  // Expense diff percentage compared to previous month
  const expDiffPercent = prevMonthExpense > 0 
    ? (((monthExpense - prevMonthExpense) / prevMonthExpense) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Month Navigation Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="আগের মাস"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-slate-900 min-w-36 text-center">
            {monthNameBn} {yearBn}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="পরের মাস"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          সমগ্র মাসের ক্যাটাগরি ও খরচের গ্রাফিক্যাল সামারি
        </div>
      </div>

      {/* Month Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 uppercase">মাসের মোট আয়</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {formatCurrency(monthIncome, currency)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 uppercase">মাসের মোট খরচ</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(monthExpense, currency)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 uppercase">মাস শেষে হাতে সঞ্চয়</span>
          <div className={`text-2xl font-bold mt-1 ${netSavings >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {formatCurrency(netSavings, currency)}
          </div>
        </div>
      </div>

      {/* Spending Highlights & MoM Smart Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Highest Spending Day Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              সর্বোচ্চ খরচের দিন
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {maxSpendingDay ? formatBnDateShort(maxSpendingDay) : 'কোন তথ্য নেই'}
            </p>
            <p className="text-xs text-brand-600 font-semibold mt-0.5">
              সেদিন খরচ: {formatCurrency(maxSpendingAmount, currency)}
            </p>
          </div>
        </div>

        {/* Top Spending Category Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              সর্বোচ্চ খরচের ক্যাটাগরি
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {topCategory ? topCategory.name : 'কোন তথ্য নেই'}
            </p>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">
              মোট: {formatCurrency(topCategory ? topCategory.amount : 0, currency)}
            </p>
          </div>
        </div>

      </div>

      {/* Comparison Callout Alert */}
      {prevMonthExpense > 0 && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-medium ${
          Number(expDiffPercent) > 0
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>
            গত মাস ({prevMonthNameBn})-এর তুলনায় এই মাসে আপনার খরচ{' '}
            <strong>{toBnDigits(Math.abs(expDiffPercent))}% {Number(expDiffPercent) > 0 ? 'বৃদ্ধি পেয়েছে' : 'হ্রাস পেয়েছে'}</strong>।
          </span>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Spending Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            প্রতিদিনের খরচের ট্রেন্ড ({monthNameBn})
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            পুরো মাস জুড়ে ১ তারিখ থেকে {toBnDigits(daysInMonth)} তারিখের খরচের তালিকা
          </p>
          <div className="h-64 w-full">
            <Bar data={dailyTrendData} options={dailyTrendOptions} />
          </div>
        </div>

        {/* Category Pie/Donut Chart (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ক্যাটাগরি ভিত্তিক খরচের পাই চার্ট
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              কোন খাতে সবচেয়ে বেশি টাকা ব্যয় হয়েছে
            </p>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            {categoryTotals.length > 0 ? (
              <Doughnut data={donutData} options={donutOptions} />
            ) : (
              <p className="text-xs text-slate-400">এই মাসে কোন খরচের ডেটা নেই</p>
            )}
          </div>
        </div>

      </div>

      {/* Month vs Month Comparison Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          মাসভিত্তিক তুলনা ({monthNameBn} vs {prevMonthNameBn})
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          গত মাসের সাথে চলতি মাসের আয়, খরচ ও নিট সঞ্চয়ের পার্থক্য
        </p>
        <div className="h-64 w-full">
          <Bar data={momData} options={momOptions} />
        </div>
      </div>

    </div>
  );
}
