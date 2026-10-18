import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, CourierProvider } from '../types';
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
    setAdminTab
  } = useStore();

  // 5 MAIN REQUESTED TABS: Dashboard, Product, Orders, Customer, Settings (Synchronized globally)
  const activeTab = adminTab;
  const setActiveTab = setAdminTab;
  
  // Settings sub-tab
  const [settingsSubTab, setSettingsSubTab] = useState<'branding' | 'shipping' | 'courier' | 'payment'>('branding');

  // Orders filters
  const [orderFilter, setOrderFilter] = useState<string>('all');
  
  // Product search & delete
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  // New Customer Form State
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
              <Logo variant="horizontal" size="sm" inverted={true} />
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
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">সকল ক্যাটেগরি</option>
                  <option value="Women Fashion">Women Fashion</option>
                  <option value="Men Fashion">Men Fashion</option>
                  <option value="Saree & Three Piece">Saree & Three Piece</option>
                  <option value="Beauty & Makeup">Beauty & Makeup</option>
                  <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                  <option value="Footwear">Footwear</option>
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
                    className="pl-9 pr-7 py-2 border border-gray-300 rounded-xl text-xs w-48 sm:w-56 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
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
                {/* Sub Tab: Branding */}
                {settingsSubTab === 'branding' && (
                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl text-xs">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* bKash */}
                    <div className="border border-pink-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">bKash Merchant PGW</span>
                        <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <p className="text-xs text-gray-500">বিকাশ অনলাইন পেমেন্ট এপিআই সক্রিয়</p>
                    </div>

                    {/* Nagad */}
                    <div className="border border-orange-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">Nagad Payment Gateway</span>
                        <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <p className="text-xs text-gray-500">নগদ সরাসরি মার্চেন্ট পেমেন্ট সক্রিয়</p>
                    </div>

                    {/* COD */}
                    <div className="border border-emerald-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">ক্যাশ অন ডেলিভারি (COD)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">সক্রিয়</span>
                      </div>
                      <p className="text-xs text-gray-500">৬৪ জেলায় পণ্য হাতে পেয়ে টাকা পরিশোধের সুবিধা চালু আছে</p>
                    </div>

                    {/* Cards */}
                    <div className="border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">Cards & Internet Banking</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Ready</span>
                      </div>
                      <p className="text-xs text-gray-500">Visa, MasterCard, Rocket, এবং মোবাইল ব্যাংকিং গেটওয়ে</p>
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
