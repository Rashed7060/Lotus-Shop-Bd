import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setActiveView, settings, showToast, setIsHostingerGuideOpen, openAdminTab } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('নিউজলেটারে সফলভাবে সাবস্ক্রাইব করা হয়েছে!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111111] text-gray-400 text-xs mt-12 pt-12 pb-6 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-neutral-800">
          {/* Column 1: Brand Info & Mission */}
          <div className="space-y-4">
            <button onClick={() => setActiveView('home')} className="flex items-center text-left cursor-pointer hover:opacity-90 transition-opacity">
              <Logo variant="horizontal" size="md" inverted={true} />
            </button>
            <p className="font-bn text-gray-400 text-xs leading-relaxed">
              {settings.taglineBn}<br />
              সেরা মানের পণ্য, সেরা অভিজ্ঞতা।
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-1">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors">
                <span className="text-[11px] font-bold">f</span>
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors">
                <span className="text-[11px] font-bold">ig</span>
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors">
                <span className="text-[11px] font-bold">yt</span>
              </a>
              <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors">
                <span className="text-[11px] font-bold">wa</span>
              </a>
            </div>
            <div className="text-[10px] text-gray-500 pt-1">
              <span>ট্রেড লাইসেন্স: {settings.tradeLicense}</span><br />
              <span>BIN: {settings.binNumber}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">Home (হোম)</button></li>
              <li><button onClick={() => { setActiveView('home'); document.getElementById('best-sellers-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">Best Sellers (সেরা বিক্রিত)</button></li>
              <li><button onClick={() => { setActiveView('home'); document.getElementById('sale-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-red-400 text-rose-300 font-semibold transition-colors cursor-pointer">Sale &amp; Offers (ধামাকা সেল)</button></li>
              <li><button onClick={() => { setActiveView('home'); document.getElementById('multi-products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">Multi Products (মাল্টি প্রোডাক্ট)</button></li>
              <li><button onClick={() => { setActiveView('home'); document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">Shop All (সব পণ্য)</button></li>
              <li><button onClick={() => { setActiveView('home'); document.getElementById('about-us-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">About Us (আমাদের কথা)</button></li>
              <li><button onClick={() => { setActiveView('home'); document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">Contact Us (যোগাযোগ)</button></li>
              <li>
                <button
                  onClick={() => openAdminTab('products')}
                  className="hover:text-rose-400 text-rose-400 font-bold transition-colors cursor-pointer flex items-center gap-1 pt-1"
                >
                  <span className="material-symbols-outlined text-xs">inventory_2</span>
                  <span>পণ্য যোগ ও ডিলিট (Admin Panel)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsHostingerGuideOpen(true)}
                  className="hover:text-amber-400 text-amber-500 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">rocket_launch</span>
                  <span>Hostinger Deployment Guide</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Customer Service</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveView('home')} className="hover:text-amber-400 transition-colors cursor-pointer">FAQ</button></li>
              <li><button onClick={() => setActiveView('home')} className="hover:text-amber-400 transition-colors cursor-pointer">Shipping Policy</button></li>
              <li><button onClick={() => setActiveView('home')} className="hover:text-amber-400 transition-colors cursor-pointer">Return &amp; Refund Policy</button></li>
              <li><button onClick={() => setActiveView('home')} className="hover:text-amber-400 transition-colors cursor-pointer">Terms &amp; Conditions</button></li>
              <li><button onClick={() => setActiveView('home')} className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => setActiveView('track_order')} className="hover:text-amber-400 text-amber-400 font-medium transition-colors cursor-pointer">Track Order</button></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Contact Us</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">phone_in_talk</span>
                <a href={`tel:${settings.phone || '+8801834355700'}`} className="font-data-tabular hover:text-white transition-colors">
                  {settings.phone || '+8801834355700'}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">mail</span>
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">location_on</span>
                <span>{settings.addressBn}</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter Subscription */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Subscribe Our Newsletter</h4>
            <p className="text-gray-400 text-[11px] mb-3">Get latest updates and offers</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold text-xs py-2 rounded transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <div>
            © 2025 Lotus Shop BD. All Rights Reserved. ঢাকা, বাংলাদেশ।
          </div>

          {/* Payment Badges Strip matching user screenshot */}
          <div className="flex items-center space-x-2 flex-wrap justify-center">
            {/* bKash Badge */}
            <span className="bg-[#d12053] text-white px-2 py-0.5 rounded font-black text-[10px]">
              bKash
            </span>
            {/* Nagad Badge */}
            <span className="bg-[#f7941d] text-white px-2 py-0.5 rounded font-black text-[10px]">
              নগদ
            </span>
            {/* Rocket Badge */}
            <span className="bg-[#8b2b8e] text-white px-2 py-0.5 rounded font-black text-[10px]">
              Rocket
            </span>
            {/* Upay Badge */}
            <span className="bg-[#0b5c9e] text-white px-2 py-0.5 rounded font-black text-[10px]">
              Upay
            </span>
            {/* VISA Badge */}
            <span className="bg-blue-900 text-white px-2 py-0.5 rounded font-black text-[10px] italic">
              VISA
            </span>
            {/* MasterCard Badge */}
            <span className="bg-neutral-800 text-white px-2 py-0.5 rounded font-bold text-[10px] flex items-center space-x-0.5">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500 -ml-1 inline-block"></span>
            </span>
            {/* COD Badge */}
            <span className="border border-neutral-700 text-gray-300 px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1">
              <span className="material-symbols-outlined text-amber-500 text-xs">shield</span>
              <span>Secure Payment</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
