import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    setActiveView
  } = useStore();

  const [couponCode, setCouponCode] = useState('LOTUS10');
  const [isCouponApplied, setIsCouponApplied] = useState(true);

  if (!isCartDrawerOpen) return null;

  const { subtotal, itemCount } = getCartTotal();
  const discount = isCouponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryEst = subtotal > 3000 ? 0 : 60;
  const finalTotal = subtotal - discount + deliveryEst;

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">shopping_bag</span>
              <h2 className="text-base font-bold text-gray-900 font-headline-md">
                শপিং কার্ট ({itemCount} টি পণ্য)
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <span className="material-symbols-outlined text-5xl text-gray-300">shopping_cart_off</span>
                <p className="text-gray-500 font-medium text-sm">আপনার শপিং কার্ট খালি আছে</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  কেনাকাটা শুরু করুন
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.nameBn}
                    className="w-16 h-20 object-cover rounded border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate font-bn">
                      {item.product.nameBn}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      সাইজ: <span className="font-semibold text-gray-700">{item.selectedSize}</span> | কালার: <span className="font-semibold text-gray-700">{item.selectedColor}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold font-data-tabular">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-bold text-red-600 font-data-tabular">
                        ৳{(item.unitPrice * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              {/* Coupon Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="কুপন কোড (LOTUS10)"
                  className="flex-1 bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold uppercase outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setIsCouponApplied(true)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded transition-colors cursor-pointer"
                >
                  প্রয়োগ
                </button>
              </div>

              {/* Price Calculations */}
              <div className="space-y-1 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>সাবটোটাল:</span>
                  <span className="font-semibold text-gray-900 font-data-tabular">৳{subtotal.toLocaleString('bn-BD')}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>কুপন ছাড় (LOTUS10 - ১০%):</span>
                    <span className="font-data-tabular">-৳{discount.toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ (ঢাকা মেট্রো):</span>
                  <span className="font-semibold text-gray-900 font-data-tabular">
                    {deliveryEst === 0 ? 'ফ্রি' : `+৳${deliveryEst.toLocaleString('bn-BD')}`}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between items-baseline font-bold text-sm text-gray-900">
                  <span>সর্বমোট:</span>
                  <span className="text-base text-red-600 font-data-tabular">
                    ৳{finalTotal.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow hover:shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>চেকআউট করুন (Proceed to Checkout)</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
