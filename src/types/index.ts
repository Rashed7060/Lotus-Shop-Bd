export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  regularPrice: number;
  stock: number;
  attributes: { [key: string]: string }; // e.g. { Color: "Peach Rose", Size: "XL" }
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  sku: string;
  price: number;
  regularPrice: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  subcategory?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  badge?: 'New' | 'Hot' | 'Sale' | 'Trending';
  badgeBn?: string;
  images: string[];
  thumbnail: string;
  description: string;
  descriptionBn: string;
  features: string[];
  featuresBn: string[];
  variants?: ProductVariant[];
  sizes: string[];
  colors: { name: string; nameBn: string; hex: string }[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  weightKg: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  unitPrice: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod =
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'upay'
  | 'sslcommerz'
  | 'cod';

export type CourierProvider = 'steadfast' | 'pathao' | 'redx' | 'manual';

export interface CourierTrackingEvent {
  time: string;
  status: string;
  description: string;
  location: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #LS-8942
  invoiceNumber: string; // e.g. INV-2024-8942
  createdAt: string;
  customerName: string;
  customerPhone: string;
  alternativePhone?: string;
  customerEmail?: string;
  division: string;
  district: string;
  thana: string;
  address: string;
  deliveryZone: 'dhaka_metro' | 'dhaka_sub' | 'outside_dhaka';
  deliveryFee: number;
  deliveryInstruction?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed' | 'refunded';
  transactionId?: string;
  courier: CourierProvider;
  consignmentId?: string;
  trackingNumber?: string;
  trackingStatus?: string;
  trackingEvents?: CourierTrackingEvent[];
  internalNotes?: string;
  codAmount: number;
}

export interface StoreSettings {
  storeName: string;
  storeNameBn: string;
  tagline: string;
  taglineBn: string;
  phone: string;
  email: string;
  address: string;
  addressBn: string;
  tradeLicense: string;
  binNumber: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingDhakaMetro: number;
  shippingDhakaSub: number;
  shippingOutsideDhaka: number;
  courierSteadfastEnabled: boolean;
  courierSteadfastApiKey: string;
  courierSteadfastSecret: string;
  courierPathaoEnabled: boolean;
  courierPathaoApiKey: string;
  courierRedXEnabled: boolean;
  paymentBkashEnabled: boolean;
  paymentBkashMerchantNumber: string;
  paymentNagadEnabled: boolean;
  paymentSslEnabled: boolean;
  paymentCodEnabled: boolean;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
}

export interface AdminUser {
  username: string;
  fullName: string;
  role: 'Super Administrator' | 'Order Manager' | 'Product Manager';
  isFirstLogin: boolean;
  passwordHash?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}
