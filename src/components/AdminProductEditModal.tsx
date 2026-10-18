import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface AdminProductEditModalProps {
  product: Product | null; // null if adding new
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProductEditModal: React.FC<AdminProductEditModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { saveProduct, deleteProduct, showToast } = useStore();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Women Fashion');
  const [brand, setBrand] = useState('Lotus Elegance');
  const [price, setPrice] = useState<number>(1850);
  const [regularPrice, setRegularPrice] = useState<number>(2450);
  const [stock, setStock] = useState<number>(25);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [badge, setBadge] = useState<'New' | 'Hot' | 'Sale' | 'Trending'>('Trending');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSizes = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const presetImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
  ];

  useEffect(() => {
    setShowDeleteConfirm(false);
    if (product) {
      setName(product.name || '');
      setNameBn(product.nameBn || '');
      setSku(product.sku || '');
      setCategory(product.category || 'Women Fashion');
      setBrand(product.brand || 'Lotus Elegance');
      setPrice(product.price || 0);
      setRegularPrice(product.regularPrice || product.price || 0);
      setStock(product.stock ?? 25);
      setImageUrl(product.images?.[0] || product.thumbnail || '');
      setDescription(product.description || '');
      setDescriptionBn(product.descriptionBn || '');
      setBadge((product.badge as any) || 'Trending');
      setSelectedSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['M', 'L', 'XL']);
    } else {
      setName('');
      setNameBn('');
      setSku(`LTS-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('Women Fashion');
      setBrand('Lotus Elegance');
      setPrice(1500);
      setRegularPrice(1950);
      setStock(30);
      setImageUrl(presetImages[0]);
      setDescription('High quality fabric product designed for elegance and comfort.');
      setDescriptionBn('উন্নত মানের ফেব্রিক ও নিখুঁত কারুকাজ সমৃদ্ধ প্রিমিয়াম কালেকশন।');
      setBadge('New');
      setSelectedSizes(['M', 'L', 'XL']);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('ছবির সাইজ ৫ মেগাবাইট (5MB)-এর কম হতে হবে', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast('ছবি সফলভাবে আপলোড হয়েছে!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes(prev =>
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  const handleDeleteCurrentProduct = () => {
    if (!product) return;
    deleteProduct(product.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) {
      showToast('অনুগ্রহ করে পণ্যের বাংলা নাম লিখুন', 'error');
      return;
    }
    if (!sku.trim()) {
      showToast('অনুগ্রহ করে পণ্যের এসকেইউ (SKU) কোড দিন', 'error');
      return;
    }
    if (price <= 0) {
      showToast('পণ্যের বিক্রয় মূল্য ০ এর বেশি হতে হবে', 'error');
      return;
    }

    const currentImg = imageUrl.trim() || presetImages[0];
    const finalSizes = selectedSizes.length > 0 ? selectedSizes : ['Standard'];

    if (product) {
      saveProduct({
        ...product,
        name: name.trim() || nameBn.trim(),
        nameBn: nameBn.trim(),
        sku: sku.trim().toUpperCase(),
        category,
        brand: brand.trim() || 'Lotus Elegance',
        price: Number(price),
        regularPrice: Number(regularPrice) || Number(price),
        stock: Number(stock),
        images: [currentImg, ...(product.images ? product.images.slice(1) : [])],
        thumbnail: currentImg,
        description,
        descriptionBn,
        badge,
        sizes: finalSizes
      });
      showToast('পণ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
    } else {
      saveProduct({
        id: `prod-${Date.now()}`,
        name: name.trim() || nameBn.trim(),
        nameBn: nameBn.trim(),
        slug: sku.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        sku: sku.trim().toUpperCase(),
        category,
        brand: brand.trim() || 'Lotus Elegance',
        price: Number(price),
        regularPrice: Number(regularPrice) || Number(price),
        stock: Number(stock),
        lowStockThreshold: 5,
        images: [currentImg],
        thumbnail: currentImg,
        description,
        descriptionBn,
        features: ['Premium Quality', 'Fast Delivery', '100% Authentic'],
        featuresBn: ['প্রিমিয়াম ফেব্রিক', 'দ্রুত ডেলিভারি', '১০০% অরিজিনাল'],
        rating: 5.0,
        reviewCount: 0,
        badge,
        badgeBn: badge === 'New' ? 'নতুন' : badge === 'Sale' ? 'অফার' : badge === 'Hot' ? 'হট' : 'জনপ্রিয়',
        sizes: finalSizes,
        colors: [
          { name: 'Peach Rose', nameBn: 'পিচ রোজ', hex: '#E8A598' },
          { name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1B2A4A' }
        ],
        weightKg: 0.5
      });
      showToast('নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-rose-500 text-2xl">
              {product ? 'edit_note' : 'add_circle'}
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {product ? 'পণ্য সম্পাদনা ও পরিচালনা (Edit Product)' : 'নতুন পণ্য যুক্ত করুন (Add New Product)'}
              </h3>
              <p className="text-[11px] text-gray-400">
                {product ? `SKU: ${product.sku} • ID: ${product.id}` : 'স্টোরে নতুন পণ্যের তথ্য ও ছবি যুক্ত করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Delete Confirmation Banner (If activated inside modal) */}
        {showDeleteConfirm && product && (
          <div className="bg-red-50 border-b border-red-200 p-4 animate-in slide-in-from-top duration-200">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-2xl shrink-0 mt-0.5">
                warning
              </span>
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-red-900 text-sm">
                  আপনি কি নিশ্চিতভাবে এই পণ্যটি ডিলিট করতে চান?
                </h4>
                <p className="text-red-700 mt-1">
                  <strong>&quot;{product.nameBn}&quot;</strong> ({product.sku}) স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteCurrentProduct}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete_forever</span>
                    <span>হ্যাঁ, সম্পূর্ণ ডিলিট করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    না, বাতিল
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Product Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                পণ্যের নাম (বাংলায়) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: প্রিমিয়াম এমব্রয়ডারি থ্রি পিস"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Product Title (English)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Embroidered Three Piece"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* SKU, Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                এসকেইউ কোড (SKU) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="LTS-1001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 uppercase"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                ক্যাটেগরি (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              >
                <option value="Women Fashion">Women Fashion (মহিলাদের পোশাক)</option>
                <option value="Men Fashion">Men Fashion (পুরুষদের পোশাক)</option>
                <option value="Saree & Three Piece">Saree & Three Piece (শাড়ি ও থ্রি পিস)</option>
                <option value="Beauty & Makeup">Beauty & Makeup (সৌন্দর্য ও প্রসাধন)</option>
                <option value="Jewelry & Accessories">Jewelry & Accessories (গহনা)</option>
                <option value="Footwear">Footwear (জুতো)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                ব্র্যান্ড (Brand)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Lotus Elegance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Pricing, Discount Preview & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div>
              <label className="block font-bold text-rose-700 mb-1">
                বিক্রয় মূল্য (৳ BDT) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold text-rose-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1">
                রেগুলার মূল্য (৳ BDT)
              </label>
              <input
                type="number"
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              />
              {regularPrice > price && (
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                  {Math.round(((regularPrice - price) / regularPrice) * 100)}% ডিসকাউন্ট
                </span>
              )}
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                স্টক পরিমাণ (Qty) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                ব্যাজ (Badge Tag)
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              >
                <option value="New">New (নতুন)</option>
                <option value="Hot">Hot (হট)</option>
                <option value="Sale">Sale (অফার)</option>
                <option value="Trending">Trending (জনপ্রিয়)</option>
              </select>
            </div>
          </div>

          {/* Available Sizes */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">
              উপলব্ধ সাইজসমূহ (Available Sizes)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(sz => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {sz} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Image: Upload from Device or URL */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-600 text-base">image</span>
                <span>পণ্যের ছবি নির্বাচন ও আপলোড (Product Photo)</span>
              </label>
              
              {/* File upload button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  <span>ডিভাইস থেকে ছবি আপলোড</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Image Preview thumbnail */}
              <div className="w-16 h-16 rounded-xl border border-gray-300 bg-white overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-gray-300 text-3xl">image</span>
                )}
              </div>

              {/* URL Input */}
              <div className="flex-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... অথবা উপরের বাটনে ক্লিক করে ছবি আপলোড করুন"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-[11px] bg-white"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  সরাসরি ওয়েব লিংক পেস্ট করুন অথবা আপনার ফোন/কম্পিউটার থেকে ছবি দিন।
                </span>
              </div>
            </div>

            {/* Catalog Presets */}
            <div>
              <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                অথবা কালেকশন থেকে দ্রুত পছন্দ করুন:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {presetImages.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setImageUrl(img)}
                    className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all hover:scale-105 cursor-pointer ${
                      imageUrl === img ? 'border-rose-600 ring-2 ring-rose-400' : 'border-gray-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                পণ্যের বিবরণ (বাংলায়)
              </label>
              <textarea
                rows={3}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="পণ্যের উপাদান, মাপ ও বৈশিষ্ট্য লিখুন..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                English Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="English description and styling notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Form Actions with Delete Option */}
          <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              {product && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  <span>পণ্যটি ডিলিট করুন</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>{product ? 'পরিবর্তন সংরক্ষণ করুন' : 'পণ্য যোগ করুন'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
