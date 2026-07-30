import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Tag,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  Sparkles,
  Repeat,
  CheckCircle2,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function Settings({
  currency,
  setCurrency,
  categories,
  onAddCategory,
  onDeleteCategory,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onLoadDemoData,
  onClearAllData,
  recurring,
  onAddRecurring,
  onDeleteRecurring,
  onInstallApp,
  isOnline = true
}) {
  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [newCatIcon, setNewCatIcon] = useState('ShoppingBag');
  const [newCatColor, setNewCatColor] = useState('#F74B00');

  // New Recurring Form State
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecAmount, setNewRecAmount] = useState('');
  const [newRecType, setNewRecType] = useState('expense');
  const [newRecCatId, setNewRecCatId] = useState('');

  const availableIcons = [
    'Utensils', 'Bus', 'Home', 'ShoppingBag', 'HeartPulse', 'Film',
    'GraduationCap', 'MoreHorizontal', 'Briefcase', 'TrendingUp', 'Laptop',
    'PiggyBank', 'Gift', 'Car', 'Phone', 'Coffee', 'Plane', 'Smile'
  ];

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    onAddCategory({
      id: 'cat_' + Date.now(),
      name: newCatName,
      type: newCatType,
      icon: newCatIcon,
      color: newCatColor,
      bgColor: `${newCatColor}1A`,
      budget: 3000
    });

    setNewCatName('');
  };

  const handleCreateRecurring = (e) => {
    e.preventDefault();
    if (!newRecTitle || !newRecAmount) return;

    onAddRecurring({
      id: 'rec_' + Date.now(),
      title: newRecTitle,
      amount: Number(newRecAmount),
      type: newRecType,
      categoryId: newRecCatId || (categories.find(c => c.type === newRecType)?.id)
    });

    setNewRecTitle('');
    setNewRecAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span>অ্যাপ সেটিংস ও ব্যাকআপ</span>
          <SettingsIcon className="w-5 h-5 text-slate-600" />
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          কাস্টম কারেন্সি, নতুন ক্যাটাগরি তৈরি, ডেটা এক্সপোর্ট এবং সেভ করা ব্যাকআপ পরিচালনা করুন
        </p>
      </div>

      {/* PWA Mobile App & Offline Sync Card */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 rounded-2xl p-6 text-white shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                মোবাইল অ্যাপ ও অফলাইন মোড 📲
              </h3>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isOnline ? 'bg-emerald-500/30 text-emerald-100' : 'bg-rose-500/30 text-rose-100'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'অনলাইন মোড' : 'অফলাইন মোড'}</span>
              </span>
            </div>
            <p className="text-xs text-brand-100 mt-1">
              ইন্টারনেট ছাড়াই অ্যাপটি অফলাইনে ১০০% চলবে এবং ইন্টারনেট পেলে অটো-সিঙ্ক হবে।
            </p>
          </div>
        </div>

        <button
          onClick={onInstallApp}
          className="w-full sm:w-auto px-5 py-2.5 bg-white text-brand-600 hover:bg-brand-50 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>মোবাইলে অ্যাপ ইনস্টল করুন</span>
        </button>
      </div>

      {/* Grid Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Currency & Theme Setting Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600" />
            <span>কারেন্সি সেটিং</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              প্রদর্শনের মুদ্রা (Currency Symbol)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { symbol: '৳', label: 'টাকা (৳)' },
                { symbol: '$', label: 'ডলার ($)' },
                { symbol: '€', label: 'ইউরো (€)' },
                { symbol: '₹', label: 'রুপি (₹)' }
              ].map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setCurrency(item.symbol)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${
                    currency === item.symbol
                      ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Data & Backup Quick Actions Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ডেমো ডেটা ও ব্যাকআপ</span>
          </h3>

          <p className="text-xs text-slate-500">
            রিপোর্ট গ্রাফ ও ফিচারগুলো ভালোভাবে পরীক্ষা করতে ১-ক্লিকে বাংলা ডেমো ট্রানজেকশন সেট লোড করুন।
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onLoadDemoData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold transition-colors border border-brand-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ডেমো ডেটা লোড করুন</span>
            </button>
          </div>
        </div>

      </div>

      {/* Custom Category Management Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-600" />
            <span>কাস্টম ক্যাটাগরি ম্যানেজমেন্ট</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            নতুন খরচের খাতা বা আয়ের উৎস যোগ করুন
          </p>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleCreateCategory} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ক্যাটাগরির নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: ইন্টারনেট বিল"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">টাইপ</label>
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              >
                <option value="expense">খরচ (Expense)</option>
                <option value="income">আয় (Income)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">আইকন</label>
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              >
                {availableIcons.map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">কালার থিম:</span>
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-brand"
            >
              <Plus className="w-4 h-4" />
              <span>ক্যাটাগরি যুক্ত করুন</span>
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat.bgColor, color: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {cat.name}
                </span>
              </div>

              <button
                onClick={() => onDeleteCategory(cat.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
                title="ডিলিট"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Export & Import Data Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>ডেটা এক্সপোর্ট ও ব্যাকআপ (CSV / JSON)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার সকল আর্থিক রেকর্ড নিরাপদ ফাইল হিসেবে ডাউনলোড বা রিস্টোর করুন
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>CSV ফাইল এক্সপোর্ট</span>
          </button>

          <button
            onClick={onExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>JSON ব্যাকআপ ডাউনলোড</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-purple-600" />
            <span>JSON ব্যাকআপ আপলোড</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportJSON}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-rose-600 font-semibold">
            বিপদজনক এলাকা: সকল রেকর্ড স্থায়ীভাবে মুছে ফেলতে চাইলে:
          </span>
          <button
            onClick={onClearAllData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সব ডেটা রিসেট করুন</span>
          </button>
        </div>
      </div>

    </div>
  );
}
