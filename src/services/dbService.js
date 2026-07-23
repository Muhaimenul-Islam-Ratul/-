import { DEFAULT_CATEGORIES } from '../data/initialCategories';
import { SAMPLE_TRANSACTIONS, SAMPLE_SAVINGS_GOALS } from '../data/sampleData';

// User-Specific Storage Keys Helper
export function getUserStorageKeys(userId) {
  const prefix = userId ? `user_${userId}` : 'guest';
  return {
    txsKey: `amar_takar_hisab_txs_${prefix}`,
    catsKey: `amar_takar_hisab_cats_${prefix}`,
    budgetsKey: `amar_takar_hisab_budgets_${prefix}`,
    goalsKey: `amar_takar_hisab_goals_${prefix}`
  };
}

// Load User Data with total privacy isolation
export function loadUserData(userId) {
  const { txsKey, catsKey, budgetsKey, goalsKey } = getUserStorageKeys(userId);

  const txsRaw = localStorage.getItem(txsKey);
  const catsRaw = localStorage.getItem(catsKey);
  const budgetsRaw = localStorage.getItem(budgetsKey);
  const goalsRaw = localStorage.getItem(goalsKey);

  return {
    transactions: txsRaw ? JSON.parse(txsRaw) : (userId ? [] : SAMPLE_TRANSACTIONS),
    categories: catsRaw ? JSON.parse(catsRaw) : DEFAULT_CATEGORIES,
    budgets: budgetsRaw ? JSON.parse(budgetsRaw) : {},
    goals: goalsRaw ? JSON.parse(goalsRaw) : (userId ? [] : SAMPLE_SAVINGS_GOALS)
  };
}

// Save User Transactions
export function saveUserTransactions(userId, transactions) {
  const { txsKey } = getUserStorageKeys(userId);
  localStorage.setItem(txsKey, JSON.stringify(transactions));
}

// Save User Categories
export function saveUserCategories(userId, categories) {
  const { catsKey } = getUserStorageKeys(userId);
  localStorage.setItem(catsKey, JSON.stringify(categories));
}

// Save User Budgets
export function saveUserBudgets(userId, budgets) {
  const { budgetsKey } = getUserStorageKeys(userId);
  localStorage.setItem(budgetsKey, JSON.stringify(budgets));
}

// Save User Savings Goals
export function saveUserGoals(userId, goals) {
  const { goalsKey } = getUserStorageKeys(userId);
  localStorage.setItem(goalsKey, JSON.stringify(goals));
}
