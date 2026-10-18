import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    isAdminLoggedIn,
    mustChangePassword,
    loginAdmin,
    changeAdminPassword,
    setActiveView,
    showToast,
    openAdminTab
  } = useStore();

  const [username, setUsername] = useState('lotusshopbd');
  const [password, setPassword] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginAdmin(username.trim(), password);
    if (!res.success) {
      setErrorMsg(res.message || 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়। দয়া করে পুনরায় চেষ্টা করুন।');
    } else {
      if (!mustChangePassword) {
        setIsAdminLoginOpen(false);
        setActiveView('admin');
      }
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword === '123456') {
      setErrorMsg('অস্থায়ী পাসওয়ার্ড "123456" নতুন পাসওয়ার্ড হিসেবে ব্যবহার করা যাবে না। একটি শক্তিশালী পাসওয়ার্ড দিন।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('নতুন পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    const ok = changeAdminPassword(newPassword);
    if (ok) {
      showToast('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! আপনাকে স্বাগতম।', 'success');
      setIsAdminLoginOpen(false);
      setActiveView('admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header styling */}
        <div className="bg-gradient-to-r from-gray-900 via-rose-950 to-gray-900 p-6 text-white text-center relative">
          <button
            onClick={() => setIsAdminLoginOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-rose-900/50 mb-3 border border-rose-400/30">
            <span className="material-symbols-outlined text-3xl text-white">shield_person</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Lotus Super Admin Console</h3>
          <p className="text-rose-200 text-xs mt-1">লটাস শপ বিডি ম্যানেজমেন্ট সিস্টেম</p>
        </div>

        <div className="p-6">
          {/* Forced Password Change screen */}
          {isAdminLoggedIn && mustChangePassword ? (
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">নিরাপত্তা সতর্কতা (Security Notice)</h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      আপনি অস্থায়ী পাসওয়ার্ড দিয়ে প্রথমবার লগইন করেছেন। সুরক্ষার স্বার্থে এখনই আপনার ব্যক্তিগত শক্তিশালী নতুন পাসওয়ার্ড সেট করুন।
                    </p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড (New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPasswordText ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
                </label>
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">lock_reset</span>
                পাসওয়ার্ড পরিবর্তন ও ড্যাশবোর্ডে প্রবেশ
              </button>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="bg-rose-50/80 border border-rose-100 p-3 rounded-lg text-xs text-rose-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">প্রথমবার সেটআপ ডেমো ক্রেডেনশিয়াল:</span>
                  <div className="text-[11px] text-gray-600 mt-0.5 font-mono">
                    ইউজার: <span className="font-bold text-gray-900">lotusshopbd</span> | পাস: <span className="font-bold text-gray-900">123456</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-rose-600 text-lg">key</span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  অ্যাডমিন ইউজারনেম (Admin Username)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-base">
                    person
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="lotusshopbd"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-base">
                    lock
                  </span>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPasswordText ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>স্মরণ রাখুন (Remember me)</span>
                </label>
                <span className="text-gray-400">Bangladesh SSL Encrypted</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-lg text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">login</span>
                অ্যাডমিন প্যানেলে লগইন করুন
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-2 text-[10px] text-gray-400 uppercase font-semibold">অথবা সরাসরি</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => openAdminTab('products')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>সরাসরি পণ্য পরিচালনা ও ডিলিট প্যানেল খুলুন</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              Hostinger cPanel/hPanel Compatible | Secure Hash Auth | v2.4 Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
