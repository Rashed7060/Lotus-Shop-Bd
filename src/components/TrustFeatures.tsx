import React from 'react';

export const TrustFeatures: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm py-4 px-6 grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Feature 1 */}
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-gray-800">
            <span className="material-symbols-outlined text-amber-600 text-xl">verified</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">100% Original</h4>
            <p className="font-bn text-[11px] text-gray-500">অরিজিনাল পণ্য</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center space-x-3 px-2 pt-2 md:pt-0">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-gray-800">
            <span className="material-symbols-outlined text-amber-600 text-xl">local_shipping</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Fast Delivery</h4>
            <p className="font-bn text-[11px] text-gray-500">সারা বাংলাদেশে</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center space-x-3 px-2 pt-2 md:pt-0">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-gray-800">
            <span className="material-symbols-outlined text-amber-600 text-xl">shield</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Secure Payment</h4>
            <p className="font-bn text-[11px] text-gray-500">নিরাপদ পেমেন্ট</p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-center space-x-3 px-2 pt-2 md:pt-0">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-gray-800">
            <span className="material-symbols-outlined text-amber-600 text-xl">support_agent</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">24/7 Support</h4>
            <p className="font-bn text-[11px] text-gray-500">সর্বদা আপনার পাশে</p>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="flex items-center space-x-3 px-2 pt-2 md:pt-0">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-gray-800">
            <span className="material-symbols-outlined text-amber-600 text-xl">published_with_changes</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Easy Return</h4>
            <p className="font-bn text-[11px] text-gray-500">সহজ রিটার্ন</p>
          </div>
        </div>
      </div>
    </section>
  );
};
