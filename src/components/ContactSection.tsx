import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const { settings, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please enter your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you! Your message has been sent successfully. Our support team will contact you shortly.', 'success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Order Inquiry',
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
          <span>24/7 Dedicated Support</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Contact <span className="text-amber-500">Lotus Shop BD</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Have questions about products, sizing, or delivery? We are here to assist you anytime.
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
              <h4 className="font-bold text-gray-900 text-sm">Customer Care Hotline</h4>
              <p className="text-xs text-gray-500 mb-1.5">Speak directly with our support specialists</p>
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
              <h4 className="font-bold text-gray-900 text-sm">WhatsApp Live Chat</h4>
              <p className="text-xs text-gray-500 mb-2">Message us photos, sizing questions, or instant queries</p>
              <a
                href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Hello Lotus Shop BD! I have an inquiry about a product.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <span>Chat on WhatsApp</span>
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
              <h4 className="font-bold text-gray-900 text-sm">Official Email</h4>
              <p className="text-xs text-gray-500 mb-1.5">For corporate, wholesale, and formal inquiries</p>
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
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">Head Office &amp; Showroom</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                House #12, Road #4, Block-C, Mirpur 10, Dhaka-1216, Bangladesh.
              </p>
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-amber-500">schedule</span>
                <span>Open: Daily 9:00 AM – 10:00 PM (Orders 24/7 online)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Instant Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Send Us a Message
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill out the form below and our customer representative will call you back promptly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 01712-345678"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address (Optional)
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
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white"
                >
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Product & Sizing Help">Product &amp; Sizing Help</option>
                  <option value="Delivery Tracking Status">Delivery Tracking Status</option>
                  <option value="Wholesale / Bulk Orders">Wholesale / Bulk Orders</option>
                  <option value="Feedback / Suggestions">Feedback / Suggestions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your question, required quantity or color details here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-neutral-900 font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
