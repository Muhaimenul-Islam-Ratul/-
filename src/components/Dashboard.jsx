import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  LogIn,
  FileText,
  Users,
  ArrowRightLeft,
  Smartphone,
  Banknote,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatBnDateShort, getTodayString, toBnDigits, formatBnTime } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { generateAIInsights } from '../utils/aiAdvisor';
import { exportTransactionsPDF } from '../utils/pdfExporter';

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
  transactions = [],
  categories = [],
  wallets = [],
  debts = [],
  budgets = {},
  goals = [],
  currency = '৳',
  onOpenAddModal,
  onNavigateTab,
  onOpenAuthModal
}) {
  const { currentUser } = useAuth();
  const { lang, t } = useLanguage();
  const todayStr = getTodayString();
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // KPI Calculations
  const todayTransactions = transactions.filter(t => t.date === todayStr);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const monthTransactions = transactions.filter(t => (t.date || '').startsWith(currentMonthStr));
  const monthExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + Number(t.amount || 0) : sum - Number(t.amount || 0);
  }, 0);

  // AI Advisor Insights
  const aiData = generateAIInsights({
    transactions,
    categories,
    budgets,
    goals,
    debts,
    currency
  });

  // Category map helper
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  // Last 7 days data for Mini Weekly Trend Graph
  const last7Days = [];
  const bnDayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  const enDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayExp = transactions
      .filter(t => t.date === dateStr && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const dayName = lang === 'en' ? enDayNames[d.getDay()] : bnDayNames[d.getDay()];
    last7Days.push({
      dateStr,
      label: dayName,
      shortDate: formatBnDateShort(dateStr, lang),
      amount: dayExp
    });
  }

  // Mini Chart Config
  const chartData = {
    labels: last7Days.map(d => d.label),
    datasets: [
      {
        label: lang === 'en' ? 'Daily Expense' : 'দৈনিক খরচ',
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
          label: (context) => `${lang === 'en' ? 'Expense' : 'খরচ'}: ${formatCurrency(context.raw, currency, lang)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: lang === 'en' ? 'Inter' : 'Hind Siliguri', size: 12 }, color: '#64748B' }
      },
      y: {
        display: false,
        beginAtZero: true
      }
    }
  };

  const handleExportPDF = () => {
    exportTransactionsPDF({
      transactions,
      categories,
      title: lang === 'en' ? 'My Money Tracker — Overall Financial Report' : 'আমার টাকার হিসাব — সামগ্রিক ফাইনান্সিয়াল রিপোর্ট',
      dateRangeStr: lang === 'en' ? 'All Transactions Summary' : 'সব ট্রানজেকশন সংকলন',
      currency,
      userName: currentUser ? (currentUser.displayName || currentUser.email) : (lang === 'en' ? 'Guest User' : 'গেস্ট ইউজার')
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Logged Out Welcome Callout Card */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 border border-brand-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {lang === 'en' ? 'Create a private profile for yourself 🔒' : 'নিজের জন্য একটি প্রাইভেট প্রোফাইল খুলুন 🔒'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'en' ? 'Logging in keeps all your income and expenses private to your account.' : 'লগইন করলে আপনার প্রতিটি জমা ও খরচ শুধুমাত্র আপনার আইডিতেই গোপন থাকবে।'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-brand transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('loginSignup', 'লগইন / সাইন-আপ করুন')}</span>
          </button>
        </div>
      )}

      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('dashboardTitle', 'আজকের ফাইন্যান্স সামারি 👋')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('dashboardDesc', 'দৈনিক আয়-ব্যয়ের নির্ভরযোগ্য হিসাব ও বিশ্লেষণের একনজরে রিপোর্ট')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{t('downloadPDF', 'PDF ডাউনলোড')}</span>
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-brand transition-all flex items-center gap-1.5"
          >
            <TrendingDown className="w-4 h-4" />
            <span>{t('addExpenseBtn', '+ খরচ যোগ')}</span>
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('addIncomeBtn', '+ আয় যোগ')}</span>
          </button>
        </div>
      </div>

      {/* Wallets Quick Bar */}
      {wallets.length > 0 && (
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500" />
            <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{t('yourWallets', 'আপনার ওয়ালেটস:')}</span>
          </div>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none min-w-0 py-0.5 px-1">
            {wallets.map((w) => (
              <button
                key={w.id}
                onClick={() => onNavigateTab('wallets')}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-brand-500 flex items-center gap-2 shrink-0 text-xs font-bold transition-all whitespace-nowrap"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: w.color || '#F74B00' }} />
                <span className="text-slate-700">{w.name}:</span>
                <span className="text-slate-900">{formatCurrency(w.initialBalance, currency, lang)}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigateTab('wallets')}
            className="text-xs font-bold text-brand-600 hover:underline shrink-0 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap pl-1"
          >
            <span>{t('allWallets', 'সব ওয়ালেট')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('todayExpense', 'আজকের খরচ')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(todayExpense, currency, lang)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'en' ? `Total ${toBnDigits(todayTransactions.filter(t => t.type === 'expense').length, lang)} expenses today` : `আজ মোট ${toBnDigits(todayTransactions.filter(t => t.type === 'expense').length, lang)} টি খরচ`}
            </p>
          </div>
        </div>

        {/* Today Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('todayIncome', 'আজকের আয়')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(todayIncome, currency, lang)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'en' ? `Total ${toBnDigits(todayTransactions.filter(t => t.type === 'income').length, lang)} incomes today` : `আজ মোট ${toBnDigits(todayTransactions.filter(t => t.type === 'income').length, lang)} টি আয়`}
            </p>
          </div>
        </div>

        {/* Current Total Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('currentBalance', 'বর্তমান মোট ব্যালেন্স')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {formatCurrency(totalBalance, currency, lang)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'en' ? 'Total accumulated balance' : 'সর্বমোট সর্বশেষ সঞ্চয় স্থিতিসমূহ'}
            </p>
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('monthExpense', 'এই মাসের মোট খরচ')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(monthExpense, currency, lang)}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <span>{lang === 'en' ? `Income: ${formatCurrency(monthIncome, currency, lang)}` : `আয়: ${formatCurrency(monthIncome, currency, lang)}`}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Section: Weekly Trend & Smart AI Advisor */}
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

        {/* AI Advisor Smart Insight Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-400 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  এআই ফাইন্যান্স এডভাইজার
                </span>
              </div>
              <span className="text-[11px] bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full">
                স্কোর: {aiData.healthScore}/১০০
              </span>
            </div>

            {aiData.insights.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-100 leading-snug">
                  {aiData.insights[0].title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiData.insights[0].desc}
                </p>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-xs text-amber-300">
                  💡 {aiData.insights[0].tip}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-base font-bold text-slate-100">
                  নিয়মিত হিসাব রাখুন
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  প্রতিদিনের খরচ ও জমা সঠিকভাবে লিখে রাখুন, সিস্টেম স্বয়ংক্রিয়ভাবে বাজেট টিপস প্রদান করবে।
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

      {/* Debt Summary Banner if any pending debts */}
      {(aiData.pendingDebtsGiven > 0 || aiData.pendingDebtsTaken > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">দেনা-পাওনা রিমাইন্ডার</p>
              <p className="text-xs text-amber-800 mt-0.5">
                আপনার মোট পাওনা: <strong>{formatCurrency(aiData.pendingDebtsGiven, currency)}</strong> | দেনা: <strong>{formatCurrency(aiData.pendingDebtsTaken, currency)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('debts')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            ধার-দেনা দেখুন →
          </button>
        </div>
      )}

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
