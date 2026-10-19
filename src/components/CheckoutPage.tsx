import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DIVISIONS, DHAKA_THANAS } from '../data/initialData';
import { PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, placeOrder, setActiveView, showToast, settings } = useStore();

  // Form Fields
  const [fullName, setFullName] = useState('তানভীর আহমেদ');
  const [phone, setPhone] = useState('01712-345678');
  const [altPhone, setAltPhone] = useState('01823-998877');
  const [email, setEmail] = useState('tanvir.ahmed@example.com');
  const [division, setDivision] = useState('ঢাকা (Dhaka)');
  const [district, setDistrict] = useState('ঢাকা মেট্রো (Dhaka City)');
  const [thana, setThana] = useState('মিরপুর-১০ (Mirpur 10)');
  const [detailedAddress, setDetailedAddress] = useState('বাড়ি-১২, রোড-৪, ব্লক-সি, মিরপুর-১০, ঢাকা-১২১৬');
  const [deliveryInstruction, setDeliveryInstruction] = useState('অফিস টাইমের পরে বিকেল ৫টার পর ডেলিভারি দিলে ভালো হয়।');

  // Delivery Zone
  const [deliveryZone, setDeliveryZone] = useState<'dhaka_metro' | 'dhaka_sub' | 'outside_dhaka'>('dhaka_metro');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Bank Payment states
  const [bankTransactionRef, setBankTransactionRef] = useState('');
  const [bankSenderName, setBankSenderName] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('LOTUS10');
  const [isCouponApplied, setIsCouponApplied] = useState(true);

  // Simulated Gateway Verification Dialog (bKash popup)
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [bkashStep, setBkashStep] = useState<'phone' | 'otp' | 'pin'>('phone');
  const [bkashWallet, setBkashWallet] = useState('01712345678');
  const [bkashOtp, setBkashOtp] = useState('1234');
  const [bkashPin, setBkashPin] = useState('*****');
  const [isProcessing, setIsProcessing] = useState(false);

  const { subtotal } = getCartTotal();
  const deliveryFee = deliveryZone === 'dhaka_metro' ? 60 : deliveryZone === 'dhaka_sub' ? 100 : 130;
  const discount = isCouponApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal - discount + deliveryFee;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'LOTUS10') {
      setIsCouponApplied(true);
      showToast('১০% ফ্ল্যাট ডিসকাউন্ট কোড সক্রিয় (LOTUS10)');
    } else {
      showToast('ভুল কুপন কোড! অনুগ্রহ করে LOTUS10 ব্যবহার করুন', 'error');
    }
  };

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const districts = BANGLADESH_DIVISIONS[newDiv] || [];
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
    if (newDiv !== 'ঢাকা (Dhaka)') {
      setDeliveryZone('outside_dhaka');
    } else {
      setDeliveryZone('dhaka_metro');
    }
  };

  const handleFinalOrderSubmit = () => {
    if (!termsAgreed) {
      showToast('অনুগ্রহ করে শর্তাবলী ও রিটার্ন পলিসিতে সম্মতি দিন', 'error');
      return;
    }
    if (!fullName || !phone || !detailedAddress) {
      showToast('অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    if (paymentMethod === 'bank') {
      if (!bankTransactionRef.trim()) {
        showToast('অনুগ্রহ করে ব্যাংক ডিপোজিট স্লিপ নম্বর বা ট্রানজেকশন রেফারেন্স দিন', 'error');
        return;
      }
      executeOrderCreation('pending');
      return;
    }

    if (paymentMethod === 'bkash') {
      setShowBkashModal(true);
      setBkashStep('phone');
      return;
    }

    if (paymentMethod === 'cod') {
      executeOrderCreation('pending');
      return;
    }

    // Process immediate order for other methods
    executeOrderCreation('verified');
  };

  const executeOrderCreation = (payStatus: 'verified' | 'pending') => {
    setIsProcessing(true);
    setTimeout(() => {
      const trxId =
        paymentMethod === 'bkash'
          ? 'TRX92819034'
          : paymentMethod === 'bank'
          ? bankTransactionRef.trim()
          : `TRX${Math.floor(10000000 + Math.random() * 90000000)}`;

      placeOrder({
        customerName: fullName,
        customerPhone: phone,
        alternativePhone: altPhone,
        customerEmail: email,
        division,
        district,
        thana,
        address: detailedAddress,
        deliveryZone,
        deliveryFee,
        deliveryInstruction,
        items: cart,
        subtotal,
        discount,
        couponCode: isCouponApplied ? 'LOTUS10' : undefined,
        total: grandTotal,
        paymentMethod,
        paymentStatus: payStatus,
        transactionId: trxId,
        bankName: paymentMethod === 'bank' ? (settings.bankName || 'Dutch-Bangla Bank PLC') : undefined,
        bankTransactionRef: paymentMethod === 'bank' ? bankTransactionRef.trim() : undefined
      });
      setIsProcessing(false);
      setShowBkashModal(false);
      setActiveView('order_success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 font-body-md text-gray-800">
      {/* Top Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-[#191c1e] text-gray-200 py-1.5 px-4 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-sm">local_shipping</span>
            <span>ফ্রি ডেলিভারি! সারা বাংলাদেশে নির্দিষ্ট পণ্যে ফ্রি হোম ডেলিভারি সুবিধা চলছে</span>
          </div>
          <div className="flex items-center gap-4">
            <span>হেল্পলাইন: +880 1234 567890</span>
            <span className="text-amber-400 font-semibold">বিশ্বাস, মান ও স্টাইলের প্রতিশ্রুতি</span>
          </div>
        </div>
      </div>

      {/* Checkout Header & Progress Stepper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <button onClick={() => setActiveView('home')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-2xl material-symbols-fill">spa</span>
            </div>
            <div className="text-left">
              <span className="text-lg font-bold text-gray-900 tracking-tight block">LOTUS SHOP BD</span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider">PREMIUM ETHNIC & LIFESTYLE</span>
            </div>
          </button>

          {/* Stepper */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>১. শপিং কার্ট</span>
            </div>
            <div className="w-8 h-0.5 bg-emerald-600"></div>

            <div className="flex items-center gap-1.5 text-amber-700 font-bold">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                ২
              </span>
              <span>২. চেকআউট ও ডেলিভারি</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>

            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                ৩
              </span>
              <span>৩. অর্ডার কনফার্মেশন</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600">
            <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
            <span>256-bit SSL এনক্রিপ্ট</span>
            <span className="text-gray-300">|</span>
            <span className="text-amber-700 font-semibold">১০০% নিরাপদ চেকআউট</span>
          </div>
        </div>
      </div>

      {/* Main Form & Summary Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>গ্রাহকের চেকআউট ও পেমেন্ট সম্পন্ন করুন</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              Express Checkout
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            আপনার ডেলিভারি তথ্য প্রদান করুন এবং পছন্দের পেমেন্ট গেটওয়ের মাধ্যমে অর্ডারটি দ্রুত সম্পন্ন করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Form & Payment Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Delivery Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    ১
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">ডেলিভারি ঠিকানা ও গ্রাহকের বিবরণ</h2>
                    <p className="text-[11px] text-gray-500">নিখুঁত ডেলিভারির জন্য সঠিক তথ্য ও সচল ফোন নম্বর লিখুন</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">pin_drop</span>
              </div>

              <div className="p-6 space-y-4">
                {/* Full name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      পূর্ণ নাম (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">person</span>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="আপনার পুরো নাম লিখুন"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">প্যাকেটের উপর এই নাম মুদ্রিত থাকবে</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      মোবাইল নম্বর (Phone Number) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-2.5 top-2 flex items-center gap-1 text-xs text-gray-700 font-semibold border-r border-gray-300 pr-2">
                        <span>🇧🇩 +৮৮</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-20 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-data-tabular text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      <span>ডেলিভারি আপডেট এসএমএস এই নম্বরে যাবে</span>
                    </p>
                  </div>
                </div>

                {/* Alternative Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      বিকল্প ফোন নম্বর (Alternative Phone) <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">call</span>
                      <input
                        type="tel"
                        value={altPhone}
                        onChange={e => setAltPhone(e.target.value)}
                        placeholder="বিকল্প নম্বর (যদি থাকে)"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-data-tabular text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      ইমেইল ঠিকানা (Email) <span className="text-gray-400 font-normal">(ঐচ্ছিক - ইনভয়েসের জন্য)</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">mail</span>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Division, District, Thana */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      বিভাগ (Division) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={division}
                      onChange={e => handleDivisionChange(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-2 text-xs text-gray-900 focus:border-amber-500 outline-none cursor-pointer"
                    >
                      {Object.keys(BANGLADESH_DIVISIONS).map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      জেলা / শহর (District) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-2 text-xs text-gray-900 focus:border-amber-500 outline-none cursor-pointer"
                    >
                      {(BANGLADESH_DIVISIONS[division] || []).map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      থানা / এলাকা (Area/Thana) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={thana}
                      onChange={e => setThana(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-2 text-xs text-gray-900 focus:border-amber-500 outline-none cursor-pointer"
                    >
                      {DHAKA_THANAS.map(th => (
                        <option key={th} value={th}>{th}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    পূর্ণ ডেলিভারি ঠিকানা (Detailed Address) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={detailedAddress}
                    onChange={e => setDetailedAddress(e.target.value)}
                    placeholder="বাড়ি নম্বর, রোড নম্বর, সেক্টর/ব্লক ও এলাকার নাম বিস্তারিত লিখুন"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:border-amber-500 outline-none"
                  ></textarea>
                  <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
                    <span>রাইডার সহজে খুঁজে পাওয়ার জন্য ল্যান্ডমার্ক উল্লেখ করুন</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">check</span> ঠিকানা যাচাইকৃত
                    </span>
                  </div>
                </div>

                {/* Delivery Zone Cards */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    ডেলিভারি এরিয়া জোন নির্বাচন করুন (Delivery Zone):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Zone A: Dhaka Metro */}
                    <label
                      onClick={() => setDeliveryZone('dhaka_metro')}
                      className={`relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryZone === 'dhaka_metro'
                          ? 'border-amber-500 bg-amber-50/60'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-amber-900">ঢাকা মেট্রো</span>
                        <input
                          type="radio"
                          name="delivery_zone"
                          checked={deliveryZone === 'dhaka_metro'}
                          onChange={() => setDeliveryZone('dhaka_metro')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">ঢাকা সিটির ভেতরে</span>
                      <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm font-bold text-gray-900 font-data-tabular">৳৬০</span>
                        <span className="text-[11px] text-emerald-700 font-semibold">১-২ কার্যদিবস</span>
                      </div>
                    </label>

                    {/* Zone B: Dhaka Sub-area */}
                    <label
                      onClick={() => setDeliveryZone('dhaka_sub')}
                      className={`relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryZone === 'dhaka_sub'
                          ? 'border-amber-500 bg-amber-50/60'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">ঢাকা সাব-এরিয়া</span>
                        <input
                          type="radio"
                          name="delivery_zone"
                          checked={deliveryZone === 'dhaka_sub'}
                          onChange={() => setDeliveryZone('dhaka_sub')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">সাভার, কেরানীগঞ্জ, টঙ্গী</span>
                      <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm font-bold text-gray-900 font-data-tabular">৳১০০</span>
                        <span className="text-[11px] text-gray-500">২-৩ কার্যদিবস</span>
                      </div>
                    </label>

                    {/* Zone C: Outside Dhaka */}
                    <label
                      onClick={() => setDeliveryZone('outside_dhaka')}
                      className={`relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryZone === 'outside_dhaka'
                          ? 'border-amber-500 bg-amber-50/60'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">ঢাকার বাইরে</span>
                        <input
                          type="radio"
                          name="delivery_zone"
                          checked={deliveryZone === 'outside_dhaka'}
                          onChange={() => setDeliveryZone('outside_dhaka')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">সারা বাংলাদেশ (জেলা সদর)</span>
                      <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm font-bold text-gray-900 font-data-tabular">৳১৩০</span>
                        <span className="text-[11px] text-gray-500">৩-৫ কার্যদিবস</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Delivery Note */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    বিশেষ ডেলিভারি নির্দেশনা (Delivery Note)
                  </label>
                  <input
                    type="text"
                    value={deliveryInstruction}
                    onChange={e => setDeliveryInstruction(e.target.value)}
                    placeholder="যেমন: গেটের গার্ডের কাছে রাখুন / কল দিয়ে আসবেন"
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Gateways */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    ২
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">পেমেন্ট পদ্ধতি নির্বাচন করুন (Select Payment Method)</h2>
                    <p className="text-[11px] text-gray-500">নিরাপদ ও সহজ উপায়ে আপনার পছন্দের মাধ্যমে পেমেন্ট সম্পন্ন করুন</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">account_balance_wallet</span>
              </div>

              <div className="p-6 space-y-3">
                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod('bkash')}
                  className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-amber-500 bg-amber-50/40'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded bg-[#e2136e] text-white flex items-center justify-center font-bold text-xs">
                            bK
                          </span>
                          <span className="font-bold text-gray-900 text-sm">বিকাশ অনলাইন পেমেন্ট (bKash PGW)</span>
                          <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                            রেকমেন্ডেড / ক্যাশব্যাক
                          </span>
                        </div>
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm">bolt</span> ইনস্ট্যান্ট প্রসেসিং
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 pl-9">
                        বিকাশ গেটওয়ের মাধ্যমে সরাসরি আপনার বিকাশ অ্যাকাউন্ট থেকে সুরক্ষিত পিন ও ওটিপি দিয়ে পেমেন্ট সম্পন্ন করুন। কোনো অতিরিক্ত ফি নেই।
                      </p>

                      {/* Expandable guide */}
                      {paymentMethod === 'bkash' && (
                        <div className="mt-3 ml-9 p-3 rounded-lg bg-white border border-amber-200 text-xs space-y-1.5">
                          <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">১</span>
                            <span>নিচের "অর্ডার নিশ্চিত করুন" বাটনে ক্লিক করলে বিকাশ সিকিউর পপ-আপ চালু হবে</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">২</span>
                            <span>আপনার বিকাশ নম্বর ও ওটিপি (OTP) কোড দিয়ে পেমেন্ট নিশ্চিত করুন</span>
                          </div>
                          <div className="text-[11px] text-pink-900 bg-pink-50 p-1.5 rounded border border-pink-200 font-semibold">
                            🎁 ১০% বা সর্বোচ্চ ১০০ টাকা পর্যন্ত তাৎক্ষণিক বিকাশ ক্যাশব্যাক অফার প্রযোজ্য!
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Nagad */}
                <div
                  onClick={() => setPaymentMethod('nagad')}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'nagad' ? 'border-2 border-amber-500 bg-amber-50/40' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-[#f7941d] text-white flex items-center justify-center font-bold text-xs">
                        নগদ
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 text-xs">নগদ পেমেন্ট (Nagad Digital Payment)</span>
                        <span className="text-[10px] text-gray-500 block">০% অতিরিক্ত চার্জ • ডাক বিভাগ অনুমোদিত</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Rocket & Upay */}
                <div
                  onClick={() => setPaymentMethod('rocket')}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'rocket' ? 'border-2 border-amber-500 bg-amber-50/40' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'rocket'}
                      onChange={() => setPaymentMethod('rocket')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-[#8b2b8e] text-white flex items-center justify-center font-bold text-xs">
                        R
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 text-xs">রকেট / উপায় (Rocket & Upay MFS)</span>
                        <span className="text-[10px] text-gray-500 block">Dutch-Bangla Bank & UCB</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* SSLCOMMERZ */}
                <div
                  onClick={() => setPaymentMethod('sslcommerz')}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'sslcommerz' ? 'border-2 border-amber-500 bg-amber-50/40' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'sslcommerz'}
                      onChange={() => setPaymentMethod('sslcommerz')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                        💳
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 text-xs">ডেবিট / ক্রেডিট কার্ড ও ইন্টারনেট ব্যাংকিং (SSLCOMMERZ)</span>
                        <span className="text-[10px] text-gray-500 block">VISA, MasterCard, AMEX, City Touch, BRAC Bank</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Bank Payment (ব্যাংক ট্রান্সফার / একাউন্ট ডিপোজিট) */}
                {settings.paymentBankEnabled !== false && (
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-2 border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            🏦
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">ব্যাংক পেমেন্ট (Direct Bank Transfer / Deposit)</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                অফিসিয়াল ব্যাংক একাউন্ট
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">
                              {settings.bankName || 'Dutch-Bangla Bank PLC'} - একাউন্টে সরাসরি টাকা জমা বা অনলাইন ফান্ড ট্রান্সফার
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Bank Details & Instructions Dropdown */}
                    {paymentMethod === 'bank' && (
                      <div className="mt-3.5 pt-3.5 border-t border-emerald-200 text-xs space-y-3 bg-white p-3.5 rounded-lg border border-emerald-100 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-700">account_balance</span>
                            <span>ব্যাংক একাউন্ট বিবরণ (লোটাস শপ বিডি):</span>
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            Verified Business Account
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                          <div>
                            <span className="text-gray-500 block">ব্যাংকের নাম:</span>
                            <span className="font-bold text-gray-900 font-sans">{settings.bankName || 'Dutch-Bangla Bank PLC (DBBL)'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">একাউন্টের নাম:</span>
                            <span className="font-bold text-gray-900 font-mono">{settings.bankAccountName || 'LOTUS SHOP BD'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">একাউন্ট নম্বর:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-emerald-700 font-mono text-xs">{settings.bankAccountNumber || '115.120.0098765'}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(settings.bankAccountNumber || '115.120.0098765');
                                  showToast('ব্যাংক একাউন্ট নম্বর কপি করা হয়েছে!');
                                }}
                                className="text-gray-400 hover:text-emerald-700 p-0.5 rounded cursor-pointer transition-colors"
                                title="একাউন্ট নম্বর কপি করুন"
                              >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 block">শাখা ও রাউটিং নম্বর:</span>
                            <span className="font-bold text-gray-900 font-mono">
                              {settings.bankBranchName || 'Mirpur-10 Branch'} (Routing: {settings.bankRoutingNumber || '090273841'})
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-700 bg-amber-50/80 p-2.5 rounded border border-amber-200 leading-relaxed">
                          📌 {settings.bankPaymentInstructions || 'অনলাইন ইন্টারনেট ব্যাংকিং (NPSB/BEFTN) অথবা সরাসরি ব্যাংক ব্রাঞ্চে ডিপোজিট করে নিচের ঘরে ট্রানজেকশন রেফারেন্স বা স্লিপ নম্বর দিন।'}
                        </p>

                        <div className="space-y-2 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-800 mb-1">
                              ডিপোজিট স্লিপ নম্বর / ব্যাংক ট্রানজেকশন রেফারেন্স (TRX ID): <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={bankTransactionRef}
                              onChange={(e) => setBankTransactionRef(e.target.value)}
                              placeholder="e.g. DBBL-92819284 অথবা ডিপোজিট স্লিপ নম্বর..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              প্রেরকের ব্যাংক বা একাউন্টের নাম (ঐচ্ছিক):
                            </label>
                            <input
                              type="text"
                              value={bankSenderName}
                              onChange={(e) => setBankSenderName(e.target.value)}
                              placeholder="যে ব্যাংক থেকে টাকা পাঠিয়েছেন (e.g. City Bank / Brac Bank)..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-2 border-amber-500 bg-amber-50/40' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-gray-800 text-white flex items-center justify-center font-bold text-xs">
                        🚚
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 text-xs">ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                        <span className="text-[10px] text-amber-700 font-semibold block">পণ্য হাতে পেয়ে টাকা দিন</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* Summary Box */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">shopping_basket</span>
                  <h3 className="text-sm font-bold text-gray-900 font-headline-md">
                    অর্ডার সামারি ({cart.length}টি আইটেম)
                  </h3>
                </div>
                <button onClick={() => setActiveView('home')} className="text-xs text-amber-600 font-semibold hover:underline cursor-pointer">
                  কার্ট এডিট
                </button>
              </div>

              {/* Items List Preview */}
              <div className="p-4 divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="py-2.5 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.nameBn}
                      className="w-12 h-14 object-cover rounded border border-gray-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate font-bn">
                        {item.product.nameBn}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        <span>সাইজ: {item.selectedSize}</span>
                        <span>•</span>
                        <span>পরিমাণ: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-gray-900 font-data-tabular">
                        ৳{(item.unitPrice * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="p-4 bg-gray-50 border-t border-b border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  কুপন অথবা ডিসকাউন্ট কোড প্রয়োগ করুন
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="কুপন কোড (LOTUS10)"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-800 uppercase outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    প্রয়োগ
                  </button>
                </div>
                {isCouponApplied && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>১০% ফ্ল্যাট ডিসকাউন্ট কোড সক্রিয় (LOTUS10)</span>
                    </span>
                    <button
                      onClick={() => setIsCouponApplied(false)}
                      className="text-red-600 font-bold hover:underline"
                    >
                      রিমুভ
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown Ledger */}
              <div className="p-4 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>সাবটোটাল (পণ্যমূল্য):</span>
                  <span className="font-semibold text-gray-900 font-data-tabular">৳{subtotal.toLocaleString('bn-BD')}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>প্রমোশনাল ছাড় (১০%):</span>
                    <span className="font-data-tabular">-৳{discount.toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>হোম ডেলিভারি চার্জ ({deliveryZone === 'dhaka_metro' ? 'ঢাকা মেট্রো' : deliveryZone === 'dhaka_sub' ? 'ঢাকা সাব-এরিয়া' : 'ঢাকার বাইরে'}):</span>
                  <span className="font-semibold text-gray-900 font-data-tabular">+৳{deliveryFee.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>পেমেন্ট গেটওয়ে চার্জ:</span>
                  <span>ফ্রি (৳০)</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-900 block font-bn">সর্বমোট প্রদেয় মূল্য</span>
                    <span className="text-[10px] text-gray-400">ভ্যাট ও সকল চার্জ অন্তর্ভুক্ত</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-amber-700 font-data-tabular">
                      ৳{grandTotal.toLocaleString('bn-BD')}
                    </span>
                    {discount > 0 && (
                      <span className="block text-[11px] text-emerald-700 font-bold">
                        আপনি সাশ্রয় করছেন ৳{discount.toLocaleString('bn-BD')}!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions & Agreement */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={e => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    আমি Lotus Shop BD-এর <span className="text-amber-700 underline font-medium">শর্তাবলী</span> ও <span className="text-amber-700 underline font-medium">রিটার্ন পলিসি</span> পড়েছি এবং একমত পোষণ করছি।
                  </span>
                </label>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinalOrderSubmit}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">lock</span>
                  <span>৳{grandTotal.toLocaleString('bn-BD')} পেমেন্ট করুন ও অর্ডার নিশ্চিত করুন</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>

                {/* Logistics Badges */}
                <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-gray-500 border-t border-gray-200">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Steadfast Courier</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    <span>Pathao Logistics</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>RedX Delivery</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Bento Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-xs grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-lg mb-0.5">replay</span>
                <span className="font-bold text-gray-900">৭ দিনে রিটার্ন</span>
                <span className="text-[10px] text-gray-500">সহজ ও নিঃশর্ত</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 text-lg mb-0.5 material-symbols-fill">verified</span>
                <span className="font-bold text-gray-900">১০০% আসল পণ্য</span>
                <span className="text-[10px] text-gray-500">কোয়ালিটি পরীক্ষিত</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-lg mb-0.5">pin_drop</span>
                <span className="font-bold text-gray-900">লাইভ ট্র্যাকিং</span>
                <span className="text-[10px] text-gray-500">এসএমএস অ্যালার্ট</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Interactive bKash PGW Popup Modal */}
      {showBkashModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-pink-200 animate-in fade-in zoom-in-95">
            {/* bKash Header Ribbon */}
            <div className="bg-[#e2136e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-white text-[#e2136e] font-black text-sm flex items-center justify-center">
                  bK
                </div>
                <div>
                  <h3 className="text-sm font-bold">bKash Payment Gateway</h3>
                  <p className="text-[10px] opacity-90">Merchant: Lotus Shop BD</p>
                </div>
              </div>
              <button onClick={() => setShowBkashModal(false)} className="text-white hover:opacity-80">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* bKash Amount Banner */}
            <div className="bg-pink-50 p-3 border-b border-pink-100 flex justify-between items-center text-xs">
              <span className="text-gray-600 font-semibold">প্রদেয় টাকার পরিমাণ:</span>
              <span className="text-base font-bold text-[#e2136e] font-data-tabular">
                ৳{grandTotal.toLocaleString('bn-BD')}
              </span>
            </div>

            {/* Interactive Step Content */}
            <div className="p-5 space-y-4 text-xs">
              {bkashStep === 'phone' && (
                <div className="space-y-3">
                  <p className="text-gray-700">আপনার বিকাশ অ্যাকাউন্ট নম্বর প্রবেশ করান:</p>
                  <input
                    type="tel"
                    value={bkashWallet}
                    onChange={e => setBkashWallet(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full text-center p-2.5 border-2 border-pink-500 rounded-lg text-sm font-bold tracking-widest outline-none font-data-tabular"
                  />
                  <button
                    onClick={() => setBkashStep('otp')}
                    className="w-full py-2.5 bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    পরবর্তী (Proceed)
                  </button>
                </div>
              )}

              {bkashStep === 'otp' && (
                <div className="space-y-3">
                  <p className="text-gray-700">আপনার মোবাইলে পাঠানো ৪-ডিজিটের ভেরিফিকেশন কোড (OTP) লিখুন:</p>
                  <input
                    type="text"
                    value={bkashOtp}
                    onChange={e => setBkashOtp(e.target.value)}
                    maxLength={6}
                    placeholder="1234"
                    className="w-full text-center p-2.5 border-2 border-pink-500 rounded-lg text-base font-bold tracking-widest outline-none font-data-tabular"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBkashStep('phone')}
                      className="w-1/3 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg"
                    >
                      ফিরে যান
                    </button>
                    <button
                      onClick={() => setBkashStep('pin')}
                      className="w-2/3 py-2 bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold rounded-lg cursor-pointer"
                    >
                      যাচাই করুন
                    </button>
                  </div>
                </div>
              )}

              {bkashStep === 'pin' && (
                <div className="space-y-3">
                  <p className="text-gray-700">পেমেন্ট নিশ্চিত করতে আপনার বিকাশ পিন (PIN) নম্বর লিখুন:</p>
                  <input
                    type="password"
                    value={bkashPin}
                    onChange={e => setBkashPin(e.target.value)}
                    maxLength={5}
                    placeholder="PIN"
                    className="w-full text-center p-2.5 border-2 border-pink-500 rounded-lg text-base font-bold tracking-widest outline-none font-data-tabular"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBkashStep('otp')}
                      className="w-1/3 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg"
                    >
                      ফিরে যান
                    </button>
                    <button
                      onClick={() => executeOrderCreation('verified')}
                      disabled={isProcessing}
                      className="w-2/3 py-2 bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold rounded-lg shadow cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? 'পেমেন্ট সম্পন্ন হচ্ছে...' : 'পেমেন্ট কনফার্ম করুন'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-100 p-2.5 text-center text-[11px] text-gray-500 border-t border-gray-200">
              🔒 128-bit SSL Secured Merchant Sandbox by bKash
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
