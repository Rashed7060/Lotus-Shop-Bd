import React from 'react';
import { useStore } from '../context/StoreContext';

export const AboutUsSection: React.FC = () => {
  const { settings } = useStore();

  const trustPoints = [
    {
      icon: 'verified',
      titleEn: '100% Authentic & Premium Quality',
      desc: 'Every item is sourced directly from certified manufacturers and thoroughly quality-checked before dispatch.'
    },
    {
      icon: 'payments',
      titleEn: 'Cash on Delivery (COD)',
      titleEnSub: 'Pay After Inspection',
      desc: 'Zero risk. Inspect your parcel when it arrives at your doorstep before completing payment.'
    },
    {
      icon: 'local_shipping',
      titleEn: 'Fast Nationwide Delivery',
      desc: '24-48 hours within Dhaka Metro and 48-72 hours across all 64 districts in Bangladesh via reliable couriers.'
    },
    {
      icon: 'published_with_changes',
      titleEn: '7 Days Easy Exchange & Return',
      desc: 'Hassle-free size exchange or quick returns if you encounter any defect or fit issue.'
    }
  ];

  const stats = [
    { value: '15,000+', label: 'Happy Customers', sub: 'Across Bangladesh' },
    { value: '64', label: 'Districts Covered', sub: 'Nationwide Delivery' },
    { value: '99.4%', label: 'Positive Rating', sub: 'Customer Satisfaction' },
    { value: '24/7', label: 'Dedicated Support', sub: 'Live Helpline' }
  ];

  return (
    <section id="about-us-section" className="bg-gradient-to-b from-white via-slate-50 to-white py-16 border-t border-b border-gray-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm text-amber-500">storefront</span>
            <span>Our Heritage &amp; Commitment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About <span className="text-amber-500">{settings.storeName || 'Lotus Shop BD'}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-3 leading-relaxed">
            {settings.tagline || 'Elegance & Trust In Every Thread'} — Delivering authentic fashion, uncompromised quality, and delightful customer service nationwide.
          </p>
        </div>

        {/* Brand Story & Visual Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-block border-l-4 border-amber-500 pl-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Why Lotus Shop BD is the Preferred Fashion Destination
              </h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Online shopping should be exciting, effortless, and dependable. <strong className="text-gray-900 font-semibold">Lotus Shop BD</strong> was founded with a clear mission: to bring 100% authentic, high-grade ethnic wear, footwear, leather goods, and smart lifestyle essentials directly to customers across Bangladesh.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              From handloom Banarasi silk sarees and designer lawn three-pieces to combed cotton men's panjabis and athletic sneakers, each piece is crafted with utmost care. We verify stitch density, color fastness, and fabric durability so you receive exactly what you see.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold px-6 py-2.5 rounded-xl shadow-md text-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Helpline: {settings.phone}</span>
              </a>

              <button
                onClick={() => {
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-gray-500">mail</span>
                <span>Contact Us</span>
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
                    <h4 className="text-lg font-bold text-amber-400">Lotus Shop BD Trust Record</h4>
                    <p className="text-xs text-gray-400">Serving thousands of happy shoppers across Bangladesh</p>
                  </div>
                  <span className="material-symbols-outlined text-amber-400 text-3xl">award_star</span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {stats.map((s, idx) => (
                    <div key={idx} className="bg-neutral-800/80 rounded-2xl p-4 border border-neutral-700/60">
                      <div className="text-2xl sm:text-3xl font-black text-amber-400 font-data-tabular">
                        {s.value}
                      </div>
                      <div className="font-bold text-sm text-gray-200 mt-1">
                        {s.label}
                      </div>
                      <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                        {s.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-700/80 flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">verified_user</span>
                    <span>Verified E-Commerce Enterprise</span>
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
              <h4 className="font-bold text-gray-900 text-base mb-1">
                {item.titleEn}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
