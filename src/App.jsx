import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailyReport from './components/DailyReport';
import MonthlyReport from './components/MonthlyReport';
import History from './components/History';
import BudgetManager from './components/BudgetManager';
import Settings from './components/Settings';
import TransactionModal from './components/TransactionModal';

import { DEFAULT_CATEGORIES } from './data/initialCategories';
import { SAMPLE_TRANSACTIONS, SAMPLE_SAVINGS_GOALS } from './data/sampleData';
import { getTodayString } from './utils/formatters';
import { Check, AlertCircle, X, Search } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // App Data States (with LocalStorage)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('amar_takar_hisab_txs');
    return saved ? JSON.parse(saved) : SAMPLE_TRANSACTIONS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('amar_takar_hisab_cats');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('amar_takar_hisab_currency') || '৳';
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('amar_takar_hisab_goals');
    return saved ? JSON.parse(saved) : SAMPLE_SAVINGS_GOALS;
  });

  const [categoriesBudgets, setCategoriesBudgets] = useState(() => {
    const saved = localStorage.getItem('amar_takar_hisab_budgets');
    return saved ? JSON.parse(saved) : {};
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalInitialType, setModalInitialType] = useState('expense');
  const [modalInitialDate, setModalInitialDate] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('amar_takar_hisab_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('amar_takar_hisab_cats', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('amar_takar_hisab_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('amar_takar_hisab_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('amar_takar_hisab_budgets', JSON.stringify(categoriesBudgets));
  }, [categoriesBudgets]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Transaction Handlers
  const handleOpenAddModal = (type = 'expense', date = '') => {
    setEditingTransaction(null);
    setModalInitialType(type);
    setModalInitialDate(date || getTodayString());
    setIsModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (txData) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === txData.id ? txData : t));
      showToast('হিসাব সফলভাবে পরিবর্তন করা হয়েছে');
    } else {
      setTransactions(prev => [txData, ...prev]);
      showToast(txData.type === 'expense' ? 'নতুন খরচ যুক্ত করা হয়েছে!' : 'নতুন আয় যুক্ত করা হয়েছে!');
    }
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই রেকর্ডটি ডিলিট করতে চান?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('ট্রানজেকশন ডিলিট করা হয়েছে', 'info');
    }
  };

  // Category Handlers
  const handleAddCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    showToast('নতুন ক্যাটাগরি যোগ করা হয়েছে!');
  };

  const handleDeleteCategory = (catId) => {
    if (window.confirm('এই ক্যাটাগরি ডিলিট করতে চান?')) {
      setCategories(prev => prev.filter(c => c.id !== catId));
      showToast('ক্যাটাগরি মুছে ফেলা হয়েছে', 'info');
    }
  };

  const handleUpdateCategoryBudget = (catId, amount) => {
    setCategoriesBudgets(prev => ({ ...prev, [catId]: amount }));
    showToast('ক্যাটাগরি বাজেট আপডেট করা হয়েছে');
  };

  // Savings Goal Handlers
  const handleAddSavingsGoal = (goal) => {
    setSavingsGoals(prev => [...prev, goal]);
    showToast('নতুন সঞ্চয় লক্ষ্য যুক্ত হয়েছে!');
  };

  const handleUpdateGoalProgress = (goalId, addedAmount) => {
    setSavingsGoals(prev =>
      prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + addedAmount } : g)
    );
    showToast('জমা যুক্ত হয়েছে!');
  };

  const handleDeleteSavingsGoal = (goalId) => {
    if (window.confirm('এই লক্ষ্যটি ডিলিট করতে চান?')) {
      setSavingsGoals(prev => prev.filter(g => g.id !== goalId));
      showToast('লক্ষ্য মুছে ফেলা হয়েছে', 'info');
    }
  };

  // Demo Data & Backup Handlers
  const handleLoadDemoData = () => {
    setTransactions(SAMPLE_TRANSACTIONS);
    setCategories(DEFAULT_CATEGORIES);
    setSavingsGoals(SAMPLE_SAVINGS_GOALS);
    showToast('ডেমো ডেটা সফলভাবে লোড হয়েছে!');
  };

  const handleClearAllData = () => {
    if (window.confirm('সতর্কতা: আপনার সকল তথ্য স্থায়ীভাবে মুছে যাবে! এগিয়ে যাবেন?')) {
      setTransactions([]);
      setSavingsGoals([]);
      showToast('সকল ডেটা পরিষ্কার করা হয়েছে', 'warning');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Time', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.time || '',
      t.type,
      t.categoryId,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amar_takar_hisab_${getTodayString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV ফাইল এক্সপোর্ট হয়েছে!');
  };

  // JSON Backup Export / Import
  const handleExportJSON = () => {
    const data = {
      transactions,
      categories,
      currency,
      savingsGoals,
      categoriesBudgets,
      version: '1.0'
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `amar_takar_hisab_backup_${getTodayString()}.json`;
    link.click();
    showToast('JSON ব্যাকআপ ডাউনলোড হয়েছে!');
  };

  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.transactions) setTransactions(parsed.transactions);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.currency) setCurrency(parsed.currency);
          if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
          if (parsed.categoriesBudgets) setCategoriesBudgets(parsed.categoriesBudgets);
          showToast('ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!');
        } catch (err) {
          alert('ভুল ব্যাকআপ ফাইল ফর্মেট!');
        }
      };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-800">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onOpenAddModal={() => handleOpenAddModal('expense')}
        onLoadDemoData={handleLoadDemoData}
        onOpenSearch={() => {
          setActiveTab('history');
        }}
        currency={currency}
        totalBalance={transactions.reduce((sum, t) => t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount), 0)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex pb-20 md:pb-8">
        
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => handleOpenAddModal('expense')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              transactions={transactions}
              categories={categories}
              currency={currency}
              onOpenAddModal={handleOpenAddModal}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'daily' && (
            <DailyReport
              transactions={transactions}
              categories={categories}
              currency={currency}
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'monthly' && (
            <MonthlyReport
              transactions={transactions}
              categories={categories}
              currency={currency}
            />
          )}

          {activeTab === 'history' && (
            <History
              transactions={transactions}
              categories={categories}
              currency={currency}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={handleOpenAddModal}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetManager
              transactions={transactions}
              categories={categories}
              categoriesBudgets={categoriesBudgets}
              onUpdateCategoryBudget={handleUpdateCategoryBudget}
              savingsGoals={savingsGoals}
              onAddSavingsGoal={handleAddSavingsGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onDeleteSavingsGoal={handleDeleteSavingsGoal}
              currency={currency}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              currency={currency}
              setCurrency={setCurrency}
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
              onLoadDemoData={handleLoadDemoData}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>

      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
        initialType={modalInitialType}
        initialDate={modalInitialDate}
      />

    </div>
  );
}
