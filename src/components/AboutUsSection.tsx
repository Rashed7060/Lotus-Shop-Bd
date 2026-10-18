import React from 'react';
import { useStore } from '../context/StoreContext';

export const AboutUsSection: React.FC = () => {
  const { settings, setActiveView } = useStore();

  const trustPoints = [
    {
      icon: 'verified',
      titleBn: '১০০% অরিজিনাল ও মানসম্পন্ন',
      titleEn: '100% Authentic Products',
      desc: 'প্রতিটি পণ্য সরাসরি কারখানা ও অনুমোদিত সোর্স থেকে সংগ্রহ করা হয় এবং ডেলিভারির পূর্বে নিখুঁতভাবে কোয়ালিটি চেক করা হয়।'
    },
    {
      icon: 'payments',
      titleBn: 'ক্যাশ অন ডেলিভারি (COD)',
      titleEn: 'Cash on Delivery',
      desc: 'কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই। সারা বাংলাদেশে হোম ডেলিভারিতে পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করার নিশ্চয়তা।'
    },
    {
      icon: 'local_shipping',
      titleBn: 'দ্রুততম হোম ডেলিভারি',
      titleEn: 'Fast Nationwide Delivery',
      desc: 'ঢাকা সিটির মধ্যে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৪৮-৭২ ঘণ্টার মধ্যে নির্ভরযোগ্য কুরিয়ারের মাধ্যমে সুরক্ষিত ডেলিভারি।'
    },
    {
      icon: 'published_with_changes',
      titleBn: '৭ দিনের সহজ এক্সচেঞ্জ ও রিটার্ন',
      titleEn: 'Easy 7 Days Return',
      desc: 'সাইজ অথবা কোনো ত্রুটি থাকলে কোনো ঝামেলা ছাড়াই দ্রুত এক্সচেঞ্জ বা রিটার্ন করার সহজ পলিসি।'
    }
  ];

  const stats = [
    { value: '১৫,০০০+', label: 'সন্তুষ্ট গ্রাহক', sub: 'Happy Customers' },
    { value: '৬৪', label: 'জেলায় ডেলিভারি', sub: 'All 64 Districts' },
    { value: '৯৯.৪%', label: 'পজিটিভ রেটিং', sub: 'Customer Satisfaction' },
    { value: '২৪/৭', label: 'গ্রাহক সেবা', sub: 'Dedicated Support' }
  ];

  return (
    <section id="about-us-section" className="bg-gradient-to-b from-white via-slate-50 to-white py-16 border-t border-b border-gray-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm text-amber-500">storefront</span>
            <span>আমাদের পরিচিতি ও অঙ্গীকার</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About <span className="text-amber-500">{settings.storeName || 'Lotus Shop BD'}</span>
          </h2>
          <p className="font-bn text-gray-600 text-base sm:text-lg mt-3 leading-relaxed">
            {settings.taglineBn || 'আভিজাত্য ও বিশ্বাসের অনন্য ঠিকানা'} — আধুনিক ফ্যাশন, কোয়ালিটি ও নির্ভরযোগ্য কেনাকাটার সেরা অভিজ্ঞতা দিতে আমরা সর্বদা প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        {/* Brand Story & Visual Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 space-y-5 font-bn">
            <div className="inline-block border-l-4 border-amber-500 pl-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                কেন লোটাস শপ বিডি গ্রাহকদের প্রথম পছন্দ?
              </h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              অনলাইন শপিংয়ে আসল পণ্য পাওয়া এবং সঠিক সময়ে ডেলিভারি পাওয়া গ্রাহকদের জন্য সবচেয়ে বড় চ্যালেঞ্জ। 
              <strong className="text-gray-900 font-semibold"> Lotus Shop BD</strong>-এর যাত্রা শুরু হয়েছে সেই আস্থার সংকট দূর করে শতভাগ খাঁটি, মানসম্পন্ন ও ট্রেন্ডি লাইফস্টাইল পণ্য প্রতিটি ঘরের দরজায় পৌঁছে দেওয়ার লক্ষ্য নিয়ে।
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              আমরা থ্রি পিস, শাড়ি, কুর্তি, ছেলেদের প্রিমিয়াম পাঞ্জাবি, আরামদায়ক জুতো ও স্নিকার্স, ফ্যাশনেবল ব্যাগ এবং গ্যাজেট সহ বহুমুখী পণ্য সরাসরি গ্রাহকদের জন্য সাজিয়েছি। প্রতিটি পোশাকে কাপড়ের কোয়ালিটি, সুতোর কাজ ও রঙের স্থায়িত্ব বিশেষভাবে যাচাই করা হয়।
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold px-6 py-2.5 rounded-xl shadow-md text-sm transition-all cursor-pointer font-sans"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>হেল্পলাইন: {settings.phone}</span>
              </a>

              <button
                onClick={() => {
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-gray-500">mail</span>
                <span>যোগাযোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Right Visual Stats Showcase Card */}
          <div className="lg:col-span-6">
            <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-neutral-700 overflow-hidden">
              {/* Background ambient pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-6 border-b border-neutral-700/80 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-amber-400">Lotus Shop BD ট্রাস্ট রেকর্ড</h4>
                    <p className="text-xs text-gray-400 font-bn">সারাদেশে গ্রাহকদের ভালোবাসায় এগিয়ে চলা</p>
                  </div>
                  <span className="material-symbols-outlined text-amber-400 text-3xl">award_star</span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {stats.map((s, idx) => (
                    <div key={idx} className="bg-neutral-800/80 rounded-2xl p-4 border border-neutral-700/60">
                      <div className="text-2xl sm:text-3xl font-black text-amber-400 font-data-tabular">
                        {s.value}
                      </div>
                      <div className="font-bn font-bold text-sm text-gray-200 mt-1">
                        {s.label}
                      </div>
                      <div className="text-[11px] text-gray-400 uppercase tracking-wider font-sans">
                        {s.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-700/80 flex items-center justify-between text-xs text-gray-300 font-bn">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">verified_user</span>
                    <span>গভর্নমেন্ট ভেরিফাইড ই-কমার্স শপ</span>
                  </div>
                  <span className="text-gray-400">BIN: {settings.binNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-500 text-amber-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h4 className="font-bold text-gray-900 font-bn text-base mb-1">
                {item.titleBn}
              </h4>
              <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider mb-2 font-sans">
                {item.titleEn}
              </p>
              <p className="text-xs text-gray-600 font-bn leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
