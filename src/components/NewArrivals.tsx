import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface NewArrivalsProps {
  filterCategory?: string;
  searchQuery?: string;
  onClearFilter?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  filterCategory,
  searchQuery,
  onClearFilter,
  onSelectCategory
}) => {
  const { products, addToCart, wishlist, toggleWishlist, setActiveProduct, setActiveView, openAdminTab } = useStore();

  const trimmedSearch = (searchQuery || '').trim().toLowerCase();

  // Filter products based on search query or category
  const filtered = products.filter(product => {
    // 1. Search Query filter
    if (trimmedSearch) {
      const matchName = product.name.toLowerCase().includes(trimmedSearch);
      const matchNameBn = product.nameBn.toLowerCase().includes(trimmedSearch);
      const matchSku = product.sku.toLowerCase().includes(trimmedSearch);
      const matchCategory = product.category.toLowerCase().includes(trimmedSearch);
      const matchBrand = product.brand.toLowerCase().includes(trimmedSearch);
      const matchDesc = product.descriptionBn?.toLowerCase().includes(trimmedSearch);
      if (!(matchName || matchNameBn || matchSku || matchCategory || matchBrand || matchDesc)) {
        return false;
      }
    }

    // 2. Category filter
    if (filterCategory) {
      const matchCat = product.category.toLowerCase().includes(filterCategory.toLowerCase());
      if (!matchCat) return false;
    }

    return true;
  });

  const handleProductClick = (prod: Product) => {
    setActiveProduct(prod);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFiltering = Boolean(trimmedSearch || filterCategory);

  return (
    <section id="new-arrivals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-gray-200 mb-6 gap-3">
        <div className="flex items-baseline space-x-2">
          {trimmedSearch ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-xl">search</span>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  অনুসন্ধানের ফলাফল: <span className="text-amber-600 font-bn">"{searchQuery}"</span>
                </h2>
              </div>
              <p className="text-xs text-gray-500 font-bn mt-0.5">
                {filtered.length} টি পণ্য খুঁজে পাওয়া গেছে
              </p>
            </div>
          ) : filterCategory ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {filterCategory}
              </h2>
              <span className="font-bn text-xs text-gray-500 font-medium">ক্যাটাগরির পণ্যসমূহ ({filtered.length} টি)</span>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">New Arrivals & All Products</h2>
              <span className="font-bn text-xs text-gray-500 font-medium">সর্বশেষ ট্রেন্ডিং কালেকশন</span>
            </div>
          )}
        </div>

        {/* Clear Filter / View All / Product Admin button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAdminTab('products')}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="অ্যাডমিন প্যানেল: সরাসরি পণ্য যোগ ও ডিলিট করুন"
          >
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>পণ্য যোগ ও ডিলিট (Admin)</span>
          </button>

          {isFiltering ? (
            <button
              onClick={onClearFilter}
              className="text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              <span>ফিল্টার রিসেট</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (products[0]) handleProductClick(products[0]);
              }}
              className="text-xs font-semibold text-gray-700 hover:text-amber-600 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* When no products match search */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-bn mb-1">
            "{searchQuery}" এর সাথে কোনো পণ্য মেলেনি
          </h3>
          <p className="text-xs text-gray-500 font-bn mb-6 leading-relaxed">
            বানান সঠিক কিনা যাচাই করুন অথবা অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।
          </p>

          <div className="space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              জনপ্রিয় সার্চ কিওয়ার্ড:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['থ্রি পিস', 'শাড়ি', 'পাঞ্জাবি', 'হিজাব', 'ব্যাগ', 'কসমেটিকস'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(tag);
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-amber-100 hover:text-amber-800 text-gray-700 rounded-full text-xs font-bn transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onClearFilter}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold font-bn transition-colors shadow-xs cursor-pointer"
              >
                সকল পণ্য ব্রাউজ করুন
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {filtered.map(product => {
            const isWish = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-xs hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative bg-gray-50 p-2 cursor-pointer" onClick={() => handleProductClick(product)}>
                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs z-10 ${
                        product.badge === 'Hot'
                          ? 'bg-red-500'
                          : product.badge === 'Sale'
                          ? 'bg-rose-600'
                          : product.badge === 'Trending'
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-colors z-10 cursor-pointer ${
                      isWish ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-sm ${isWish ? 'material-symbols-fill' : ''}`}>
                      favorite
                    </span>
                  </button>

                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.nameBn}
                    className="w-full h-44 object-cover rounded-md group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  <div className="mb-1 flex items-center justify-between gap-1 text-[10px] text-gray-500">
                    <span className="truncate">{product.category}</span>
                    <span className="font-mono bg-gray-100 px-1 rounded text-gray-600 shrink-0">{product.sku}</span>
                  </div>

                  <h3
                    onClick={() => handleProductClick(product)}
                    className="font-bn text-xs font-semibold text-gray-800 line-clamp-1 mb-1 hover:text-amber-600 cursor-pointer"
                  >
                    {product.nameBn}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-1.5">
                    <div className="flex text-amber-400 text-xs">
                      <span className="material-symbols-outlined text-xs material-symbols-fill">star</span>
                      <span className="material-symbols-outlined text-xs material-symbols-fill">star</span>
                      <span className="material-symbols-outlined text-xs material-symbols-fill">star</span>
                      <span className="material-symbols-outlined text-xs material-symbols-fill">star</span>
                      <span className="material-symbols-outlined text-xs material-symbols-fill">star</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bn">
                      ({product.reviewCount || 12})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-1.5 mt-auto mb-2">
                    <span className="font-bn font-bold text-red-600 text-sm">
                      ৳{product.price.toLocaleString('bn-BD')}
                    </span>
                    <span className="font-bn text-gray-400 text-xs line-through">
                      ৳{product.regularPrice.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  {/* Add to cart */}
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="w-full bg-neutral-900 hover:bg-amber-600 text-white text-[11px] font-medium py-1.5 rounded flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">shopping_cart</span>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
