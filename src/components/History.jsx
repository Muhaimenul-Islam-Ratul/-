import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Download,
  X
} from 'lucide-react';
import {
  formatCurrency,
  formatBnDateShort,
  toBnDigits,
  formatBnTime
} from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function History({
  transactions,
  categories,
  currency,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal,
  searchQuery,
  setSearchQuery
}) {
  const [typeFilter, setTypeFilter] = useState('all'); // all, income, expense
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // Category map helper
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    const category = categoryMap[t.categoryId] || {};
    const matchesSearch =
      !searchQuery ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.categoryId === categoryFilter;

    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && t.date >= startDate;
    }
    if (endDate) {
      matchesDate = matchesDate && t.date <= endDate;
    }

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  // Sort logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date + 'T' + (b.time || '00:00')) - new Date(a.date + 'T' + (a.time || '00:00'));
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00'));
    }
    if (sortBy === 'amount-desc') {
      return Number(b.amount) - Number(a.amount);
    }
    if (sortBy === 'amount-asc') {
      return Number(a.amount) - Number(b.amount);
    }
    return 0;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              সব ট্রানজেকশন হিস্ট্রি
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              সম্পূর্ণ আর্থিক হিস্ট্রির ফিল্টার, সার্চ ও এডিটিং সুবিধা
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              মোট: {toBnDigits(sortedTransactions.length)} টি এন্ট্রি
            </span>
          </div>
        </div>

        {/* Search & Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="নোট বা ক্যাটাগরি খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800 font-medium"
            >
              <option value="all">সব টাইপ (আয় ও খরচ)</option>
              <option value="expense">শুধু খরচ</option>
              <option value="income">শুধু আয়</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800 font-medium"
            >
              <option value="all">সব ক্যাটাগরি</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type === 'income' ? 'আয়' : 'খরচ'})
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800 font-medium"
            >
              <option value="date-desc">নতুন থেকে পুরাতন</option>
              <option value="date-asc">পুরাতন থেকে নতুন</option>
              <option value="amount-desc">বেশি টাকা থেকে কম</option>
              <option value="amount-asc">কম টাকা থেকে বেশি</option>
            </select>
          </div>

        </div>

        {/* Date Range Picker Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">তারিখ রেঞ্জ:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          />
          <span className="text-slate-400">থেকে</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          />

          {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট</span>
            </button>
          )}
        </div>

      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
        {sortedTransactions.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-sm text-slate-500">কোন ফলাফল পাওয়া যায়নি।</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
            >
              ফিল্টারগুলো পরিষ্কার করুন
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedTransactions.map((item) => {
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
                  className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-3 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: category.bgColor, color: category.color }}
                    >
                      <CategoryIcon name={category.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {item.note || category.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-600">{category.name}</span>
                        <span>•</span>
                        <span>{formatBnDateShort(item.date)}</span>
                        {item.time && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatBnTime(item.time)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-base font-bold block ${
                          isIncome ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTransaction(item)}
                        className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(item.id)}
                        className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
