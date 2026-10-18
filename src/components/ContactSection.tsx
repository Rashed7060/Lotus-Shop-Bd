import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const { settings, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'অর্ডার সম্পর্কিত অনুসন্ধান',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('দয়া করে আপনার নাম ও ফোন নম্বর লিখুন', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('আপনার বার্তাটি সফলভাবে গৃহীত হয়েছে! আমাদের সাপোর্ট টিম দ্রুত যোগাযোগ করবে।', 'success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'অর্ডার সম্পর্কিত অনুসন্ধান',
        message: ''
      });
    }, 600);
  };

  const whatsappClean = (settings.whatsappNumber || '+8801834355700').replace(/[^0-9]/g, '');

  return (
    <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 scroll-mt-24">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-sm text-amber-500">support_agent</span>
          <span>২৪/৭ ডেডিকেটেড সাপোর্ট</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Contact <span className="text-amber-500">Lotus Shop BD</span>
        </h2>
        <p className="font-bn text-gray-500 text-sm mt-1">
          অর্ডার, পণ্য বা ডেলিভারি সম্পর্কিত যেকোনো প্রশ্নে আমাদের সাথে যোগাযোগ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Direct Phone / Call Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-amber-400 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 font-bn text-sm">হটলাইন ও কাস্টমার কেয়ার</h4>
              <p className="text-xs text-gray-500 font-bn mb-1.5">সরাসরি কথা বলুন আমাদের প্রতিনিধির সাথে</p>
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-amber-600 font-mono transition-colors"
              >
                <span>{settings.phone}</span>
                <span className="material-symbols-outlined text-sm text-amber-500">north_east</span>
              </a>
            </div>
          </div>

          {/* WhatsApp Chat Card */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:border-emerald-500 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 font-bn text-sm">হোয়াটসঅ্যাপ সাপোর্ট (WhatsApp)</h4>
              <p className="text-xs text-gray-500 font-bn mb-2">ছবি বা সাইজ জানতে সরাসরি চ্যাট করুন</p>
              <a
                href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('হ্যালো Lotus Shop BD! আমি একটি পণ্য সম্পর্কে জানতে চাই।')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <span>সরাসরি হোয়াটসঅ্যাপ মেসেজ</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-amber-400 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 font-bn text-sm">ইমেইল সাপোর্ট</h4>
              <p className="text-xs text-gray-500 font-bn mb-1.5">বিজনেস ও হোলসেল যোগাযোগের জন্য</p>
              <a
                href={`mailto:${settings.email}`}
                className="text-xs font-semibold text-gray-800 hover:text-amber-600 font-mono transition-colors block break-all"
              >
                {settings.email}
              </a>
            </div>
          </div>

          {/* Office Address Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <div className="flex-1 font-bn">
              <h4 className="font-bold text-gray-900 text-sm">প্রধান শোরুম ও কর্পোরেট অফিস</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                বাড়ি-১২, রোড-৪, ব্লক-সি, মিরপুর-১০, ঢাকা-১২১৬, বাংলাদেশ।
              </p>
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-amber-500">schedule</span>
                <span>খোলা: প্রতিদিন সকাল ৯:০০ টা - রাত ১০:০০ টা</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Instant Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-bn">
              আমাদের সরাসরি মেসেজ পাঠান
            </h3>
            <p className="text-xs text-gray-500 font-bn mt-0.5">
              ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি খুব শীঘ্রই আপনার নম্বরে যোগাযোগ করবেন।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-bn text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="যেমন: 01712-345678"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  যোগাযোগের বিষয়
                </label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white"
                >
                  <option value="অর্ডার সম্পর্কিত অনুসন্ধান">অর্ডার সম্পর্কিত অনুসন্ধান</option>
                  <option value="পণ্য ও সাইজ যাচাই">পণ্য ও সাইজ যাচাই</option>
                  <option value="ডেলিভারি স্ট্যাটাস">ডেলিভারি স্ট্যাটাস</option>
                  <option value="পাইকারি / হোলসেল অর্ডার">পাইকারি / হোলসেল অর্ডার</option>
                  <option value="অভিযোগ বা পরামর্শ">অভিযোগ বা পরামর্শ</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                আপনার বার্তা লিখুন
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="আপনার যে কোনো প্রশ্ন বা পণ্যের বিস্তারিত এখানে লিখুন..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-neutral-900 font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-bn text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>মেসেজ পাঠান</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
