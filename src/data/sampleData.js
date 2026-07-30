export const SAMPLE_TRANSACTIONS = [
  // Today's Transactions (July 23, 2026)
  {
    id: 'tx_101',
    amount: 350,
    type: 'expense',
    categoryId: 'cat_food',
    date: '2026-07-23',
    time: '13:15',
    note: 'দুপুরের খাবার ও রিফ্রেশমেন্ট',
    tags: ['খাবার', 'জরুরি']
  },
  {
    id: 'tx_102',
    amount: 120,
    type: 'expense',
    categoryId: 'cat_transport',
    date: '2026-07-23',
    time: '09:30',
    note: 'অফিস যাতায়াত রিকশা ভাড়া',
    tags: ['যাতায়াত']
  },
  {
    id: 'tx_103',
    amount: 1500,
    type: 'income',
    categoryId: 'cat_freelance',
    date: '2026-07-23',
    time: '11:00',
    note: 'লোগো ডিজাইন ফ্রিল্যান্স ক্লায়েন্ট পেমেন্ট',
    tags: ['ফ্রিল্যান্সিং']
  },

  // July 2026 Transactions
  {
    id: 'tx_104',
    amount: 50000,
    type: 'income',
    categoryId: 'cat_salary',
    date: '2026-07-01',
    time: '10:00',
    note: 'জুলাই মাসের মাসিক বেতন',
    tags: ['বেতন']
  },
  {
    id: 'tx_105',
    amount: 10000,
    type: 'expense',
    categoryId: 'cat_bills',
    date: '2026-07-02',
    time: '14:00',
    note: 'বাসা ভাড়া জুলাই',
    tags: ['বাসা ভাড়া']
  },
  {
    id: 'tx_106',
    amount: 1800,
    type: 'expense',
    categoryId: 'cat_bills',
    date: '2026-07-03',
    time: '16:30',
    note: 'বিদ্যুৎ ও ইন্টারনেট বিল',
    tags: ['বিল']
  },
  {
    id: 'tx_107',
    amount: 2400,
    type: 'expense',
    categoryId: 'cat_food',
    date: '2026-07-05',
    time: '18:45',
    note: 'সাপ্তাহিক সুপারশপ বাজার',
    tags: ['মুদি বাজার']
  },
  {
    id: 'tx_108',
    amount: 450,
    type: 'expense',
    categoryId: 'cat_transport',
    date: '2026-07-07',
    time: '19:10',
    note: 'উবার সিএনজি ভাড়া',
    tags: ['যাতায়াত']
  },
  {
    id: 'tx_109',
    amount: 1200,
    type: 'expense',
    categoryId: 'cat_health',
    date: '2026-07-10',
    time: '11:20',
    note: 'ডাক্তারের ফি ও ওষুধ কেনা',
    tags: ['চিকিৎসা']
  },
  {
    id: 'tx_110',
    amount: 3200,
    type: 'expense',
    categoryId: 'cat_shopping',
    date: '2026-07-12',
    time: '17:00',
    note: 'ঈদের পাঞ্জাবি ও জুতা কেনা',
    tags: ['কেনাকাটা']
  },
  {
    id: 'tx_111',
    amount: 8000,
    type: 'income',
    categoryId: 'cat_business',
    date: '2026-07-15',
    time: '15:00',
    note: 'অনলাইন শপ প্রোডাক্ট সেলস লাভ',
    tags: ['ব্যবসা']
  },
  {
    id: 'tx_112',
    amount: 1650,
    type: 'expense',
    categoryId: 'cat_food',
    date: '2026-07-16',
    time: '20:30',
    note: 'বন্ধুদের সাথে রেস্টুরেন্টে ডিনার',
    tags: ['খাবার']
  },
  {
    id: 'tx_113',
    amount: 850,
    type: 'expense',
    categoryId: 'cat_entertainment',
    date: '2026-07-18',
    time: '16:00',
    note: 'সিনেমা টিকেট ও পপকর্ন',
    tags: ['বিনোদন']
  },
  {
    id: 'tx_114',
    amount: 1100,
    type: 'expense',
    categoryId: 'cat_education',
    date: '2026-07-20',
    time: '12:00',
    note: 'প্রোগ্রামিং টেক বই ক্রয়',
    tags: ['বই']
  },
  {
    id: 'tx_115',
    amount: 600,
    type: 'expense',
    categoryId: 'cat_food',
    date: '2026-07-21',
    time: '15:20',
    note: 'বিকেলের নাস্তা ও কফি',
    tags: ['খাবার']
  },
  {
    id: 'tx_116',
    amount: 500,
    type: 'expense',
    categoryId: 'cat_other_exp',
    date: '2026-07-22',
    time: '10:15',
    note: 'মোবাইল রিচার্জ ও ড্রাইভ প্যাক',
    tags: ['মোবাইল']
  },

  // Previous Month (June 2026) for MoM Comparison Chart
  {
    id: 'tx_201',
    amount: 48000,
    type: 'income',
    categoryId: 'cat_salary',
    date: '2026-06-01',
    time: '09:00',
    note: 'জুন মাসের বেতন',
    tags: ['বেতন']
  },
  {
    id: 'tx_202',
    amount: 10000,
    type: 'expense',
    categoryId: 'cat_bills',
    date: '2026-06-02',
    time: '11:00',
    note: 'বাসা ভাড়া জুন',
    tags: ['বাসা ভাড়া']
  },
  {
    id: 'tx_203',
    amount: 6500,
    type: 'expense',
    categoryId: 'cat_food',
    date: '2026-06-10',
    time: '14:00',
    note: 'জুন মাসের মোট খাবার বাজার',
    tags: ['খাবার']
  },
  {
    id: 'tx_204',
    amount: 4200,
    type: 'expense',
    categoryId: 'cat_shopping',
    date: '2026-06-18',
    time: '19:00',
    note: 'হোম অ্যাপ্লায়েন্স সামগ্রী',
    tags: ['কেনাকাটা']
  },
  {
    id: 'tx_205',
    amount: 2800,
    type: 'expense',
    categoryId: 'cat_transport',
    date: '2026-06-25',
    time: '18:00',
    note: 'মাসিক যাতায়াত খরচ',
    tags: ['যাতায়াত']
  }
];

export const SAMPLE_SAVINGS_GOALS = [
  {
    id: 'goal_1',
    title: 'নতুন ল্যাপটপ ফান্ড',
    targetAmount: 85000,
    currentAmount: 42000,
    targetDate: '2026-11-30',
    color: '#F74B00'
  },
  {
    id: 'goal_2',
    title: 'জরুরি ইমার্জেন্সি ফান্ড (৩ মাস)',
    targetAmount: 50000,
    currentAmount: 35000,
    targetDate: '2026-09-30',
    color: '#059669'
  },
  {
    id: 'goal_3',
    title: 'কক্সবাজার ফ্যামিলি ট্যুর',
    targetAmount: 25000,
    currentAmount: 18500,
    targetDate: '2026-12-15',
    color: '#2563EB'
  }
];

export const DEFAULT_WALLETS = [
  { id: 'wallet_cash', name: 'ক্যাশ টাকা', type: 'cash', icon: 'Banknote', color: '#10B981', initialBalance: 15000 },
  { id: 'wallet_bkash', name: 'বিকাশ (bKash)', type: 'mobile', icon: 'Smartphone', color: '#E2136E', initialBalance: 8500 },
  { id: 'wallet_nagad', name: 'নগদ (Nagad)', type: 'mobile', icon: 'Smartphone', color: '#F7931E', initialBalance: 3200 },
  { id: 'wallet_bank', name: 'ব্যাংক অ্যাকাউন্ট', type: 'bank', icon: 'Building2', color: '#2563EB', initialBalance: 42500 }
];

export const SAMPLE_DEBTS = [
  {
    id: 'debt_1',
    personName: 'রহিম (বন্ধু)',
    type: 'given', // 'given' = ধার দিয়েছি (পাবো), 'taken' = ধার নিয়েছি (দেবো)
    totalAmount: 2500,
    paidAmount: 1000,
    dueDate: '2026-08-15',
    note: 'জরুরি কাজের জন্য নিয়েছিল',
    status: 'pending' // 'pending', 'paid'
  },
  {
    id: 'debt_2',
    personName: 'আরিফ ভাই',
    type: 'taken',
    totalAmount: 5000,
    paidAmount: 5000,
    dueDate: '2026-07-20',
    note: 'ট্যুরের খরচের ধার',
    status: 'paid'
  },
  {
    id: 'debt_3',
    personName: 'তৌহিদ',
    type: 'given',
    totalAmount: 1200,
    paidAmount: 0,
    dueDate: '2026-08-01',
    note: 'বই কেনার টাকা',
    status: 'pending'
  }
];

export const SAMPLE_RECURRING = [
  {
    id: 'rec_1',
    title: 'বাসা ভাড়া',
    amount: 10000,
    categoryId: 'cat_bills',
    walletId: 'wallet_bank',
    type: 'expense',
    frequency: 'monthly',
    dayOfMonth: 2,
    lastProcessedDate: '2026-07-02'
  },
  {
    id: 'rec_2',
    title: 'ওয়াইফাই ও ইন্টারনেট বিল',
    amount: 800,
    categoryId: 'cat_bills',
    walletId: 'wallet_bkash',
    type: 'expense',
    frequency: 'monthly',
    dayOfMonth: 5,
    lastProcessedDate: '2026-07-05'
  },
  {
    id: 'rec_3',
    title: 'মাসিক স্যালারি',
    amount: 50000,
    categoryId: 'cat_salary',
    walletId: 'wallet_bank',
    type: 'income',
    frequency: 'monthly',
    dayOfMonth: 1,
    lastProcessedDate: '2026-07-01'
  }
];

