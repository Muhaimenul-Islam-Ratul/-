import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import DailyReport from './components/DailyReport';
import MonthlyReport from './components/MonthlyReport';
import History from './components/History';
import BudgetManager from './components/BudgetManager';
import Settings from './components/Settings';
import TransactionModal from './components/TransactionModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ProtectedGuard from './components/ProtectedGuard';

import WalletsManager from './components/WalletsManager';
import DebtTracker from './components/DebtTracker';
import RecurringManager from './components/RecurringManager';

import { AuthProvider, useAuth } from './context/AuthContext';
import {
  loadUserData,
  saveUserTransactions,
  saveUserCategories,
  saveUserBudgets,
  saveUserGoals,
  saveUserWallets,
  saveUserDebts,
  saveUserRecurring
} from './services/dbService';

import { DEFAULT_CATEGORIES } from './data/initialCategories';
import {
  SAMPLE_TRANSACTIONS,
  SAMPLE_SAVINGS_GOALS,
  DEFAULT_WALLETS,
  SAMPLE_DEBTS,
  SAMPLE_RECURRING
} from './data/sampleData';
import { getTodayString } from './utils/formatters';
import { Check, ShieldCheck } from 'lucide-react';

function MainAppContent() {
  const { currentUser } = useAuth();

  // Navigation State (Default to Landing Homepage)
  const [activeTab, setActiveTab] = useState('home');

  // Language State (Default: 'bn')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('amar_takar_hisab_lang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('amar_takar_hisab_lang', lang);
  }, [lang]);

  // App Data States
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [currency, setCurrency] = useState('৳');
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [categoriesBudgets, setCategoriesBudgets] = useState({});
  const [wallets, setWallets] = useState(DEFAULT_WALLETS);
  const [debts, setDebts] = useState([]);
  const [recurring, setRecurring] = useState([]);

  // Auth & Profile Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Transaction Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalInitialType, setModalInitialType] = useState('expense');
  const [modalInitialDate, setModalInitialDate] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // PWA Install Prompt & Online/Offline Status
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleOnline = () => {
      setIsOnline(true);
      showToast('🌐 আপনি অনলাইন আছেন! অফলাইন ডেটা অটো-সিঙ্ক হয়েছে।', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('⚡ অফলাইন মোড সক্রিয় — সব ডেটা লোকালি সেভ হচ্ছে!', 'info');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('📱 অ্যাপটি সফলভাবে ইনস্টল করা হয়েছে!');
      }
      setDeferredPrompt(null);
    } else {
      alert('📲 অ্যাপ হিসেবে ইনস্টল করার সহজ নিয়ম:\n\n• Android (Chrome): উপরে ডানের ৩টি ডটে ক্লিক করে "Add to Home screen" বা "Install app" চাপুন।\n\n• iPhone (Safari): নিচে/উপরে Share بٹন এ চাপ দিয়ে "Add to Home Screen" দিন।');
    }
  };

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Protected Tab Selection Wrapper
  const handleSelectTab = (tabId) => {
    if (!currentUser && tabId !== 'home') {
      setIsAuthModalOpen(true);
    }
    setActiveTab(tabId);
  };

  const isInitialLoaded = useRef(false);

  // Load User Data whenever currentUser changes (with real-time cloud sync across devices)
  useEffect(() => {
    isInitialLoaded.current = false;
    const userId = currentUser ? currentUser.uid : null;

    const { localData, unsubscribe } = loadUserData(userId, (cloudData) => {
      if (cloudData) {
        setTransactions(cloudData.transactions || []);
        setCategories(cloudData.categories || DEFAULT_CATEGORIES);
        setCategoriesBudgets(cloudData.budgets || {});
        setSavingsGoals(cloudData.goals || []);
        setWallets(cloudData.wallets || DEFAULT_WALLETS);
        setDebts(cloudData.debts || []);
        setRecurring(cloudData.recurring || []);
      }
      isInitialLoaded.current = true;
    });

    setTransactions(localData.transactions || []);
    setCategories(localData.categories || DEFAULT_CATEGORIES);
    setCategoriesBudgets(localData.budgets || {});
    setSavingsGoals(localData.goals || []);
    setWallets(localData.wallets || DEFAULT_WALLETS);
    setDebts(localData.debts || []);
    setRecurring(localData.recurring || []);

    const timer = setTimeout(() => {
      isInitialLoaded.current = true;
    }, 600);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Keep fullState updated via Ref
  const fullStateRef = useRef({
    transactions,
    categories,
    budgets: categoriesBudgets,
    goals: savingsGoals,
    wallets,
    debts,
    recurring
  });

  useEffect(() => {
    fullStateRef.current = {
      transactions,
      categories,
      budgets: categoriesBudgets,
      goals: savingsGoals,
      wallets,
      debts,
      recurring
    };
  }, [transactions, categories, categoriesBudgets, savingsGoals, wallets, debts, recurring]);

  // Persistence Effects (saves to local cache + syncs to Cloud Firestore ONLY when data changes after initial load)
  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserTransactions(userId, transactions, fullStateRef.current);
  }, [transactions]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserCategories(userId, categories, fullStateRef.current);
  }, [categories]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserBudgets(userId, categoriesBudgets, fullStateRef.current);
  }, [categoriesBudgets]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserGoals(userId, savingsGoals, fullStateRef.current);
  }, [savingsGoals]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserWallets(userId, wallets, fullStateRef.current);
  }, [wallets]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserDebts(userId, debts, fullStateRef.current);
  }, [debts]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const userId = currentUser ? currentUser.uid : null;
    saveUserRecurring(userId, recurring, fullStateRef.current);
  }, [recurring]);

  // Transaction Handlers
  const handleOpenAddModal = (type = 'expense', date = '') => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
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
      
      // Update target wallet balance automatically!
      if (txData.walletId) {
        setWallets(prev => prev.map(w => {
          if (w.id === txData.walletId) {
            const change = txData.type === 'income' ? Number(txData.amount) : -Number(txData.amount);
            return { ...w, initialBalance: Number(w.initialBalance || 0) + change };
          }
          return w;
        }));
      }

      showToast(txData.type === 'expense' ? 'নতুন খরচ যুক্ত করা হয়েছে!' : 'নতুন আয় যুক্ত করা হয়েছে!');
    }
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই রেকর্ডটি ডিলিট করতে চান?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('ট্রানজেকশন ডিলিট করা হয়েছে', 'info');
    }
  };

  // Wallet Handlers
  const handleAddWallet = (newWallet) => {
    setWallets(prev => [...prev, newWallet]);
    showToast('নতুন ওয়ালেট যোগ করা হয়েছে!');
  };

  const handleDeleteWallet = (walletId) => {
    if (window.confirm('এই ওয়ালেট ডিলিট করতে চান?')) {
      setWallets(prev => prev.filter(w => w.id !== walletId));
      showToast('ওয়ালেট মুছে ফেলা হয়েছে', 'info');
    }
  };

  const handleTransferMoney = ({ fromWalletId, toWalletId, amount, note }) => {
    const fromW = wallets.find(w => w.id === fromWalletId);
    const toW = wallets.find(w => w.id === toWalletId);

    if (!fromW || !toW) return;

    // Deduct from source wallet, add to target wallet
    setWallets(prev => prev.map(w => {
      if (w.id === fromWalletId) {
        return { ...w, initialBalance: Number(w.initialBalance) - amount };
      }
      if (w.id === toWalletId) {
        return { ...w, initialBalance: Number(w.initialBalance) + amount };
      }
      return w;
    }));

    // Record system transfer transactions
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = getTodayString();

    const transferOutTx = {
      id: `tx_tr_out_${Date.now()}`,
      amount,
      type: 'expense',
      categoryId: 'cat_other_exp',
      walletId: fromWalletId,
      date: dateStr,
      time: timeStr,
      note: `ট্রান্সফার পাঠানো হয়েছে [${toW.name}]: ${note}`
    };

    const transferInTx = {
      id: `tx_tr_in_${Date.now()}`,
      amount,
      type: 'income',
      categoryId: 'cat_other_inc',
      walletId: toWalletId,
      date: dateStr,
      time: timeStr,
      note: `ট্রান্সফার গ্রহণ করা হয়েছে [${fromW.name}]: ${note}`
    };

    setTransactions(prev => [transferOutTx, transferInTx, ...prev]);
    showToast('ফান্ড ট্রান্সফার সফল হয়েছে!');
  };

  // Debt Handlers
  const handleAddDebt = (newDebt) => {
    setDebts(prev => [newDebt, ...prev]);
    showToast('নতুন ধারের রেকর্ড যুক্ত হয়েছে!');
  };

  const handleUpdateDebtPayment = ({ debtId, newPaidAmount, status }) => {
    setDebts(prev => prev.map(d => d.id === debtId ? { ...d, paidAmount: newPaidAmount, status } : d));
    showToast('জমা হিসেব আপডেট হয়েছে!');
  };

  const handleDeleteDebt = (debtId) => {
    if (window.confirm('এই ধারের তথ্যটি মুছে ফেলতে চান?')) {
      setDebts(prev => prev.filter(d => d.id !== debtId));
      showToast('রেকর্ড মুছে ফেলা হয়েছে', 'info');
    }
  };

  // Recurring Handlers
  const handleAddRecurring = (newRec) => {
    setRecurring(prev => [...prev, newRec]);
    showToast('নতুন সাবস্ক্রিপশন যুক্ত করা হয়েছে!');
  };

  const handleDeleteRecurring = (recId) => {
    if (window.confirm('এই সাবস্ক্রিপশনটি ডিলিট করতে চান?')) {
      setRecurring(prev => prev.filter(r => r.id !== recId));
      showToast('সাবস্ক্রিপশন মুছে ফেলা হয়েছে', 'info');
    }
  };

  const handleProcessDueRecurring = () => {
    const todayStr = getTodayString();
    let processedCount = 0;
    const newTxs = [];

    const updatedRecurring = recurring.map(r => {
      if (r.lastProcessedDate !== todayStr) {
        processedCount++;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        newTxs.push({
          id: `tx_rec_${r.id}_${Date.now()}`,
          amount: r.amount,
          type: r.type,
          categoryId: r.categoryId,
          walletId: r.walletId,
          date: todayStr,
          time: timeStr,
          note: `অটো সাবস্ক্রিপশন: ${r.title}`
        });

        return { ...r, lastProcessedDate: todayStr };
      }
      return r;
    });

    if (newTxs.length > 0) {
      setTransactions(prev => [...newTxs, ...prev]);
      setRecurring(updatedRecurring);
      showToast(`${processedCount} টি রিঅ্যাকারিং এন্ট্রি প্রসেস করা হয়েছে!`);
    } else {
      showToast('আজকে কোনো নতুন ডিউ সাবস্ক্রিপশন এন্ট্রি নেই', 'info');
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
    setWallets(DEFAULT_WALLETS);
    setDebts(SAMPLE_DEBTS);
    setRecurring(SAMPLE_RECURRING);
    showToast('ডেমো ডেটা সফলভাবে লোড হয়েছে!');
  };

  const handleClearAllData = () => {
    if (window.confirm('সতর্কতা: আপনার সকল তথ্য স্থায়ীভাবে মুছে যাবে! এগিয়ে যাবেন?')) {
      setTransactions([]);
      setSavingsGoals([]);
      setDebts([]);
      setRecurring([]);
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
      wallets,
      debts,
      recurring,
      version: '2.0'
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
          if (parsed.wallets) setWallets(parsed.wallets);
          if (parsed.debts) setDebts(parsed.debts);
          if (parsed.recurring) setRecurring(parsed.recurring);
          showToast('ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!');
        } catch (err) {
          alert('ভুল ব্যাকআপ ফাইল ফর্মেট!');
        }
      };
    }
  };

  const pageNames = {
    dashboard: 'ড্যাশবোর্ড',
    wallets: 'ওয়ালেট ও ব্যাংক',
    daily: 'দৈনিক রিপোর্ট',
    monthly: 'মাসিক রিপোর্ট',
    history: 'সব হিসাব',
    budget: 'বাজেট ও লক্ষ্য',
    debts: 'ধার-দেনা',
    recurring: 'সাবস্ক্রিপশন',
    settings: 'সেটিংস'
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

      {/* User Login Banner Callout if Not Logged In */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              আপনার প্রোফাইল আলাদা ও শতভাগ প্রাইভেট রাখতে সাইন-ইন করুন।
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="ml-auto underline font-bold hover:text-amber-200 shrink-0"
            >
              সাইন-ইন / রেজিস্টার →
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onOpenAddModal={() => handleOpenAddModal('expense')}
        onLoadDemoData={handleLoadDemoData}
        onOpenSearch={() => handleSelectTab('history')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        currency={currency}
        totalBalance={transactions.reduce((sum, t) => t.type === 'income' ? sum + Number(t.amount || 0) : sum - Number(t.amount || 0), 0)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex pb-20 md:pb-8">
        
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSelectTab}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {/* Public Home Page */}
          {activeTab === 'home' && (
            <HomePage
              onNavigateTab={handleSelectTab}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* Protected Guard Screen if unauthenticated and trying to view protected pages */}
          {!currentUser && activeTab !== 'home' && (
            <ProtectedGuard
              pageName={pageNames[activeTab] || 'ড্যাশবোর্ড'}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onGoHome={() => setActiveTab('home')}
            />
          )}

          {/* Authenticated Protected Pages */}
          {currentUser && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  transactions={transactions}
                  categories={categories}
                  wallets={wallets}
                  debts={debts}
                  budgets={categoriesBudgets}
                  goals={savingsGoals}
                  currency={currency}
                  onOpenAddModal={handleOpenAddModal}
                  onNavigateTab={handleSelectTab}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              )}

              {activeTab === 'wallets' && (
                <WalletsManager
                  wallets={wallets}
                  onAddWallet={handleAddWallet}
                  onUpdateWallet={(w) => setWallets(prev => prev.map(item => item.id === w.id ? w : item))}
                  onDeleteWallet={handleDeleteWallet}
                  onTransferMoney={handleTransferMoney}
                  currency={currency}
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

              {activeTab === 'debts' && (
                <DebtTracker
                  debts={debts}
                  onAddDebt={handleAddDebt}
                  onUpdateDebtPayment={handleUpdateDebtPayment}
                  onDeleteDebt={handleDeleteDebt}
                  currency={currency}
                />
              )}

              {activeTab === 'recurring' && (
                <RecurringManager
                  recurring={recurring}
                  categories={categories}
                  wallets={wallets}
                  onAddRecurring={handleAddRecurring}
                  onDeleteRecurring={handleDeleteRecurring}
                  onProcessDueRecurring={handleProcessDueRecurring}
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
                  onInstallApp={handleInstallApp}
                  isOnline={isOnline}
                />
              )}
            </>
          )}

        </main>

      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        wallets={wallets}
        editingTransaction={editingTransaction}
        initialType={modalInitialType}
        initialDate={modalInitialDate}
      />

      {/* Login & Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Edit Profile & Nickname Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onShowToast={showToast}
        lang={lang}
        setLang={setLang}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
