import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC<{ onSelectCategory?: (cat: string) => void }> = ({ onSelectCategory }) => {
  const { setActiveProduct, setActiveView, products, settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { name: 'Three Piece', icon: 'checkroom', badge: '' },
    { name: 'Saree', icon: 'auto_awesome', badge: '' },
    { name: 'Salwar Kameez', icon: 'content_cut', badge: '' },
    { name: 'Kurti', icon: 'styler', badge: '' },
    { name: 'Lehenga', icon: 'diamond', badge: '' },
    { name: 'Panjabi', icon: 'person', badge: '' },
    { name: 'Shirt', icon: 'dry_cleaning', badge: '' },
    { name: 'T-Shirt', icon: 'label', badge: '' },
    { name: 'Pants', icon: 'straighten', badge: '' },
    { name: 'Hijab', icon: 'face_3', badge: '' },
    { name: 'Abaya', icon: 'shield', badge: '' },
    { name: 'Kids Wear', icon: 'child_care', badge: '' },
    { name: "Men's Wear", icon: 'man', badge: '' },
    { name: "Women's Wear", icon: 'woman', badge: '' },
    { name: 'New Collection', icon: 'explore', badge: '' },
    { name: 'Sale', icon: 'percent', badge: 'HOT SALE', isSale: true }
  ];

  const handleShopNow = () => {
    const featured = products[0];
    if (featured) {
      setActiveProduct(featured);
      setActiveView('product');
    } else {
      const el = document.getElementById('new-arrivals-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If admin uploaded a custom home banner, display that banner directly
  const customBanner = settings.heroBannerUrl;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Left Category Sidebar */}
        <aside className="w-full lg:w-60 bg-white border border-gray-200 shadow-sm rounded-lg flex-shrink-0 text-xs font-medium text-gray-700 hidden lg:block overflow-hidden">
          <div className="bg-gray-900 text-white px-4 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-amber-400">category</span>
            <span>ক্যাটেগরি তালিকা (Categories)</span>
          </div>
          <ul className="divide-y divide-gray-100 max-h-[440px] overflow-y-auto">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer ${
                    cat.isSale
                      ? 'text-red-600 hover:bg-red-50 font-bold'
                      : 'hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="material-symbols-outlined text-sm text-gray-400">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  {cat.badge && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Hero Banner Area matching the exact user screenshot */}
        <div className="flex-1 w-full relative rounded-xl overflow-hidden shadow-sm min-h-[380px] sm:min-h-[440px] flex items-center bg-gradient-to-r from-[#eae1d0] via-[#f7f2ea] to-[#eedfc8]">
          {/* Custom Uploaded Banner Mode */}
          {customBanner ? (
            <div
              onClick={handleShopNow}
              className="w-full h-full relative cursor-pointer group flex items-center justify-center overflow-hidden"
            >
              <img
                src={customBanner}
                alt="Lotus Shop BD - Fashion & Lifestyle For Everyone"
                className="w-full h-auto min-h-[380px] sm:min-h-[440px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 transition-colors">
                <span>Shop Now</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          ) : (
            /* EXACT RECREATION OF USER SCREENSHOT */
            <div className="w-full h-full relative flex items-center overflow-hidden select-none">
              {/* Soft Architectural Colonnade & Garden Backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80')"
                }}
              />

              {/* Dynamic Angular Geometric Yellow & Dark Facet Accents (Top Right & Bottom Right) */}
              <div className="absolute top-0 right-0 w-64 sm:w-80 h-36 sm:h-48 overflow-hidden pointer-events-none z-10">
                <svg viewBox="0 0 320 200" className="w-full h-full" fill="none">
                  {/* Top Yellow Angular Facet */}
                  <polygon points="320,0 170,0 240,110 320,70" fill="#F59E0B" opacity="0.95" />
                  {/* Dark Accent Triangle */}
                  <polygon points="320,0 260,0 290,50" fill="#1C1917" opacity="0.85" />
                  {/* Outer Orange Ray */}
                  <polygon points="240,110 320,70 320,130" fill="#EA580C" opacity="0.9" />
                </svg>
              </div>

              <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-28 sm:h-36 overflow-hidden pointer-events-none z-10">
                <svg viewBox="0 0 380 150" className="w-full h-full" fill="none">
                  {/* Bottom Yellow/Orange Slice */}
                  <polygon points="380,150 160,150 250,70 380,110" fill="#F59E0B" opacity="0.95" />
                  {/* Dark Cut on Bottom Right */}
                  <polygon points="380,150 280,150 380,85" fill="#1C1917" opacity="0.9" />
                </svg>
              </div>

              {/* Carousel Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md z-30 transition-all cursor-pointer hover:scale-110"
                title="পূর্ববর্তী স্লাইড"
              >
                <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1))}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md z-30 transition-all cursor-pointer hover:scale-110"
                title="পরবর্তী স্লাইড"
              >
                <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
              </button>

              {/* Grid Layout: Model (Left), Headline & CTA (Center), Accessories (Right) */}
              <div className="w-full grid grid-cols-12 items-center px-4 sm:px-8 lg:px-12 py-4 relative z-20">
                {/* 1. Model Left Side - Smiling South Asian Female in Yellow Embroidered Kurti */}
                <div className="col-span-12 md:col-span-4 flex justify-center md:justify-start items-end self-end order-2 md:order-1 relative">
                  <div className="relative group cursor-pointer" onClick={handleShopNow}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhyJo73BT2WT2WCUIKJg0r1eMH6zGx2Atuof49WyHTbYZgzqhLCT8rJlD678C5XV9HJyXMqE8-apnqAdmuaT2SCsVCYMiR9wbGKKlzZzVW3HA_mevEBaLcHvjy83SHEFWKK6mH2k4W47jckaxvhA8aWgsD-VOw0Dr0qkW9gGub8KwiAh_1mC0k5yD3jFJI1AFcEKmLyxqLsr9bdfafZNk_H22xNvRJMeBnSMXbXkn5FaSj-FlQ-AnTSQ"
                      alt="Lotus Shop BD - Traditional Bengali Embroidered Yellow Kurti"
                      className="h-72 sm:h-88 md:h-[400px] w-auto object-cover object-top drop-shadow-lg filter contrast-[1.02] transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* 2. Central Typography & Brand Call To Action (Exact Match to Screenshot) */}
                <div className="col-span-12 md:col-span-4 text-center px-2 flex flex-col items-center justify-center order-1 md:order-2 my-2 md:my-0">
                  {/* Brand Emblem + Name */}
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 inline-flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-amber-600">
                        <path d="M12 2C10 5 8 9 12 13C16 9 14 5 12 2Z" />
                        <path d="M7 8C7 11 9 14 12 15C10 14 8 11 7 8Z" fill="#1C1917" />
                        <path d="M17 8C17 11 15 14 12 15C14 14 16 11 17 8Z" fill="#1C1917" />
                        <path d="M12 16C8 16 4 13 4 16C6 19 10 18 12 16Z" fill="#EA580C" />
                        <path d="M12 16C16 16 20 13 20 16C18 19 14 18 12 16Z" fill="#EA580C" />
                      </svg>
                    </span>
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-neutral-900 font-sans">
                      LOTUS SHOP BD
                    </span>
                  </div>

                  {/* Main Bold Headline */}
                  <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-neutral-950 tracking-tight leading-none uppercase font-sans">
                    FASHION &amp; LIFESTYLE
                  </h1>

                  {/* Elegant Golden Cursive "For Everyone" */}
                  <div className="text-amber-500 font-serif italic font-bold text-2xl sm:text-3xl lg:text-[32px] tracking-wide my-0.5">
                    For Everyone
                  </div>

                  {/* Bengali Subtitle - Exactly from Screenshot */}
                  <p className="text-xs sm:text-[13px] text-neutral-800 font-bold tracking-wide mt-1 mb-4">
                    এক ছাদের নিচে সবকিছু | স্টাইল, কমফোর্ট, কোয়ালিটি
                  </p>

                  {/* Golden-Amber Pill Button "Shop Now ->" */}
                  <button
                    onClick={handleShopNow}
                    className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E59008] text-neutral-950 font-bold text-xs sm:text-sm px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>

                  {/* Carousel Pagination Dots */}
                  <div className="flex items-center justify-center space-x-1.5 mt-5">
                    <span
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        currentSlide === 0 ? 'bg-[#F59E0B] w-5' : 'bg-neutral-300 w-2 hover:bg-neutral-400'
                      }`}
                      onClick={() => setCurrentSlide(0)}
                    />
                    <span
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        currentSlide === 1 ? 'bg-[#F59E0B] w-5' : 'bg-neutral-300 w-2 hover:bg-neutral-400'
                      }`}
                      onClick={() => setCurrentSlide(1)}
                    />
                    <span
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        currentSlide === 2 ? 'bg-[#F59E0B] w-5' : 'bg-neutral-300 w-2 hover:bg-neutral-400'
                      }`}
                      onClick={() => setCurrentSlide(2)}
                    />
                  </div>
                </div>

                {/* 3. Lifestyle Accessories on Right Side (Smartwatch, Handbag, Sneakers, Perfume) */}
                <div className="col-span-12 md:col-span-4 hidden md:flex justify-end items-center relative order-3">
                  <div
                    onClick={handleShopNow}
                    className="relative w-full max-w-[320px] h-[340px] flex items-center justify-end cursor-pointer group"
                  >
                    {/* Layered Arrangement matching the screenshot */}
                    {/* Smart Watch - Top Left */}
                    <div className="absolute top-2 left-4 w-28 h-28 z-20 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc7F6tfmbG1KR_VpxE-z6mKPxyrMFRqZMtWEeoZ5UmwO6csoeLFrOMA8Q1i2_56gqLd3aVZTfX7LJ13fk9MVWbMlV-vE5Ey2hziQayChLkvU-XNncIV9mlupqEGyTdvLjkzx9jYFpNpt2l00wur4E1iHsVUelj-WAXpTwvJF5zQjKCfcW_VnDPSZDs44qgrVRGn6KVvtMJRnH08b9VVnEwYgBgvXPTbhNBubzpnXC5Ef11WC5JmaHelA"
                        alt="Smart Watch"
                        className="w-full h-full object-contain drop-shadow-xl"
                      />
                    </div>

                    {/* Black Handbag - Top Right */}
                    <div className="absolute top-6 right-2 w-44 h-40 z-10 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKYLcMQFRP1-AjOjWW54TUX1_vzmHBXGXKYwKwtcbKh2hFfKJ4_nKizUo5J7c7SxBRPcal03Ukdg8Xwjut2Vd6VDnj1jUeaea4ikyTHBdeye8cMVzUDnPYSrlAMGKL2j_ObBYZi1NM991aOaKrgO_caTY57yo_12MQ2s7cb3MIAlACHSChVQesAcvdB0zro2cf26NKAAwvfXIdHS2uAPDNFUx5aoRUPoUnw3NeibxgSTQ2iOs-WKlF1Q"
                        alt="Luxury Black Handbag"
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* White Sneakers - Bottom Left */}
                    <div className="absolute bottom-2 left-6 w-44 h-32 z-20 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa7qrU0mMirYwZFRpexnj038p6tzmwTwQOtAW1Zf3yma_fYfVx-8mdqnKPCKFSZiTmG24y4u9Bq-M7hUN6VzWTZL80wfFrJilsNhpij5gyliVOth76u-jTfhrikOMPk70fh1I2wmjq5MzzezYnBe7ygY4sgIV5i7TMNdn7aUAmjLTjFYrWHulW4N2atecjNq4afBEnMbXg8s6HP2gJmzYi8tH7rRFiVYYv4PSIhUVGvLLYcwKOFA6b3g"
                        alt="White Lifestyle Sneakers"
                        className="w-full h-full object-contain drop-shadow-xl"
                      />
                    </div>

                    {/* Luxury Amber Perfume Bottle - Bottom Right */}
                    <div className="absolute bottom-6 right-4 w-24 h-32 z-30 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhLB3WkC0dJroFWE9riPsjPN1FJozCZNLB076hdl2TXOpe_6cdz2b9oYSfmedV4JgQv1cnO8pLNUvLHKJoA3lPK77K3186jOY-b_GKZ3GU-gIolRMFNpiN1Kfb1tXLKenoW7Blc7qlS0w8EmrjaaP8Z7JT8jKLGO_VOD9my9hR3jGgkoFmD3E0YCh9LE17zpW5zZiCQjGykYInLJJvUDOO_P7DMz696ngIh6gcQDXqEXYzLHrD8bp1sg"
                        alt="Luxury Perfume"
                        className="w-full h-full object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
