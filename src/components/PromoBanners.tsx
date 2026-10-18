import React from 'react';
import { useStore } from '../context/StoreContext';

export const PromoBanners: React.FC = () => {
  const { setActiveProduct, setActiveView, products } = useStore();

  const handleShop = (productId: string) => {
    const p = products.find(prod => prod.id === productId) || products[0];
    setActiveProduct(p);
    setActiveView('product');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Promo Banner 1: Big Discount */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#e77a1e] to-[#f59e0b] text-white p-5 flex items-center justify-between min-h-[160px] shadow-sm">
          <div className="relative z-10 max-w-[55%]">
            <span className="text-xs uppercase font-bold tracking-wider text-orange-950/80">Big Discount</span>
            <h3 className="font-bn text-xl font-bold mt-0.5">বিশেষ ছাড়</h3>
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-100 my-1">UP TO 50% OFF</p>
            <button
              onClick={() => handleShop('prod-8')}
              className="inline-flex items-center space-x-1.5 font-bn text-xs bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded transition-colors mt-1 font-medium cursor-pointer"
            >
              <span>কেনাকাটা করুন</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="absolute -right-2 bottom-0 h-full w-[45%] flex items-end justify-end pointer-events-none">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfzn4BoQx9LHJGLm3-6tPA2qTbHiH4Q5cMNudbscEOcFcBu3YvYWxYem3YbJG5eNRWCfRrLMw74ozDDcfH-6k9NvyxEcT9y8MTfvErVxGU_5Yjo5qaObKrd3Nayc2W_vvuSg1b2ZfKa46ARC0eGed480SZEUwC-QmRaxhzkhkiBINX9jekm9dMZDGCOlQZIuA967BxJ20ownMYu1J3R69riZuDiA2V6z3H7f-SauU07zScckWo1MSCUQ"
              alt="Special Discount Saree"
              className="h-full object-cover object-top filter drop-shadow"
            />
          </div>
        </div>

        {/* Promo Banner 2: Electronics */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] text-gray-900 p-5 flex items-center justify-between min-h-[160px] shadow-sm">
          <div className="relative z-10 max-w-[55%]">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-600">Electronics</span>
            <h3 className="font-bn text-xl font-bold mt-0.5 text-gray-900">স্মার্ট লাইফের জন্য</h3>
            <p className="text-xs font-semibold tracking-wide uppercase text-gray-700 my-1">UP TO 40% OFF</p>
            <button
              onClick={() => handleShop('prod-6')}
              className="inline-flex items-center space-x-1.5 font-bn text-xs bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded transition-colors mt-1 font-medium cursor-pointer"
            >
              <span>কেনাকাটা করুন</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="absolute -right-1 bottom-1 h-32 w-[45%] flex items-center justify-end pointer-events-none">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUmeaWGHRCH5C4yfqs48C87kXP504DvWJQReGJk-uOmizazn5eiwpPGm3ATJw5Ly7FyDvSgPERsdruIpvtkkGFkot3CzQh_sBOeCiFEaxYkKg2YGeXIBoHKyd2fXpXEuQtyLkJkan9Rw2SJvsM_jjBl1fv2VUffwam6Agzo7GsNXKHu0tY7SIXrazJiYeFmJOd0emJ1SCnja90C_awUr7eLioMAjM1KAcxAl99Sez5gTuH1MbNj5v9PA"
              alt="Electronics Tech"
              className="h-28 object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Promo Banner 3: Beauty & Personal Care */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ffd9d9] to-[#fecdd3] text-gray-900 p-5 flex items-center justify-between min-h-[160px] shadow-sm">
          <div className="relative z-10 max-w-[55%]">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-800">Beauty & Personal Care</span>
            <h3 className="font-bn text-xl font-bold mt-0.5 text-rose-950">নিজেকে আরও সুন্দর করুন</h3>
            <p className="text-xs font-semibold tracking-wide uppercase text-rose-700 my-1">UP TO 35% OFF</p>
            <button
              onClick={() => handleShop('prod-1')}
              className="inline-flex items-center space-x-1.5 font-bn text-xs bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded transition-colors mt-1 font-medium cursor-pointer"
            >
              <span>কেনাকাটা করুন</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="absolute right-0 bottom-2 h-32 w-[45%] flex items-center justify-end pointer-events-none">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-3MsyARoJ0SQL7C5sK4jJ3xBTO4o8VQCvEx_fDFC4IC5AsRoqbnmBfpRLmNCx3I-g75QrjHE7Hko0_g0Alvo_njJ5zZCclARfcW4J9Rms8caTjSegqc1fBvNpgjlkVSKsmIhRJ8XXg__pd5cqZELZEXQrAxmhqwTORDu0gJApId69LLZZjsNp-uTsMi7w5FpYxawtaT6K9ZXPKpkIJIh4IN7dNqWng6yhNYWDRtFgygY6NyR_NLVTRw"
              alt="Beauty Care"
              className="h-28 object-contain filter drop-shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
