import { formatCurrency } from './formatters';

export function generateAIInsights({
  transactions = [],
  categories = [],
  budgets = {},
  goals = [],
  debts = [],
  currency = '৳'
}) {
  const currentMonthPrefix = new Date().toISOString().slice(0, 7); // e.g. '2026-07'
  
  // Filter current month transactions
  const monthTxs = transactions.filter(t => (t.date || '').startsWith(currentMonthPrefix));
  
  const totalIncome = monthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = monthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Category Breakdown
  const catExpenses = {};
  monthTxs.filter(t => t.type === 'expense').forEach(t => {
    catExpenses[t.categoryId] = (catExpenses[t.categoryId] || 0) + Number(t.amount || 0);
  });

  // Top spending category
  let topCatId = null;
  let topCatAmount = 0;
  Object.entries(catExpenses).forEach(([catId, amt]) => {
    if (amt > topCatAmount) {
      topCatAmount = amt;
      topCatId = catId;
    }
  });

  const topCategoryObj = categories.find(c => c.id === topCatId) || { name: 'অন্যান্য খরচ' };
  const topCatPercentage = totalExpense > 0 ? Math.round((topCatAmount / totalExpense) * 100) : 0;

  // Budget Breach Checks
  const budgetAlerts = [];
  Object.entries(budgets).forEach(([catId, limit]) => {
    if (limit > 0) {
      const spent = catExpenses[catId] || 0;
      const pct = Math.round((spent / limit) * 100);
      const cat = categories.find(c => c.id === catId);
      if (pct >= 80) {
        budgetAlerts.push({
          categoryName: cat ? cat.name : 'ক্যাটাগরি',
          spent,
          limit,
          pct,
          isOver: pct >= 100
        });
      }
    }
  });

  // Debt Overview
  const pendingDebtsTaken = debts
    .filter(d => d.type === 'taken' && d.status !== 'paid')
    .reduce((sum, d) => sum + (Number(d.totalAmount) - Number(d.paidAmount || 0)), 0);

  const pendingDebtsGiven = debts
    .filter(d => d.type === 'given' && d.status !== 'paid')
    .reduce((sum, d) => sum + (Number(d.totalAmount) - Number(d.paidAmount || 0)), 0);

  // Health Score Calculation (0 to 100)
  let healthScore = 70;
  if (savingsRate >= 30) healthScore += 20;
  else if (savingsRate >= 15) healthScore += 10;
  else if (savingsRate < 0) healthScore -= 30;

  if (budgetAlerts.some(b => b.isOver)) healthScore -= 15;
  if (pendingDebtsTaken > totalIncome * 0.5) healthScore -= 15;

  healthScore = Math.max(10, Math.min(100, healthScore));

  // Insights List
  const insights = [];

  // Top spending insight
  if (topCatAmount > 0) {
    insights.push({
      id: 'top_spend',
      type: 'warning',
      title: 'সর্বোচ্চ খরচের খাত',
      desc: `এই মাসে আপনার সবচেয়ে বেশি খরচ হয়েছে **${topCategoryObj.name}** খাতে (${formatCurrency(topCatAmount, currency)}), যা আপনার মোট খরচের **${topCatPercentage}%**।`,
      tip: topCatPercentage > 35 ? 'পরামর্শ: এই খাতে আগামী মাসে ১৫%-২০% খরচ কমানোর লক্ষ্য নির্ধারণ করুন।' : 'বেশ ভালো নিয়ন্ত্রণ বজায় রাখছেন!'
    });
  }

  // Budget warnings
  budgetAlerts.forEach(b => {
    insights.push({
      id: `budget_${b.categoryName}`,
      type: b.isOver ? 'danger' : 'warning',
      title: b.isOver ? `বাজেট ছাড়িয়ে গেছে (${b.categoryName})` : `বাজেট লিমিটের কাছাকাছি (${b.categoryName})`,
      desc: `${b.categoryName} খাতে খরচ হয়েছে ${formatCurrency(b.spent, currency)} (বাজেট ${formatCurrency(b.limit, currency)}, ${b.pct}%)।`,
      tip: b.isOver ? 'জরুরি না হলে এই খাতে নতুন ব্যয় বন্ধ রাখুন।' : 'সতর্ক থাকুন, সীমা অতিক্রান্ত হতে পারে।'
    });
  });

  // Savings health
  if (totalIncome > 0) {
    insights.push({
      id: 'savings_rate',
      type: savingsRate >= 20 ? 'success' : (savingsRate > 0 ? 'info' : 'danger'),
      title: `মাসিক সঞ্চয় হার (${savingsRate}%)`,
      desc: savingsRate >= 20 
        ? `অসাধারণ! আপনার আয়ের ${savingsRate}% সঞ্চয় হচ্ছে।`
        : (savingsRate > 0 
          ? `আপনার সঞ্চয় হার ${savingsRate}%। আদর্শভাবে অন্তত ২০% সঞ্চয় রাখা উচিত।` 
          : `সতর্কতা: এই মাসে আপনার আয় অপেক্ষা খরচ বেশি হয়েছে!`),
      tip: savingsRate < 20 ? 'অপ্রয়োজনীয় মেস/অফিস স্ন্যাকস বা ইমপালস শপিং নিয়ন্ত্রণে আনুন।' : 'আপনার সঞ্চয় লক্ষ্যগুলোতে টাকা স্থানান্তর করার জন্য দারুণ সময়!'
    });
  }

  // Debt alert
  if (pendingDebtsTaken > 0) {
    insights.push({
      id: 'debt_alert',
      type: 'warning',
      title: 'বকেয়া দেনা পরিশোধ',
      desc: `আপনার মোট ধার করা দেনা বাকি আছে ${formatCurrency(pendingDebtsTaken, currency)}।`,
      tip: 'মাসের বেতনের একটি অংশ প্রথমে দেনা পরিশোধের জন্য বরাদ্দ রাখুন।'
    });
  }

  return {
    healthScore,
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    topCategoryObj,
    topCatAmount,
    topCatPercentage,
    pendingDebtsTaken,
    pendingDebtsGiven,
    budgetAlerts,
    insights
  };
}
