import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const HostingerGuideModal: React.FC = () => {
  const { isHostingerGuideOpen, setIsHostingerGuideOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'quick' | 'hpanel' | 'ssl' | 'domain'>('quick');

  if (!isHostingerGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-900 via-indigo-950 to-gray-900 p-6 text-white flex items-center justify-between border-b border-violet-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-2xl text-violet-300">cloud_upload</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Hostinger ডিপ্লয়মেন্ট ও সেটআপ নির্দেশিকা</h3>
                <span className="text-[10px] bg-violet-400/20 text-violet-200 border border-violet-400/30 px-2 py-0.5 rounded-full font-bold">
                  Beginner Friendly
                </span>
              </div>
              <p className="text-xs text-violet-200 mt-0.5">
                আপনার বিদ্যমান Hostinger ডোমেইন ও হোস্টিংয়ে সহজে ওয়েবসাইট চালু করার পরিপূর্ণ গাইড
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHostingerGuideOpen(false)}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 px-6 pt-3 border-b border-gray-200 flex gap-2">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-violet-600 text-violet-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            সহজ ৩ ধাপ (Quick 3-Steps)
          </button>
          <button
            onClick={() => setActiveTab('hpanel')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hpanel'
                ? 'border-violet-600 text-violet-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dns</span>
            hPanel ফাইল ম্যানেজার
          </button>
          <button
            onClick={() => setActiveTab('ssl')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ssl'
                ? 'border-violet-600 text-violet-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            ফ্রি SSL ও সিকিউরিটি
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'domain'
                ? 'border-violet-600 text-violet-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">domain</span>
            কাস্টম ডোমেইন কানেক্ট
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed">
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-2xl shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">কোনো জটিল কোডিং প্রয়োজন নেই!</h4>
                  <p className="text-emerald-800 mt-1">
                    এই প্রজেক্টটি আধুনিক ওয়েব স্ট্যান্ডার্ডে তৈরি করা হয়েছে। এটি Hostinger-এর যেকোনো শেয়ার্ড হোস্টিং (Shared Hosting), ক্লাউড হোস্টিং (Cloud Hosting), অথবা VPS-এ মাত্র কয়েক মিনিটে লাইভ করা সম্ভব।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 hover:shadow-xs transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm mb-2">
                    ১
                  </div>
                  <h5 className="font-bold text-gray-900 mb-1">বিল্ড জেনারেট করুন</h5>
                  <p className="text-[11px] text-gray-600">
                    টার্মিনালে <code className="bg-gray-200 px-1 py-0.5 rounded text-violet-700 font-mono">npm run build</code> কমান্ড চালালে সম্পূর্ণ ওয়েবসাইটটি অপ্টিমাইজড হয়ে <strong>dist</strong> ফোল্ডারে প্রস্তুত হবে।
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 hover:shadow-xs transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm mb-2">
                    ২
                  </div>
                  <h5 className="font-bold text-gray-900 mb-1">ফাইল আপলোড</h5>
                  <p className="text-[11px] text-gray-600">
                    Hostinger hPanel-এ লগইন করে <strong>File Manager</strong>-এ যান এবং <strong>public_html</strong> ফোল্ডারে <strong>dist</strong>-এর ভেতরের সব ফাইল আপলোড করে দিন।
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 hover:shadow-xs transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm mb-2">
                    ৩
                  </div>
                  <h5 className="font-bold text-gray-900 mb-1">ওয়েবসাইট লাইভ!</h5>
                  <p className="text-[11px] text-gray-600">
                    আপনার ডোমেইনে ব্রাউজ করুন (যেমন: lotusshopbd.com)। অ্যাডমিন প্যানেলে লগইন করে প্রথমবার পাসওয়ার্ড পরিবর্তন করুন এবং সরাসরি সেল শুরু করুন!
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <span className="material-symbols-outlined text-amber-700 text-base">info</span>
                  <span>SPA রাউটিংয়ের জন্য .htaccess ফাইল কনফিগারেশন:</span>
                </div>
                <p className="text-[11px] text-amber-800 mb-2">
                  Hostinger-এর Apache/LiteSpeed সার্ভারে সরাসরি রিফ্রেশ করলে 404 যাতে না আসে, সেজন্য public_html-এ একটি ছোট <strong>.htaccess</strong> ফাইল রাখবেন:
                </p>
                <div className="bg-gray-900 text-amber-300 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {`<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n  RewriteRule ^index\\.html$ - [L]\n  RewriteCond %{REQUEST_FILENAME} !-f\n  RewriteCond %{REQUEST_FILENAME} !-d\n  RewriteRule . /index.html [L]\n</IfModule>`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hpanel' && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Hostinger hPanel ব্যবহার করে আপলোড পদ্ধতি:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-700">
                <li>Hostinger অ্যাকাউন্টে (hpanel.hostinger.com) লগইন করুন।</li>
                <li><strong>Websites</strong> সেকশন থেকে আপনার ডোমেইনের পাশে <strong>Manage</strong> বাটনে ক্লিক করুন।</li>
                <li>বামের মেনু থেকে <strong>Files &gt; File Manager</strong> নির্বাচন করুন।</li>
                <li><strong>public_html</strong> ডিরেক্টরিতে প্রবেশ করুন। (আগে থেকে কোনো ডিফল্ট index.php বা default.php থাকলে তা ডিলিট বা ব্যাকআপ করে নিন)।</li>
                <li>বিল্ড করা <code>dist.zip</code> ফাইলটি ড্র্যাগ অ্যান্ড ড্রপ করে আপলোড করুন এবং সেখানে <strong>Extract</strong> করুন।</li>
                <li>সব ফাইল যেন সরাসরি <code>public_html/index.html</code> আকারে থাকে তা নিশ্চিত করুন।</li>
              </ol>
            </div>
          )}

          {activeTab === 'ssl' && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">ফ্রি লাইফটাইম SSL চালু করার নিয়ম:</h4>
              <p>
                Hostinger প্রতিটি ডোমেইনের সাথে আনলিমিটেড ফ্রি Let's Encrypt SSL সার্টিফিকেট প্রদান করে। এটি কাস্টমারের কার্ড এবং bKash লেনদেন ১০০% সুরক্ষিত রাখে।
              </p>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <span className="material-symbols-outlined text-green-600">lock</span>
                  <span>১ ক্লিকে SSL সক্রিয়করণ:</span>
                </div>
                <p className="text-xs text-gray-600">
                  ১. hPanel-এর সার্চবারে <strong>SSL</strong> লিখে সার্চ করুন।<br />
                  ২. আপনার ডোমেইনের পাশে <strong>Install SSL</strong> বাটনে চাপ দিন।<br />
                  ৩. <strong>Force HTTPS</strong> অপশনটি টগল অন করে দিন।
                </p>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">ডোমেইন ডিএনএস ও কানেকশন:</h4>
              <p>
                যদি ডোমেইন ও হোস্টিং দুটোই Hostinger-এ থাকে, তবে কোনো DNS পরিবর্তনের প্রয়োজন নেই। এটি স্বয়ংক্রিয়ভাবে যুক্ত থাকবে।
              </p>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <span className="material-symbols-outlined text-blue-600">dns</span>
                  <span>Hostinger ডিফল্ট নেমসার্ভার:</span>
                </div>
                <div className="font-mono text-xs bg-white p-2.5 rounded border border-gray-200 space-y-1">
                  <div>ns1.dns-parking.com</div>
                  <div>ns2.dns-parking.com</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-[11px] text-gray-500">
            সমস্যা হলে Hostinger 24/7 লাইভ চ্যাটে সহায়তা নিতে পারেন
          </span>
          <button
            onClick={() => setIsHostingerGuideOpen(false)}
            className="px-5 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
