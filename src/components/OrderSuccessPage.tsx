import React from 'react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessPage: React.FC = () => {
  const { activeOrder, setActiveView, products, setActiveProduct, settings } = useStore();

  const order = activeOrder || {
    id: 'ord-8942',
    orderNumber: '#LS-8942',
    invoiceNumber: 'INV-2024-8942',
    createdAt: '১৭ অক্টোবর ২০২৪, ১০:১৫ AM',
    customerName: 'তানভীর আহমেদ',
    customerPhone: '01712-345678',
    division: 'ঢাকা (Dhaka)',
    district: 'ঢাকা মেট্রো',
    thana: 'মিরপুর-১০',
    address: 'মিরপুর-১০, ব্লক-সি, রোড-৪, বাড়ি-১২ (৪র্থ তলা), ঢাকা মেট্রো - ১২১৬, বাংলাদেশ।',
    items: [],
    subtotal: 3400,
    discount: 340,
    total: 3120,
    paymentMethod: 'bkash',
    paymentStatus: 'verified',
    transactionId: 'TRX92819034',
    courier: 'steadfast',
    consignmentId: 'ST-90214-MIRPUR',
    trackingNumber: 'ST-90214',
    deliveryFee: 60,
    deliveryInstruction: 'অফিস টাইমের পরে বিকেল ৫টার পর ডেলিভারি দিলে ভালো হয়।'
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-body-md text-gray-800">
      {/* 1. Celebratory Success Hero Banner */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Animated Check Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-4xl sm:text-5xl material-symbols-fill text-emerald-600">
                check_circle
              </span>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-300 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>অর্ডারটি কনফার্ম হয়েছে</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-headline-lg">
                ধন্যবাদ, {order.customerName}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-2xl font-bn">
                একটি কনফার্মেশন এসএমএস ও ইমেইল আপনার <strong className="text-gray-900 font-data-tabular">{order.customerPhone}</strong> নম্বরে পাঠানো হয়েছে। আমাদের মার্চেন্ট হাব থেকে পণ্য দ্রুততম সময়ে পাঠানো হবে।
              </p>
            </div>
          </div>

          {/* Quick Invoice & Print Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs font-bold hover:bg-gray-50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>প্রিন্ট রিসিট</span>
            </button>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-600 shadow transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>ইনভয়েস (PDF)</span>
            </button>
          </div>
        </div>

        {/* Order Metadata Strip / Key Metrics */}
        <div className="mt-6 pt-5 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[11px] text-gray-500 uppercase block font-semibold">অর্ডার নম্বর</span>
            <span className="text-base font-bold text-amber-700 font-data-tabular mt-0.5 block">{order.orderNumber}</span>
            <span className="text-[10px] text-gray-400">{order.createdAt}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[11px] text-gray-500 uppercase block font-semibold">পেমেন্ট মেথড</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                order.paymentMethod === 'bank'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.paymentMethod === 'cod'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-pink-100 text-pink-800'
              }`}>
                {order.paymentMethod === 'bank' ? '🏦 BANK' : order.paymentMethod.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {order.paymentMethod === 'bank'
                  ? 'রেফারেন্স গৃহীত'
                  : order.paymentMethod === 'cod'
                  ? 'ক্যাশ অন ডেলিভারি'
                  : 'পরিশোধিত'}
              </span>
            </div>
            <span className="text-xs font-bold font-data-tabular text-gray-900 mt-0.5 block truncate">
              ৳{order.total.toLocaleString('bn-BD')}{' '}
              {order.paymentMethod === 'bank' && order.transactionId
                ? `(Ref: ${order.transactionId})`
                : order.paymentMethod === 'cod'
                ? '(বকেয়া)'
                : '(ভেরিফায়েড)'}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[11px] text-gray-500 uppercase block font-semibold">আনুমানিক ডেলিভারি সময়</span>
            <span className="text-base font-bold text-gray-900 mt-0.5 block">১৯-২০ অক্টোবর</span>
            <span className="text-[10px] text-emerald-700 font-medium">১-২ কার্যদিবসের মধ্যে</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[11px] text-gray-500 uppercase block font-semibold">ডেলিভারি পার্টনার</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-sm font-bold text-gray-900">Steadfast</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-data-tabular">
                {order.trackingNumber || 'ST-90214'}
              </span>
            </div>
            <span className="text-[10px] text-gray-500">এক্সপ্রেস হোম ডেলিভারি</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Live Order Tracking Timeline Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" id="tracking-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-lg">route</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-headline-md">রিয়েল-টাইম অর্ডার ট্র্যাকিং</h2>
              <p className="text-xs text-gray-500">Steadfast Courier API ও Lotus ইন-হাউস মার্চেন্ট হাব লাইভ ট্র্যাকার</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>ইন-প্রসেসিং (প্যাকিং সম্পন্ন)</span>
            </span>
          </div>
        </div>

        {/* Dynamic Timeline Tracker matching user screenshot */}
        <div className="py-6 overflow-x-auto">
          <div className="min-w-[680px] grid grid-cols-5 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative px-2">
              <div className="absolute top-4 left-1/2 w-full h-1 bg-emerald-600 z-0"></div>
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center z-10 shadow">
                <span className="material-symbols-outlined text-base font-bold">check</span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 mt-2.5">অর্ডার গ্রহণ করা হয়েছে</h3>
              <span className="text-[11px] text-gray-500">১৭ অক্টোবর, ১০:১৫ AM</span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">অর্ডার ভেরিফায়েড ✓</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative px-2">
              <div className="absolute top-4 left-1/2 w-full h-1 bg-emerald-600 z-0"></div>
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center z-10 shadow">
                <span className="material-symbols-outlined text-base font-bold">check</span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 mt-2.5">পেমেন্ট নিশ্চিতকরণ</h3>
              <span className="text-[11px] text-gray-500">১৭ অক্টোবর, ১০:১৮ AM</span>
              <span className="text-[10px] text-pink-700 font-semibold mt-0.5">
                {order.paymentMethod.toUpperCase()} {order.transactionId || 'TRX92819034'}
              </span>
            </div>

            {/* Step 3 (Active) */}
            <div className="flex flex-col items-center text-center relative px-2">
              <div className="absolute top-4 left-1/2 w-full h-1 bg-gray-200 z-0"></div>
              <div className="w-10 h-10 -mt-0.5 rounded-full bg-amber-500 text-white flex items-center justify-center z-10 ring-4 ring-amber-200 shadow-md">
                <span className="material-symbols-outlined text-lg">inventory_2</span>
              </div>
              <h3 className="text-xs font-bold text-amber-700 mt-2">পার্সেল প্যাকেজিং ও প্রস্তুত</h3>
              <span className="text-[11px] text-amber-700 font-medium">১৭ অক্টোবর, ০২:৩০ PM</span>
              <span className="text-[10px] text-gray-500 mt-0.5">মিরপুর ওয়্যারহাউস হাব</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative px-2 opacity-60">
              <div className="absolute top-4 left-1/2 w-full h-1 bg-gray-200 z-0"></div>
              <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center z-10">
                <span className="material-symbols-outlined text-base">local_shipping</span>
              </div>
              <h3 className="text-xs font-bold text-gray-800 mt-2.5">কুরিয়ারে হস্তান্তর</h3>
              <span className="text-[11px] text-gray-500">১৮ অক্টোবর (প্রত্যাশিত)</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Steadfast Hub</span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center relative px-2 opacity-60">
              <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center z-10">
                <span className="material-symbols-outlined text-base">home</span>
              </div>
              <h3 className="text-xs font-bold text-gray-800 mt-2.5">ডেলিভারি সম্পন্ন</h3>
              <span className="text-[11px] text-gray-500">১৯ অক্টোবর (প্রত্যাশিত)</span>
              <span className="text-[10px] text-gray-400 mt-0.5">গ্রাহকের ঠিকানা</span>
            </div>
          </div>
        </div>

        {/* Courier dispatch note */}
        <div className="mt-2 bg-gray-50 rounded-lg p-3.5 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">notifications_active</span>
            </div>
            <div>
              <p className="text-gray-800 font-medium">
                আপনার পার্সেলটি মিরপুর সেন্ট্রাল হাব-এ কোয়ালিটি চেকিং ও প্যাকেজিং শেষ পর্যায়ে রয়েছে। কুরিয়ার রাইডার পিকআপ করলেই লাইভ ট্র্যাকিং লিংক এসএমএস করা হবে।
              </p>
              <span className="text-[11px] text-gray-500">
                Steadfast Consignment ID: <strong>{order.consignmentId || 'ST-90214-MIRPUR'}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => alert(`কুরিয়ার ট্র্যাকিং কোড: ${order.trackingNumber || 'ST-90214'}`)}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-amber-500 text-amber-700 font-bold hover:bg-amber-50 transition-colors"
          >
            এসএমএস ট্র্যাকিং স্ট্যাটাস
          </button>
        </div>
      </section>

      {/* 3. Detailed Breakdown (Left: Items & Ledger, Right: Destination & Payment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">shopping_bag</span>
                <h3 className="text-sm font-bold text-gray-900 font-headline-md">
                  অর্ডারকৃত পণ্যসমূহ ({(order.items && order.items.length) || 3}টি)
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
                প্যাকেজ কোড: PKG-BD-441
              </span>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
              {(order.items && order.items.length > 0 ? order.items : [
                {
                  id: '1',
                  product: products[0],
                  quantity: 1,
                  selectedSize: 'XL',
                  selectedColor: 'পিচ রোজ (Peach Rose)',
                  unitPrice: 1450
                },
                {
                  id: '2',
                  product: products[4] || products[0],
                  quantity: 1,
                  selectedSize: 'Standard Tote',
                  selectedColor: 'ক্রিম ব্রাউন',
                  unitPrice: 1250
                },
                {
                  id: '3',
                  product: products[6] || products[0],
                  quantity: 2,
                  selectedSize: '80x30 Inch',
                  selectedColor: 'পিচ',
                  unitPrice: 350
                }
              ]).map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.thumbnail}
                      alt={it.product.nameBn}
                      className="w-14 h-16 object-cover rounded border border-gray-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">
                        {it.product.nameBn}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        সাইজ: <span className="font-semibold text-gray-800">{it.selectedSize}</span> • রং: <span className="font-semibold text-gray-800">{it.selectedColor}</span> • পরিমাণ: <span className="font-semibold text-gray-800">{it.quantity}টি</span>
                      </p>
                      <span className="text-[10px] text-emerald-700 font-semibold">ইন-স্টক (মিরপুর হাব)</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-gray-900 font-data-tabular block">
                      ৳{(it.unitPrice * it.quantity).toLocaleString('bn-BD')}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      ৳{(it.product.regularPrice * it.quantity).toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Ledger */}
            <div className="mt-4 pt-3 border-t border-gray-200 space-y-1.5 bg-gray-50 p-3.5 rounded-lg text-xs text-gray-600">
              <div className="flex justify-between">
                <span>পণ্যসমূহের মোট মূল্য (Subtotal):</span>
                <span className="font-semibold text-gray-900 font-data-tabular">৳{order.subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>প্রমোশনাল কুপন ডিসকাউন্ট (LOTUS10):</span>
                <span className="font-data-tabular">-৳{(order.discount || 340).toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ (ঢাকা মেট্রো এরিয়া):</span>
                <span className="font-semibold text-gray-900 font-data-tabular">+৳{(order.deliveryFee || 60).toLocaleString('bn-BD')}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-gray-900 block font-bn">সর্বমোট পরিশোধিত (Total Paid):</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">সকল ভ্যাট ও ট্যাক্স অন্তর্ভুক্ত</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-amber-700 font-data-tabular">
                    ৳{order.total.toLocaleString('bn-BD')}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-semibold">
                    {order.paymentMethod.toUpperCase()} এর মাধ্যমে পেইড ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help assistance strip */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-gray-700 font-medium">কোনো পণ্য পরিবর্তন বা সমস্যা আছে?</span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <span>হোয়াটসঅ্যাপ সহায়তা</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Recipient & Payment Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recipient Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">ডেলিভারি ও প্রাপকের তথ্য</h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                হোম ডেলিভারি
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">প্রাপকের নাম</span>
                <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">যোগাযোগের মোবাইল</span>
                <p className="font-bold text-gray-900 font-data-tabular flex items-center gap-1">
                  <span>{order.customerPhone}</span>
                  <span className="material-symbols-outlined text-xs text-emerald-600">verified</span>
                </p>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">ডেলিভারি ঠিকানা</span>
                <p className="font-medium text-gray-900 mt-0.5 leading-relaxed">
                  {order.address}
                </p>
              </div>
              {order.deliveryInstruction && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900">
                  <span className="font-bold uppercase block text-[10px]">গ্রাহকের বিশেষ নির্দেশনা:</span>
                  <p className="italic mt-0.5">"{order.deliveryInstruction}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">পেমেন্ট মেথড বিবরণ</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                ভেরিফায়েড পেইড ✓
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">পেমেন্ট গেটওয়ে:</span>
                <span className="font-bold text-[#e2136e]">{order.paymentMethod.toUpperCase()} PGW (মার্চেন্ট পে)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">ট্রানজেকশন আইডি (TrxID):</span>
                <span className="font-data-tabular font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {order.transactionId || 'TRX92819034'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">পরিশোধের তারিখ ও সময়:</span>
                <span className="font-data-tabular text-gray-800">{order.createdAt}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                <span className="text-gray-500 font-bold">পরিশোধিত অর্থ:</span>
                <span className="text-base font-bold text-emerald-700 font-data-tabular">
                  ৳{order.total.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>
          </div>

          {/* Support Helpline Card */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">support_agent</span>
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-gray-900">ডেলিভারি সহায়তা প্রয়োজন?</h4>
              <p className="text-gray-500">আমাদের কাস্টমার কেয়ার প্রতিনিধিরা ২৪/৭ সক্রিয় রয়েছেন।</p>
              <div className="mt-1 flex items-center gap-3 font-bold text-amber-700">
                <a href={`tel:${settings.phone || '+8801834355700'}`} className="hover:underline">
                  {settings.phone || '+8801834355700'}
                </a>
                <span>•</span>
                <a href={`mailto:${settings.email || 'support@lotusshop.com.bd'}`} className="hover:underline text-gray-600">ইমেইল সাপোর্ট</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recommendation Cards matching screenshot (New Arrivals) */}
      <section className="pt-6 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">আরো এক্সপ্লোর করুন</span>
            <h2 className="text-lg font-bold text-gray-900 font-bn">আপনার পছন্দের অন্যান্য পণ্য (New Arrivals)</h2>
          </div>
          <button onClick={() => setActiveView('home')} className="text-xs text-gray-600 hover:text-amber-600 font-semibold flex items-center gap-1 cursor-pointer">
            <span>সকল নতুন কালেকশন দেখুন</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.slice(1, 4).map(p => (
            <div
              key={p.id}
              onClick={() => {
                setActiveProduct(p);
                setActiveView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-56 bg-gray-50 overflow-hidden">
                <img
                  src={p.thumbnail}
                  alt={p.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  New Arrival
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{p.category}</span>
                  <span className="text-amber-500 font-bold">★ {p.rating} ({p.reviewCount})</span>
                </div>
                <h4 className="font-bold text-xs text-gray-800 line-clamp-1 group-hover:text-amber-600">
                  {p.nameBn}
                </h4>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-sm font-bold text-red-600 font-data-tabular">
                    ৳{p.price.toLocaleString('bn-BD')}
                  </span>
                  <span className="text-xs text-gray-400 line-through font-data-tabular">
                    ৳{p.regularPrice.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Action CTA Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">আপনার পূর্বের সকল অর্ডার দেখতে চান?</h4>
            <p className="text-xs text-gray-500">গ্রাহক ড্যাশবোর্ড থেকে সহজেই ডেলিভারি ইতিহাস ও লেনদেন যাচাই করুন।</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('account')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
          >
            অর্ডার হিস্টোরি
          </button>
          <button
            onClick={() => setActiveView('home')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold shadow transition-colors cursor-pointer"
          >
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
};
