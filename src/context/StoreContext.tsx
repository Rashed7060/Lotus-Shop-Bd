import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  AdminUser,
  Review,
  OrderStatus,
  CourierProvider,
  PaymentMethod
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  settings: StoreSettings;
  activeProduct: Product | null;
  activeOrder: Order | null;
  selectedOrderForInvoice: Order | null;
  activeView: 'home' | 'product' | 'checkout' | 'order_success' | 'account' | 'track_order' | 'admin';
  language: 'bn' | 'en';
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  mustChangePassword: boolean;
  toasts: Toast[];
  isCartDrawerOpen: boolean;
  isSizeChartOpen: boolean;
  isReviewsModalOpen: boolean;
  isHostingerGuideOpen: boolean;
  isAdminLoginOpen: boolean;

  // Admin Navigation
  adminTab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';
  setAdminTab: (tab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;
  openAdminTab: (tab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;

  // Actions
  setActiveView: (view: 'home' | 'product' | 'checkout' | 'order_success' | 'account' | 'track_order' | 'admin') => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  setActiveProduct: (prod: Product | null) => void;
  setActiveOrder: (order: Order | null) => void;
  setSelectedOrderForInvoice: (order: Order | null) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsSizeChartOpen: (open: boolean) => void;
  setIsReviewsModalOpen: (open: boolean) => void;
  setIsHostingerGuideOpen: (open: boolean) => void;
  setIsAdminLoginOpen: (open: boolean) => void;

  // Cart & Wishlist
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  getCartTotal: () => { subtotal: number; itemCount: number };

  // Orders
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignCourierConsignment: (orderId: string, courier: CourierProvider, trackingNo?: string) => void;
  bulkDispatchOrders: (orderIds: string[]) => void;
  addOrderNote: (orderId: string, note: string) => void;

  // Product Admin
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  adjustStock: (productId: string, newStock: number) => void;

  // Settings Admin
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Admin Auth
  loginAdmin: (username: string, pass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => boolean;

  // Toasts
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lotus_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lotus_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('lotus_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          phone: '+8801834355700',
          whatsappNumber: '+8801834355700'
        };
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lotus_cart');
    if (saved) return JSON.parse(saved);
    // Initialize default items from screenshot (TP-104 x 1, BG-208 x 1, HJ-08 x 2)
    return [
      {
        id: 'cart-1',
        productId: 'prod-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'XL',
        selectedColor: 'পিচ রোজ (Peach Rose)',
        unitPrice: 1450
      },
      {
        id: 'cart-2',
        productId: 'prod-5',
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        selectedSize: 'Standard Tote',
        selectedColor: 'ক্রিম ব্রাউন',
        unitPrice: 1250
      },
      {
        id: 'cart-3',
        productId: 'prod-7',
        product: INITIAL_PRODUCTS[6],
        quantity: 2,
        selectedSize: '80x30 Inch',
        selectedColor: 'পিচ',
        unitPrice: 350
      }
    ];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3', 'prod-4']);

  // Admin user & auth
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('lotus_admin_user');
    return saved
      ? JSON.parse(saved)
      : {
          username: 'lotusshopbd',
          fullName: 'Lotus Admin Super Console',
          role: 'Super Administrator',
          isFirstLogin: true,
          passwordHash: 'e10adc3949ba59abbe56e057f20f883e' // md5 of 123456
        };
  });
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings'>('products');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('lotus_admin_logged_in');
    return saved !== null ? saved === 'true' : true; // seamless entry
  });
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    return localStorage.getItem('lotus_admin_must_change_pass') === 'true';
  });

  const openAdminTab = (tab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' = 'products') => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('lotus_admin_logged_in', 'true');
    setAdminTab(tab);
    setActiveView('admin');
    setIsAdminLoginOpen(false);
  };

  // View States
  const [activeView, setActiveView] = useState<'home' | 'product' | 'checkout' | 'order_success' | 'account' | 'track_order' | 'admin'>('home');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeProduct, setActiveProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(INITIAL_ORDERS[0]);

  // Modals & Drawers
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isHostingerGuideOpen, setIsHostingerGuideOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('lotus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lotus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lotus_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lotus_settings', JSON.stringify(settings));
  }, [settings]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(
        item =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          selectedSize: size || product.sizes[0] || 'Standard',
          selectedColor: color || product.colors[0]?.nameBn || 'Standard',
          unitPrice: product.price
        }
      ];
    });
    showToast(`${product.nameBn} কার্টে যোগ করা হয়েছে!`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('পণ্য কার্ট থেকে অপসারিত হয়েছে', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('উইশলিস্ট থেকে সরানো হয়েছে', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('উইশলিস্টে যুক্ত করা হয়েছে!');
        return [...prev, productId];
      }
    });
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  };

  // Order Placement with Stock Reserve
  const placeOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `#LS-${Math.floor(1000 + Math.random() * 9000)}`;
    const invNum = `INV-2024-${orderNum.replace('#LS-', '')}`;

    // Decrement stock safe reservation
    setProducts(prev =>
      prev.map(p => {
        const orderedItem = (orderData.items || cart).find(item => item.productId === p.id);
        if (orderedItem) {
          const newStock = Math.max(0, p.stock - orderedItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    const now = new Date();
    const formattedDate = `${now.getDate()} অক্টোবর ২০২৪, ${now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      invoiceNumber: invNum,
      createdAt: formattedDate,
      customerName: orderData.customerName || 'তানভীর আহমেদ',
      customerPhone: orderData.customerPhone || '01712-345678',
      alternativePhone: orderData.alternativePhone,
      customerEmail: orderData.customerEmail,
      division: orderData.division || 'ঢাকা (Dhaka)',
      district: orderData.district || 'ঢাকা মেট্রো (Dhaka City)',
      thana: orderData.thana || 'মিরপুর-১০ (Mirpur 10)',
      address: orderData.address || 'বাড়ি-১২, রোড-৪, ব্লক-সি, মিরপুর-১০, ঢাকা-১২১৬',
      deliveryZone: orderData.deliveryZone || 'dhaka_metro',
      deliveryFee: orderData.deliveryFee ?? 60,
      deliveryInstruction: orderData.deliveryInstruction,
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal || getCartTotal().subtotal,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode,
      total: orderData.total || 0,
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'bkash',
      paymentStatus: orderData.paymentStatus || 'verified',
      transactionId: orderData.transactionId || `TRX${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: 'steadfast',
      consignmentId: `ST-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingNumber: `ST-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingStatus: 'প্যাকেজিং ও প্রস্তুত (Ready for Dispatch)',
      codAmount: orderData.paymentMethod === 'cod' ? (orderData.total || 0) : 0
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    showToast(`অর্ডার ${orderNum} সফলভাবে গ্রহণ করা হয়েছে!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          // If cancelled or returned, replenish stock
          if ((status === 'cancelled' || status === 'returned') && ord.status !== 'cancelled' && ord.status !== 'returned') {
            setProducts(prods =>
              prods.map(p => {
                const item = ord.items.find(i => i.productId === p.id);
                return item ? { ...p, stock: p.stock + item.quantity } : p;
              })
            );
          }
          return { ...ord, status };
        }
        return ord;
      })
    );
    showToast(`অর্ডারের স্ট্যাটাস পরিবর্তন হয়েছে: ${status}`);
  };

  const assignCourierConsignment = (orderId: string, courier: CourierProvider, trackingNo?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const generatedTracking = trackingNo || `${courier.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
          return {
            ...ord,
            courier,
            consignmentId: generatedTracking,
            trackingNumber: generatedTracking,
            trackingStatus: 'কুরিয়ারে পিকআপ প্রস্তুত',
            status: 'processing'
          };
        }
        return ord;
      })
    );
    showToast(`কুরিয়ার পার্সেল তৈরি হয়েছে (${courier})`);
  };

  const bulkDispatchOrders = (orderIds: string[]) => {
    setOrders(prev =>
      prev.map(ord => {
        if (orderIds.includes(ord.id) && ord.status !== 'shipped' && ord.status !== 'delivered') {
          const tracking = ord.trackingNumber || `ST-${Math.floor(10000 + Math.random() * 90000)}`;
          return {
            ...ord,
            courier: 'steadfast',
            consignmentId: tracking,
            trackingNumber: tracking,
            trackingStatus: 'ইন-ট্রানজিট (কুরিয়ার পিকআপ সম্পন্ন)',
            status: 'shipped'
          };
        }
        return ord;
      })
    );
    showToast(`${orderIds.length}টি পার্সেল সফলভাবে Steadfast কুরিয়ারে বুকিং করা হয়েছে!`);
  };

  const addOrderNote = (orderId: string, note: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, internalNotes: note } : ord))
    );
    showToast('অ্যাডমিন নোট সংরক্ষিত হয়েছে');
  };

  // Product Admin
  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === product.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = product;
        return copy;
      }
      return [product, ...prev];
    });
    showToast('পণ্য সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const remaining = prev.filter(p => p.id !== productId);
      return remaining;
    });
    setActiveProduct(prev => (prev?.id === productId ? null : prev));
    showToast('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে!', 'info');
  };

  const adjustStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    showToast('স্টক আপডেট করা হয়েছে');
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('ওয়েবসাইট সেটিংস সংরক্ষিত হয়েছে');
  };

  // Admin Auth
  const loginAdmin = (username: string, pass: string) => {
    if (username.toLowerCase() === 'lotusshopbd') {
      if (pass === '123456') {
        setIsAdminLoggedIn(true);
        localStorage.setItem('lotus_admin_logged_in', 'true');
        // Initial setup enforcement
        setMustChangePassword(true);
        localStorage.setItem('lotus_admin_must_change_pass', 'true');
        return { success: true, message: 'প্রাথমিক লগইন সফল! অনুগ্রহ করে এখনই পাসওয়ার্ড পরিবর্তন করুন।' };
      }
      // Check if user changed password before
      const savedPass = localStorage.getItem('lotus_admin_pass');
      if (savedPass && pass === savedPass) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('lotus_admin_logged_in', 'true');
        setMustChangePassword(false);
        localStorage.setItem('lotus_admin_must_change_pass', 'false');
        return { success: true, message: 'অ্যাডমিন কনসোলে স্বাগতম!' };
      }
    }
    return { success: false, message: 'ভুল ইউজারনেম বা পাসওয়ার্ড!' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('lotus_admin_logged_in');
    showToast('অ্যাডমিন কনসোল থেকে লগ আউট হয়েছে', 'info');
  };

  const changeAdminPassword = (newPass: string) => {
    if (!newPass || newPass.length < 6 || newPass === '123456') {
      showToast('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে এবং 123456 হওয়া যাবে না', 'error');
      return false;
    }
    localStorage.setItem('lotus_admin_pass', newPass);
    localStorage.setItem('lotus_admin_must_change_pass', 'false');
    setMustChangePassword(false);
    setAdminUser(prev => prev ? { ...prev, isFirstLogin: false } : null);
    showToast('অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        wishlist,
        settings,
        activeProduct,
        activeOrder,
        selectedOrderForInvoice,
        activeView,
        language,
        adminUser,
        isAdminLoggedIn,
        mustChangePassword,
        toasts,
        isCartDrawerOpen,
        isSizeChartOpen,
        isReviewsModalOpen,
        isHostingerGuideOpen,
        isAdminLoginOpen,
        adminTab,
        setAdminTab,
        openAdminTab,
        setActiveView,
        setLanguage,
        setActiveProduct,
        setActiveOrder,
        setSelectedOrderForInvoice,
        setIsCartDrawerOpen,
        setIsSizeChartOpen,
        setIsReviewsModalOpen,
        setIsHostingerGuideOpen,
        setIsAdminLoginOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        getCartTotal,
        placeOrder,
        updateOrderStatus,
        assignCourierConsignment,
        bulkDispatchOrders,
        addOrderNote,
        saveProduct,
        deleteProduct,
        adjustStock,
        updateSettings,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        showToast
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 border transition-all animate-bounce ${
              toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : toast.type === 'info'
                ? 'bg-neutral-900 text-white border-neutral-700'
                : 'bg-emerald-800 text-white border-emerald-600'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
