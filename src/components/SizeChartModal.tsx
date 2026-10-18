import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const SizeChartModal: React.FC = () => {
  const { isSizeChartOpen, setIsSizeChartOpen } = useStore();
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');

  if (!isSizeChartOpen) return null;

  const rows = [
    { size: 'M (৩৮)', bustInch: '৩৮"', bustCm: '৯৬.৫ সেমি', lenInch: '৪২"', lenCm: '১০৬.৬ সেমি', waistInch: '৩৪"', waistCm: '৮৬.৩ সেমি', hipInch: '৪০"', hipCm: '১০১.৬ সেমি', trouserInch: '৩৮"', trouserCm: '৯৬.৫ সেমি' },
    { size: 'L (৪০)', isStd: true, bustInch: '৪০"', bustCm: '১০১.৬ সেমি', lenInch: '৪৪"', lenCm: '১১১.৭ সেমি', waistInch: '৩৬"', waistCm: '৯১.৪ সেমি', hipInch: '৪২"', hipCm: '১০৬.৬ সেমি', trouserInch: '৩৯"', trouserCm: '৯৯.০ সেমি' },
    { size: 'XL (৪২)', bustInch: '৪২"', bustCm: '১০৬.৬ সেমি', lenInch: '৪৫"', lenCm: '১১৪.৩ সেমি', waistInch: '৩৮"', waistCm: '৯৬.৫ সেমি', hipInch: '৪৪"', hipCm: '১১১.৭ সেমি', trouserInch: '৪০"', trouserCm: '১০১.৬ সেমি' },
    { size: 'XXL (৪৪)', bustInch: '৪৪"', bustCm: '১১১.৭ সেমি', lenInch: '৪৬"', lenCm: '১১৯.৩ সেমি', waistInch: '৪০"', waistCm: '১০১.৬ সেমি', hipInch: '৪৬"', hipCm: '১১৯.৩ সেমি', trouserInch: '৪০"', trouserCm: '১০১.৬ সেমি' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-gray-200 space-y-4 my-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <span className="material-symbols-outlined text-lg">straighten</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-headline-md">
                সাইজ চার্ট ও মাপের নির্দেশিকা
              </h3>
              <p className="text-xs text-gray-500 font-medium">Women's Three-Piece Size Guide • সঠিক সাইজ নিশ্চিত করুন</p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeChartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
            রেডিমেড সেলাইকৃত থ্রি পিস মেজারমেন্ট
          </span>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setUnit('inch')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                unit === 'inch' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-gray-600'
              }`}
            >
              ইঞ্চি (Inches)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                unit === 'cm' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-gray-600'
              }`}
            >
              সেন্টিমিটার (CM)
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-xs">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs sm:text-sm border-b border-gray-200 font-semibold">
                <th className="py-2.5 px-3 text-left">সাইজ</th>
                <th className="py-2.5 px-2">বক্ষ (Bust)</th>
                <th className="py-2.5 px-2">কামিজ দৈর্ঘ্য</th>
                <th className="py-2.5 px-2">কোমর (Waist)</th>
                <th className="py-2.5 px-2">হিপ (Hip)</th>
                <th className="py-2.5 px-2">সালোয়ার লং</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-data-tabular text-xs sm:text-sm text-gray-800">
              {rows.map((row, idx) => (
                <tr key={idx} className={row.isStd ? 'bg-amber-50/50' : 'hover:bg-gray-50'}>
                  <td className="py-2.5 px-3 text-left font-bold text-amber-800">
                    {row.size} {row.isStd && <span className="text-[10px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded ml-1">স্ট্যান্ডার্ড</span>}
                  </td>
                  <td className="py-2.5 px-2">{unit === 'inch' ? row.bustInch : row.bustCm}</td>
                  <td className="py-2.5 px-2">{unit === 'inch' ? row.lenInch : row.lenCm}</td>
                  <td className="py-2.5 px-2">{unit === 'inch' ? row.waistInch : row.waistCm}</td>
                  <td className="py-2.5 px-2">{unit === 'inch' ? row.hipInch : row.hipCm}</td>
                  <td className="py-2.5 px-2">{unit === 'inch' ? row.trouserInch : row.trouserCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip Box */}
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs">
          <span className="material-symbols-outlined text-amber-600 text-lg mt-0.5 shrink-0">tips_and_updates</span>
          <div className="text-gray-700">
            <p className="font-bold text-gray-900 mb-0.5">সঠিক মাপ নেওয়ার টিপস:</p>
            <p>ফিতা খুব বেশি টাইট না রেখে সোজা হয়ে দাঁড়িয়ে মাপ নিন। বুকের মাপের সাথে ১-২ ইঞ্চি ছাড় রেখে সাইজ বাছাই করলে সবচেয়ে আরামদায়ক হবে।</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-200">
          <button
            onClick={() => setIsSizeChartOpen(false)}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};
