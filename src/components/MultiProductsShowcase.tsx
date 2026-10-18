import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface MultiProductsShowcaseProps {
  onSelectCategory?: (category: string) => void;
}

export const MultiProductsShowcase: React.FC<MultiProductsShowcaseProps> = ({ onSelectCategory }) => {
  const { products, setActiveProduct, setActiveView, addToCart, wishlist, toggleWishlist, showToast } = useStore();
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories', icon: 'grid_view' },
    { id: 'Three Piece', label: 'Three Piece & Sarees', icon: 'apparel' },
    { id: "Men's Wear", label: "Men's Fashion", icon: 'man' },
    { id: 'Kurti', label: 'Kurtis & Tops', icon: 'checkroom' },
    { id: 'Bags', label: 'Bags & Purses', icon: 'shopping_bag' },
    { id: 'Shoes', label: 'Shoes & Sneakers', icon: 'footprint' },
    { id: 'Hijab', label: 'Hijab Collection', icon: 'styler' },
    { id: 'Electronics', label: 'Watches & Gadgets', icon: 'watch' }
  ];

  // Filter products by selected tab
  const filteredProducts = selectedTab === 'all'
    ? products
    : products.filter(p => {
        if (selectedTab === 'Three Piece') {
          return p.category === 'Three Piece' || p.category === 'Saree';
        }
        return p.category.toLowerCase().includes(selectedTab.toLowerCase());
      });

  const displayProducts = filteredProducts.slice(0, 8);

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
    <section id="multi-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 scroll-mt-24">
      {/* Visual Feature Banner: Multi Product Hub Header */}
      <div className="relative bg-gradient-to-r from-neutral-900 via-[#1c1c1c] to-neutral-900 rounded-2xl overflow-hidden shadow-xl border border-neutral-800 text-white p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">category</span>
              <span>All-In-One Lifestyle Store</span>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide">
                Multi Products
              </h2>
              <p className="text-base text-gray-300 mt-1 font-medium">
                Every fashion and lifestyle essential under one trusted roof.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-200">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                <span>Women's Lawn &amp; Silk</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                <span>Men's Cotton Panjabi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                <span>Athletic Sneakers &amp; Shoes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                <span>Quilted Leather Handbags</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                <span>Smartwatches &amp; Gadgets</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                <span>Pure Modal Hijab Scarves</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onSelectCategory) onSelectCategory('all');
                  const el = document.getElementById('new-arrivals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-6 py-2.5 rounded-lg shadow-md text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Explore Full Catalog</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Product Collage Cards */}
          <div className="lg:col-span-7 flex flex-wrap items-center justify-center gap-3">
            {products.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item)}
                className="w-24 sm:w-28 h-32 rounded-xl bg-neutral-800/80 p-1 border border-neutral-700/80 overflow-hidden shadow-lg cursor-pointer group hover:border-amber-400 transition-all hover:scale-105"
                title={item.name}
              >
                <img
                  src={item.thumbnail || item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map(cat => {
          const isActive = selectedTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedTab(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400 hover:text-amber-600 shadow-2xs'
              }`}
            >
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Multi Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map(product => {
          const discountPercent = product.regularPrice > product.price
            ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
            : 0;
          const isInWishlist = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-xl border border-gray-200/90 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  <span className="inline-block bg-neutral-900/80 text-white font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-md backdrop-blur-xs">
                    {product.category}
                  </span>
                  {discountPercent > 0 && (
                    <span className="inline-block bg-red-600 text-white font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-md">
                      {discountPercent}% OFF
                    </span>
                  )}
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
              </div>

              {/* Product Details */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-amber-600">{product.brand || 'Lotus'}</span>
                    <span className="text-gray-400 font-mono text-[10px]">{product.sku}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {product.category} • Fast Delivery
                  </p>
                </div>

                {/* Price & CTA */}
                <div className="mt-3 pt-2.5 border-t border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-extrabold text-gray-900 font-data-tabular">
                      ৳{product.price.toLocaleString('en-US')}
                    </span>
                    {product.regularPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through font-data-tabular">
                        ৳{product.regularPrice.toLocaleString('en-US')}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      <span>Cart</span>
                    </button>
                    <button
                      onClick={(e) => handleDirectBuy(e, product)}
                      className="bg-amber-500 hover:bg-amber-600 text-neutral-900 text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Buy Now</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
