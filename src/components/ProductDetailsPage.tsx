import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductDetailsPage: React.FC = () => {
  const {
    activeProduct,
    setActiveProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    setActiveView,
    products,
    setIsSizeChartOpen,
    setIsReviewsModalOpen,
    openAdminTab
  } = useStore();

  const product = activeProduct || products[0];

  const [activeImage, setActiveImage] = useState(product.images[0] || product.thumbnail);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.nameBn || 'পিচ রোজ');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'L (40)');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<number>(0);

  const isWish = wishlist.includes(product.id);

  const handleBuyNow = () => {
    addToCart(product, qty, selectedSize, selectedColor);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize, selectedColor);
  };

  const discountAmount = product.regularPrice - product.price;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb & Admin Action */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <button onClick={() => setActiveView('home')} className="hover:text-amber-600 flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>হোম</span>
          </button>
          <span>/</span>
          <span className="hover:text-amber-600 cursor-pointer">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.nameBn}</span>
        </nav>

        <button
          onClick={() => openAdminTab('products')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ml-auto"
          title="অ্যাডমিন প্যানেল: পণ্য সম্পাদনা, ডিলিট বা নতুন পণ্য যোগ করুন"
        >
          <span className="material-symbols-outlined text-sm">inventory_2</span>
          <span>অ্যাডমিন: পণ্য যোগ ও ডিলিট প্যানেল</span>
        </button>
      </div>

      {/* Main Product Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-4 sm:p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
        {/* Left Column: Media Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main High-Resolution View */}
          <div className="relative w-full aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden border border-gray-200 group flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.nameBn}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                <span className="material-symbols-outlined text-xs material-symbols-fill">local_fire_department</span>
                <span>হট সেলিং</span>
              </span>
              <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                ২২% ডিসকাউন্ট
              </span>
              <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                SKU: {product.sku}
              </span>
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center transition-all cursor-pointer ${
                isWish ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span className={`material-symbols-outlined ${isWish ? 'material-symbols-fill' : ''}`}>favorite</span>
            </button>

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded text-xs backdrop-blur flex items-center gap-1 pointer-events-none">
              <span className="material-symbols-outlined text-xs">zoom_in</span>
              <span>জুম করতে কার্সর রাখুন</span>
            </div>
          </div>

          {/* Thumbnails list */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`rounded-lg overflow-hidden aspect-[4/5] bg-gray-100 transition-all cursor-pointer ${
                  activeImage === img ? 'border-2 border-amber-500 ring-2 ring-amber-500/20' : 'border border-gray-200 hover:border-amber-400'
                }`}
              >
                <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="material-symbols-outlined text-sm text-emerald-600">verified_user</span>
              <span>১০০% আসল প্রোডাক্টের নিশ্চয়তা ও কোয়ালিটি চেকিং</span>
            </div>
          </div>
        </div>

        {/* Right Column: Buying Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                ব্র্যান্ড: {product.brand}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>ইন-স্টক ({product.stock} টি বাকি আছে)</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug font-bn">
              {product.nameBn}
            </h1>

            {/* Rating & Review Trigger */}
            <div className="flex items-center gap-3 py-2 flex-wrap">
              <button
                onClick={() => setIsReviewsModalOpen(true)}
                className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded text-amber-800 transition-colors cursor-pointer"
              >
                <div className="flex text-amber-400">
                  <span className="material-symbols-outlined text-sm material-symbols-fill">star</span>
                  <span className="material-symbols-outlined text-sm material-symbols-fill">star</span>
                  <span className="material-symbols-outlined text-sm material-symbols-fill">star</span>
                  <span className="material-symbols-outlined text-sm material-symbols-fill">star</span>
                  <span className="material-symbols-outlined text-sm material-symbols-fill">star_half</span>
                </div>
                <span className="text-xs font-bold font-data-tabular">{product.rating}</span>
                <span className="text-xs text-gray-500 underline ml-1">({product.reviewCount}টি ভেরিফায়েড রিভিউ)</span>
              </button>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">local_mall</span>
                <span>৪৫০+ টি ডেলিভারি সম্পন্ন</span>
              </span>
            </div>

            {/* Price Ledger Card */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1 my-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-red-600 font-data-tabular">
                  ৳{product.price.toLocaleString('bn-BD')}
                </span>
                <span className="text-sm text-gray-400 line-through font-data-tabular">
                  ৳{product.regularPrice.toLocaleString('bn-BD')}
                </span>
                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded font-bold">
                  ২২% ছাড়
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                🎉 এই অর্ডারে আপনি সরাসরি বাঁচাচ্ছেন <span className="font-bold font-data-tabular">৳{discountAmount.toLocaleString('bn-BD')}</span> টাকা!
              </p>
            </div>

            {/* Color Variants */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-800">কালার ভ্যারিয়েন্ট:</span>
                <span className="text-amber-700 font-bold">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.nameBn)}
                    className={`p-1 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === c.nameBn
                        ? 'ring-2 ring-amber-500 ring-offset-2'
                        : 'ring-1 ring-gray-300 hover:ring-amber-400'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-gray-300 block"
                      style={{ backgroundColor: c.hex }}
                    ></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Variants & Size Chart Modal Trigger */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-800">সাইজ নির্বাচন করুন:</span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-amber-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  <span>সাইজ চার্ট (Size Guide)</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((sz, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'border-2 border-amber-500 bg-amber-50 text-amber-800'
                        : 'border border-gray-200 text-gray-700 hover:border-amber-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 py-2">
              <span className="text-xs font-semibold text-gray-800">পরিমাণ (Quantity):</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold text-base cursor-pointer"
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={qty}
                  className="w-10 h-8 text-center border-none focus:ring-0 p-0 font-data-tabular text-sm font-semibold"
                />
                <button
                  onClick={() => setQty(prev => Math.min(5, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold text-base cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-gray-500">সর্বোচ্চ ৫টি পর্যন্ত একবারে অর্ডার করতে পারবেন</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-98 text-neutral-950 py-3.5 px-6 rounded-lg font-bold text-sm shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>এখনই কিনুন (Buy Now)</span>
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-98 py-3.5 px-6 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                <span>কার্টে যোগ করুন</span>
              </button>
            </div>

            {/* Shipping & Delivery Box */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2 text-xs mt-4">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base mt-0.5">local_shipping</span>
                <div>
                  <p className="font-semibold text-gray-900">ডেলিভারি চার্জ ও সময়সীমা:</p>
                  <p className="text-gray-600">
                    • ঢাকা মেট্রো: <span className="font-bold text-gray-900 font-data-tabular">৳৬০</span> (১-২ কার্যদিবস)<br />
                    • ঢাকার বাইরে (সারা দেশ): <span className="font-bold text-gray-900 font-data-tabular">৳১৩০</span> (২-৩ কার্যদিবস)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 border-t border-gray-200 pt-2">
                <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5">payments</span>
                <div>
                  <p className="font-semibold text-gray-900">পেমেন্ট মেথড:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-gray-800 border border-gray-300">
                      ক্যাশ অন ডেলিভারি
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200">
                      bKash
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      Nagad
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-gray-200 pt-2 text-gray-600 text-[11px]">
                <span className="material-symbols-outlined text-sm text-amber-600">published_with_changes</span>
                <span>পণ্য হাতে পেয়ে চেক করে নেওয়ার সুবিধা এবং ৭ দিনের সহজ রিটার্ন পলিসি।</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description / Size Chart / Delivery / Reviews */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab(0)}
            className={`py-3.5 px-4 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 0 ? 'text-amber-600 border-b-2 border-amber-500 font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            পণ্যের বিবরণ (Description)
          </button>
          <button
            onClick={() => {
              setActiveTab(1);
              setIsSizeChartOpen(true);
            }}
            className={`py-3.5 px-4 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 1 ? 'text-amber-600 border-b-2 border-amber-500 font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>সাইজ চার্ট (Size Chart)</span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`py-3.5 px-4 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 2 ? 'text-amber-600 border-b-2 border-amber-500 font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ডেলিভারি ও রিটার্ন পলিসি
          </button>
          <button
            onClick={() => {
              setActiveTab(3);
              setIsReviewsModalOpen(true);
            }}
            className={`py-3.5 px-4 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 3 ? 'text-amber-600 border-b-2 border-amber-500 font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>গ্রাহক রিভিউ</span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold font-data-tabular">
              {product.reviewCount}
            </span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </button>
        </div>

        {/* Tab 0: Description */}
        {activeTab === 0 && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">পণ্যের বৈশিষ্ট্য ও ফেব্রিক ডিটেইলস</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-bn">
                  {product.descriptionBn}
                </p>
                <div className="space-y-1.5 pt-2 text-xs text-gray-700">
                  {product.featuresBn.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-sm">check_circle</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">dry_cleaning</span>
                  <span>ওয়াশ কেয়ার নির্দেশিকা (Washing Guidelines)</span>
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                  <li>প্রথমবার ওয়াশের ক্ষেত্রে ড্রাই ক্লিন অথবা মৃদু হাতে পরিষ্কার করার পরামর্শ দেয়া হচ্ছে।</li>
                  <li>কড়া রোদে দীর্ঘক্ষণ শুকানো থেকে বিরত থাকুন, ছায়াযুক্ত স্থানে শুকানো ভালো।</li>
                  <li>এমব্রয়ডারি অংশের উপর উল্টো পাশ থেকে মাঝারি তাপে ইস্ত্রি করুন।</li>
                  <li>কোনো প্রকার ব্লিচ বা ক্লোরিনযুক্ত ডিটারজেন্ট ব্যবহার করবেন না।</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Delivery & Return */}
        {activeTab === 2 && (
          <div className="p-4 sm:p-6 space-y-4 text-xs text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-base">local_shipping</span>
                  <span>ডেলিভারি পার্টনার্স ও সার্ভিস</span>
                </h4>
                <p>আমরা সারা বাংলাদেশে <strong>Steadfast Courier</strong>, <strong>Pathao</strong> এবং <strong>RedX</strong> এর মাধ্যমে দ্রুততম সময়ে ডেলিভারি নিশ্চিত করি।</p>
                <p>• ঢাকা মেট্রো: ২৪ থেকে ৪৮ ঘণ্টা (চার্জ ৳৬০)<br />• সারা বাংলাদেশ: ২ থেকে ৩ কার্যদিবস (চার্জ ৳১৩০)</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">assignment_return</span>
                  <span>৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ</span>
                </h4>
                <p>পণ্য হাতে পেয়ে কোনো সাইজ বা ত্রুটি থাকলে ৭ দিনের মধ্যে অরিজিনাল ট্যাগ সহ সহজে রিপ্লেসমেন্ট করা যাবে।</p>
                <p>ক্যাশ অন ডেলিভারি অর্ডারেও ডেলিভারি ম্যানের সামনে পণ্য দেখে নেওয়ার সম্পূর্ণ সুযোগ রয়েছে।</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-bn">একই ক্যাটাগরির জনপ্রিয় পণ্য</h2>
            <p className="text-xs text-gray-500">অন্যান্য গ্রাহকদের সর্বাধিক পছন্দের কালেকশন</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(1, 5).map(relProd => (
            <div
              key={relProd.id}
              onClick={() => {
                setActiveProduct(relProd);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <img
                  src={relProd.thumbnail}
                  alt={relProd.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-amber-600">
                  {relProd.nameBn}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs font-bold text-red-600 font-data-tabular">
                    ৳{relProd.price.toLocaleString('bn-BD')}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through font-data-tabular">
                    ৳{relProd.regularPrice.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
