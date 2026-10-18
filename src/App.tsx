/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustFeatures } from './components/TrustFeatures';
import { CategoryBubbles } from './components/CategoryBubbles';
import { MultiProductsShowcase } from './components/MultiProductsShowcase';
import { BestSellers } from './components/BestSellers';
import { SaleSection } from './components/SaleSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ContactSection } from './components/ContactSection';
import { PromoBanners } from './components/PromoBanners';
import { NewArrivals } from './components/NewArrivals';
import { BrandsStrip } from './components/BrandsStrip';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { CustomerAccountPage } from './components/CustomerAccountPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminOrderDetailsModal } from './components/AdminOrderDetailsModal';
import { SizeChartModal } from './components/SizeChartModal';
import { ReviewsModal } from './components/ReviewsModal';
import { HostingerGuideModal } from './components/HostingerGuideModal';

const MainLayout: React.FC = () => {
  const { activeView, isAdminLoggedIn, mustChangePassword } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    const element = document.getElementById('new-arrivals-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedCategory(undefined); // Reset category filter so search covers all products
    }
    const element = document.getElementById('new-arrivals-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900 selection:bg-rose-500 selection:text-white">
      {/* RENDER VIEW BASED ON ACTIVE VIEW */}
      {activeView === 'admin' && isAdminLoggedIn && !mustChangePassword ? (
        <AdminDashboard />
      ) : activeView === 'checkout' ? (
        <CheckoutPage />
      ) : activeView === 'order_success' ? (
        <OrderSuccessPage />
      ) : activeView === 'account' ? (
        <>
          <Header onSearch={handleSearch} />
          <CustomerAccountPage />
          <Footer />
        </>
      ) : activeView === 'product' ? (
        <>
          <Header onSearch={handleSearch} />
          <ProductDetailsPage />
          <BrandsStrip />
          <Footer />
        </>
      ) : (
        /* DEFAULT: STOREFRONT HOMEPAGE ('home' or fallback) */
        <>
          <Header onSearch={handleSearch} />
          <main className="flex-1">
            <HeroBanner onSelectCategory={handleSelectCategory} />
            <TrustFeatures />
            <CategoryBubbles onSelectCategory={handleSelectCategory} />

            {/* 1. Best Sellers Section */}
            <BestSellers />

            {/* 2. Flash Sale & Offers Section */}
            <SaleSection />

            {/* 3. Multi Products Showcase */}
            <MultiProductsShowcase onSelectCategory={handleSelectCategory} />

            <PromoBanners />

            {/* All Products / New Arrivals */}
            <div id="new-arrivals-section">
              <NewArrivals
                filterCategory={selectedCategory}
                searchQuery={searchQuery}
                onClearFilter={handleClearFilters}
                onSelectCategory={handleSelectCategory}
              />
            </div>

            {/* 4. About Us Section */}
            <AboutUsSection />

            {/* 5. Contact Section */}
            <ContactSection />

            <BrandsStrip />
          </main>
          <Footer />
        </>
      )}

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <SizeChartModal />
      <ReviewsModal />
      <AdminLoginModal />
      <AdminOrderDetailsModal />
      <HostingerGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
