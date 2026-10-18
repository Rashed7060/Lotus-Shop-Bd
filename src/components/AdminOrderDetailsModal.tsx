import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, CourierProvider } from '../types';

export const AdminOrderDetailsModal: React.FC = () => {
  const {
    activeOrder,
    setActiveOrder,
    updateOrderStatus,
    assignCourierConsignment,
    showToast
  } = useStore();

  const [printMode, setPrintMode] = useState<'invoice' | 'packing_slip' | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>(
    activeOrder?.courier || 'steadfast'
  );
  const [trackingInput, setTrackingInput] = useState(
    activeOrder?.trackingNumber || ''
  );
  const [isSyncingCourier, setIsSyncingCourier] = useState(false);

  if (!activeOrder) return null;

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus(activeOrder.id, status);
  };

  const handleSaveCourier = () => {
    setIsSyncingCourier(true);
    setTimeout(() => {
      const generatedTracking = trackingInput.trim() || `SF-${Math.floor(100000 + Math.random() * 900000)}`;
      setTrackingInput(generatedTracking);
      assignCourierConsignment(activeOrder.id, selectedCourier, generatedTracking);
      setIsSyncingCourier(false);
      showToast(`${selectedCourier.toUpperCase()} কুরিয়ারে কনসাইনমেন্ট সফলভাবে যুক্ত হয়েছে! ট্র্যাকিং: ${generatedTracking}`, 'success');
    }, 600);
  };

  const handlePrint = (mode: 'invoice' | 'packing_slip') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const isOrderPaid = activeOrder.paymentStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-500 text-2xl">receipt_long</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  অর্ডার বিস্তারিত: #{activeOrder.orderNumber}
                </h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeOrder.status === 'delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  activeOrder.status === 'shipped' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  activeOrder.status === 'processing' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  activeOrder.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {activeOrder.status === 'delivered' ? 'ডেলিভার্ড (Delivered)' :
                   activeOrder.status === 'shipped' ? 'শিপড (On Transit)' :
                   activeOrder.status === 'processing' ? 'প্রসেসিং (Processing)' :
                   activeOrder.status === 'cancelled' ? 'বাতিল (Cancelled)' : 'পেন্ডিং (Pending)'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                অর্ডার তারিখ: {activeOrder.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrint('invoice')}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-700"
              title="ইনভয়েস প্রিন্ট করুন"
            >
              <span className="material-symbols-outlined text-sm text-rose-400">print</span>
              <span>ট্যাক্স ইনভয়েস</span>
            </button>
            <button
              onClick={() => handlePrint('packing_slip')}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-700"
              title="প্যাকিং স্লিপ ও বারকোড লেবেল"
            >
              <span className="material-symbols-outlined text-sm text-blue-400">qr_code_2</span>
              <span>প্যাকিং স্লিপ</span>
            </button>
            <button
              onClick={() => setActiveOrder(null)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 ml-2"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Quick Action Bar / Status Dropdown */}
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-800">অর্ডার স্ট্যাটাস আপডেট:</span>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-xs">
                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                      activeOrder.status === st
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {st === 'pending' ? 'পেন্ডিং' :
                     st === 'processing' ? 'প্রসেসিং' :
                     st === 'shipped' ? 'শিপড' :
                     st === 'delivered' ? 'ডেলিভার্ড' : 'বাতিল'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">পেমেন্ট মেথড:</span>
              <span className="text-xs font-bold uppercase px-2.5 py-1 bg-white border border-gray-200 rounded-md text-gray-800">
                {activeOrder.paymentMethod} ({isOrderPaid ? 'PAID / পরিশোধিত' : 'COD / বকেয়া'})
              </span>
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-rose-600">person</span>
                  গ্রাহকের তথ্য (Customer Details)
                </h4>
                <span className="text-[11px] font-mono bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                  ID: #{activeOrder.customerPhone.slice(-4)}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">নাম:</span>
                  <span className="font-bold text-gray-900">{activeOrder.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">মোবাইল:</span>
                  <a
                    href={`tel:${activeOrder.customerPhone}`}
                    className="font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">call</span>
                    {activeOrder.customerPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ইমেইল:</span>
                  <span className="text-gray-800">{activeOrder.customerEmail || 'তথ্য নেই'}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-500 block mb-0.5">ডেলিভারি ঠিকানা:</span>
                  <p className="font-medium text-gray-900 leading-relaxed bg-white p-2 rounded border border-gray-200">
                    {activeOrder.address}, {activeOrder.thana}, {activeOrder.district}, {activeOrder.division}
                  </p>
                </div>
              </div>
            </div>

            {/* Courier Booking & Logistics */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-blue-600">local_shipping</span>
                  কুরিয়ার ডেলিভারি অটোমেশন (Courier API)
                </h4>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {activeOrder.division.includes('ঢাকা') ? 'ঢাকা সিটি (৳৬০)' : 'ঢাকার বাইরে (৳১২০)'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    কুরিয়ার পার্টনার নির্বাচন:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['steadfast', 'pathao', 'redx'] as CourierProvider[]).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setSelectedCourier(prov)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center capitalize ${
                          selectedCourier === prov
                            ? 'bg-rose-50 border-rose-600 text-rose-700 shadow-xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    কুরিয়ার কনসাইনমেন্ট / ট্র্যাকিং নম্বর:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="যেমন: SF-984321"
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white font-mono"
                    />
                    <button
                      type="button"
                      disabled={isSyncingCourier}
                      onClick={handleSaveCourier}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSyncingCourier ? 'sync' : 'send'}
                      </span>
                      <span>{isSyncingCourier ? 'পাঠানো হচ্ছে...' : 'কুরিয়ারে পাঠান'}</span>
                    </button>
                  </div>
                </div>

                {activeOrder.trackingNumber && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                      <span>লাইভ ট্র্যাকিং প্রস্তুত: <strong>{activeOrder.trackingNumber}</strong></span>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                      {activeOrder.trackingStatus || 'Active'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-gray-600">inventory_2</span>
              অর্ডারকৃত পণ্যের তালিকা ({activeOrder.items.length} আইটেম)
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">পণ্য</th>
                    <th className="py-2.5 px-4">এসকেইউ (SKU)</th>
                    <th className="py-2.5 px-4">ভেরিয়েন্ট</th>
                    <th className="py-2.5 px-4 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-4 text-right">একক মূল্য</th>
                    <th className="py-2.5 px-4 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {activeOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{item.product.nameBn}</p>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{item.product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">
                        {item.product.sku}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {item.selectedSize || 'Standard'} / {item.selectedColor || 'Default'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">
                        ৳{item.product.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-rose-700">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Order Calculations */}
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col items-end gap-1.5 text-xs">
                <div className="flex justify-between w-64 text-gray-600">
                  <span>সাবটোটাল:</span>
                  <span className="font-semibold text-gray-900">৳{activeOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold text-gray-900">৳{activeOrder.deliveryFee}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between w-64 text-emerald-600 font-medium">
                    <span>ডিসকাউন্ট (কুপন):</span>
                    <span>-৳{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 pt-2 border-t border-gray-200 text-sm font-bold text-rose-800">
                  <span>সর্বমোট বিল (Grand Total):</span>
                  <span>৳{activeOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              অর্ডার বাতিল করুন
            </button>
          </div>
          
          <button
            onClick={() => setActiveOrder(null)}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>

      {/* HIDDEN PRINTABLE CONTAINER - activated when window.print() is called */}
      <div className="print-only hidden print:block fixed inset-0 bg-white p-8 z-[9999] text-black">
        {printMode === 'packing_slip' ? (
          /* THERMAL PACKING SLIP FORMAT */
          <div className="max-w-md mx-auto border-2 border-black p-4 space-y-3 font-sans">
            <div className="text-center border-b-2 border-black pb-2">
              <h1 className="text-xl font-bold tracking-tight">LOTUS SHOP BD</h1>
              <p className="text-xs">Express Delivery Logistics Slip</p>
              <div className="mt-2 py-1 bg-black text-white font-mono font-bold text-sm tracking-widest">
                *{activeOrder.orderNumber}*
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p><strong>গ্রাহক:</strong> {activeOrder.customerName}</p>
              <p><strong>মোবাইল:</strong> {activeOrder.customerPhone}</p>
              <p><strong>ঠিকানা:</strong> {activeOrder.address}, {activeOrder.thana}, {activeOrder.district}</p>
              <p><strong>কুরিয়ার:</strong> {selectedCourier.toUpperCase()} | ট্র্যাকিং: {activeOrder.trackingNumber || 'PENDING'}</p>
            </div>

            <div className="border-t-2 border-b-2 border-black py-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="text-left">আইটেম</th>
                    <th className="text-center">পরিমাণ</th>
                    <th className="text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrder.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.product.nameBn} ({it.selectedSize || 'Standard'})</td>
                      <td className="text-center font-bold">{it.quantity}</td>
                      <td className="text-right">৳{it.product.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <p>পেমেন্ট স্ট্যাটাস: <strong>{isOrderPaid ? 'PAID' : `COD (সংগ্রহ: ৳${activeOrder.total})`}</strong></p>
              <p className="text-sm font-bold">সর্বমোট: ৳{activeOrder.total}</p>
            </div>

            <div className="text-center text-[10px] text-gray-600 pt-2 border-t border-gray-300">
              প্যাকেজিং সময়: {new Date().toLocaleString()} | হেল্পলাইন: +8801834355700
            </div>
          </div>
        ) : (
          /* FULL TAX INVOICE FORMAT */
          <div className="max-w-3xl mx-auto space-y-6 font-sans">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-rose-700 pb-4">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="Lotus" className="h-16 w-auto" />
                <div>
                  <h1 className="text-xl font-black text-gray-900 tracking-tight">LOTUS CLOTHING BRAND</h1>
                  <p className="text-xs text-gray-600">হাউস #১২, রোড #০৪, মিরপুর-১০, ঢাকা - ১২১৬, বাংলাদেশ</p>
                  <p className="text-xs text-gray-600">ফোন: +8801834355700 | ইমেইল: support@lotusshopbd.com</p>
                  <p className="text-xs text-gray-600 font-mono">BIN: 002948192-0101 | TIN: 84920192841</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold bg-gray-100 px-3 py-1 rounded border border-gray-300 inline-block mb-1">
                  ট্যাক্স ইনভয়েস
                </span>
                <p className="text-xs font-bold text-gray-800">ইনভয়েস #: {activeOrder.orderNumber}</p>
                <p className="text-xs text-gray-600">তারিখ: {activeOrder.createdAt}</p>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-1 border-b pb-1">গ্রাহকের বিবরণ (Bill To):</h3>
                <p className="font-semibold text-gray-900">{activeOrder.customerName}</p>
                <p className="text-gray-700">মোবাইল: {activeOrder.customerPhone}</p>
                <p className="text-gray-700">ইমেইল: {activeOrder.customerEmail || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-1 border-b pb-1">ডেলিভারি ঠিকানা (Ship To):</h3>
                <p className="text-gray-900">{activeOrder.address}</p>
                <p className="text-gray-700">{activeOrder.thana}, {activeOrder.district}, {activeOrder.division}</p>
                <p className="text-gray-700 font-semibold mt-1">কুরিয়ার: {selectedCourier.toUpperCase()} (ID: {activeOrder.trackingNumber || 'Pending'})</p>
              </div>
            </div>

            {/* Invoice Line Items */}
            <table className="w-full text-left text-xs border border-gray-300">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-2">ক্র.নং</th>
                  <th className="p-2">পণ্যের বিবরণ</th>
                  <th className="p-2">এসকেইউ</th>
                  <th className="p-2 text-center">পরিমাণ</th>
                  <th className="p-2 text-right">দর (৳)</th>
                  <th className="p-2 text-right">মোট (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">
                      <p className="font-bold">{it.product.nameBn}</p>
                      <p className="text-[10px] text-gray-500">{it.selectedSize || 'Standard'}</p>
                    </td>
                    <td className="p-2 font-mono">{it.product.sku}</td>
                    <td className="p-2 text-center font-bold">{it.quantity}</td>
                    <td className="p-2 text-right">৳{it.product.price.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold">৳{(it.product.price * it.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল:</span>
                  <span>৳{activeOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>৳{activeOrder.deliveryFee}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>ডিসকাউন্ট:</span>
                    <span>-৳{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-gray-400 pt-1 text-black">
                  <span>সর্বমোট বিল:</span>
                  <span>৳{activeOrder.total.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-gray-600 pt-1">
                  পেমেন্ট মাধ্যম: <strong className="uppercase">{activeOrder.paymentMethod}</strong> ({isOrderPaid ? 'পরিশোধিত / PAID' : 'ক্যাশ অন ডেলিভারি'})
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-12 grid grid-cols-2 text-xs text-center">
              <div>
                <div className="w-40 border-t border-gray-400 mx-auto pt-1 font-semibold">
                  গ্রাহকের স্বাক্ষর
                </div>
              </div>
              <div>
                <div className="w-40 border-t border-gray-400 mx-auto pt-1 font-semibold">
                  অনুমোদিত স্বাক্ষর (Lotus Shop BD)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
