import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Plus,
  TrendingUp,
  PiggyBank,
  Edit,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { formatCurrency, toBnDigits, formatBnDateShort } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function BudgetManager({
  transactions,
  categories,
  categoriesBudgets,
  onUpdateCategoryBudget,
  savingsGoals,
  onAddSavingsGoal,
  onUpdateGoalProgress,
  onDeleteSavingsGoal,
  currency
}) {
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  const monthExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Overall Monthly Budget calculation
  const totalCategoryBudgets = categories
    .filter(c => c.type === 'expense')
    .reduce((sum, cat) => sum + (categoriesBudgets[cat.id] || cat.budget || 0), 0);

  const overallBudgetPercentage = totalCategoryBudgets > 0
    ? (monthExpense / totalCategoryBudgets) * 100
    : 0;

  // New Goal Modal State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalInitial, setGoalInitial] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // Add Goal Deposit Modal State
  const [depositModalGoal, setDepositModalGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Edit Category Budget State
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingBudgetVal, setEditingBudgetVal] = useState('');

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    onAddSavingsGoal({
      id: 'goal_' + Date.now(),
      title: goalTitle,
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalInitial) || 0,
      targetDate: goalDate,
      color: '#F74B00'
    });

    setGoalTitle('');
    setGoalTarget('');
    setGoalInitial('');
    setGoalDate('');
    setShowGoalModal(false);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositModalGoal || !depositAmount) return;
    onUpdateGoalProgress(depositModalGoal.id, Number(depositAmount));
    setDepositModalGoal(null);
    setDepositAmount('');
  };

  const handleSaveCatBudget = (catId) => {
    onUpdateCategoryBudget(catId, Number(editingBudgetVal) || 0);
    setEditingCatId(null);
    setEditingBudgetVal('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner / Budget Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>বাজেট ও সেভিংস লক্ষ্য</span>
              <Target className="w-5 h-5 text-brand-600" />
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ক্যাটাগরি-ভিত্তিক বাজেট সেট করুন এবং সঞ্চয় লক্ষ্যের অগ্রগতি ট্র্যাকিং করুন
            </p>
          </div>

          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-brand transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>নতুন সঞ্চয় লক্ষ্য</span>
          </button>
        </div>

        {/* Overall Budget Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm font-semibold mb-2">
            <span className="text-slate-700">চলতি মাসের বাজেট ওভারভিউ</span>
            <span className={overallBudgetPercentage > 100 ? 'text-rose-600' : 'text-slate-900'}>
              {formatCurrency(monthExpense, currency)} / {formatCurrency(totalCategoryBudgets, currency)} ({toBnDigits(overallBudgetPercentage.toFixed(1))}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallBudgetPercentage > 100
                  ? 'bg-rose-500'
                  : overallBudgetPercentage > 80
                  ? 'bg-amber-500'
                  : 'bg-brand-500'
              }`}
              style={{ width: `${Math.min(overallBudgetPercentage, 100)}%` }}
            ></div>
          </div>

          {overallBudgetPercentage > 100 && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>সতর্কতা: আপনার চলতি মাসের খরচ নির্ধারিত মোট বাজেট ছাড়িয়ে গেছে!</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          ক্যাটাগরি ভিত্তিক বাজেট লিমিট
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          প্রতিটি খাতে বাজেট বরাদ্দ ও বর্তমান খরচের অনুপাত
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories
            .filter(c => c.type === 'expense')
            .map((cat) => {
              const categoryBudget = categoriesBudgets[cat.id] !== undefined 
                ? categoriesBudgets[cat.id] 
                : (cat.budget || 0);

              const spent = monthTransactions
                .filter(t => t.categoryId === cat.id && t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

              const percentage = categoryBudget > 0 ? (spent / categoryBudget) * 100 : 0;
              const isOver = percentage > 100;
              const isWarning = percentage >= 80 && percentage <= 100;

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isOver
                      ? 'bg-rose-50/40 border-rose-200'
                      : isWarning
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/60 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: cat.bgColor, color: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                        <p className="text-xs text-slate-400">
                          বাজেট: {formatCurrency(categoryBudget, currency)}
                        </p>
                      </div>
                    </div>

                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editingBudgetVal}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
                            if (val === '' || /^\d*\.?\d*$/.test(val)) setEditingBudgetVal(val);
                          }}
                          placeholder="বাজেট"
                          className="w-20 px-2 py-1 text-xs border rounded-lg"
                        />
                        <button
                          onClick={() => handleSaveCatBudget(cat.id)}
                          className="text-xs bg-brand-500 text-white px-2 py-1 rounded-lg"
                        >
                          সেভ
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditingBudgetVal(categoryBudget);
                        }}
                        className="text-xs text-slate-400 hover:text-brand-600 p-1"
                        title="বাজেট পরিবর্তনের অপশন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">খরচ হয়েছে: {formatCurrency(spent, currency)}</span>
                      <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {toBnDigits(percentage.toFixed(0))}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>সঞ্চয় লক্ষ্যসমূহ (Savings Goals)</span>
              <PiggyBank className="w-5 h-5 text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              স্বপ্নের যেকোনো কিছু কেনার জন্য জমানো টাকার ট্র্যাকিং
            </p>
          </div>
        </div>

        {savingsGoals.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-sm text-slate-400">এখনো কোন সঞ্চয় লক্ষ্য যোগ করা হয়নি।</p>
            <button
              onClick={() => setShowGoalModal(true)}
              className="mt-3 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
            >
              + নতুন লক্ষ্য সেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savingsGoals.map((goal) => {
              const progress = goal.targetAmount > 0 
                ? (goal.currentAmount / goal.targetAmount) * 100 
                : 0;
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{goal.title}</h4>
                        {goal.targetDate && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            টার্গেট ডেট: {formatBnDateShort(goal.targetDate)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteSavingsGoal(goal.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="text-xl font-bold text-emerald-600">
                        {formatCurrency(goal.currentAmount, currency)}
                      </div>
                      <p className="text-xs text-slate-500">
                        টার্গেট: {formatCurrency(goal.targetAmount, currency)}
                      </p>

                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {toBnDigits(progress.toFixed(0))}% সম্পন্ন
                    </span>

                    <button
                      onClick={() => setDepositModalGoal(goal)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>টাকা জমান</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              নতুন সঞ্চয় লক্ষ্য যোগ করুন
            </h3>
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  লক্ষ্যের নাম (Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: নতুন বাইক ফান্ড"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    টার্গেট টাকা (৳)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="৫০,০০০"
                    value={goalTarget}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
                      if (val === '' || /^\d*\.?\d*$/.test(val)) setGoalTarget(val);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    বর্তমানে জমানো টাকা
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="০"
                    value={goalInitial}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
                      if (val === '' || /^\d*\.?\d*$/.test(val)) setGoalInitial(val);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  টার্গেট পূরণ করার তারিখ (ঐচ্ছিক)
                </label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-brand"
                >
                  লক্ষ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              জমা যোগ করুন: {depositModalGoal.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              কত টাকা এই লক্ষ্যে জমা করতে চান?
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <input
                  type="number"
                  required
                  autoFocus
                  placeholder="টাকার পরিমাণ লিখুন"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  + জমা যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
