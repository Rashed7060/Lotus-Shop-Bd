import React from 'react';

export const BrandsStrip: React.FC<{ onSelectBrand?: (brand: string) => void }> = ({ onSelectBrand }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row items-center gap-4">
        {/* Brand Strip Title Button */}
        <div className="bg-neutral-900 text-white py-2.5 px-4 rounded-md flex-shrink-0 flex items-center justify-between w-full md:w-56 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Shop by Brands</span>
            <span className="font-bn text-[11px] text-gray-300">বিশ্বস্ত ব্র্যান্ডের পণ্য</span>
          </div>
          <button
            onClick={() => onSelectBrand && onSelectBrand('All')}
            className="text-[10px] bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold px-2 py-1 rounded inline-flex items-center space-x-0.5 ml-2 cursor-pointer"
          >
            <span>See All Brands</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>
        </div>

        {/* Brand Logos Container */}
        <div className="flex-1 flex items-center justify-around gap-6 overflow-x-auto w-full py-1 text-gray-800 font-bold text-sm tracking-widest">
          {/* Brand 1: Samsung */}
          <span className="text-blue-700 font-extrabold tracking-tighter text-base">SAMSUNG</span>
          {/* Brand 2: Xiaomi */}
          <span className="flex items-center space-x-1">
            <span className="w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded flex items-center justify-center">
              mi
            </span>
          </span>
          {/* Brand 3: Realme */}
          <span className="text-yellow-600 font-bold lowercase text-base">realme</span>
          {/* Brand 4: Vivo */}
          <span className="text-blue-500 font-bold lowercase text-base tracking-normal">vivo</span>
          {/* Brand 5: H&M */}
          <span className="text-red-600 font-black italic text-lg">H&amp;M</span>
          {/* Brand 6: Nike */}
          <span className="font-black italic tracking-tighter text-base">NIKE</span>
          {/* Brand 7: Adidas */}
          <span className="font-extrabold tracking-tighter lowercase text-base">adidas</span>
          {/* Brand 8: Tommy Hilfiger */}
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] tracking-widest font-black uppercase">TOMMY</span>
            <span className="text-[8px] tracking-wider font-semibold uppercase text-red-600">HILFIGER</span>
          </div>
          {/* Brand 9: Ray-Ban */}
          <span className="font-serif-title italic font-black text-red-600 text-base">Ray-Ban</span>
        </div>
      </div>
    </section>
  );
};
