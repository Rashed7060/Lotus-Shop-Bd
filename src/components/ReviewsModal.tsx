import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_REVIEWS } from '../data/initialData';
import { Review } from '../types';

export const ReviewsModal: React.FC = () => {
  const { isReviewsModalOpen, setIsReviewsModalOpen, showToast } = useStore();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  if (!isReviewsModalOpen) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author,
      location: location || 'বাংলাদেশ',
      rating,
      date: 'আজকে',
      content,
      verified: true
    };
    setReviews([newRev, ...reviews]);
    setIsFormOpen(false);
    setAuthor('');
    setLocation('');
    setContent('');
    showToast('ধন্যবাদ! আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col p-4 sm:p-6 shadow-2xl border border-gray-200 my-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <span className="material-symbols-outlined text-lg">reviews</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-headline-md">
                গ্রাহকদের রিভিউ ও রেটিং
              </h3>
              <p className="text-xs text-gray-500 font-medium">{reviews.length + 120} Verified Reviews • ১০০% আসল ক্রেতাদের মতামত</p>
            </div>
          </div>
          <button
            onClick={() => setIsReviewsModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
          {/* Ratings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-gray-200 md:pr-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-700 font-data-tabular">৪.৮</span>
                <span className="text-xs text-gray-500">/ ৫.০</span>
              </div>
              <div className="flex text-amber-400 my-1">
                <span className="material-symbols-outlined text-base material-symbols-fill">star</span>
                <span className="material-symbols-outlined text-base material-symbols-fill">star</span>
                <span className="material-symbols-outlined text-base material-symbols-fill">star</span>
                <span className="material-symbols-outlined text-base material-symbols-fill">star</span>
                <span className="material-symbols-outlined text-base material-symbols-fill">star_half</span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1">
                ৯৬% রেকমেন্ডেশন
              </span>
              <span className="text-[11px] text-gray-500 mt-1 font-data-tabular">১২৪টি অনুমোদিত রিভিউ</span>
            </div>

            <div className="md:col-span-5 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-gray-700 font-semibold font-data-tabular">৫ স্টার</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="w-8 text-right font-data-tabular text-gray-500">৮৫%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-gray-700 font-semibold font-data-tabular">৪ স্টার</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500/80 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="w-8 text-right font-data-tabular text-gray-500">১০%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-gray-700 font-semibold font-data-tabular">৩ স্টার</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500/60 h-full rounded-full" style={{ width: '3%' }}></div>
                </div>
                <span className="w-8 text-right font-data-tabular text-gray-500">৩%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-gray-700 font-semibold font-data-tabular">২ স্টার</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500/40 h-full rounded-full" style={{ width: '1%' }}></div>
                </div>
                <span className="w-8 text-right font-data-tabular text-gray-500">১%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-gray-700 font-semibold font-data-tabular">১ স্টার</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-red-400 h-full rounded-full" style={{ width: '1%' }}></div>
                </div>
                <span className="w-8 text-right font-data-tabular text-gray-500">১%</span>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 py-2.5 px-3 rounded-lg text-xs font-bold shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">rate_review</span>
                <span>রিভিউ লিখুন</span>
              </button>
            </div>
          </div>

          {/* Expandable Review Form */}
          {isFormOpen && (
            <form onSubmit={handleSubmitReview} className="bg-amber-50/50 border border-amber-300 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-700 text-base">edit_note</span>
                  <span>আপনার মতামত দিন</span>
                </h4>
                <button type="button" onClick={() => setIsFormOpen(false)} className="text-xs text-gray-500 hover:text-gray-800">
                  বাতিল
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">রেটিং নির্বাচন করুন:</label>
                <div className="flex items-center gap-1 text-amber-500 cursor-pointer">
                  {[1, 2, 3, 4, 5].map(st => (
                    <span
                      key={st}
                      onClick={() => setRating(st)}
                      className={`material-symbols-outlined text-xl ${st <= rating ? 'material-symbols-fill text-amber-500' : 'text-gray-300'}`}
                    >
                      star
                    </span>
                  ))}
                  <span className="text-xs font-bold text-gray-800 ml-2">{rating}/৫ স্টার</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম *"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="text-xs p-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="জেলা / শহর (যেমন: মিরপুর, ঢাকা)"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="text-xs p-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <textarea
                required
                rows={2}
                placeholder="কাপড়ের মান ও ডেলিভারি কেমন লেগেছে বিস্তারিত লিখুন..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-amber-500"
              ></textarea>

              <button
                type="submit"
                className="w-full py-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                জমা দিন (Submit Review)
              </button>
            </form>
          )}

          {/* Customer Reviews List */}
          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-3.5 border border-gray-200 rounded-xl bg-white space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                      {rev.author.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{rev.author}</h4>
                      <span className="text-[10px] text-emerald-700 flex items-center gap-0.5 font-medium">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>ভেরিফায়েড পারচেজ ({rev.location}) • {rev.date}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(st => (
                      <span
                        key={st}
                        className={`material-symbols-outlined text-xs ${st <= rev.rating ? 'material-symbols-fill' : 'text-gray-200'}`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-bn">
                  "{rev.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 flex-shrink-0">
          <span className="text-xs text-gray-500 font-data-tabular">মোট রিভিউ: {reviews.length}</span>
          <button
            onClick={() => setIsReviewsModalOpen(false)}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
