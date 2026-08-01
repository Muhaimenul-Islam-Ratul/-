import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, User, Camera, Check, Trash2, AlertCircle, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose, onShowToast, lang = 'bn', setLang }) {
  const { currentUser, updateUserProfile } = useAuth();
  
  const [nickname, setNickname] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const prevIsOpen = useRef(false);

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpen.current;
    if (isOpen && justOpened && currentUser) {
      setNickname(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
      setErrorMsg('');
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  // Word count calculator
  const countWords = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const wordCount = countWords(nickname);
  const isWordCountExceeded = wordCount > 10;

  // Handle Nickname Input with 10 Words Limit
  const handleNicknameChange = (e) => {
    const val = e.target.value;
    const words = countWords(val);
    
    if (words > 10) {
      setErrorMsg(lang === 'en' ? 'Nickname must be within 10 words!' : 'নিকনেম সর্বোচ্চ ১০ শব্দের মধ্যে হতে হবে!');
    } else {
      setErrorMsg('');
    }
    setNickname(val);
  };

  // Image Upload Handler (Convert to Compressed Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'en' ? 'Please select a valid image file!' : 'অনুগ্রহ করে সঠিক ছবি সিলেক্ট করুন!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(lang === 'en' ? 'Image file size cannot exceed 5MB!' : 'ছবি ফাইলের সাইজ সর্বোচ্চ 5MB হতে পারবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoURL(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoURL('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isWordCountExceeded) {
      setErrorMsg(lang === 'en' ? 'Nickname cannot exceed 10 words!' : 'নিকনেমে ১০টির বেশি শব্দ রাখা যাবে না!');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: nickname.trim(),
        photoURL: photoURL
      });
      if (onShowToast) {
        onShowToast(lang === 'en' ? 'Profile and nickname saved successfully!' : 'প্রোফাইল ও নিকনেম সফলভাবে সেভ করা হয়েছে!');
      }
      onClose();
    } catch (err) {
      setErrorMsg(lang === 'en' ? 'Error updating profile!' : 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            <span>{lang === 'en' ? 'Update Profile' : 'প্রোফাইল আপডেট করুন'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          
          {/* Avatar / Photo Upload Section */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-brand-100 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-brand-100 shadow-md">
                  {(nickname || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}

              <label
                htmlFor="avatar-upload-input"
                className="absolute bottom-0 right-0 p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg cursor-pointer transition-all hover:scale-110"
                title={lang === 'en' ? 'Upload Photo' : 'ছবি আপলোড করুন'}
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="avatar-upload-input"
                className="text-xs font-bold text-brand-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Upload New Photo' : 'নতুন ছবি আপলোড'}</span>
              </label>

              {photoURL && (
                <>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Remove Photo' : 'ছবি মুছুন'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Language Switcher Option */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-brand-600" />
              <span>{lang === 'en' ? 'App Language / ভাষা' : 'অ্যাপের ভাষা (Language)'}</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang && setLang('bn')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  lang === 'bn'
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🇧🇩 বাংলা</span>
              </button>

              <button
                type="button"
                onClick={() => setLang && setLang('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  lang === 'en'
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🇺🇸 English</span>
              </button>
            </div>
          </div>

          {/* Nickname / Display Name Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'en' ? 'Nickname / Name' : 'নিকনেম / নাম (Nickname)'}
              </label>
              <span className={`text-[11px] font-bold ${isWordCountExceeded ? 'text-rose-600' : 'text-slate-400'}`}>
                {wordCount}/10 {lang === 'en' ? 'words' : 'শব্দ'}
              </span>
            </div>

            <input
              type="text"
              placeholder={lang === 'en' ? 'e.g. Shakib Hasan' : 'যেমন: সাকিব হাসান'}
              value={nickname}
              onChange={handleNicknameChange}
              className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none transition-colors ${
                isWordCountExceeded
                  ? 'border-rose-500 focus:border-rose-600 bg-rose-50/30 text-rose-900'
                  : 'border-slate-200 focus:border-brand-500 text-slate-900 font-medium'
              }`}
            />

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            <p className="text-[11px] text-slate-400 mt-1">
              {lang === 'en' ? '* Maximum 10 words allowed for nickname.' : '* সর্বোচ্চ ১০টি শব্দের নাম বা ডাকনাম ব্যবহার করা যাবে।'}
            </p>
          </div>

          {/* Email Readonly */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              {lang === 'en' ? 'Registered Email' : 'রেজিস্টার্ড ইমেইল'}
            </span>
            <span className="text-xs font-semibold text-slate-700 truncate block">
              {currentUser.email}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isWordCountExceeded || isSaving}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-brand transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
