import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const SaleSection: React.FC = () => {
  const { products, addToCart, wishlist, toggleWishlist, setActiveProduct, setActiveView, showToast } = useStore();

  // Flash Sale Countdown Timer (Simulated 14 hours remaining, ticks down every second)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 48
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products on sale (regularPrice > price or badge is 'Sale')
  const saleProducts = products.filter(
    p => (p.regularPrice && p.regularPrice > p.price) || p.badge === 'Sale'
  );

  const displayProducts = saleProducts.length > 0 ? saleProducts.slice(0, 8) : products.slice(0, 4);

  const handleProductClick = (prod: Product) => {
    setActiveProduct(prod);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectBuy = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCart(prod, 1, prod.sizes?.[0], prod.colors?.[0]?.name);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCart(prod, 1, prod.sizes?.[0], prod.colors?.[0]?.name);
    showToast(`"${prod.name}" added to cart`, 'success');
  };

  return (
    <section id="sale-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 scroll-mt-24">
      {/* Sale Section Hero Banner / Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl mb-8 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200">
              <span className="material-symbols-outlined text-sm text-amber-300">bolt</span>
              <span>Flash Sale &amp; Mega Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Mega Sale &amp; Offers</span>
              <span className="text-amber-300 text-lg font-normal">/ Up to 50% OFF</span>
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm">
              Limited-time discounts on our top selected lifestyle and fashion collections!
            </p>
          </div>

          {/* Real-time Countdown Timer Box */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 self-start md:self-auto">
            <div className="text-center pr-2 hidden sm:block border-r border-white/20">
              <p className="text-[11px] text-rose-200">Deals End</p>
              <p className="text-xs font-bold text-amber-300">In</p>
            </div>
            
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-900 rounded-lg flex items-center justify-center font-mono font-black text-base sm:text-lg shadow-inner">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-200 mt-1 uppercase">Hours</span>
            </div>
            <span className="text-xl font-bold text-amber-300 -mt-4">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-900 rounded-lg flex items-center justify-center font-mono font-black text-base sm:text-lg shadow-inner">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-200 mt-1 uppercase">Mins</span>
            </div>
            <span className="text-xl font-bold text-amber-300 -mt-4">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 text-gray-900 rounded-lg flex items-center justify-center font-mono font-black text-base sm:text-lg shadow-inner animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-200 mt-1 uppercase">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sale Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => {
          const regular = product.regularPrice || Math.round(product.price * 1.3);
          const discountPercent = Math.round(((regular - product.price) / regular) * 100);
          const savings = regular - product.price;
          const isInWishlist = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-xl border border-rose-200/80 hover:border-red-500 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Big Sale Discount Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-xs">local_offer</span>
                    <span>{discountPercent}% OFF</span>
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-sm ${
                    isInWishlist
                      ? 'bg-red-50 text-red-500 border border-red-200'
                      : 'bg-white/90 hover:bg-white text-gray-500 hover:text-red-500'
                  }`}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <span className={`material-symbols-outlined text-sm ${isInWishlist ? 'material-symbols-fill text-red-500' : ''}`}>
                    favorite
                  </span>
                </button>

                {/* Savings Pill */}
                <div className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold">
                  Save ৳{savings.toLocaleString('en-US')}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-rose-600 uppercase tracking-wider">{product.brand || 'Lotus'}</span>
                    <span className="text-gray-400 font-mono text-[10px]">{product.sku}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {product.category} • In Stock
                  </p>
                </div>

                {/* Stock Urgency Progress Indicator */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span className="text-red-600 font-semibold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      Selling Fast
                    </span>
                    <span>Only {product.stock || 4} Left</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-red-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(95, Math.max(30, 100 - (product.stock || 2) * 10))}%` }}
                    />
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-3 pt-2.5 border-t border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-red-600 font-data-tabular">
                      ৳{product.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-data-tabular">
                      ৳{regular.toLocaleString('en-US')}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                      <span>Cart</span>
                    </button>
                    <button
                      onClick={(e) => handleDirectBuy(e, product)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Buy Now</span>
                      <span className="material-symbols-outlined text-sm">flash_on</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
