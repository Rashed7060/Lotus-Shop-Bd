import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, CourierProvider, Category } from '../types';
import { AdminProductEditModal } from './AdminProductEditModal';
import { Logo } from './Logo';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  thana: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tag: 'VIP' | 'Regular' | 'New';
  preferredPayment: string;
  orders: Order[];
}

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    setActiveView,
    orders,
    products,
    updateOrderStatus,
    deleteProduct,
    setActiveOrder,
    settings,
    updateSettings,
    showToast,
    setIsHostingerGuideOpen,
    adminTab,
    setAdminTab,
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useStore();

  // 5 MAIN REQUESTED TABS: Dashboard, Product, Orders, Customer, Settings (Synchronized globally)
  const activeTab = adminTab;
  const setActiveTab = setAdminTab;
  
  // Settings sub-tab (Defaults to Appearance Settings)
  const [settingsSubTab, setSettingsSubTab] = useState<'appearance' | 'branding' | 'shipping' | 'courier' | 'payment'>('appearance');

  // Orders filters
  const [orderFilter, setOrderFilter] = useState<string>('all');
  
  // Product search & delete
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Category Manager State
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameBn, setNewCatNameBn] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('category');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleSaveCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) {
      showToast('ক্যাটেগরির নাম প্রদান করুন', 'error');
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: newCatName.trim(),
        nameBn: newCatNameBn.trim() || newCatName.trim(),
        icon: newCatIcon || 'category',
        image: newCatImage.trim(),
        description: newCatDescription.trim()
      });
      setEditingCategory(null);
      showToast(`"${newCatName.trim()}" ক্যাটেগরি আপডেট হয়েছে!`);
    } else {
      addCategory({
        name: newCatName.trim(),
        nameBn: newCatNameBn.trim() || newCatName.trim(),
        icon: newCatIcon || 'category',
        image: newCatImage.trim(),
        description: newCatDescription.trim()
      });
    }
    setNewCatName('');
    setNewCatNameBn('');
    setNewCatIcon('category');
    setNewCatImage('');
    setNewCatDescription('');
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewCatNameBn(cat.nameBn || '');
    setNewCatIcon(cat.icon || 'category');
    setNewCatImage(cat.image || '');
    setNewCatDescription(cat.description || '');
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setNewCatName('');
    setNewCatNameBn('');
    setNewCatIcon('category');
    setNewCatImage('');
    setNewCatDescription('');
  };

  // Customer state & filters
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'vip' | 'repeat' | 'new'>('all');
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<CustomerRecord | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [manualCustomers, setManualCustomers] = useState<CustomerRecord[]>([]);

  // Settings form state
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeNameBn, setStoreNameBn] = useState(settings.storeNameBn);
  const [storeTagline, setStoreTagline] = useState(settings.tagline);
  const [storePhone, setStorePhone] = useState(settings.phone);
  const [storeEmail, setStoreEmail] = useState(settings.email);
  const [storeAddress, setStoreAddress] = useState(settings.address);
  const [insideDhakaFee, setInsideDhakaFee] = useState(settings.shippingDhakaMetro);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(settings.shippingOutsideDhaka);
  const [freeShippingMin, setFreeShippingMin] = useState(settings.freeShippingThreshold);

  // Appearance & Logo management state
  const [customLogoInputUrl, setCustomLogoInputUrl] = useState('');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ইমেজ (JPG, PNG, WebP, SVG) ফাইল আপলোড করুন', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('ফাইলের সাইজ ৫ মেগাবাইট (5MB)-এর কম হতে হবে', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateSettings({ logoUrl: result });
        showToast('লোগো সফলভাবে আপলোড ও আপডেট করা হয়েছে! ওয়েবসাইটের সর্বত্র লোগো src পরিবর্তিত হয়েছে।', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processLogoFile(file);
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleApplyLogoUrl = () => {
    if (!customLogoInputUrl.trim()) {
      showToast('অনুগ্রহ করে একটি বৈধ ইমেজ URL দিন', 'error');
      return;
    }
    updateSettings({ logoUrl: customLogoInputUrl.trim() });
    setCustomLogoInputUrl('');
    showToast('লোগো URL সফলভাবে সেট করা হয়েছে! ওয়েবসাইটের সর্বত্র লোগো src পরিবর্তিত হয়েছে।', 'success');
  };

  const handleDeleteLogo = () => {
    updateSettings({ logoUrl: '' });
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = '';
    }
    showToast('কাস্টম লোগো মুছে ফেলা হয়েছে এবং মূল লোগো (/logo.svg) রিস্টোর করা হয়েছে!', 'info');
  };

  const handleSetLogoHeight = (height: number) => {
    updateSettings({ logoHeight: height });
    showToast(`লোগো উচ্চতা ${height}px নির্ধারণ করা হয়েছে`, 'success');
  };

  // Bank Payment Gateway settings state
  const [paymentBankEnabled, setPaymentBankEnabled] = useState(settings.paymentBankEnabled ?? true);
  const [bankName, setBankName] = useState(settings.bankName || 'Dutch-Bangla Bank PLC (DBBL)');
  const [bankAccountName, setBankAccountName] = useState(settings.bankAccountName || 'LOTUS SHOP BD');
  const [bankAccountNumber, setBankAccountNumber] = useState(settings.bankAccountNumber || '115.120.0098765');
  const [bankBranchName, setBankBranchName] = useState(settings.bankBranchName || 'Mirpur-10 Branch, Dhaka');
  const [bankRoutingNumber, setBankRoutingNumber] = useState(settings.bankRoutingNumber || '090273841');
  const [bankPaymentInstructions, setBankPaymentInstructions] = useState(
    settings.bankPaymentInstructions ||
      'অনুগ্রহ করে উপরের ব্যাংক অ্যাকাউন্টে অর্ডার মূল্য জমা দিন বা অনলাইন ফান্ড ট্রান্সফার (BEFTN/NPSB/RTGS) করুন। এরপর ট্রানজেকশন আইডি / রেফারেন্স নম্বর নিচে প্রদান করে অর্ডার কনফার্ম করুন।'
  );

  const handleSaveBankSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      paymentBankEnabled,
      bankName,
      bankAccountName,
      bankAccountNumber,
      bankBranchName,
      bankRoutingNumber,
      bankPaymentInstructions
    });
    showToast('ব্যাংক পেমেন্ট গেটওয়ে সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  // Home Hero Banner Management state & handlers
  const [customBannerInputUrl, setCustomBannerInputUrl] = useState('');
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const processBannerFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ইমেজ (JPG, PNG, WebP) ফাইল আপলোড করুন', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('ফাইলের সাইজ ৮ মেগাবাইট (8MB)-এর কম হতে হবে', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateSettings({ heroBannerUrl: result });
        showToast('হোম স্ক্রিন হিরো ব্যানার সফলভাবে আপডেট করা হয়েছে!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processBannerFile(file);
  };

  const handleBannerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingBanner(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processBannerFile(file);
    }
  };

  const handleApplyBannerUrl = () => {
    if (!customBannerInputUrl.trim()) {
      showToast('অনুগ্রহ করে একটি বৈধ ইমেজ URL দিন', 'error');
      return;
    }
    updateSettings({ heroBannerUrl: customBannerInputUrl.trim() });
    setCustomBannerInputUrl('');
    showToast('হোম ব্যানার URL সফলভাবে সেট করা হয়েছে!', 'success');
  };

  const handleDeleteBanner = () => {
    updateSettings({ heroBannerUrl: '' });
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.value = '';
    }
    showToast('কাস্টম ব্যানার মুছে ফেলা হয়েছে এবং মূল ব্যানার রিস্টোর করা হয়েছে!', 'info');
  };

  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustDistrict, setNewCustDistrict] = useState('ঢাকা');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Calculate KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const lowStockCount = products.filter(p => p.stock <= 10).length;

  // Derive Customers list aggregated from Orders + manual
  const customerList: CustomerRecord[] = useMemo(() => {
    const customerMap = new Map<string, CustomerRecord>();

    orders.forEach(ord => {
      const key = ord.customerPhone.trim();
      const existing = customerMap.get(key);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += ord.total;
        existing.orders.push(ord);
        if (existing.totalSpent >= 5000) existing.tag = 'VIP';
        else if (existing.totalOrders >= 2) existing.tag = 'Regular';
      } else {
        const isVip = ord.total >= 5000;
        customerMap.set(key, {
          id: `cust-${key.replace(/[^0-9]/g, '')}`,
          name: ord.customerName,
          phone: ord.customerPhone,
          email: ord.customerEmail || `${ord.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          district: ord.district || 'ঢাকা',
          thana: ord.thana || 'মিরপুর',
          address: ord.address,
          totalOrders: 1,
          totalSpent: ord.total,
          lastOrderDate: ord.createdAt,
          tag: isVip ? 'VIP' : 'New',
          preferredPayment: ord.paymentMethod.toUpperCase(),
          orders: [ord]
        });
      }
    });

    // Add sample active repeat customers if list is small for rich showcase
    const defaultSeeded: CustomerRecord[] = [
      {
        id: 'cust-demo-1',
        name: 'তানভীর আহমেদ',
        phone: '01712-345678',
        email: 'tanvir.ahmed@example.com',
        district: 'ঢাকা মেট্রো',
        thana: 'উত্তরা',
        address: 'বাড়ি #১২, রোড #০৫, সেক্টর #০৩, উত্তরা, ঢাকা',
        totalOrders: 4,
        totalSpent: 8450,
        lastOrderDate: '১৭ অক্টোবর ২০২৪',
        tag: 'VIP',
        preferredPayment: 'BKASH',
        orders: orders.slice(0, 2)
      },
      {
        id: 'cust-demo-2',
        name: 'নুসরাত জাহান রিয়া',
        phone: '01823-987654',
        email: 'nusrat.ria@gmail.com',
        district: 'চট্টগ্রাম',
        thana: 'পাঁচলাইশ',
        address: 'জিইসি মোড়, পাঁচলাইশ, চট্টগ্রাম',
        totalOrders: 3,
        totalSpent: 5900,
        lastOrderDate: '১৬ অক্টোবর ২০২৪',
        tag: 'VIP',
        preferredPayment: 'NAGAD',
        orders: orders.slice(1, 3)
      },
      {
        id: 'cust-demo-3',
        name: 'ফারহান চৌধুরী',
        phone: '01911-223344',
        email: 'farhan.chy@yahoo.com',
        district: 'সিলেট',
        thana: 'কোতোয়ালী',
        address: 'জিন্দাবাজার, সিলেট সদর',
        totalOrders: 2,
        totalSpent: 3650,
        lastOrderDate: '১৫ অক্টোবর ২০২৪',
        tag: 'Regular',
        preferredPayment: 'COD',
        orders: orders.slice(0, 1)
      },
      {
        id: 'cust-demo-4',
        name: 'সাদিয়া ইসলাম প্রমি',
        phone: '01678-554433',
        email: 'promi.islam@outlook.com',
        district: 'ঢাকা',
        thana: 'ধানমন্ডি',
        address: 'রোড #৪/এ, ধানমন্ডি, ঢাকা',
        totalOrders: 1,
        totalSpent: 1850,
        lastOrderDate: '১৪ অক্টোবর ২০২৪',
        tag: 'New',
        preferredPayment: 'BKASH',
        orders: []
      }
    ];

    defaultSeeded.forEach(sc => {
      if (!customerMap.has(sc.phone)) {
        customerMap.set(sc.phone, sc);
      }
    });

    manualCustomers.forEach(mc => {
      customerMap.set(mc.phone, mc);
    });

    return Array.from(customerMap.values());
  }, [orders, manualCustomers]);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  // Filtered products
  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
      return false;
    }
    if (!productSearch) return true;
    const term = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.nameBn.includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  // Filtered customers
  const filteredCustomers = customerList.filter(c => {
    const term = customerSearch.toLowerCase().trim();
    const matchSearch =
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.district.toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (customerFilter === 'vip') return c.tag === 'VIP' || c.totalSpent >= 5000;
    if (customerFilter === 'repeat') return c.totalOrders >= 2;
    if (customerFilter === 'new') return c.tag === 'New' || c.totalOrders === 1;

    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeNameBn,
      tagline: storeTagline,
      phone: storePhone,
      email: storeEmail,
      address: storeAddress,
      shippingDhakaMetro: Number(insideDhakaFee),
      shippingOutsideDhaka: Number(outsideDhakaFee),
      freeShippingThreshold: Number(freeShippingMin)
    });
    showToast('স্টোরের সেটিংস ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) {
      showToast('গ্রাহকের নাম ও ফোন নম্বর দিন', 'error');
      return;
    }
    const newRecord: CustomerRecord = {
      id: `cust-${Date.now()}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail || `${newCustName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      district: newCustDistrict,
      thana: 'সদর',
      address: newCustAddress || `${newCustDistrict}, বাংলাদেশ`,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: 'আজ যুক্ত হয়েছেন',
      tag: 'New',
      preferredPayment: 'COD',
      orders: []
    };
    setManualCustomers(prev => [newRecord, ...prev]);
    setIsAddCustomerModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
    showToast('নতুন কাস্টমার সফলভাবে তালিকায় যোগ করা হয়েছে!', 'success');
  };

  const exportOrdersCSV = () => {
    const headers = ['Order Number,Customer Name,Phone,Address,Items,Total BDT,Payment Method,Status,Courier,Date'];
    const rows = orders.map(o => {
      const itemsStr = o.items.map(i => `${i.product.nameBn} x${i.quantity}`).join('; ');
      return `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.address}, ${o.district}","${itemsStr}",${o.total},"${o.paymentMethod}","${o.status}","${o.courier} - ${o.trackingNumber || ''}","${o.createdAt}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lotus_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('অর্ডার ডাটা CSV ফরম্যাটে এক্সপোর্ট করা হয়েছে!', 'success');
  };

  const exportCustomersCSV = () => {
    const headers = ['Customer Name,Phone,Email,District,Total Orders,Total Spent BDT,Tag,Last Order'];
    const rows = customerList.map(c => {
      return `"${c.name}","${c.phone}","${c.email}","${c.district}",${c.totalOrders},${c.totalSpent},"${c.tag}","${c.lastOrderDate}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lotus_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('কাস্টমার ডাটা CSV ফরম্যাটে এক্সপোর্ট করা হয়েছে!', 'success');
  };

  const currentUsername = adminUser?.username || 'lotusshopbd';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top Super Admin Navigation Bar */}
      <header className="bg-gray-900 text-white sticky top-0 z-30 shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left Brand & Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center text-left cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Logo size="sm" inverted={true} />
            </button>
            <div className="hidden sm:block pl-2 border-l border-gray-800">
              <span className="text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/60 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Super Admin Panel v2.5
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-gray-800 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ঢাকা সার্ভার: {new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka' })}</span>
            </div>
          </div>

          {/* Right Action buttons & Profile */}
          <div className="flex items-center gap-3">
            {/* Appearance Settings Quick Shortcut */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setSettingsSubTab('appearance');
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-700/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="লোগো ও অ্যাপিয়ারেন্স পরিবর্তন করুন"
            >
              <span className="material-symbols-outlined text-sm text-amber-400">palette</span>
              <span>লোগো ও অ্যাপিয়ারেন্স</span>
            </button>

            {/* Hostinger Guide Button */}
            <button
              onClick={() => setIsHostingerGuideOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-violet-900/60 hover:bg-violet-800 text-violet-200 border border-violet-700/50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Hostinger হোস্টিং ডিপ্লয়মেন্ট গাইড"
            >
              <span className="material-symbols-outlined text-sm text-violet-400">cloud_upload</span>
              <span>Hostinger ডিপ্লয়</span>
            </button>

            {/* View Live Store */}
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-rose-400">visibility</span>
              <span className="hidden sm:inline">লাইভ শপ দেখুন</span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white text-xs border border-white/20">
                {currentUsername.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-bold text-gray-200 block leading-none">{currentUsername}</span>
                <span className="text-[10px] text-gray-400">Super Admin</span>
              </div>
              <button
                onClick={logoutAdmin}
                className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-800 ml-1 transition-colors cursor-pointer"
                title="লগআউট"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 MAIN REQUESTED TABS: Dashboard, Product, Orders, Customer, Settings */}
        <div className="bg-gray-950 px-4 sm:px-6 lg:px-8 border-t border-gray-800/60 overflow-x-auto shadow-inner">
          <div className="max-w-7xl mx-auto flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', bangla: 'ড্যাশবোর্ড', icon: 'dashboard', badge: null },
              { id: 'products', label: 'Product', bangla: 'পণ্যসমূহ', icon: 'inventory_2', badge: products.length },
              { id: 'orders', label: 'Orders', bangla: 'অর্ডারসমূহ', icon: 'shopping_bag', badge: orders.length },
              { id: 'customers', label: 'Customer', bangla: 'কাস্টমার', icon: 'group', badge: customerList.length },
              { id: 'settings', label: 'Settings', bangla: 'সেটিংস', icon: 'settings', badge: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-400 bg-gray-900/90 shadow-sm'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-900/40'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span className="font-bold">{tab.label}</span>
                <span className="text-[11px] opacity-75 font-normal">({tab.bangla})</span>
                {tab.badge !== null && (
                  <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* ============================================================== */}
        {/* TAB 1: DASHBOARD                                              */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Revenue */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    মোট বিক্রয় (Total Revenue)
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ৳{totalRevenue.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    <span>+18.4% গত সপ্তাহের চেয়ে</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    মোট অর্ডার (Total Orders)
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {totalOrdersCount} টি
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-1">
                    <span className="material-symbols-outlined text-xs">shopping_cart</span>
                    <span>সফল অর্ডারসমূহ</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">orders</span>
                </div>
              </div>

              {/* Card 3: Pending Shipments */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    ডেলিভারি বাকি (Pending Orders)
                  </span>
                  <h3 className="text-2xl font-bold text-amber-600">
                    {pendingOrdersCount} টি
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    <span>শিপমেন্ট অ্যাকশন প্রয়োজন</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">local_shipping</span>
                </div>
              </div>

              {/* Card 4: Total Customers */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    মোট গ্রাহক (Total Customers)
                  </span>
                  <h3 className="text-2xl font-bold text-rose-600">
                    {customerList.length} জন
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-1">
                    <span className="material-symbols-outlined text-xs">group</span>
                    <span>সক্রিয় ক্রেতা ডাটাবেস</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">badge</span>
                </div>
              </div>

            </div>

            {/* Quick Action Navigation Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-700">দ্রুত অ্যাকশন:</span>
                
                <button
                  onClick={() => {
                    setSelectedProductForEdit(null);
                    setIsProductEditModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>নতুন পণ্য যোগ</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-blue-600">receipt_long</span>
                  <span>অর্ডার প্রসেস</span>
                </button>

                <button
                  onClick={() => setActiveTab('customers')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-purple-600">group</span>
                  <span>কাস্টমার লিস্ট</span>
                </button>

                <button
                  onClick={exportOrdersCSV}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-600">download</span>
                  <span>অর্ডার এক্সপোর্ট (CSV)</span>
                </button>
              </div>

              <div className="text-xs text-gray-500">
                স্বয়ংক্রিয় সিস্টেম সিঙ্ক: <strong className="text-emerald-600">অনলাইন</strong>
              </div>
            </div>

            {/* Main Section Grid: Recent Orders (Left) & Sidebar Widgets (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</h3>
                    <p className="text-xs text-gray-500">গ্রাহকের লাইভ অর্ডার ও ডেলিভারি স্ট্যাটাস</p>
                  </div>

                  <div className="flex gap-1 overflow-x-auto">
                    {[
                      { id: 'all', label: 'সকল' },
                      { id: 'pending', label: 'পেন্ডিং' },
                      { id: 'processing', label: 'প্রসেসিং' },
                      { id: 'shipped', label: 'শিপড' },
                      { id: 'delivered', label: 'ডেলিভার্ড' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setOrderFilter(f.id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          orderFilter === f.id
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                      <tr>
                        <th className="py-2.5 px-4">অর্ডার #</th>
                        <th className="py-2.5 px-4">গ্রাহক ও মোবাইল</th>
                        <th className="py-2.5 px-4 text-right">মূল্য</th>
                        <th className="py-2.5 px-4">পেমেন্ট</th>
                        <th className="py-2.5 px-4">স্ট্যাটাস</th>
                        <th className="py-2.5 px-4 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.slice(0, 6).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">
                            #{order.orderNumber}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900">{order.customerName}</p>
                            <p className="text-[11px] text-gray-500 font-mono">{order.customerPhone}</p>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-rose-700">
                            ৳{order.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="uppercase font-semibold text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status === 'delivered' ? 'ডেলিভার্ড' :
                               order.status === 'shipped' ? 'শিপড' :
                               order.status === 'processing' ? 'প্রসেসিং' :
                               order.status === 'cancelled' ? 'বাতিল' : 'পেন্ডিং'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setActiveOrder(order)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              ইনভয়েস
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>সকল অর্ডার তালিকা দেখুন ({orders.length} টি)</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Right 1 Col: Widgets */}
              <div className="space-y-6">
                {/* Courier Breakdown Widget */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-600 text-base">local_shipping</span>
                      কুরিয়ার ডেলিভারি ব্রেকডাউন
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      API LIVE
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-gray-700 mb-1">
                        <span>Steadfast Express</span>
                        <span>62%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-rose-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-gray-700 mb-1">
                        <span>Pathao Courier</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-gray-700 mb-1">
                        <span>RedX Delivery</span>
                        <span>10%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low Stock Alert List */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-rose-600 text-base">warning</span>
                      কম স্টক সতর্কতা (Low Stock)
                    </h4>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                      {lowStockCount} টি
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {products.filter(p => p.stock <= 10).slice(0, 3).map(p => (
                      <div key={p.id} className="py-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img src={p.thumbnail || p.images[0]} alt="" className="w-8 h-8 rounded object-cover border border-gray-200" />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{p.nameBn}</p>
                            <span className="text-[11px] text-rose-600 font-bold font-mono">
                              মাত্র {p.stock} টি অবশিষ্ট
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProductForEdit(p);
                            setIsProductEditModalOpen(true);
                          }}
                          className="px-2 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 rounded text-[11px] font-bold text-gray-700 transition-colors cursor-pointer"
                        >
                          রিস্টক
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRODUCT                                                */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base">Product Management (পণ্য ব্যবস্থাপনা)</h3>
                      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        মোট {products.length}টি পণ্য
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">স্টোরে নতুন পণ্য যোগ করুন, দাম ও স্টক পরিবর্তন করুন অথবা ডিলিট করুন</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Category Filter */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 max-w-[190px] truncate"
                >
                  <option value="all">সকল ক্যাটেগরি ({products.length})</option>
                  {categories.map((c) => {
                    const count = products.filter(p => p.category?.toLowerCase() === c.name.toLowerCase()).length;
                    return (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name} {c.nameBn && c.nameBn !== c.name ? `(${c.nameBn})` : ''} ({count})
                      </option>
                    );
                  })}
                </select>

                {/* Search Bar */}
                <div className="relative">
                  <span className="material-symbols-outlined text-gray-400 text-base absolute left-3 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="পণ্য বা SKU সার্চ..."
                    className="pl-9 pr-7 py-2 border border-gray-300 rounded-xl text-xs w-44 sm:w-52 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                {/* Category Management Button */}
                <button
                  onClick={() => setIsCategoryManagerOpen(true)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:border-rose-300"
                  title="ক্যাটেগরি যোগ, সম্পাদনা ও ম্যানেজমেন্ট"
                >
                  <span className="material-symbols-outlined text-base text-rose-600">category</span>
                  <span>ক্যাটেগরি সমূহ ({categories.length})</span>
                </button>

                {/* Primary Add Product Button */}
                <button
                  onClick={() => {
                    setSelectedProductForEdit(null);
                    setIsProductEditModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-rose-600/30 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  <span>নতুন পণ্য যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">পণ্য ও ছবি</th>
                      <th className="py-3.5 px-4">ক্যাটেগরি</th>
                      <th className="py-3.5 px-4">এসকেইউ (SKU)</th>
                      <th className="py-3.5 px-4 text-right">বিক্রয় মূল্য</th>
                      <th className="py-3.5 px-4 text-right">রেগুলার মূল্য</th>
                      <th className="py-3.5 px-4 text-center">স্টক</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                      <th className="py-3.5 px-4 text-center">অ্যাকশন (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.thumbnail || p.images[0]}
                              alt=""
                              className="w-11 h-11 object-cover rounded-xl border border-gray-200 shrink-0 shadow-2xs"
                            />
                            <div>
                              <p className="font-bold text-gray-900 text-xs">{p.nameBn}</p>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{p.name}</p>
                              {p.badge && (
                                <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                  {p.badgeBn || p.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-medium">
                          {p.category}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-700 font-bold">
                          {p.sku}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-rose-700 text-sm">
                          ৳{p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-400 line-through">
                          ৳{p.regularPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold font-mono px-2.5 py-1 rounded-lg text-xs ${
                            p.stock <= 5 ? 'bg-red-100 text-red-700 border border-red-200' :
                            p.stock <= 15 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {p.stock} টি
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {p.stock > 0 ? 'ইন স্টক' : 'স্টক শেষ'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setSelectedProductForEdit(p);
                                setIsProductEditModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="পণ্য সম্পাদনা করুন"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              <span>এডিট</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="পণ্য ডিলিট করুন"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              <span>ডিলিট</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-3xl">inventory_2</span>
                  </div>
                  <h4 className="text-gray-900 font-bold text-sm">কোনো পণ্য পাওয়া যায়নি</h4>
                  <p className="text-gray-500 text-xs mt-1">সার্চ ফিল্টার পরিবর্তন করুন অথবা নতুন পণ্য যুক্ত করুন</p>
                  <button
                    onClick={() => {
                      setSelectedProductForEdit(null);
                      setIsProductEditModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    <span>নতুন পণ্য যোগ করুন</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ORDERS                                                 */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Orders Management (অর্ডার ব্যবস্থাপনা)</h3>
                <p className="text-xs text-gray-500">সকল অর্ডারের চালান প্রিন্ট, প্যাকিং স্লিপ এবং কুরিয়ারে বুকিং</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportOrdersCSV}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">file_download</span>
                  <span>এক্সেল / CSV এক্সপোর্ট</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as (string)[]).map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        orderFilter === st
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st === 'all' ? 'সকল অর্ডার' :
                       st === 'pending' ? 'পেন্ডিং' :
                       st === 'processing' ? 'প্রসেসিং' :
                       st === 'shipped' ? 'শিপড' :
                       st === 'delivered' ? 'ডেলিভার্ড' : 'বাতিল'}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  মোট ফিল্টার্ড: {filteredOrders.length} টি অর্ডার
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold">
                    <tr>
                      <th className="py-3 px-4">অর্ডার নং</th>
                      <th className="py-3 px-4">গ্রাহক ও মোবাইল</th>
                      <th className="py-3 px-4">ঠিকানা</th>
                      <th className="py-3 px-4">আইটেমস</th>
                      <th className="py-3 px-4 text-right">মোট টাকা</th>
                      <th className="py-3 px-4">পেমেন্ট</th>
                      <th className="py-3 px-4">কুরিয়ার</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                          <p className="text-[11px] text-gray-500 font-mono">{order.customerPhone}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                          {order.thana}, {order.district}
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-semibold">
                          {order.items.length} টি পণ্য
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-rose-700">
                          ৳{order.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase font-semibold text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-mono text-gray-600 uppercase">
                            {order.courier}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-semibold rounded border border-gray-300 py-1 px-2 bg-white cursor-pointer"
                          >
                            <option value="pending">পেন্ডিং</option>
                            <option value="processing">প্রসেসিং</option>
                            <option value="shipped">শিপড</option>
                            <option value="delivered">ডেলিভার্ড</option>
                            <option value="cancelled">বাতিল</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setActiveOrder(order)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            বিস্তারিত ও প্রিন্ট
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CUSTOMER (Dedicated New Rich Tab)                       */}
        {/* ============================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            
            {/* Header with Title & Add Customer Button */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-600 text-2xl">group</span>
                  <h3 className="font-bold text-gray-900 text-base">Customer Directory (কাস্টমার ও গ্রাহক তালিকা)</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  নিবন্ধিত ও অর্ডারিং কাস্টমারদের প্রোফাইল, মোট ক্রয়, ঠিকানা এবং ফোন নম্বর ডাটাবেস
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportCustomersCSV}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-emerald-600">download</span>
                  <span>কাস্টমার লিস্ট এক্সপোর্ট</span>
                </button>

                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>নতুন কাস্টমার যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Customer Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">মোট কাস্টমার</span>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xl font-bold text-gray-900">{customerList.length} জন</h4>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">সক্রিয়</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">ভিআইপি ক্রেতা (৳৫,০০০+)</span>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xl font-bold text-purple-700">
                    {customerList.filter(c => c.tag === 'VIP').length} জন
                  </h4>
                  <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">High Value</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">রিপিট ক্রেতা (২+ অর্ডার)</span>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xl font-bold text-blue-700">
                    {customerList.filter(c => c.totalOrders >= 2).length} জন
                  </h4>
                  <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full">লয়াল বায়ার</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">নতুন গ্রাহক</span>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xl font-bold text-rose-700">
                    {customerList.filter(c => c.totalOrders <= 1).length} জন
                  </h4>
                  <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">নতুন সংযোগ</span>
                </div>
              </div>
            </div>

            {/* Customer Filter and Search Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'সকল কাস্টমার' },
                  { id: 'vip', label: 'ভিআইপি (VIP)' },
                  { id: 'repeat', label: 'রিপিট ক্রেতা' },
                  { id: 'new', label: 'নতুন ক্রেতা' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setCustomerFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customerFilter === f.id
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="material-symbols-outlined text-gray-400 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  search
                </span>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="নাম, মোবাইল বা জেলা খুঁজুন..."
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs w-64 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold">
                    <tr>
                      <th className="py-3 px-4">গ্রাহকের নাম ও ইমেইল</th>
                      <th className="py-3 px-4">মোবাইল নম্বর</th>
                      <th className="py-3 px-4">জেলা ও ঠিকানা</th>
                      <th className="py-3 px-4 text-center">মোট অর্ডার</th>
                      <th className="py-3 px-4 text-right">সর্বমোট ক্রয় (BDT)</th>
                      <th className="py-3 px-4">কাস্টমার ট্যাগ</th>
                      <th className="py-3 px-4">পেমেন্ট পছন্দ</th>
                      <th className="py-3 px-4 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {cust.name.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{cust.name}</p>
                              <p className="text-[11px] text-gray-500">{cust.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`tel:${cust.phone}`}
                            className="font-mono text-gray-800 hover:text-rose-600 font-bold flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs text-rose-500">call</span>
                            {cust.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                          <span className="font-semibold text-gray-800">{cust.district}</span> - {cust.address}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gray-900">
                          {cust.totalOrders} টি
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-rose-700">
                          ৳{cust.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cust.tag === 'VIP' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            cust.tag === 'Regular' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {cust.tag === 'VIP' ? '★ VIP ক্রেতা' : cust.tag === 'Regular' ? 'লয়াল ক্রেতা' : 'নতুন গ্রাহক'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono uppercase bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {cust.preferredPayment}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedCustomerForModal(cust)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold text-[11px] transition-colors cursor-pointer"
                              title="গ্রাহকের সম্পূর্ণ হিস্ট্রি দেখুন"
                            >
                              বিস্তারিত
                            </button>
                            <a
                              href={`https://wa.me/88${cust.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                              title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                            >
                              <span className="material-symbols-outlined text-base">chat</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SETTINGS                                               */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-base mb-1">Store Settings & Configurations (স্টোর সেটিংস)</h3>
              <p className="text-xs text-gray-500">ওয়েবসাইটের নাম, ডেলিভারি চার্জ, কুরিয়ার সার্ভিস API এবং পেমেন্ট গেটওয়ে কনফিগারেশন</p>
            </div>

            {/* Sub-Tabs for Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                {[
                  { id: 'appearance', label: 'Appearance Settings (লোগো ও অ্যাপিয়ারেন্স)', icon: 'palette' },
                  { id: 'branding', label: 'সাধারণ ব্র্যান্ডিং ও যোগাযোগ', icon: 'storefront' },
                  { id: 'shipping', label: 'ডেলিভারি চার্জ নির্ধারণ', icon: 'local_shipping' },
                  { id: 'courier', label: 'কুরিয়ার API (Steadfast/Pathao/RedX)', icon: 'local_post_office' },
                  { id: 'payment', label: 'পেমেন্ট গেটওয়ে (বিকাশ/নগদ/COD)', icon: 'account_balance_wallet' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSettingsSubTab(sub.id as any)}
                    className={`py-3 px-4 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      settingsSubTab === sub.id
                        ? 'border-rose-600 text-rose-700 bg-white shadow-xs'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{sub.icon}</span>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Sub Tab: Appearance Settings */}
                {settingsSubTab === 'appearance' && (
                  <div className="space-y-6 max-w-4xl">
                    {/* Appearance Settings Header Card */}
                    <div className="bg-gradient-to-br from-amber-50/80 via-white to-rose-50/50 p-6 rounded-2xl border border-amber-200/90 shadow-xs">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-2xl">palette</span>
                            <h3 className="font-extrabold text-gray-900 text-lg">Appearance Settings</h3>
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Site Logo & Branding</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            ওয়েবসাইটের লোগো আপলোড, পরিবর্তন (Replace) বা ডিলিট করুন। নতুন লোগো আপলোড করলে সমগ্র ওয়েবসাইটের (Header, Footer, Mobile, Invoice) লোগো <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono text-[11px]">src</code> অ্যাট্রিবিউট রিয়েল-টাইমে গ্লোবালি আপডেট হয়ে যাবে।
                          </p>
                        </div>

                        <div className="shrink-0">
                          {settings.logoUrl ? (
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs border border-emerald-300 shadow-2xs">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>কাস্টম লোগো সক্রিয় (Custom Logo Active)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100 text-amber-800 rounded-full font-bold text-xs border border-amber-300 shadow-2xs">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                              <span>ডিফল্ট অফিসিয়াল লোগো সক্রিয় (/logo.svg)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Live Global Source Inspector Banner */}
                      <div className="mt-4 p-3 bg-white/90 rounded-xl border border-amber-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-gray-500 text-base shrink-0">code</span>
                          <span className="font-bold text-gray-700 shrink-0">Global Image Src:</span>
                          <code className="bg-gray-100 text-rose-600 font-mono text-[11px] px-2 py-0.5 rounded border border-gray-200 truncate max-w-md">
                            {settings.logoUrl || '/logo.svg'}
                          </code>
                        </div>
                        <span className="text-[11px] text-emerald-700 font-bold shrink-0 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">sync</span>
                          গ্লোবাল বাইন্ডিং সক্রিয়
                        </span>
                      </div>

                      {/* Interactive Drag-and-Drop & Upload / Replace Zone */}
                      <div className="mt-5">
                        <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={handleLogoFileUpload}
                          accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                          className="hidden"
                          id="admin-logo-upload-input"
                        />

                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                          onDragLeave={() => setIsDraggingLogo(false)}
                          onDrop={handleLogoDrop}
                          onClick={() => logoFileInputRef.current?.click()}
                          className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
                            isDraggingLogo
                              ? 'border-rose-500 bg-rose-50/70 scale-[1.01]'
                              : 'border-amber-300 hover:border-amber-400 bg-white/70 hover:bg-amber-50/30'
                          }`}
                        >
                          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md mb-3">
                            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {settings.logoUrl ? 'নতুন লোগো দিয়ে প্রতিস্থাপন (Replace Logo) করুন' : 'ওয়েবসাইটের নতুন লোগো আপলোড করুন'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            আপনার ইমেজ ফাইলটি এখানে ড্র্যাগ করে এনে ছেড়ে দিন অথবা ব্রাউজ করতে ক্লিক করুন
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 font-mono">
                            সাপোর্টেড ফরম্যাট: PNG (স্বচ্ছ ব্যাকগ্রাউন্ড সবচেয়ে ভালো), SVG, JPG, WebP | সর্বোচ্চ ৫ MB
                          </p>
                          
                          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-lg font-bold text-xs shadow-xs hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-sm">folder_open</span>
                            <span>{settings.logoUrl ? 'লোগো পরিবর্তন বা রিপ্লেস করুন' : 'ফাইল ব্রাউজ করুন'}</span>
                          </div>
                        </div>

                        {/* URL Input & Quick Actions Bar */}
                        <div className="mt-4 pt-4 border-t border-amber-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                          {/* Image URL Direct Input */}
                          <div className="flex-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-base shrink-0">link</span>
                            <input
                              type="url"
                              placeholder="অথবা সরাসরি Image URL পেস্ট করুন (e.g. https://...)..."
                              value={customLogoInputUrl}
                              onChange={(e) => setCustomLogoInputUrl(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-xs w-full focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleApplyLogoUrl}
                              className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
                            >
                              URL প্রয়োগ করুন
                            </button>
                          </div>

                          {/* Delete / Reset Button */}
                          {settings.logoUrl && (
                            <button
                              type="button"
                              onClick={handleDeleteLogo}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
                              title="কাস্টম লোগো মুছে ফেলে মূল অফিসিয়াল লোটাস লোগোতে রিসেট করুন"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                              <span>লোগো ডিলিট করুন (ডিফল্ট রিসেট)</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Logo Height / Sizing Controls */}
                      <div className="mt-5 pt-4 border-t border-amber-100 bg-white/60 p-4 rounded-xl border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-amber-600">aspect_ratio</span>
                            <span>লোগোর ডিসপ্লে সাইজ (Logo Display Height):</span>
                            <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                              {settings.logoHeight || 80}px
                            </span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            {[
                              { label: 'Small', h: 56 },
                              { label: 'Standard', h: 80 },
                              { label: 'Large', h: 104 },
                              { label: 'XL', h: 128 }
                            ].map((preset) => (
                              <button
                                key={preset.h}
                                type="button"
                                onClick={() => handleSetLogoHeight(preset.h)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                                  (settings.logoHeight || 80) === preset.h
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="range"
                          min="40"
                          max="140"
                          step="2"
                          value={settings.logoHeight || 80}
                          onChange={(e) => handleSetLogoHeight(Number(e.target.value))}
                          className="w-full accent-amber-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                          <span>40px (কমপ্যাক্ট)</span>
                          <span>80px (স্ট্যান্ডার্ড)</span>
                          <span>140px (লার্জ)</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Multi-Theme & Multi-Device Previews Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-rose-600 text-lg">preview</span>
                          <span>লাইভ প্রিভিউ (Global Real-time Previews across Storefront)</span>
                        </h4>
                        <span className="text-[11px] text-gray-500">সমস্ত ভিউতে একই লোগো src কাজ করছে</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. Light Header Navbar Preview */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">desktop_windows</span>
                              হেডার ডিসপ্লে (Light Header Navbar)
                            </span>
                            <span className="text-gray-400 font-mono">BG: #FFFFFF</span>
                          </div>
                          
                          {/* Simulated Storefront Header */}
                          <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-2xs">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Logo size="md" />
                              </div>
                              <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-500">
                                <span className="hover:text-rose-600 cursor-pointer">নতুন কালেকশন</span>
                                <span className="hover:text-rose-600 cursor-pointer">থ্রি পিস</span>
                                <span className="hover:text-rose-600 cursor-pointer">শাড়ি</span>
                              </div>
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                                <span className="material-symbols-outlined text-xs">shopping_bag</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-gray-400 font-mono flex items-center justify-between">
                            <span>Tag: &lt;img data-logo-image="site-logo"&gt;</span>
                            <span className="text-emerald-600 font-bold">Live Synced</span>
                          </div>
                        </div>

                        {/* 2. Dark Footer Preview */}
                        <div className="bg-[#111111] p-4 rounded-xl border border-neutral-800 shadow-2xs text-white">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">dark_mode</span>
                              ফুটার ডিসপ্লে (Dark Footer Theme)
                            </span>
                            <span className="text-neutral-500 font-mono">BG: #111111</span>
                          </div>
                          
                          {/* Simulated Footer Area */}
                          <div className="rounded-lg border border-neutral-800 bg-[#1c1917] p-2.5">
                            <div className="flex items-center justify-between gap-3">
                              <Logo size="md" inverted={true} />
                              <div className="text-[10px] text-neutral-400 text-right">
                                <p className="font-bold text-white">Lotus Clothing Brand</p>
                                <p className="text-[9px] text-neutral-500">We Trust In Quality</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                            <span>Inverted filter applied for dark background</span>
                            <span className="text-emerald-400 font-bold">Live Synced</span>
                          </div>
                        </div>

                        {/* 3. Mobile Device Navbar Preview */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-2xs">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">smartphone</span>
                              মোবাইল ভিউ ডিসপ্লে (Mobile Top Bar)
                            </span>
                            <span className="text-gray-400 font-mono">Screen: ~375px</span>
                          </div>

                          <div className="max-w-xs mx-auto bg-white rounded-xl border border-gray-300 p-2 shadow-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="material-symbols-outlined text-gray-700 text-lg">menu</span>
                              <Logo size="sm" />
                              <span className="material-symbols-outlined text-gray-700 text-lg">shopping_cart</span>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-gray-400 font-mono text-center">
                            মোবাইলেও স্বয়ংক্রিয়ভাবে পারফেক্ট সাইজে ফিট হয়
                          </div>
                        </div>

                        {/* 4. Order Invoice Preview */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">receipt_long</span>
                              ইনভয়েস ও ক্যাশ মেমো (Print Invoice Display)
                            </span>
                            <span className="text-gray-400 font-mono">Invoice Header</span>
                          </div>

                          <div className="p-3 bg-amber-50/20 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Logo size="sm" />
                                <div>
                                  <p className="font-extrabold text-[11px] text-gray-900">LOTUS SHOP BD</p>
                                  <p className="text-[9px] text-gray-500">ট্যাক্স ইনভয়েস ও ক্যাশ মেমো</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                                #INV-2026-001
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-gray-400 font-mono text-center">
                            কাস্টমার ইনভয়েস প্রিন্ট করার সময় এই লোগোই প্রিন্ট হবে
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Home Screen Hero Banner Management Card */}
                    <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 p-6 rounded-2xl border border-amber-200/90 shadow-xs mt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-2xl">view_carousel</span>
                            <h3 className="font-extrabold text-gray-900 text-base">হোম স্ক্রিন হিরো ব্যানার (Home Hero Banner)</h3>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              Homepage Top Banner
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            হোমপেজের প্রধান হিরো ব্যানার পরিবর্তন করতে এখান থেকে আপনার ব্যানার ইমেজ (যেমন: আপনার দেওয়া স্ক্রিনশট বা ব্যানার ডিজাইন) আপলোড করুন বা ইমেজ URL প্রদান করুন।
                          </p>
                        </div>

                        <div className="shrink-0">
                          {settings.heroBannerUrl ? (
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs border border-emerald-300 shadow-2xs">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>কাস্টম ব্যানার সক্রিয়</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100 text-amber-800 rounded-full font-bold text-xs border border-amber-300 shadow-2xs">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                              <span>ডিফল্ট অফিসিয়াল ব্যানার সক্রিয় (Fashion &amp; Lifestyle)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Banner Current Preview */}
                      <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>বর্তমানে হোম স্ক্রিনে সক্রিয় ব্যানার প্রিভিউ</span>
                          <span className="text-emerald-700 font-bold text-[11px]">লাইভ প্রিভিউ</span>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-h-56 flex items-center justify-center">
                          {settings.heroBannerUrl ? (
                            <img
                              src={settings.heroBannerUrl}
                              alt="Active Home Banner"
                              className="w-full h-auto max-h-56 object-cover object-center"
                            />
                          ) : (
                            <div className="p-6 text-center text-xs text-gray-600 space-y-1">
                              <p className="font-bold text-gray-800">অফিসিয়াল লোটাস ফ্যাশন &amp; লাইফস্টাইল ব্যানার সক্রিয়</p>
                              <p className="text-[11px] text-gray-500">
                                মডেল (হলুদ কুর্তি) + LOTUS SHOP BD + Fashion &amp; Lifestyle For Everyone + এক ছাদের নিচে সবকিছু
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Banner Upload Zone */}
                      <div className="mt-4">
                        <input
                          type="file"
                          ref={bannerFileInputRef}
                          onChange={handleBannerFileUpload}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                          id="admin-banner-upload-input"
                        />

                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingBanner(true); }}
                          onDragLeave={() => setIsDraggingBanner(false)}
                          onDrop={handleBannerDrop}
                          onClick={() => bannerFileInputRef.current?.click()}
                          className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
                            isDraggingBanner
                              ? 'border-amber-500 bg-amber-50/70 scale-[1.01]'
                              : 'border-amber-300 hover:border-amber-400 bg-white/70 hover:bg-amber-50/30'
                          }`}
                        >
                          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md mb-2">
                            <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {settings.heroBannerUrl ? 'হোম ব্যানার পরিবর্তন বা রিপ্লেস (Replace Banner) করুন' : 'হোম স্ক্রিন নতুন ব্যানার ইমেজ আপলোড করুন'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            আপনার ব্যানার ছবি বা স্ক্রিনশট ফাইলটি টেনে এনে এখানে ছাড়ুন অথবা ক্লিক করে আপলোড করুন
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 font-mono">
                            সাপোর্টেড ফরম্যাট: PNG, JPG, WebP | সর্বোচ্চ ৮ MB
                          </p>
                          
                          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-bold text-xs shadow-xs hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-sm">folder_open</span>
                            <span>{settings.heroBannerUrl ? 'ব্যানার ফাইল পরিবর্তন করুন' : 'ব্যানার ইমেজ ব্রাউজ করুন'}</span>
                          </div>
                        </div>

                        {/* Banner URL Input & Delete Actions */}
                        <div className="mt-4 pt-4 border-t border-amber-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-base shrink-0">link</span>
                            <input
                              type="url"
                              placeholder="অথবা ব্যানার Image URL পেস্ট করুন..."
                              value={customBannerInputUrl}
                              onChange={(e) => setCustomBannerInputUrl(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-xs w-full focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleApplyBannerUrl}
                              className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
                            >
                              ব্যানার সেট করুন
                            </button>
                          </div>

                          {settings.heroBannerUrl && (
                            <button
                              type="button"
                              onClick={handleDeleteBanner}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
                              title="কাস্টম ব্যানার মুছে ফেলে মূল ব্যানারে রিসেট করুন"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                              <span>ব্যানার ডিলিট (ডিফল্ট রিসেট)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab: Branding */}
                {settingsSubTab === 'branding' && (
                  <div className="space-y-6 max-w-3xl">
                    {/* Notice pointing to Appearance Settings */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-amber-600 text-xl">palette</span>
                        <div>
                          <p className="font-bold text-gray-900">লোগো পরিবর্তন করতে চান?</p>
                          <p className="text-gray-600 text-[11px]">ওয়েবসাইটের লোগো আপলোড, রিপ্লেস ও সাইজ নিয়ন্ত্রণের জন্য Appearance Settings ট্যাবে যান।</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettingsSubTab('appearance')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
                      >
                        Appearance Settings খুলুন
                      </button>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">ওয়েবসাইটের নাম (English):</label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">ওয়েবসাইটের নাম (বাংলা):</label>
                        <input
                          type="text"
                          value={storeNameBn}
                          onChange={(e) => setStoreNameBn(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">স্লোগান (Tagline):</label>
                      <input
                        type="text"
                        value={storeTagline}
                        onChange={(e) => setStoreTagline(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">হেল্পলাইন ফোন নম্বর:</label>
                        <input
                          type="text"
                          value={storePhone}
                          onChange={(e) => setStorePhone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">অফিসিয়াল ইমেইল:</label>
                        <input
                          type="email"
                          value={storeEmail}
                          onChange={(e) => setStoreEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">অফিসের ঠিকানা:</label>
                      <textarea
                        rows={2}
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>ব্র্যান্ডিং সংরক্ষণ করুন</span>
                    </button>
                    </form>
                  </div>
                )}

                {/* Sub Tab: Shipping */}
                {settingsSubTab === 'shipping' && (
                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl text-xs">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                        ডেলিভারি চার্জ নির্ধারণ (BDT)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-gray-600 font-bold mb-1">ঢাকা সিটি ভেতরে (৳):</label>
                          <input
                            type="number"
                            value={insideDhakaFee}
                            onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-bold bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 font-bold mb-1">ঢাকার বাইরে (৳):</label>
                          <input
                            type="number"
                            value={outsideDhakaFee}
                            onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-bold bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 font-bold mb-1">ফ্রি ডেলিভারি সীমা (৳):</label>
                          <input
                            type="number"
                            value={freeShippingMin}
                            onChange={(e) => setFreeShippingMin(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-bold bg-white"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>ডেলিভারি চার্জ সংরক্ষণ করুন</span>
                    </button>
                  </form>
                )}

                {/* Sub Tab: Courier */}
                {settingsSubTab === 'courier' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Steadfast */}
                    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">Steadfast Courier</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">সক্রিয়</span>
                      </div>
                      <div className="text-xs space-y-2">
                        <label className="block font-bold text-gray-600">API Key:</label>
                        <input type="text" defaultValue="sf_live_sec_849204928" className="w-full p-2 border border-gray-300 rounded font-mono text-[11px] bg-gray-50" />
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Steadfast API টেস্ট সফল!', 'success')}
                        className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold cursor-pointer"
                      >
                        টেস্ট সিঙ্ক
                      </button>
                    </div>

                    {/* Pathao */}
                    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">Pathao Courier</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">সক্রিয়</span>
                      </div>
                      <div className="text-xs space-y-2">
                        <label className="block font-bold text-gray-600">Store ID:</label>
                        <input type="text" defaultValue="84920" className="w-full p-2 border border-gray-300 rounded font-mono text-[11px] bg-gray-50" />
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Pathao API টেস্ট সফল!', 'success')}
                        className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold cursor-pointer"
                      >
                        টেস্ট সিঙ্ক
                      </button>
                    </div>

                    {/* RedX */}
                    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">RedX Logistics</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">সক্রিয়</span>
                      </div>
                      <div className="text-xs space-y-2">
                        <label className="block font-bold text-gray-600">Pickup Hub:</label>
                        <input type="text" defaultValue="Dhaka Dhanmondi Hub" className="w-full p-2 border border-gray-300 rounded text-[11px] bg-gray-50" />
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('RedX API টেস্ট সফল!', 'success')}
                        className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold cursor-pointer"
                      >
                        টেস্ট সিঙ্ক
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub Tab: Payment */}
                {settingsSubTab === 'payment' && (
                  <div className="space-y-6 max-w-4xl text-xs">
                    {/* Bank Payment Gateway Configuration Card (Requested Feature) */}
                    <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 rounded-2xl border border-emerald-200/90 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
                            <span className="material-symbols-outlined text-lg">account_balance</span>
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-gray-900 text-sm">
                                ব্যাংক পেমেন্ট গেটওয়ে (Direct Bank Transfer / Deposit)
                              </h4>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full uppercase">
                                নতুন যুক্ত
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              গ্রাহকদের জন্য চেকআউট পেজে সরাসরি ব্যাংক ডিপোজিট বা অনলাইন ফান্ড ট্রান্সফার (BEFTN/NPSB) অপশন সক্রিয় করুন।
                            </p>
                          </div>
                        </div>

                        {/* Enable/Disable Toggle */}
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <span className="text-xs font-bold text-gray-700">গেটওয়ে স্ট্যাটাস:</span>
                          <input
                            type="checkbox"
                            checked={paymentBankEnabled}
                            onChange={(e) => {
                              setPaymentBankEnabled(e.target.checked);
                              updateSettings({ paymentBankEnabled: e.target.checked });
                              showToast(
                                e.target.checked
                                  ? 'ব্যাংক পেমেন্ট গেটওয়ে সক্রিয় করা হয়েছে!'
                                  : 'ব্যাংক পেমেন্ট সাময়িক বন্ধ করা হয়েছে',
                                'info'
                              );
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                          <span className={`text-xs font-bold ${paymentBankEnabled ? 'text-emerald-700' : 'text-gray-400'}`}>
                            {paymentBankEnabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Off)'}
                          </span>
                        </label>
                      </div>

                      {/* Bank Details Form */}
                      <form onSubmit={handleSaveBankSettings} className="mt-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">ব্যাংকের নাম (Bank Name):</label>
                            <input
                              type="text"
                              required
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="e.g. Dutch-Bangla Bank PLC (DBBL)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">একাউন্টের নাম (Account Holder Name):</label>
                            <input
                              type="text"
                              required
                              value={bankAccountName}
                              onChange={(e) => setBankAccountName(e.target.value)}
                              placeholder="e.g. LOTUS SHOP BD"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">একাউন্ট নম্বর (Account Number):</label>
                            <input
                              type="text"
                              required
                              value={bankAccountNumber}
                              onChange={(e) => setBankAccountNumber(e.target.value)}
                              placeholder="e.g. 115.120.0098765"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-mono font-bold text-emerald-800"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">শাখার নাম (Branch Name):</label>
                            <input
                              type="text"
                              required
                              value={bankBranchName}
                              onChange={(e) => setBankBranchName(e.target.value)}
                              placeholder="e.g. Mirpur-10 Branch, Dhaka"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">রাউটিং নম্বর (Routing Number):</label>
                            <input
                              type="text"
                              required
                              value={bankRoutingNumber}
                              onChange={(e) => setBankRoutingNumber(e.target.value)}
                              placeholder="e.g. 090273841"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            গ্রাহকদের জন্য ডিপোজিট ও পেমেন্ট নির্দেশিকা (Payment Instructions):
                          </label>
                          <textarea
                            rows={2}
                            value={bankPaymentInstructions}
                            onChange={(e) => setBankPaymentInstructions(e.target.value)}
                            placeholder="গ্রাহক কীভাবে পেমেন্ট করবেন ও রেফারেন্স নম্বর দেবেন..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white text-xs leading-relaxed"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-gray-500">
                            সেভ করার সাথে সাথে চেকআউট পেজের ব্যাংক একাউন্ট বিবরণ আপডেট হয়ে যাবে।
                          </span>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">save</span>
                            <span>ব্যাংক সেটিংস সেভ করুন</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Other Gateways Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* bKash */}
                      <div className="border border-pink-200 bg-pink-50/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                            bKash Merchant PGW
                          </span>
                          <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <p className="text-xs text-gray-500">বিকাশ অনলাইন পেমেন্ট এপিআই সক্রিয় (+8801834355700)</p>
                      </div>

                      {/* Nagad */}
                      <div className="border border-orange-200 bg-orange-50/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                            Nagad Payment Gateway
                          </span>
                          <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <p className="text-xs text-gray-500">নগদ সরাসরি মার্চেন্ট পেমেন্ট সক্রিয়</p>
                      </div>

                      {/* COD */}
                      <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            ক্যাশ অন ডেলিভারি (COD)
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">সক্রিয়</span>
                        </div>
                        <p className="text-xs text-gray-500">৬৪ জেলায় পণ্য হাতে পেয়ে টাকা পরিশোধের সুবিধা চালু আছে</p>
                      </div>

                      {/* Cards & SSLCommerz */}
                      <div className="border border-blue-200 bg-blue-50/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            Cards &amp; Internet Banking (SSLCOMMERZ)
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Ready</span>
                        </div>
                        <p className="text-xs text-gray-500">Visa, MasterCard, Rocket, এবং মোবাইল ব্যাংকিং গেটওয়ে</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Edit / Add Product Modal */}
      <AdminProductEditModal
        product={selectedProductForEdit}
        isOpen={isProductEditModalOpen}
        onClose={() => {
          setIsProductEditModalOpen(false);
          setSelectedProductForEdit(null);
        }}
      />

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-2xl text-white">delete_forever</span>
                <h3 className="font-bold text-base tracking-wide">পণ্য ডিলিট নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3.5 p-3.5 bg-red-50/70 rounded-xl border border-red-100">
                <img
                  src={productToDelete.thumbnail || productToDelete.images[0]}
                  alt=""
                  className="w-14 h-14 object-cover rounded-xl border border-red-200 shrink-0 shadow-2xs"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{productToDelete.nameBn}</h4>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {productToDelete.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-rose-700 font-data-tabular">৳{productToDelete.price.toLocaleString()}</span>
                    <span className="text-[11px] text-gray-500">• স্টক: {productToDelete.stock} টি</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">⚠️ আপনি কি নিশ্চিত?</p>
                <p>
                  <strong>&quot;{productToDelete.nameBn}&quot;</strong> পণ্যটি আপনার স্টোর ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলা হবে। ক্যাটালগ ও হোমপেজে এটি আর প্রদর্শিত হবে না।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>হ্যাঁ, ডিলিট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white px-6 py-5 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25">
                  <span className="material-symbols-outlined text-2xl">category</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide flex items-center gap-2">
                    ক্যাটেগরি ম্যানেজমেন্ট ও নতুন ক্যাটেগরি যোগ
                    <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded-full border border-white/30">
                      {categories.length}টি ক্যাটেগরি
                    </span>
                  </h3>
                  <p className="text-xs text-rose-100">
                    স্টোরের পণ্যের জন্য নতুন ক্যাটেগরি তৈরি করুন, নাম পরিবর্তন করুন অথবা ক্যাটেগরি ফিল্টার করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCategoryManagerOpen(false);
                  cancelEditCategory();
                }}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">

              {/* Add / Edit Category Form Card */}
              <div className="bg-gradient-to-br from-rose-50/60 to-amber-50/40 p-5 rounded-2xl border border-rose-100 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-xl">
                      {editingCategory ? 'edit' : 'add_circle'}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {editingCategory ? `ক্যাটেগরি সম্পাদনা: "${editingCategory.name}"` : 'নতুন ক্যাটেগরি যুক্ত করুন (Add New Category)'}
                    </h4>
                  </div>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={cancelEditCategory}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200 cursor-pointer"
                    >
                      বাতিল
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        ক্যাটেগরির ইংরেজি নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Winter Wear / Cosmetics / Shoes"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        ক্যাটেগরির বাংলা নাম (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. শীতের পোশাক / কসমেটিকস"
                        value={newCatNameBn}
                        onChange={(e) => setNewCatNameBn(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        আইকন (Icon)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                          <span className="material-symbols-outlined text-lg">{newCatIcon || 'category'}</span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. category, checkroom"
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        ছবি / ব্যানার URL (Image URL - ঐচ্ছিক)
                      </label>
                      <input
                        type="url"
                        placeholder="https://... (ছবি থাকলে হোম বাবল ও কার্ডে দেখাবে)"
                        value={newCatImage}
                        onChange={(e) => setNewCatImage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Quick Icon Selector Pills */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                      দ্রুত আইকন নির্বাচন করুন:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { icon: 'category', label: 'সাধারণ' },
                        { icon: 'checkroom', label: 'পোশাক' },
                        { icon: 'styler', label: 'থ্রি পিস' },
                        { icon: 'woman', label: 'শাড়ি' },
                        { icon: 'man', label: 'পুরুষ' },
                        { icon: 'child_care', label: 'কিডস' },
                        { icon: 'apparel', label: 'কুর্তি' },
                        { icon: 'dry_cleaning', label: 'টি-শার্ট' },
                        { icon: 'steps', label: 'জুতো' },
                        { icon: 'shopping_bag', label: 'ব্যাগ' },
                        { icon: 'diamond', label: 'গহনা' },
                        { icon: 'brush', label: 'বিউটি' },
                        { icon: 'devices', label: 'ইলেকট্রনিক্স' },
                        { icon: 'watch', label: 'ঘড়ি' },
                        { icon: 'ac_unit', label: 'শীতের' }
                      ].map((item) => (
                        <button
                          key={item.icon}
                          type="button"
                          onClick={() => setNewCatIcon(item.icon)}
                          className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                            newCatIcon === item.icon
                              ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-rose-100">
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={cancelEditCategory}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        বাতিল
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span className="material-symbols-outlined text-base">
                        {editingCategory ? 'save' : 'add_circle'}
                      </span>
                      <span>{editingCategory ? 'ক্যাটেগরি আপডেট করুন' : '+ নতুন ক্যাটেগরি সংরক্ষণ করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Categories Table & Search */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span>বিদ্যমান ক্যাটেগরি তালিকা</span>
                      <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        মোট {categories.length}টি
                      </span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      যেকোনো ক্যাটেগরি এডিট, ডিলিট বা ক্লিক করে সংশ্লিষ্ট পণ্যগুলো ফিল্টার করতে পারেন
                    </p>
                  </div>

                  {/* Search inside categories */}
                  <div className="relative">
                    <span className="material-symbols-outlined text-gray-400 text-base absolute left-3 top-1/2 -translate-y-1/2">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="ক্যাটেগরি খুঁজুন..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs w-48 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    />
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories
                    .filter(c => {
                      if (!categorySearch) return true;
                      const q = categorySearch.toLowerCase();
                      return (
                        c.name.toLowerCase().includes(q) ||
                        (c.nameBn && c.nameBn.toLowerCase().includes(q))
                      );
                    })
                    .map((cat) => {
                      const count = products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                      return (
                        <div
                          key={cat.id || cat.name}
                          className="p-3.5 bg-white rounded-2xl border border-gray-200 hover:border-rose-300 transition-all shadow-xs flex flex-col justify-between group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-rose-600">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-xl">{cat.icon || 'category'}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-gray-900 text-xs truncate">{cat.name}</h5>
                              {cat.nameBn && cat.nameBn !== cat.name && (
                                <p className="text-[11px] text-gray-500 truncate">{cat.nameBn}</p>
                              )}
                              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100">
                                  {count} টি পণ্য
                                </span>
                                {cat.isPopular && (
                                  <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-100">
                                    জনপ্রিয়
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons for Category */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setProductCategoryFilter(cat.name);
                                setIsCategoryManagerOpen(false);
                              }}
                              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="এই ক্যাটেগরির পণ্যগুলো দেখুন"
                            >
                              <span className="material-symbols-outlined text-xs">visibility</span>
                              <span>পণ্য দেখুন</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => startEditCategory(cat)}
                                className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="ক্যাটেগরি সম্পাদনা করুন"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setCategoryToDelete(cat)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="ক্যাটেগরি মুছে ফেলুন"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0 text-xs text-gray-500">
              <span>টিপস: নতুন পণ্য যোগ করার সময়ও আপনি সরাসরি নতুন ক্যাটেগরি তৈরি করতে পারবেন।</span>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryManagerOpen(false);
                  cancelEditCategory();
                }}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold cursor-pointer transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-2xl text-white">delete_forever</span>
                <h3 className="font-bold text-base tracking-wide">ক্যাটেগরি ডিলিট নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3.5 p-3.5 bg-red-50/70 rounded-xl border border-red-100">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 border border-red-200 shrink-0">
                  <span className="material-symbols-outlined text-2xl">{categoryToDelete.icon || 'category'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{categoryToDelete.name}</h4>
                  {categoryToDelete.nameBn && (
                    <p className="text-xs text-gray-500">{categoryToDelete.nameBn}</p>
                  )}
                  <div className="text-xs font-bold text-red-700 mt-1">
                    মোট {products.filter(p => p.category?.toLowerCase() === categoryToDelete.name.toLowerCase()).length} টি পণ্য রয়েছে
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">⚠️ আপনি কি নিশ্চিত?</p>
                <p>
                  <strong>&quot;{categoryToDelete.name}&quot;</strong> ক্যাটেগরি মুছে ফেলা হবে। বর্তমান পণ্যগুলো ডিলিট হবে না, তবে ক্যাটেগরি তালিকা থেকে এটি বাদ পড়বে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCategory(categoryToDelete.id);
                    setCategoryToDelete(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>হ্যাঁ, ডিলিট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-xl">person_add</span>
                <h3 className="font-bold text-sm">নতুন কাস্টমার যোগ করুন</h3>
              </div>
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="01712-345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">জেলা (District)</label>
                <select
                  value={newCustDistrict}
                  onChange={(e) => setNewCustDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                >
                  <option value="ঢাকা">ঢাকা</option>
                  <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                  <option value="রাজশাহী">রাজশাহী</option>
                  <option value="খুলনা">খুলনা</option>
                  <option value="সিলেট">সিলেট</option>
                  <option value="বরিশাল">বরিশাল</option>
                  <option value="রংপুর">রংপুর</option>
                  <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ডেলিভারি ঠিকানা</label>
                <textarea
                  rows={2}
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="বাড়ি নং, রোড নং, এলাকা..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomerForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm">
                  {selectedCustomerForModal.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedCustomerForModal.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{selectedCustomerForModal.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerForModal(null)}
                className="p-1 text-gray-400 hover:text-white rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-gray-500 font-bold block mb-0.5">মোট ক্রয়</span>
                  <span className="text-base font-bold text-rose-700">৳{selectedCustomerForModal.totalSpent.toLocaleString()}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <span className="text-gray-500 font-bold block mb-0.5">মোট অর্ডার</span>
                  <span className="text-base font-bold text-blue-700">{selectedCustomerForModal.totalOrders} টি</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <span className="text-gray-500 font-bold block mb-0.5">কাস্টমার স্ট্যাটাস</span>
                  <span className="text-xs font-bold text-purple-700">{selectedCustomerForModal.tag}</span>
                </div>
              </div>

              {/* Contact & Address */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">ইমেইল:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomerForModal.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">জেলা ও থানা:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomerForModal.thana}, {selectedCustomerForModal.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">পূর্ণ ঠিকানা:</span>
                  <span className="font-medium text-gray-900">{selectedCustomerForModal.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={`tel:${selectedCustomerForModal.phone}`}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>সরাসরি কল দিন</span>
                </a>
                <a
                  href={`https://wa.me/88${selectedCustomerForModal.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>হোয়াটসঅ্যাপ মেসেজ</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
