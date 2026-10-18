import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const BestSellers: React.FC = () => {
  const { products, addToCart, wishlist, toggleWishlist, setActiveProduct, setActiveView, showToast } = useStore();

  // Find best sellers: explicitly flagged as isBestseller, or rating >= 4.6, or top ordered
  const bestsellerProducts = products.filter(
    p => p.isBestseller || p.rating >= 4.6 || p.badge === 'Hot' || p.reviewCount >= 20
  );

  // If few match, show top 4 from available products
  const displayProducts = bestsellerProducts.length >= 4 
    ? bestsellerProducts.slice(0, 8) 
    : products.slice(0, 8);

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

  if (displayProducts.length === 0) return null;

  return (
    <section id="best-sellers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-gray-200 mb-8 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm text-amber-500">local_fire_department</span>
            <span>Customer Favorites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Best Sellers</span>
            <span className="text-amber-500 text-lg font-normal">/ Top Rated</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Our most popular and highest rated premium items, loved by thousands of shoppers.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('new-arrivals-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 group cursor-pointer"
        >
          <span>View All Products</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product, idx) => {
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
              {/* Top Badges */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Best Seller Rank Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md">
                    <span className="material-symbols-outlined text-xs">workspace_premium</span>
                    <span>#{idx + 1} Best Seller</span>
                  </span>
                  {discountPercent > 0 && (
                    <span className="inline-block bg-red-600 text-white font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-md">
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

                {/* Stock alert pill if low stock */}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] sm:text-xs py-0.5 px-2 rounded text-center font-medium">
                    Only {product.stock} left in stock!
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-amber-600">{product.category}</span>
                    <div className="flex items-center text-amber-500 gap-0.5">
                      <span className="material-symbols-outlined text-xs material-symbols-fill">star</span>
                      <span className="font-semibold text-gray-700">{product.rating || '4.8'}</span>
                      <span className="text-gray-400">({product.reviewCount || 25})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    SKU: {product.sku} • {product.brand}
                  </p>
                </div>

                {/* Price Section */}
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

                  {/* Actions: Add to Cart & Buy Now */}
                  <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      <span>Cart</span>
                    </button>
                    <button
                      onClick={(e) => handleDirectBuy(e, product)}
                      className="bg-amber-500 hover:bg-amber-600 text-neutral-900 text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Buy Now</span>
                      <span className="material-symbols-outlined text-sm">bolt</span>
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
