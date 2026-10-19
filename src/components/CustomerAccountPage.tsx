import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const CustomerAccountPage: React.FC = () => {
  const { orders, setActiveView, setActiveOrder, showToast, addToCart } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('orders');

  const filteredOrders = orders.filter(ord => {
    if (activeTab === 'in_transit') return ord.status === 'in_transit' || ord.status === 'processing';
    if (activeTab === 'delivered') return ord.status === 'delivered';
    if (activeTab === 'cancelled') return ord.status === 'cancelled';
    if (searchQuery) {
      return (
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.items.some(i => i.product.nameBn.includes(searchQuery))
      );
    }
    return true;
  });

  const handleTrackOrder = (ord: Order) => {
    setActiveOrder(ord);
    setActiveView('order_success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorder = (ord: Order) => {
    ord.items.forEach(it => {
      addToCart(it.product, it.quantity, it.selectedSize, it.selectedColor);
    });
    showToast('অর্ডারের পণ্যসমূহ আপনার কার্টে যুক্ত করা হয়েছে!');
    setActiveView('checkout');
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 font-body-md text-gray-800">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => setActiveView('home')} className="hover:text-amber-600 flex items-center gap-1 cursor-pointer">
          <span className="material-symbols-outlined text-sm">home</span>
          <span>হোম</span>
        </button>
        <span>/</span>
        <span className="text-gray-900 font-semibold text-amber-700">কাস্টমার ড্যাশবোর্ড ও অর্ডার হিস্টোরি</span>
      </nav>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="relative">
                <div className="w-13 h-13 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-amber-800 font-bold text-lg shadow-sm">
                  তা
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[9px] font-bold">check</span>
                </span>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-gray-900 truncate">তানভীর আহমেদ</h2>
                <p className="text-xs text-gray-500 font-data-tabular">+880 1712-345678</p>
                <p className="text-[11px] text-gray-400 truncate">tanvir.ahmed@example.com</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                <span className="material-symbols-outlined text-xs">military_tech</span>
                <span>গোল্ড মেম্বার</span>
              </span>
              <span className="text-emerald-700 font-bold text-[11px]">VIP Customer</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm space-y-1 text-xs">
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeNav === 'overview' ? 'bg-gray-100 font-bold text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span>ড্যাশবোর্ড ওভারভিউ</span>
            </button>

            <button
              onClick={() => setActiveNav('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeNav === 'orders' ? 'bg-amber-50 text-amber-800 font-bold border-l-4 border-amber-500' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>আমার অর্ডারসমূহ</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView('track_order')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">local_shipping</span>
                <span>লাইভ অর্ডার ট্র্যাকিং</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveNav('addresses')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeNav === 'addresses' ? 'bg-gray-100 font-bold text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>সেভ করা ঠিকানা</span>
            </button>

            <button
              onClick={() => setActiveNav('wishlist')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">favorite</span>
                <span>উইশলিস্ট ও সংরক্ষিত পণ্য</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-400">৪টি</span>
            </button>

            <button
              onClick={() => setActiveNav('coupons')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">confirmation_number</span>
                <span>কুপন ও রিওয়ার্ড পয়েন্টস</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">৪২০ pts</span>
            </button>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  showToast('লগ আউট সম্পন্ন হয়েছে', 'info');
                  setActiveView('home');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>লগ আউট</span>
              </button>
            </div>
          </div>

          {/* Support call box */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
              <span className="material-symbols-outlined text-sm text-amber-600">support_agent</span>
              <span>সহায়তা বা প্রশ্ন আছে?</span>
            </div>
            <p className="text-gray-500 text-[11px] mb-2 leading-relaxed">
              যেকোনো অর্ডার সংক্রান্ত তথ্যের জন্য আমাদের কাস্টমার সাপোর্ট টিম সর্বদা প্রস্তুত।
            </p>
            <a
              href="tel:+8801234567890"
              className="w-full py-1.5 bg-white border border-gray-300 rounded text-center block font-bold text-gray-800 hover:border-amber-500 transition-colors"
            >
              সরাসরি কল করুন
            </a>
          </div>
        </aside>

        {/* Right Dashboard & Orders Canvas (9 cols) */}
        <section className="lg:col-span-9 space-y-6">
          {/* Greeting & Top KPI Pills matching user screenshot */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-headline-lg flex items-center gap-1.5">
                  <span>স্বাগতম, তানভীর আহমেদ 👋</span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  আপনার সাম্প্রতিক কেনাকাটা, ট্র্যাকিং এবং ডেলিভারি স্ট্যাটাস এখান থেকে পর্যবেক্ষণ করুন।
                </p>
              </div>
              <button
                onClick={() => setActiveView('home')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-lg transition-all shadow cursor-pointer self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                <span>নতুন কেনাকাটা শুরু করুন</span>
              </button>
            </div>

            {/* 4 KPI Operational Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 border-t-2 border-t-amber-500">
                <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                  <span>মোট অর্ডার</span>
                  <span className="material-symbols-outlined text-sm text-amber-600">shopping_bag</span>
                </div>
                <div className="text-xl font-bold text-gray-900 font-data-tabular">{orders.length}টি</div>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  <span>সর্বমোট সংগৃহীত</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 border-t-2 border-t-blue-500">
                <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                  <span>চলমান পার্সেল</span>
                  <span className="material-symbols-outlined text-sm text-blue-600">local_shipping</span>
                </div>
                <div className="text-xl font-bold text-gray-900 font-data-tabular">১টি</div>
                <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-xs">near_me</span>
                  <span>ট্রানজিটে রয়েছে</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 border-t-2 border-t-emerald-500">
                <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                  <span>সম্পন্ন ডেলিভারি</span>
                  <span className="material-symbols-outlined text-sm text-emerald-600">inventory</span>
                </div>
                <div className="text-xl font-bold text-gray-900 font-data-tabular">১১টি</div>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>শতভাগ সফল</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 border-t-2 border-t-purple-500">
                <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                  <span>রিওয়ার্ড পয়েন্ট</span>
                  <span className="material-symbols-outlined text-sm text-purple-600">stars</span>
                </div>
                <div className="text-xl font-bold text-amber-700 font-data-tabular">৪২০</div>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  ৳ ২১০ ডিসকাউন্ট সমমূল্য
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Strip */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all' ? 'bg-amber-500 text-neutral-950 shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                সব অর্ডার ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('in_transit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'in_transit' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>প্রসেসিং / ট্রানজিট</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="font-bold text-[11px]">১</span>
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'delivered' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ডেলিভার্ড সম্পন্ন ({orders.filter(o => o.status === 'delivered').length})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'cancelled' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                বাতিল / রিটার্ন (০)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400 text-base">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="অর্ডার নম্বর (#LS-...) বা পণ্যের নাম দিয়ে খুঁজুন"
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:border-amber-500 outline-none"
                />
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                গত ৩০ দিন (Last 30 Days)
              </div>
            </div>
          </div>

          {/* Orders Cards List */}
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <article
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-amber-300 transition-all"
              >
                {/* Header */}
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-bold text-amber-800 font-data-tabular text-sm">{order.orderNumber}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      <span>{order.createdAt}</span>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="font-bold text-gray-900">
                      মোট মূল্য: ৳{order.total.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  {/* Payment pill */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    order.paymentMethod === 'bank'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : order.paymentMethod === 'cod'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-pink-100 text-pink-800 border-pink-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.paymentMethod === 'bank'
                        ? 'bg-emerald-600'
                        : order.paymentMethod === 'cod'
                        ? 'bg-amber-600'
                        : 'bg-pink-700'
                    }`}></span>
                    <span>
                      {order.paymentMethod === 'bank'
                        ? '🏦 BANK PAYMENT (ভেরিফিকেশন সাপেক্ষ)'
                        : order.paymentMethod === 'cod'
                        ? '🚚 ক্যাশ অন ডেলিভারি (COD)'
                        : `${order.paymentMethod.toUpperCase()} ভেরিফাইড (Paid)`}
                    </span>
                  </span>
                </div>

                {/* Status bar */}
                <div className="bg-blue-50/70 px-5 py-2 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-blue-700">local_shipping</span>
                    <span className="font-bold">
                      {order.status === 'delivered' ? 'সফলভাবে ডেলিভার্ড সম্পন্ন' : 'ইন-প্রসেসিং / ট্রানজিটে রয়েছে'}
                    </span>
                    <span className="text-gray-600">
                      (কুরিয়ার: Steadfast Courier - ট্র্যাকিং: <strong>{order.trackingNumber || 'ST-90214'}</strong>)
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    সম্ভাব্য ডেলিভারি: ১৯-২০ অক্টোবর
                  </span>
                </div>

                {/* Products in this order */}
                <div className="p-5 divide-y divide-gray-100">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.thumbnail}
                          alt={it.product.nameBn}
                          className="w-14 h-16 object-cover rounded border border-gray-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 leading-tight">
                            {it.product.nameBn}
                          </h4>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            সাইজ: <span className="font-semibold text-gray-800">{it.selectedSize}</span> | কালার: <span className="font-semibold text-gray-800">{it.selectedColor}</span>
                          </p>
                          <span className="text-gray-500 font-data-tabular">
                            পরিমাণ: {it.quantity}টি × ৳{it.unitPrice.toLocaleString('bn-BD')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-gray-900 font-data-tabular text-sm">
                          ৳{(it.unitPrice * it.quantity).toLocaleString('bn-BD')}
                        </span>
                        <span className="block text-[10px] text-emerald-700 font-semibold">স্টকে মজুত</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom actions strip */}
                <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span className="material-symbols-outlined text-sm text-amber-600">location_on</span>
                    <span>ডেলিভারি: <strong>{order.address}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-800 font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      ইনভয়েস ডাউনলোড (PDF)
                    </button>
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="px-3.5 py-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded shadow transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">near_me</span>
                      <span>লাইভ ট্র্যাকিং দেখুন</span>
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1 bg-neutral-900 hover:bg-black text-white font-bold rounded transition-colors cursor-pointer"
                    >
                      রি-অর্ডার
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Saved Delivery Addresses Preview matching user screenshot */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">pin_drop</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 font-headline-md">
                    সেভ করা ডেলিভারি ঠিকানা (Saved Addresses)
                  </h3>
                  <p className="text-xs text-gray-500">চেকআউটে দ্রুত অর্ডার প্লেস করতে আপনার প্রাথমিক ও অফিস ঠিকানা নির্বাচন করুন</p>
                </div>
              </div>
              <button
                onClick={() => showToast('নতুন ঠিকানা যোগ করার ফর্ম সক্রিয়')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>+ নতুন ঠিকানা যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Home Address */}
              <div className="p-4 rounded-xl border-2 border-amber-500/50 bg-amber-50/30 text-xs space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                    <span className="material-symbols-outlined text-xs">home</span>
                    <span>হোম (বাসা) - ডিফল্ট</span>
                  </span>
                  <span className="material-symbols-outlined text-amber-600 text-sm">check_circle</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">তানভীর আহমেদ (+880 1712-345678)</h4>
                <p className="text-gray-600 leading-relaxed">
                  মিরপুর-১০, ব্লক-সি, রোড-৪, বাড়ি-১২ (৪র্থ তলা, ফ্ল্যাট-৪বি)<br />
                  মিরপুর, ঢাকা-১২১৬, বাংলাদেশ
                </p>
                <div className="pt-2 text-emerald-800 font-bold flex items-center gap-1">
                  <span>ডিফল্ট শিপিং অ্যাড্রেস হিসেবে সক্রিয়</span>
                </div>
              </div>

              {/* Office Address */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white text-xs space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                    <span className="material-symbols-outlined text-xs">apartment</span>
                    <span>অফিস</span>
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">তানভীর আহমেদ (অফিস ডেস্ক)</h4>
                <p className="text-gray-600 leading-relaxed">
                  বাড়ি-২৮, রোড-৩২ (পুরাতন), ধানমন্ডি আবাসিক এলাকা<br />
                  ঢাকা-১২০৯, বাংলাদেশ
                </p>
                <div className="pt-2 text-gray-400 font-semibold">
                  <span>বিকল্প ডেলিভারি স্থান</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
