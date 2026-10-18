import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC<{ onSelectCategory?: (cat: string) => void }> = ({ onSelectCategory }) => {
  const { setActiveProduct, setActiveView, products } = useStore();
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
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Category Sidebar */}
        <aside className="w-full lg:w-60 bg-white border border-t-0 border-gray-200 shadow-sm rounded-b flex-shrink-0 text-xs font-medium text-gray-700">
          <ul className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors cursor-pointer ${
                    cat.isSale
                      ? 'text-red-600 hover:bg-red-50 font-bold'
                      : 'hover:bg-amber-50 hover:text-amber-600'
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

        {/* Main Hero Banner Area */}
        <div className="flex-1 w-full relative rounded-lg overflow-hidden bg-gradient-to-r from-[#e8decb] via-[#f7f3ea] to-[#e4d7c0] shadow-sm min-h-[460px] flex items-center">
          {/* Left & Right Arrow Navigation */}
          <button
            onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow z-20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow z-20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>

          {/* Banner Content Layout */}
          <div className="w-full grid grid-cols-12 items-center px-4 sm:px-6 lg:px-10 py-6 relative z-10">
            {/* Female Model Left Side */}
            <div className="col-span-12 sm:col-span-4 flex justify-center items-end self-end order-2 sm:order-1">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhyJo73BT2WT2WCUIKJg0r1eMH6zGx2Atuof49WyHTbYZgzqhLCT8rJlD678C5XV9HJyXMqE8-apnqAdmuaT2SCsVCYMiR9wbGKKlzZzVW3HA_mevEBaLcHvjy83SHEFWKK6mH2k4W47jckaxvhA8aWgsD-VOw0Dr0qkW9gGub8KwiAh_1mC0k5yD3jFJI1AFcEKmLyxqLsr9bdfafZNk_H22xNvRJMeBnSMXbXkn5FaSj-FlQ-AnTSQ"
                alt="Traditional Bengali Fashion Kurti Yellow"
                className="h-80 sm:h-96 object-cover object-top rounded-lg shadow-md border-2 border-white/50"
              />
            </div>

            {/* Hero Central Typography & Call To Action */}
            <div className="col-span-12 sm:col-span-4 text-center px-2 flex flex-col items-center order-1 sm:order-2 mb-4 sm:mb-0">
              {/* Lotus Shop BD Brand Badge */}
              <div className="flex items-center justify-center space-x-1 mb-2">
                <span className="text-amber-600 font-bold tracking-widest text-[11px] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">local_florist</span>
                  LOTUS SHOP BD
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight uppercase font-sans">
                Fashion & Lifestyle
              </h1>
              <p className="text-amber-600 font-serif-title italic font-medium text-2xl -mt-1 mb-2">
                For Everyone
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mb-5 font-medium">
                Everything Under One Roof | Style, Comfort &amp; Quality
              </p>
              <button
                onClick={handleShopNow}
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-6 py-2.5 rounded shadow hover:shadow-md transition-all cursor-pointer"
              >
                <span>Shop Now</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* Carousel Pagination Dots */}
              <div className="flex space-x-1.5 mt-6">
                <span className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentSlide === 0 ? 'bg-amber-500 w-4' : 'bg-gray-400 opacity-60'}`} onClick={() => setCurrentSlide(0)}></span>
                <span className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentSlide === 1 ? 'bg-amber-500 w-4' : 'bg-gray-400 opacity-60'}`} onClick={() => setCurrentSlide(1)}></span>
                <span className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentSlide === 2 ? 'bg-amber-500 w-4' : 'bg-gray-400 opacity-60'}`} onClick={() => setCurrentSlide(2)}></span>
              </div>
            </div>

            {/* Lifestyle Accessories & Fashion Items Right Side */}
            <div className="col-span-12 sm:col-span-4 hidden sm:flex justify-end items-center relative space-x-2 order-3">
              <div className="relative w-full max-w-[280px]">
                <div className="relative grid grid-cols-2 gap-2">
                  <div
                    onClick={handleShopNow}
                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow bg-white p-1"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc7F6tfmbG1KR_VpxE-z6mKPxyrMFRqZMtWEeoZ5UmwO6csoeLFrOMA8Q1i2_56gqLd3aVZTfX7LJ13fk9MVWbMlV-vE5Ey2hziQayChLkvU-XNncIV9mlupqEGyTdvLjkzx9jYFpNpt2l00wur4E1iHsVUelj-WAXpTwvJF5zQjKCfcW_VnDPSZDs44qgrVRGn6KVvtMJRnH08b9VVnEwYgBgvXPTbhNBubzpnXC5Ef11WC5JmaHelA"
                      alt="Smart Watch"
                      className="rounded object-cover h-28 w-full group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div
                    onClick={handleShopNow}
                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow bg-white p-1"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKYLcMQFRP1-AjOjWW54TUX1_vzmHBXGXKYwKwtcbKh2hFfKJ4_nKizUo5J7c7SxBRPcal03Ukdg8Xwjut2Vd6VDnj1jUeaea4ikyTHBdeye8cMVzUDnPYSrlAMGKL2j_ObBYZi1NM991aOaKrgO_caTY57yo_12MQ2s7cb3MIAlACHSChVQesAcvdB0zro2cf26NKAAwvfXIdHS2uAPDNFUx5aoRUPoUnw3NeibxgSTQ2iOs-WKlF1Q"
                      alt="Handbag"
                      className="rounded object-cover h-28 w-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div
                    onClick={handleShopNow}
                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow bg-white p-1"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa7qrU0mMirYwZFRpexnj038p6tzmwTwQOtAW1Zf3yma_fYfVx-8mdqnKPCKFSZiTmG24y4u9Bq-M7hUN6VzWTZL80wfFrJilsNhpij5gyliVOth76u-jTfhrikOMPk70fh1I2wmjq5MzzezYnBe7ygY4sgIV5i7TMNdn7aUAmjLTjFYrWHulW4N2atecjNq4afBEnMbXg8s6HP2gJmzYi8tH7rRFiVYYv4PSIhUVGvLLYcwKOFA6b3g"
                      alt="Sneakers"
                      className="rounded object-cover h-28 w-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div
                    onClick={handleShopNow}
                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow bg-white p-1"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhLB3WkC0dJroFWE9riPsjPN1FJozCZNLB076hdl2TXOpe_6cdz2b9oYSfmedV4JgQv1cnO8pLNUvLHKJoA3lPK77K3186jOY-b_GKZ3GU-gIolRMFNpiN1Kfb1tXLKenoW7Blc7qlS0w8EmrjaaP8Z7JT8jKLGO_VOD9my9hR3jGgkoFmD3E0YCh9LE17zpW5zZiCQjGykYInLJJvUDOO_P7DMz696ngIh6gcQDXqEXYzLHrD8bp1sg"
                      alt="Perfume"
                      className="rounded object-cover h-28 w-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
