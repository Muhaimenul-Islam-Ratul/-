import { DEFAULT_CATEGORIES } from '../data/initialCategories';
import {
  SAMPLE_TRANSACTIONS,
  SAMPLE_SAVINGS_GOALS,
  DEFAULT_WALLETS,
  SAMPLE_DEBTS,
  SAMPLE_RECURRING
} from '../data/sampleData';

// User-Specific Storage Keys Helper
export function getUserStorageKeys(userId) {
  const prefix = userId ? `user_${userId}` : 'guest';
  return {
    txsKey: `amar_takar_hisab_txs_${prefix}`,
    catsKey: `amar_takar_hisab_cats_${prefix}`,
    budgetsKey: `amar_takar_hisab_budgets_${prefix}`,
    goalsKey: `amar_takar_hisab_goals_${prefix}`,
    walletsKey: `amar_takar_hisab_wallets_${prefix}`,
    debtsKey: `amar_takar_hisab_debts_${prefix}`,
    recurringKey: `amar_takar_hisab_recurring_${prefix}`
  };
}

// Load User Data (Instant Local Cache + Async MongoDB Cloud Fetch & Polling for Cross-Device Sync)
export function loadUserData(userId, onCloudUpdate) {
  const keys = getUserStorageKeys(userId);

  let txsRaw = localStorage.getItem(keys.txsKey);
  const catsRaw = localStorage.getItem(keys.catsKey);
  const budgetsRaw = localStorage.getItem(keys.budgetsKey);
  const goalsRaw = localStorage.getItem(keys.goalsKey);
  const walletsRaw = localStorage.getItem(keys.walletsKey);
  const debtsRaw = localStorage.getItem(keys.debtsKey);
  const recurringRaw = localStorage.getItem(keys.recurringKey);

  // If user transactions are empty for this user ID, fallback to guest transactions if available
  if (!txsRaw && userId) {
    const guestTxs = localStorage.getItem('amar_takar_hisab_txs_guest');
    if (guestTxs && guestTxs !== '[]') {
      txsRaw = guestTxs;
    }
  }

  const localData = {
    transactions: txsRaw ? JSON.parse(txsRaw) : (userId ? [] : SAMPLE_TRANSACTIONS),
    categories: catsRaw ? JSON.parse(catsRaw) : DEFAULT_CATEGORIES,
    budgets: budgetsRaw ? JSON.parse(budgetsRaw) : {},
    goals: goalsRaw ? JSON.parse(goalsRaw) : (userId ? [] : SAMPLE_SAVINGS_GOALS),
    wallets: walletsRaw ? JSON.parse(walletsRaw) : (userId ? DEFAULT_WALLETS.map(w => ({ ...w, initialBalance: 0 })) : DEFAULT_WALLETS),
    debts: debtsRaw ? JSON.parse(debtsRaw) : (userId ? [] : SAMPLE_DEBTS),
    recurring: recurringRaw ? JSON.parse(recurringRaw) : (userId ? [] : SAMPLE_RECURRING)
  };

  let intervalId = null;

  const fetchCloudData = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/userData?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) return;
      const cloudData = await res.json();

      if (cloudData) {
        let cloudTxs = cloudData.transactions || [];

        // Read current local cache
        const currentLocalRaw = localStorage.getItem(keys.txsKey);
        const currentLocalTxs = currentLocalRaw ? JSON.parse(currentLocalRaw) : [];

        // Auto-migrate local transactions to MongoDB if new cloud database has 0 transactions
        if (cloudTxs.length === 0 && currentLocalTxs.length > 0) {
          cloudTxs = currentLocalTxs;
          syncUserDataToCloud(userId, { ...localData, transactions: currentLocalTxs });
        }

        // Intelligently merge cloud transactions with local transactions so recently added inputs are never lost
        const mergedMap = new Map();
        currentLocalTxs.forEach(tx => mergedMap.set(tx.id, tx));
        cloudTxs.forEach(tx => mergedMap.set(tx.id, tx));
        const finalTxs = Array.from(mergedMap.values());

        if (finalTxs.length > 0) localStorage.setItem(keys.txsKey, JSON.stringify(finalTxs));
        if (cloudData.categories) localStorage.setItem(keys.catsKey, JSON.stringify(cloudData.categories));
        if (cloudData.budgets) localStorage.setItem(keys.budgetsKey, JSON.stringify(cloudData.budgets));
        if (cloudData.goals) localStorage.setItem(keys.goalsKey, JSON.stringify(cloudData.goals));
        if (cloudData.wallets) localStorage.setItem(keys.walletsKey, JSON.stringify(cloudData.wallets));
        if (cloudData.debts) localStorage.setItem(keys.debtsKey, JSON.stringify(cloudData.debts));
        if (cloudData.recurring) localStorage.setItem(keys.recurringKey, JSON.stringify(cloudData.recurring));

        if (onCloudUpdate) {
          onCloudUpdate({
            transactions: finalTxs,
            categories: cloudData.categories && cloudData.categories.length > 0 ? cloudData.categories : localData.categories,
            budgets: cloudData.budgets || localData.budgets,
            goals: cloudData.goals || localData.goals,
            wallets: cloudData.wallets && cloudData.wallets.length > 0 ? cloudData.wallets : localData.wallets,
            debts: cloudData.debts || localData.debts,
            recurring: cloudData.recurring || localData.recurring
          });
        }
      }
    } catch (err) {
      console.warn('MongoDB API fetch notice:', err);
    }
  };

  if (userId) {
    // Initial Fetch
    fetchCloudData();
    // Poll every 15 seconds for cross-device sync
    intervalId = setInterval(fetchCloudData, 15000);
  }

  const unsubscribe = () => {
    if (intervalId) clearInterval(intervalId);
  };

  return { localData, unsubscribe };
}

// Sync full state to MongoDB Cloud API
export async function syncUserDataToCloud(userId, data) {
  if (!userId) return;
  try {
    // 1. Sync User Settings (Wallets, Budgets, Goals, Debts, Recurring, Categories)
    await fetch('/api/userData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        categories: data.categories || DEFAULT_CATEGORIES,
        budgets: data.budgets || {},
        goals: data.goals || [],
        wallets: data.wallets || DEFAULT_WALLETS,
        debts: data.debts || [],
        recurring: data.recurring || []
      })
    });

    // 2. Sync Transactions in a single bulk API call
    if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, transactions: data.transactions })
      });
    }
  } catch (err) {
    console.warn('MongoDB Cloud Sync error:', err);
  }
}

// Save User Transactions
export function saveUserTransactions(userId, transactions, fullState = {}) {
  const { txsKey } = getUserStorageKeys(userId);
  localStorage.setItem(txsKey, JSON.stringify(transactions));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, transactions });
  }
}

// Save User Categories
export function saveUserCategories(userId, categories, fullState = {}) {
  const { catsKey } = getUserStorageKeys(userId);
  localStorage.setItem(catsKey, JSON.stringify(categories));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, categories });
  }
}

// Save User Budgets
export function saveUserBudgets(userId, budgets, fullState = {}) {
  const { budgetsKey } = getUserStorageKeys(userId);
  localStorage.setItem(budgetsKey, JSON.stringify(budgets));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, budgets });
  }
}

// Save User Savings Goals
export function saveUserGoals(userId, goals, fullState = {}) {
  const { goalsKey } = getUserStorageKeys(userId);
  localStorage.setItem(goalsKey, JSON.stringify(goals));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, goals });
  }
}

// Save User Wallets
export function saveUserWallets(userId, wallets, fullState = {}) {
  const { walletsKey } = getUserStorageKeys(userId);
  localStorage.setItem(walletsKey, JSON.stringify(wallets));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, wallets });
  }
}

// Save User Debts
export function saveUserDebts(userId, debts, fullState = {}) {
  const { debtsKey } = getUserStorageKeys(userId);
  localStorage.setItem(debtsKey, JSON.stringify(debts));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, debts });
  }
}

// Save User Recurring Subscriptions
export function saveUserRecurring(userId, recurring, fullState = {}) {
  const { recurringKey } = getUserStorageKeys(userId);
  localStorage.setItem(recurringKey, JSON.stringify(recurring));
  if (userId) {
    syncUserDataToCloud(userId, { ...fullState, recurring });
  }
}
