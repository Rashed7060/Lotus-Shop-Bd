import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Logo } from './Logo';

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const {
    products,
    cart,
    wishlist,
    setActiveView,
    setActiveProduct,
    setIsCartDrawerOpen,
    language,
    setLanguage,
    isAdminLoggedIn,
    logoutAdmin,
    setIsAdminLoginOpen,
    settings,
    openAdminTab
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products for instant live search dropdown
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchSuggestions: Product[] = trimmedQuery
    ? products
        .filter(p => {
          return (
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.nameBn.includes(trimmedQuery) ||
            p.sku.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery) ||
            p.brand.toLowerCase().includes(trimmedQuery)
          );
        })
        .slice(0, 6)
    : [];

  // Close live search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (query: string) => {
    setIsSearchFocused(false);
    if (onSearch) {
      onSearch(query.trim());
    }
    setActiveView('home');
    // Scroll down to products section
    setTimeout(() => {
      const el = document.getElementById('new-arrivals-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleSelectProduct = (product: Product) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setActiveProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#111111] text-white text-xs border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between font-bn">
          {/* Left Notice */}
          <div className="flex items-center space-x-2 text-gray-300">
            <span className="material-symbols-outlined text-amber-500 text-sm">local_shipping</span>
            <span>ফ্রি ডেলিভারি | সারা বাংলাদেশে ২,৫০০ টাকার অর্ডারে</span>
          </div>

          {/* Center Slogan */}
          <div className="hidden md:flex items-center space-x-2 text-gray-200 font-medium">
            <span>{settings.taglineBn || 'আভিজাত্য ও বিশ্বাসের অনন্য ঠিকানা'} - {settings.storeName}</span>
          </div>

          {/* Right Action: Helpline & Admin Panel */}
          <div className="flex items-center space-x-4">
            <a href={`tel:${settings.phone}`} className="hidden sm:flex items-center gap-1 text-gray-300 hover:text-white">
              <span className="material-symbols-outlined text-xs text-amber-400">call</span>
              <span className="font-mono text-[11px]">{settings.phone}</span>
            </a>

            {/* Direct 1-Click Product Management Shortcut */}
            <button
              onClick={() => openAdminTab('products')}
              className="hidden sm:flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="অ্যাডমিন: নতুন পণ্য যোগ করুন ও ডিলিট করুন"
            >
              <span className="material-symbols-outlined text-xs">add_circle</span>
              <span>পণ্য যোগ ও ডিলিট</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-amber-400 focus:outline-none text-xs font-sans py-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                <span>Admin Panel</span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>

              {isAdminDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 bg-[#1a1a1a] border border-neutral-700 shadow-xl rounded-md z-50 py-1 text-xs"
                  onMouseLeave={() => setIsAdminDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      openAdminTab('dashboard');
                      setIsAdminDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 text-gray-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 text-amber-400">dashboard</span>
                    <span>Dashboard (ড্যাশবোর্ড)</span>
                  </button>
                  <button
                    onClick={() => {
                      openAdminTab('products');
                      setIsAdminDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 text-white bg-rose-950/40 hover:bg-rose-900/60 font-bold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 text-rose-400">inventory_2</span>
                    <span>Product (পণ্য যোগ ও ডিলিট)</span>
                  </button>
                  <button
                    onClick={() => {
                      openAdminTab('orders');
                      setIsAdminDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 text-gray-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 text-amber-400">shopping_bag</span>
                    <span>Orders (অর্ডারসমূহ)</span>
                  </button>
                  <button
                    onClick={() => {
                      openAdminTab('customers');
                      setIsAdminDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 text-gray-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 text-amber-400">group</span>
                    <span>Customer (গ্রাহক তালিকা)</span>
                  </button>
                  <button
                    onClick={() => {
                      openAdminTab('settings');
                      setIsAdminDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 text-gray-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 text-amber-400">settings</span>
                    <span>Settings (সেটিংস)</span>
                  </button>
                  <div className="border-t border-neutral-700 my-1"></div>
                  {isAdminLoggedIn ? (
                    <button
                      onClick={() => {
                        logoutAdmin();
                        setIsAdminDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center px-3 py-2 text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm mr-2">logout</span>
                      <span>Logout Admin</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAdminLoginOpen(true);
                        setIsAdminDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center px-3 py-2 text-emerald-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm mr-2">lock</span>
                      <span>Login as Admin</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="text-gray-300 hover:text-amber-400 text-xs font-bold border border-neutral-700 px-1.5 py-0.5 rounded cursor-pointer"
            >
              {language === 'bn' ? 'বাংলা' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 py-2 sm:py-2.5 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo Area */}
          <button
            onClick={() => {
              setActiveView('home');
              if (onSearch) onSearch('');
              setSearchQuery('');
            }}
            className="flex items-center flex-shrink-0 text-left cursor-pointer group hover:opacity-95 transition-all duration-200 py-0.5"
            title="Lotus Shop BD - হোমপেজ"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Search Bar with Live Instant Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="hidden sm:block flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="পণ্য খুঁজুন (নাম, যেমন: থ্রি পিস, শাড়ি, পাঞ্জাবি, ব্যাগ, SKU...)"
                className="w-full pl-4 pr-20 py-2.5 text-sm font-bn border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs bg-white placeholder-gray-400"
              />

              {/* Clear button if text exists */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
                  title="ক্লিয়ার করুন"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}

              <button
                type="submit"
                title="Search"
                className="absolute right-1 top-1 bottom-1 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
            </form>

            {/* LIVE AUTOCOMPLETE SEARCH RESULTS DROPDOWN */}
            {isSearchFocused && trimmedQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2.5 bg-gray-50 flex items-center justify-between text-xs text-gray-500 font-bn">
                  <span>অনুসন্ধানের ফলাফল ({searchSuggestions.length}টি পণ্য পাওয়া গেছে)</span>
                  <button
                    onClick={() => executeSearch(searchQuery)}
                    className="text-amber-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>সকল ফলাফল দেখুন</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>

                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className="p-3 hover:bg-amber-50/60 transition-colors cursor-pointer flex items-center gap-3 group"
                    >
                      <img
                        src={item.thumbnail || item.images[0]}
                        alt={item.nameBn}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="font-bn font-bold text-xs text-gray-900 group-hover:text-amber-700 truncate">
                            {item.nameBn}
                          </h4>
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-mono px-1 rounded shrink-0">
                            {item.sku}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">
                          {item.category} • {item.brand}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bn font-bold text-rose-600 text-xs block">
                          ৳{item.price.toLocaleString('bn-BD')}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through">
                          ৳{item.regularPrice.toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-gray-500 font-bn">
                    <span className="material-symbols-outlined text-3xl text-gray-300 block mb-1">
                      search_off
                    </span>
                    <p className="font-semibold text-gray-700">"{searchQuery}" এর সাথে কোনো পণ্য মেলেনি</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      পরামর্শ: 'থ্রি পিস', 'শাড়ি', 'পাঞ্জাবি', 'হিজাব', বা 'ব্যাগ' লিখে খুঁজুন।
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Account, Wishlist & Cart Actions */}
          <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
            {/* Account */}
            <button
              onClick={() => setActiveView('account')}
              className="flex flex-col items-center group text-gray-700 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl mb-0.5">person</span>
              <span className="hidden sm:inline text-[11px] font-medium text-gray-600 group-hover:text-amber-500">Account</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveView('account')}
              className="flex flex-col items-center relative group text-gray-700 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-xl mb-0.5">favorite</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-[11px] font-medium text-gray-600 group-hover:text-amber-500">Wishlist</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex flex-col items-center relative group text-gray-700 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-xl mb-0.5">shopping_cart</span>
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline text-[11px] font-medium text-gray-600 group-hover:text-amber-500">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        <div className="sm:hidden px-4 pt-2.5 pb-1">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              placeholder="পণ্য খুঁজুন (নাম, SKU, ক্যাটাগরি...)"
              className="w-full pl-3 pr-16 py-2 text-xs font-bn border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-10 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 text-white rounded-md flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </form>
        </div>
      </header>

      {/* Primary Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            {/* All Categories Trigger Button */}
            <div className="w-52 sm:w-60 flex-shrink-0 relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium py-3 px-4 flex items-center justify-between rounded-t transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-lg">menu</span>
                  <span className="font-bn font-semibold text-xs sm:text-sm tracking-wide">সকল ক্যাটাগরি</span>
                </div>
                <span className={`material-symbols-outlined text-sm transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                  chevron_right
                </span>
              </button>

              {/* All Categories Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-2xl rounded-b-xl z-50 divide-y divide-gray-100 font-bn text-xs sm:text-sm py-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('home');
                      if (onSearch) onSearch('Three Piece');
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-amber-500">apparel</span>
                      <span>থ্রি পিস ও কামিজ</span>
                    </span>
                    <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('home');
                      if (onSearch) onSearch('Saree');
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-amber-500">dry_cleaning</span>
                      <span>কাতান ও বেনারসি শাড়ি</span>
                    </span>
                    <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('home');
                      if (onSearch) onSearch('Panjabi');
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-amber-500">man</span>
                      <span>পাঞ্জাবি ও মেনস কালেকশন</span>
                    </span>
                    <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('home');
                      if (onSearch) onSearch('Bags');
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-amber-500">shopping_bag</span>
                      <span>লেডিস ব্যাগ ও পার্স</span>
                    </span>
                    <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('home');
                      if (onSearch) onSearch('Shoes');
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-amber-500">footprint</span>
                      <span>স্নিকার্স ও জুতো</span>
                    </span>
                    <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('home');
                      if (onSearch) onSearch('Hijab');
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-amber-500">styler</span>
                      <span>হিজাব ও স্কার্ফ</span>
                    </span>
                    <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                  </button>

                  {/* Section Jumps */}
                  <div className="pt-2 pb-1 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveView('home');
                        const el = document.getElementById('best-sellers-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2 text-amber-600 font-bold hover:bg-amber-100 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">local_fire_department</span>
                      <span>Best Sellers (সেরা বিক্রিত)</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveView('home');
                        const el = document.getElementById('sale-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-50 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span>Sale & Offers (ধামাকা অফার)</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveView('home');
                        const el = document.getElementById('about-us-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>আমাদের সম্পর্কে (About Us)</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveView('home');
                        const el = document.getElementById('contact-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span>যোগাযোগ (Contact)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Navigation Links */}
            <div className="hidden lg:flex ml-6 items-center space-x-6 text-sm font-medium">
              <button
                onClick={() => {
                  setActiveView('home');
                  clearSearch();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-amber-500 font-bold border-b-2 border-amber-500 pb-3 pt-3 cursor-pointer"
              >
                হোম
              </button>

              <button
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('best-sellers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-amber-500 pb-3 pt-3 transition-colors cursor-pointer font-bn flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-amber-500 text-sm">local_fire_department</span>
                <span>বেস্ট সেলার</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('sale-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-red-600 hover:text-red-700 pb-3 pt-3 transition-colors cursor-pointer font-bn font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-red-500 text-sm">bolt</span>
                <span>অফার ও সেল</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('multi-products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-amber-500 pb-3 pt-3 transition-colors cursor-pointer font-bn"
              >
                মাল্টি প্রোডাক্ট
              </button>

              <button
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('new-arrivals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-amber-500 pb-3 pt-3 transition-colors cursor-pointer font-bn"
              >
                সব পণ্য (Shop)
              </button>

              <button
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('about-us-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-amber-500 pb-3 pt-3 transition-colors cursor-pointer font-bn"
              >
                আমাদের সম্পর্কে
              </button>

              <button
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-amber-500 pb-3 pt-3 transition-colors cursor-pointer font-bn"
              >
                যোগাযোগ
              </button>

              <button
                onClick={() => openAdminTab('products')}
                className="text-rose-600 hover:text-rose-700 font-bold pb-3 pt-3 transition-colors cursor-pointer flex items-center gap-1 border-b-2 border-transparent hover:border-rose-600"
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>পণ্য যোগ ও ডিলিট</span>
              </button>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
            <span>১০০% ক্যাশ অন ডেলিভারি</span>
          </div>
        </div>
      </nav>
    </>
  );
};
