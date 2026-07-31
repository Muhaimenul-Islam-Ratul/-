import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
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

// Load User Data (returns local cache first + subscribes to Firestore real-time cloud sync across devices)
export function loadUserData(userId, onCloudUpdate) {
  const keys = getUserStorageKeys(userId);

  const txsRaw = localStorage.getItem(keys.txsKey);
  const catsRaw = localStorage.getItem(keys.catsKey);
  const budgetsRaw = localStorage.getItem(keys.budgetsKey);
  const goalsRaw = localStorage.getItem(keys.goalsKey);
  const walletsRaw = localStorage.getItem(keys.walletsKey);
  const debtsRaw = localStorage.getItem(keys.debtsKey);
  const recurringRaw = localStorage.getItem(keys.recurringKey);

  const localData = {
    transactions: txsRaw ? JSON.parse(txsRaw) : (userId ? [] : SAMPLE_TRANSACTIONS),
    categories: catsRaw ? JSON.parse(catsRaw) : DEFAULT_CATEGORIES,
    budgets: budgetsRaw ? JSON.parse(budgetsRaw) : {},
    goals: goalsRaw ? JSON.parse(goalsRaw) : (userId ? [] : SAMPLE_SAVINGS_GOALS),
    wallets: walletsRaw ? JSON.parse(walletsRaw) : (userId ? DEFAULT_WALLETS.map(w => ({ ...w, initialBalance: 0 })) : DEFAULT_WALLETS),
    debts: debtsRaw ? JSON.parse(debtsRaw) : (userId ? [] : SAMPLE_DEBTS),
    recurring: recurringRaw ? JSON.parse(recurringRaw) : (userId ? [] : SAMPLE_RECURRING)
  };

  let unsubscribe = null;

  // If user is logged in, subscribe to real-time cloud changes from Firestore
  if (userId) {
    try {
      const userDocRef = doc(db, 'user_data', userId);

      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();

          if (cloudData) {
            if (cloudData.transactions) {
              localStorage.setItem(keys.txsKey, JSON.stringify(cloudData.transactions));
            }
            if (cloudData.categories) {
              localStorage.setItem(keys.catsKey, JSON.stringify(cloudData.categories));
            }
            if (cloudData.budgets) {
              localStorage.setItem(keys.budgetsKey, JSON.stringify(cloudData.budgets));
            }
            if (cloudData.goals) {
              localStorage.setItem(keys.goalsKey, JSON.stringify(cloudData.goals));
            }
            if (cloudData.wallets) {
              localStorage.setItem(keys.walletsKey, JSON.stringify(cloudData.wallets));
            }
            if (cloudData.debts) {
              localStorage.setItem(keys.debtsKey, JSON.stringify(cloudData.debts));
            }
            if (cloudData.recurring) {
              localStorage.setItem(keys.recurringKey, JSON.stringify(cloudData.recurring));
            }

            if (onCloudUpdate) {
              onCloudUpdate({
                transactions: cloudData.transactions || [],
                categories: cloudData.categories || DEFAULT_CATEGORIES,
                budgets: cloudData.budgets || {},
                goals: cloudData.goals || [],
                wallets: cloudData.wallets || DEFAULT_WALLETS,
                debts: cloudData.debts || [],
                recurring: cloudData.recurring || []
              });
            }
          }
        } else {
          // First time user login: initialize cloud document with localData
          syncUserDataToCloud(userId, localData);
        }
      }, (err) => {
        console.warn('Firestore cloud sync notice:', err);
      });
    } catch (err) {
      console.warn('Firestore connection notice:', err);
    }
  }

  return { localData, unsubscribe };
}

// Sync full state object to Cloud Firestore
export async function syncUserDataToCloud(userId, data) {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'user_data', userId);
    await setDoc(userDocRef, {
      transactions: data.transactions || [],
      categories: data.categories || DEFAULT_CATEGORIES,
      budgets: data.budgets || {},
      goals: data.goals || [],
      wallets: data.wallets || DEFAULT_WALLETS,
      debts: data.debts || [],
      recurring: data.recurring || [],
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore cloud sync error:', err);
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
