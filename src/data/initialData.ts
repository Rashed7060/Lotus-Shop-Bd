import { Product, Order, StoreSettings, Review, Category } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Embroidered Three Piece - Luxury Lawn Collection',
    nameBn: 'Embroidered Three Piece - Luxury Lawn Collection',
    slug: 'embroidered-three-piece-luxury-lawn',
    sku: 'TP-104',
    price: 1450,
    regularPrice: 1850,
    costPrice: 950,
    stock: 12,
    lowStockThreshold: 5,
    category: 'Three Piece',
    subcategory: 'Lawn',
    brand: 'Lotus Exclusive',
    rating: 4.8,
    reviewCount: 124,
    badge: 'New',
    badgeBn: 'New Arrival',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAaWALRuynp8FxiWUZjjtB2vkwj6_wgcbzTNbxLoNZG1R41kldPAGHp_Er87tmqTO7HnCRpeXjvg4b0CSTAiw9KzrMheF_mbvmVcljLtK9nAQsp4DOdI42uN5d5ME23UED8XN6cr3Mzq7wbyhJdjSiOmKCffqOant0AlIAxtpEFCNoIDZXpHsQdsA1gxHe9UZwlYnN0lQW1SbGgSC4IJFIL_njomlqk39jk1M25JukrJ3CIdDYYXMKIpQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlqTt9YUXUSXecTWQ8o2d3HYPP9MDyyF625bKMtl961XSp4ZMNt3xtU2_vGg9CZq6RhwwzI_z0jJxJpTDbMz0hrIbUxNdKTXuq-L4dkoNhq0HWoDlV7CvyMtl9lGInvpG_3zVyDHi95C-m6W6-UnSk4Xffu7baA-rU-ArZQI0ogdGMbhzIbZesE0535aFmgstJuV_eT8kaFA8LTQkQqIOwGimQi68Em0IxbvS3-KKPDB1ZFhsWDOMmYw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8dxsuN4p2bGORLrX0hvDCHRg_0zXc0SWPDsa1P_5d6u09GI7H_ND350n4SHfkef9sG7-xs89ZNwqYg0W_yD-19YqW3qLotC5-Fn22k1Q-oUAWS1Z56SAEyewBH0a81a2bTwG3C91TVh7ZhVIAY0-uDJeGMi9_l3rxJGGb_C8kwSwZi0P5cjtRZOuYEr5oHDNt5WZ07I_Y3ViHu-h7y3S0n-uiPhTyeZqaHi7ggXWqmzVR-9q7VrTx7g',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARsQa1MqQEVyBSxGSzpjajoqyZYn0h-NmiMdQ_DR0nWogmB41GDo8JwR_ZQW1xRMHQuwHjofN3OTI5-t-iBbN5rGc9h24RUii0RjRL0Z8QGbznRabEFj9p1j7H-Iswy3KqwZGB1hxY17-_C-QpcdBoj2fKAV9WYZHJ3fvKYNgyp5bdwkhZZAxWHrAvaJhafaMeF3f0_XopeWz2HtGUod19M3s4XmOKshUuwVi8euHnziSpagc7GiJhGw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvBI0CHlVHK2fg2GYZe-aYVCVARjGinKNvn-qPjTWpi4wAt0rsKL2rkkPgb9WACysVpSly6YKfI1h2IGYkMQmO365E2A6XIUtAnOwkL7Z4V0OvlQtxe-UQ9GTKqEbeThuOA8ddrLGVurONrXNKtc3oSaHQTC-uLPbf_Y5oPTxz6WMBrhMzhAGST2CSehihJWzf6kY0C5GKp5SC9mDSH-wLm1eUDht9zDOw9zsYVWPzZMu0mVdLx6bN5Q'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaWALRuynp8FxiWUZjjtB2vkwj6_wgcbzTNbxLoNZG1R41kldPAGHp_Er87tmqTO7HnCRpeXjvg4b0CSTAiw9KzrMheF_mbvmVcljLtK9nAQsp4DOdI42uN5d5ME23UED8XN6cr3Mzq7wbyhJdjSiOmKCffqOant0AlIAxtpEFCNoIDZXpHsQdsA1gxHe9UZwlYnN0lQW1SbGgSC4IJFIL_njomlqk39jk1M25JukrJ3CIdDYYXMKIpQ',
    description: 'Authentic Pakistani design inspired luxury lawn embroidered 3-piece collection. Made with 100% pure breathable cotton lawn fabric, delicate gold zari and sequence embroidery work.',
    descriptionBn: 'Authentic Pakistani design inspired luxury lawn embroidered 3-piece collection. Made with 100% pure breathable cotton lawn fabric, delicate gold zari and sequence embroidery work.',
    features: [
      'Kameez: 100% Pure luxury cotton lawn with heavy front embroidery (Length 44-46 in)',
      'Dupatta: Premium soft digital printed chiffon dupatta (5 Haat bohor)',
      'Salwar: Matching soft cotton dying salwar fabric (2.5 yards)',
      'Embroidery: Fine golden zari thread and sequence work',
      '100% Color Fastness Guarantee'
    ],
    featuresBn: [
      'Kameez: 100% Pure luxury cotton lawn with heavy front embroidery (Length 44-46 in)',
      'Dupatta: Premium soft digital printed chiffon dupatta (5 Haat bohor)',
      'Salwar: Matching soft cotton dying salwar fabric (2.5 yards)',
      'Embroidery: Fine golden zari thread and sequence work',
      '100% Color Fastness Guarantee'
    ],
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: [
      { name: 'Peach Rose', nameBn: 'Peach Rose', hex: '#f4b8b4' },
      { name: 'Royal Navy', nameBn: 'Royal Navy', hex: '#1b2b48' },
      { name: 'Mint Green', nameBn: 'Mint Green', hex: '#a7d7c5' }
    ],
    isFeatured: true,
    isBestseller: true,
    weightKg: 0.8
  },
  {
    id: 'prod-2',
    name: "Men's Premium Cotton Panjabi - Royal Navy",
    nameBn: "Men's Premium Cotton Panjabi - Royal Navy",
    slug: 'mens-premium-cotton-panjabi-royal-navy',
    sku: 'MN-201',
    price: 990,
    regularPrice: 1250,
    costPrice: 650,
    stock: 24,
    lowStockThreshold: 6,
    category: "Men's Wear",
    subcategory: 'Panjabi',
    brand: 'Lotus Men',
    rating: 4.6,
    reviewCount: 18,
    badge: 'New',
    badgeBn: 'New',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvhEqahoPqaXreCREsXbHm0YZKGm3IgV9HDs-iBkD1Jz_DbMJ6bf0wEjcJZBEfxJo8W8JO7Q-QxA9BnSfU6V0MRw3snGQXm-TCBZn29mFH_eE7Q88ibY-k6GB-FYpeUVo-DoPygcP0D5RQf0ZBXoTVjiaqnRcDcJOLOJ4L0l1t7lsr-tiUxZ520lRwEqS_dveL7Kx_lA7Do1mVWyy6NgqjPSGusAJDqJ2TZyexv5Oa32qXiFuLY_5KQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcTnacXlGs2dtt1rMmt0cW_NfRVOyu2ngS5kTLDLpBc1u-Pem68KIzhGHJZ8M-CsL9_j2ibzu-N2GEnNVtvOpXux1ht5cnk80zq0oadrBC7_rwin3jA3DGh9-EBoFzu6QM_SsjTku21_UwwEuP1H0qowZkdek1kgCWCkIDeb5Zx1i7IEZ0U1RhI0N9uXMwVWh7h551QVwmr1RYNr732iyc1R4QZJfyciGZ9kheuOkMfJLgejlNqCMJBQ'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvhEqahoPqaXreCREsXbHm0YZKGm3IgV9HDs-iBkD1Jz_DbMJ6bf0wEjcJZBEfxJo8W8JO7Q-QxA9BnSfU6V0MRw3snGQXm-TCBZn29mFH_eE7Q88ibY-k6GB-FYpeUVo-DoPygcP0D5RQf0ZBXoTVjiaqnRcDcJOLOJ4L0l1t7lsr-tiUxZ520lRwEqS_dveL7Kx_lA7Do1mVWyy6NgqjPSGusAJDqJ2TZyexv5Oa32qXiFuLY_5KQ',
    description: "Classic South Asian traditional Men's panjabi tailored with 100% high-count combed cotton, delicate minimal collar embroidery.",
    descriptionBn: "Classic South Asian traditional Men's panjabi tailored with 100% high-count combed cotton, delicate minimal collar embroidery.",
    features: ['100% Combed Cotton', 'Designer Placket & Collar', 'Slim Fit Cut', 'Breathable fabric'],
    featuresBn: ['100% Combed Cotton', 'Designer Placket & Collar', 'Slim Fit Cut', 'Breathable fabric'],
    sizes: ['M (40)', 'L (42)', 'XL (44)'],
    colors: [
      { name: 'Royal Navy', nameBn: 'Royal Navy', hex: '#1b2b48' },
      { name: 'Pure White', nameBn: 'Pure White', hex: '#ffffff' },
      { name: 'Jet Black', nameBn: 'Jet Black', hex: '#111111' }
    ],
    isFeatured: true,
    weightKg: 0.4
  },
  {
    id: 'prod-3',
    name: 'Designer Georgette Kurti - Mint Green',
    nameBn: 'Designer Georgette Kurti - Mint Green',
    slug: 'designer-georgette-kurti-mint-green',
    sku: 'KT-305',
    price: 850,
    regularPrice: 1150,
    costPrice: 520,
    stock: 18,
    lowStockThreshold: 5,
    category: 'Kurti',
    subcategory: 'Georgette',
    brand: 'Lotus Ethnic',
    rating: 4.7,
    reviewCount: 32,
    badge: 'Hot',
    badgeBn: 'Hot',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAitd4I6CmjChNy9uroXCcWmRBEasrXeBaUukzo2s95kwHRlFgaS6Y7kDee7jC_TtABAL-Ehk_I3fMDwPvo7gR3XYjc7sV4B7AQSdoBY9HG8uTdYQI0EKvGGpj4xMt2SG--aTOyQycne1r2jR904RH1to6cfMB2rU9eGnw9w7vVWd-pZoUjzDUJZdrWKwSZ9ZFf7_j0X8Xy5nnfFO7SFeDUmqDvEdwlysFLwSNicnKD3Ot3EEbz6R-eKQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDY9mWuzm7oWRXZi60B5NIaqF-haMViSu3cQaSU6LVH1Som_ePofelnPyalXExBqeRkufs9WQNa6MO3aTMchQne4D4irPFFEvJFnoYkSnbBs61EN9fft47T33DOPLcg-TJoUG3ua8UODSPEBRiPFUWSmYgwpaHCceN42GHwH2lnHfqSuRZojZv8qS2n9EZxT4rfLKOJId8mdDSOyEdn5kc2rZF5YW-bdko5RYcoJtzRrxXjQl5z9Y6tRw'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAitd4I6CmjChNy9uroXCcWmRBEasrXeBaUukzo2s95kwHRlFgaS6Y7kDee7jC_TtABAL-Ehk_I3fMDwPvo7gR3XYjc7sV4B7AQSdoBY9HG8uTdYQI0EKvGGpj4xMt2SG--aTOyQycne1r2jR904RH1to6cfMB2rU9eGnw9w7vVWd-pZoUjzDUJZdrWKwSZ9ZFf7_j0X8Xy5nnfFO7SFeDUmqDvEdwlysFLwSNicnKD3Ot3EEbz6R-eKQ',
    description: 'Chic designer mint green georgette kurti with comfortable inner lining and artistic floral neckline thread embroidery.',
    descriptionBn: 'Chic designer mint green georgette kurti with comfortable inner lining and artistic floral neckline thread embroidery.',
    features: ['Premium imported georgette', 'Attached soft cotton inner', 'Trendy sleeve cut', 'Fade-proof dyes'],
    featuresBn: ['Premium imported georgette', 'Attached soft cotton inner', 'Trendy sleeve cut', 'Fade-proof dyes'],
    sizes: ['M (38)', 'L (40)', 'XL (42)'],
    colors: [
      { name: 'Mint Green', nameBn: 'Mint Green', hex: '#a7d7c5' },
      { name: 'Baby Pink', nameBn: 'Baby Pink', hex: '#f9a8d4' },
      { name: 'Sky Blue', nameBn: 'Sky Blue', hex: '#7dd3fc' }
    ],
    isFeatured: true,
    weightKg: 0.35
  },
  {
    id: 'prod-4',
    name: 'Ultra-Light Breathable Running Sneakers - Beige Edition',
    nameBn: 'Ultra-Light Breathable Running Sneakers - Beige Edition',
    slug: 'ultra-light-running-sneakers-beige',
    sku: 'SN-402',
    price: 1990,
    regularPrice: 2500,
    costPrice: 1200,
    stock: 2,
    lowStockThreshold: 5,
    category: 'Shoes',
    subcategory: 'Sneakers',
    brand: 'Lotus Sport',
    rating: 4.5,
    reviewCount: 16,
    badge: 'Trending',
    badgeBn: 'Trending',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvZaHj05pyoRvYnxnqgrA8Fv5yNkNioI0QnZtNm96iQDYtDCxHfKR-_wyqQMAHstzBpMtdPgjvQTXW9pMGkJi_3z8TVnVYgrSmsyWuN6LJ3whL3eXlOhvaUUZ8mKvHyRr2r2tnuUmLD99-h5mDArO44_avOy-qrfGJYj7FjUOVXgwH8b91EScc0J8IbKLUoFVJVNHY-DHOMizGxMJ0iqd3ilVQk5vNWKoSNmxp7Yij3n6_h_WGAU2_UQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpeLk6ClBD5s9QHHV4RC-NdIY3m9R6QN8L7ZvAO8ZiKE7KWlqxRLelHpFiN0Otenw7IsaPW-MQOyaEX5KpBIsPPLzrwOfRf4HnN5_mIyXwlw_VPTEY2weQQQ5B9aA8FoZax-NoNpYbIBVBd2Cgid-ZDOvVYJDmKfTsTsiCas7U9GgLES7xVFpyp3P1m_TjSsspF0zN-RbbMwp40brgeRn1O8zZ6MKd7dLBPluYbYz4pn81ZgE_YCGH3g'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvZaHj05pyoRvYnxnqgrA8Fv5yNkNioI0QnZtNm96iQDYtDCxHfKR-_wyqQMAHstzBpMtdPgjvQTXW9pMGkJi_3z8TVnVYgrSmsyWuN6LJ3whL3eXlOhvaUUZ8mKvHyRr2r2tnuUmLD99-h5mDArO44_avOy-qrfGJYj7FjUOVXgwH8b91EScc0J8IbKLUoFVJVNHY-DHOMizGxMJ0iqd3ilVQk5vNWKoSNmxp7Yij3n6_h_WGAU2_UQ',
    description: 'High-performance ultra-light sneakers with cushioned memory foam sole, breathable honeycomb mesh and anti-slip rubber traction.',
    descriptionBn: 'High-performance ultra-light sneakers with cushioned memory foam sole, breathable honeycomb mesh and anti-slip rubber traction.',
    features: ['High elastic EVA memory foam sole', 'Sweat-absorbing insole', 'Anti-slip grip', 'Ultra-lightweight 220g'],
    featuresBn: ['High elastic EVA memory foam sole', 'Sweat-absorbing insole', 'Anti-slip grip', 'Ultra-lightweight 220g'],
    sizes: ['40', '41', '42', '43', '44'],
    colors: [
      { name: 'Beige', nameBn: 'Beige', hex: '#d6c7b2' },
      { name: 'Charcoal Black', nameBn: 'Charcoal Black', hex: '#222222' }
    ],
    isFeatured: true,
    weightKg: 0.6
  },
  {
    id: 'prod-5',
    name: 'Premium Quilted Leather Handbag - Cream Brown',
    nameBn: 'Premium Quilted Leather Handbag - Cream Brown',
    slug: 'premium-quilted-leather-handbag-cream',
    sku: 'BG-208',
    price: 1250,
    regularPrice: 2500,
    costPrice: 750,
    stock: 2,
    lowStockThreshold: 4,
    category: 'Bags',
    subcategory: 'Handbags',
    brand: 'Lotus Elegance',
    rating: 4.3,
    reviewCount: 12,
    badge: 'Sale',
    badgeBn: '50% OFF',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEGe1mnObcJzG49_BfXPi-NEpyPKF4TnIW5qNd7JsBp74F8jG5kytxUKo14i5PFuwQzatm1V3r-LSiJRuHTPC33dh0GhqSDDZaIWg4evQ36MKnhOWX0-_t5jMQj0NKUEe56Mxw7lD4g5L8lb5RdZJnSvscSvK8JCS6Z3yP21ix8rpIhmWyEwSWIz1OS3Yo6TFcmeya-4h2eXrNbHkNsgYBefLWc3mNHK4vx6V7qAwrjYpt81Z-wu4G4g',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgQ1PTbHdcbpYRds3ZJO-WayEXACi1Zyo92fAQFCEiROeZrgPH50pFs7ZM63r71GlEQ7hBKh-JisjfMyIioObhRB424iH3HET0xyb5f4o83GQQlPzlKJPvQMgedJvJ_09R4EA1L2SyJHWWxLcIEGJJIU5_1l-8WRYBzC33XgbaZsVY7fxYmKL_4-58lZJUcdBbtYu4KtEDlib0swTcU7uZFXyx6YELuoq_2kic5XKeg6y2TgNeHR9wMg'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEGe1mnObcJzG49_BfXPi-NEpyPKF4TnIW5qNd7JsBp74F8jG5kytxUKo14i5PFuwQzatm1V3r-LSiJRuHTPC33dh0GhqSDDZaIWg4evQ36MKnhOWX0-_t5jMQj0NKUEe56Mxw7lD4g5L8lb5RdZJnSvscSvK8JCS6Z3yP21ix8rpIhmWyEwSWIz1OS3Yo6TFcmeya-4h2eXrNbHkNsgYBefLWc3mNHK4vx6V7qAwrjYpt81Z-wu4G4g',
    description: 'Sophisticated women leather handbag crafted with imported grain PU leather, gold buckle accents, and dual compartment storage.',
    descriptionBn: 'Sophisticated women leather handbag crafted with imported grain PU leather, gold buckle accents, and dual compartment storage.',
    features: ['High-grade water-resistant PU leather', 'Gold-plated hardware', 'Includes detachable shoulder strap'],
    featuresBn: ['High-grade water-resistant PU leather', 'Gold-plated hardware', 'Includes detachable shoulder strap'],
    sizes: ['Standard Tote'],
    colors: [
      { name: 'Cream Brown', nameBn: 'Cream Brown', hex: '#d2b48c' },
      { name: 'Blush Pink', nameBn: 'Blush Pink', hex: '#fbcfe8' },
      { name: 'Classic Black', nameBn: 'Classic Black', hex: '#1c1917' }
    ],
    isFeatured: true,
    weightKg: 0.55
  },
  {
    id: 'prod-6',
    name: 'Smart Watch Fitness Tracker with AMOLED Display',
    nameBn: 'Smart Watch Fitness Tracker with AMOLED Display',
    slug: 'smart-watch-fitness-tracker-amoled',
    sku: 'WT-509',
    price: 2450,
    regularPrice: 3200,
    costPrice: 1600,
    stock: 15,
    lowStockThreshold: 4,
    category: 'Electronics',
    subcategory: 'Smart Watch',
    brand: 'Lotus Tech',
    rating: 4.2,
    reviewCount: 20,
    badge: 'Trending',
    badgeBn: 'Trending',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3XhXdKj2nra1UJJK2hOKFRyQ4SgLm8bU-2SVv9iPNUvdlvJa-ZSeSzx_jpX0DIIQoJmsOH9jv0VYC7TyLasKcx-B1s4kirI3irxUtHOuET4aL8Vfd4_OlTNDBBlDwt6e4iuUzRoTKPBXxxg8HvqI8YtQAsIeonGcw8ao_eumxJat22-yqGHLTunSI0F_Kyfr1JB1J0hwEpFB_EcnhlRm8-Q_Bwlg5ZiWNpMnUBxGPUgCtamXQ0Meew'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3XhXdKj2nra1UJJK2hOKFRyQ4SgLm8bU-2SVv9iPNUvdlvJa-ZSeSzx_jpX0DIIQoJmsOH9jv0VYC7TyLasKcx-B1s4kirI3irxUtHOuET4aL8Vfd4_OlTNDBBlDwt6e4iuUzRoTKPBXxxg8HvqI8YtQAsIeonGcw8ao_eumxJat22-yqGHLTunSI0F_Kyfr1JB1J0hwEpFB_EcnhlRm8-Q_Bwlg5ZiWNpMnUBxGPUgCtamXQ0Meew',
    description: 'Smart Watch with Bluetooth calling, 1.96-inch AMOLED display, SpO2 & Heart Rate monitoring, IP68 water resistance.',
    descriptionBn: 'Smart Watch with Bluetooth calling, 1.96-inch AMOLED display, SpO2 & Heart Rate monitoring, IP68 water resistance.',
    features: ['1.96" HD AMOLED Touchscreen', 'Bluetooth Voice Calling', '7-Day Long Battery Life', 'IP68 Waterproof'],
    featuresBn: ['1.96" HD AMOLED Touchscreen', 'Bluetooth Voice Calling', '7-Day Long Battery Life', 'IP68 Waterproof'],
    sizes: ['46mm Dial'],
    colors: [
      { name: 'Onyx Black', nameBn: 'Onyx Black', hex: '#111827' },
      { name: 'Metallic Silver', nameBn: 'Metallic Silver', hex: '#9ca3af' }
    ],
    isFeatured: true,
    weightKg: 0.25
  },
  {
    id: 'prod-7',
    name: 'Premium Modal Cotton Soft Hijab - Peach & Rose',
    nameBn: 'Premium Modal Cotton Soft Hijab - Peach & Rose',
    slug: 'premium-modal-cotton-hijab-peach',
    sku: 'HJ-08',
    price: 350,
    regularPrice: 450,
    costPrice: 180,
    stock: 45,
    lowStockThreshold: 10,
    category: 'Hijab',
    subcategory: 'Modal Cotton',
    brand: 'Lotus Modest',
    rating: 4.9,
    reviewCount: 42,
    badge: 'Sale',
    badgeBn: 'Special Offer',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMIQAVA8QcT20Lq9ELXD2dLPXSXRXKmXUhX6p9zKb8g4AAmhd73cEIFWLYY5GJkRT4dhnAOTHmLTrMpSjOpjV23fBqcovDtANvlktOZ3vJRgk26uqpPBlJA4Uh5PuFnE5fFYyhuw4WStigE_mNiukv-yF5cSOhk7s39IKSbJu003XcsRczBjq7uqpIRODrc6ubbnTbFNcxMA2QvIAF5v66Wr4eFMaiph4bMRelwd6IMJS-16L1RhGCdA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBye_PMLRBvD1cc1fYzWAbYeitzZh8AOMWJuaW0YUuMHbw-IiK4y1OFGnBgirT5OeW9wTPFJiLAaevs8eD5dvM7qvkjh1aYRUGTGPPSg3oUU-kIytM3Magy4RMaf9YWzag5KhfyEclAmEidWtprwjzGG97yQSMUDP61lMtjwX1mK00hZiGBsTGqkfZYNNFbzRAE6gwMpYAb_qFiGFG5Vq0smMp94HI4TBJX-8pKz_DMiDupSRPaHZw'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMIQAVA8QcT20Lq9ELXD2dLPXSXRXKmXUhX6p9zKb8g4AAmhd73cEIFWLYY5GJkRT4dhnAOTHmLTrMpSjOpjV23fBqcovDtANvlktOZ3vJRgk26uqpPBlJA4Uh5PuFnE5fFYyhuw4WStigE_mNiukv-yF5cSOhk7s39IKSbJu003XcsRczBjq7uqpIRODrc6ubbnTbFNcxMA2QvIAF5v66Wr4eFMaiph4bMRelwd6IMJS-16L1RhGCdA',
    description: 'Feather-soft pure modal cotton luxury hijab scarf with generous 80x30 inch coverage, non-slip drape, perfect for all day wear.',
    descriptionBn: 'Feather-soft pure modal cotton luxury hijab scarf with generous 80x30 inch coverage, non-slip drape, perfect for all day wear.',
    features: ['100% Breathable Modal Cotton', 'Generous 80x30 inch coverage', 'Non-slip texture'],
    featuresBn: ['100% Breathable Modal Cotton', 'Generous 80x30 inch coverage', 'Non-slip texture'],
    sizes: ['80x30 Inch'],
    colors: [
      { name: 'Peach', nameBn: 'Peach', hex: '#ffedd5' },
      { name: 'Blush Rose', nameBn: 'Blush Rose', hex: '#fecdd3' },
      { name: 'Mocha', nameBn: 'Mocha', hex: '#a8a29e' }
    ],
    weightKg: 0.15
  },
  {
    id: 'prod-8',
    name: 'Katan Banarasi Silk Saree - Crimson Red Festive',
    nameBn: 'Katan Banarasi Silk Saree - Crimson Red Festive',
    slug: 'katan-banarasi-silk-saree-crimson',
    sku: 'SR-309',
    price: 4200,
    regularPrice: 5500,
    costPrice: 2800,
    stock: 8,
    lowStockThreshold: 3,
    category: 'Saree',
    subcategory: 'Silk',
    brand: 'Lotus Heritage',
    rating: 4.9,
    reviewCount: 38,
    badge: 'Sale',
    badgeBn: 'Special Sale',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfzn4BoQx9LHJGLm3-6tPA2qTbHiH4Q5cMNudbscEOcFcBu3YvYWxYem3YbJG5eNRWCfRrLMw74ozDDcfH-6k9NvyxEcT9y8MTfvErVxGU_5Yjo5qaObKrd3Nayc2W_vvuSg1b2ZfKa46ARC0eGed480SZEUwC-QmRaxhzkhkiBINX9jekm9dMZDGCOlQZIuA967BxJ20ownMYu1J3R69riZuDiA2V6z3H7f-SauU07zScckWo1MSCUQ'
    ],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfzn4BoQx9LHJGLm3-6tPA2qTbHiH4Q5cMNudbscEOcFcBu3YvYWxYem3YbJG5eNRWCfRrLMw74ozDDcfH-6k9NvyxEcT9y8MTfvErVxGU_5Yjo5qaObKrd3Nayc2W_vvuSg1b2ZfKa46ARC0eGed480SZEUwC-QmRaxhzkhkiBINX9jekm9dMZDGCOlQZIuA967BxJ20ownMYu1J3R69riZuDiA2V6z3H7f-SauU07zScckWo1MSCUQ',
    description: 'Exquisite bridal and festive Katan Banarasi Silk Saree featuring heavy minakari zari border and traditional floral motifs.',
    descriptionBn: 'Exquisite bridal and festive Katan Banarasi Silk Saree featuring heavy minakari zari border and traditional floral motifs.',
    features: ['Pure Katan Silk with Zari', 'Includes 1m matching blouse piece', 'Authentic handloom finish'],
    featuresBn: ['Pure Katan Silk with Zari', 'Includes 1m matching blouse piece', 'Authentic handloom finish'],
    sizes: ['12 Haat Saree + 1m Blouse Piece'],
    colors: [
      { name: 'Crimson Red', nameBn: 'Crimson Red', hex: '#b91c1c' },
      { name: 'Emerald Green', nameBn: 'Emerald Green', hex: '#047857' }
    ],
    weightKg: 0.95
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8942',
    orderNumber: '#LS-8942',
    invoiceNumber: 'INV-2024-8942',
    createdAt: 'October 17, 2024, 10:15 AM',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01712-345678',
    alternativePhone: '01823-998877',
    customerEmail: 'tanvir.ahmed@example.com',
    division: 'Dhaka',
    district: 'Dhaka City',
    thana: 'Mirpur 10',
    address: 'House #12, Road #4, Block-C, Mirpur 10 (4th Floor, Flat 4B), Dhaka-1216',
    deliveryZone: 'dhaka_metro',
    deliveryFee: 60,
    deliveryInstruction: 'Please deliver after 5:00 PM.',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'XL (42)',
        selectedColor: 'Peach Rose',
        unitPrice: 1450
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedSize: 'L (42)',
        selectedColor: 'Royal Navy',
        unitPrice: 990
      },
      {
        id: 'item-3',
        productId: 'prod-3',
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedSize: 'M (38)',
        selectedColor: 'Mint Green',
        unitPrice: 850
      }
    ],
    subtotal: 3290,
    discount: 340,
    couponCode: 'LOTUS10',
    total: 3120,
    status: 'pending',
    paymentMethod: 'bkash',
    paymentStatus: 'verified',
    transactionId: 'TRX92819034',
    courier: 'steadfast',
    consignmentId: 'ST-90214-MIRPUR',
    trackingNumber: 'ST-90214',
    trackingStatus: 'Ready for Dispatch',
    internalNotes: 'Free gift card added with packaging.',
    codAmount: 0
  },
  {
    id: 'ord-8941',
    orderNumber: '#LS-8941',
    invoiceNumber: 'INV-2024-8941',
    createdAt: 'October 17, 2024, 09:50 AM',
    customerName: 'Farhana Yasmin',
    customerPhone: '01819-876543',
    customerEmail: 'farhana.y@example.com',
    division: 'Dhaka',
    district: 'Dhaka City',
    thana: 'Uttara',
    address: 'House #8, Sector #3, Uttara, Dhaka',
    deliveryZone: 'dhaka_metro',
    deliveryFee: 60,
    items: [
      {
        id: 'item-4',
        productId: 'prod-5',
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        selectedSize: 'Standard Tote',
        selectedColor: 'Cream Brown',
        unitPrice: 1250
      }
    ],
    subtotal: 1250,
    discount: 0,
    total: 1310,
    status: 'in_transit',
    paymentMethod: 'nagad',
    paymentStatus: 'verified',
    transactionId: 'NG991823901',
    courier: 'pathao',
    consignmentId: 'PTH-99214',
    trackingNumber: 'Pathao: Picked Up',
    trackingStatus: 'In Transit',
    codAmount: 0
  },
  {
    id: 'ord-8940',
    orderNumber: '#LS-8940',
    invoiceNumber: 'INV-2024-8940',
    createdAt: 'October 17, 2024, 09:15 AM',
    customerName: 'Mehedi Hasan',
    customerPhone: '01911-223344',
    division: 'Chittagong',
    district: 'Chittagong Sadar',
    thana: 'GEC Circle',
    address: 'Flat 3A, Sanmar Ocean City Lane, GEC Circle, Chittagong',
    deliveryZone: 'outside_dhaka',
    deliveryFee: 130,
    items: [
      {
        id: 'item-5',
        productId: 'prod-4',
        product: INITIAL_PRODUCTS[3],
        quantity: 2,
        selectedSize: '42',
        selectedColor: 'Beige',
        unitPrice: 1990
      }
    ],
    subtotal: 3980,
    discount: 220,
    total: 3890,
    status: 'delivered',
    paymentMethod: 'cod',
    paymentStatus: 'verified',
    courier: 'steadfast',
    consignmentId: 'ST-90180',
    trackingNumber: 'ST-90180',
    trackingStatus: 'Delivered Successfully',
    codAmount: 3890
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Lotus Shop BD',
  storeNameBn: 'Lotus Shop BD',
  tagline: 'Fashion & Lifestyle For Everyone',
  taglineBn: 'Fashion & Lifestyle For Everyone',
  phone: '+8801834355700',
  email: 'support@lotusshop.com.bd',
  address: 'House-22, Road-07, Dhanmondi, Dhaka-1205, Bangladesh',
  addressBn: 'House-22, Road-07, Dhanmondi, Dhaka-1205, Bangladesh',
  tradeLicense: 'TRAD/DNCC/019283/2023',
  binNumber: '004829104-0101',
  currency: 'BDT',
  currencySymbol: '৳',
  freeShippingThreshold: 3000,
  shippingDhakaMetro: 60,
  shippingDhakaSub: 100,
  shippingOutsideDhaka: 130,
  courierSteadfastEnabled: true,
  courierSteadfastApiKey: 'st_live_9019283489234',
  courierSteadfastSecret: 'st_sec_8923471049283',
  courierPathaoEnabled: true,
  courierPathaoApiKey: 'pth_live_891238491823',
  courierRedXEnabled: true,
  paymentBkashEnabled: true,
  paymentBkashMerchantNumber: '01834355700',
  paymentNagadEnabled: true,
  paymentSslEnabled: true,
  paymentCodEnabled: true,
  paymentBankEnabled: true,
  bankName: 'Dutch-Bangla Bank PLC (DBBL)',
  bankAccountName: 'LOTUS SHOP BD',
  bankAccountNumber: '115.120.0098765',
  bankBranchName: 'Mirpur-10 Branch, Dhaka',
  bankRoutingNumber: '090273841',
  bankPaymentInstructions: 'অনুগ্রহ করে উপরের ব্যাংক অ্যাকাউন্টে অর্ডার মূল্য জমা দিন বা অনলাইন ফান্ড ট্রান্সফার (BEFTN/NPSB/RTGS) করুন। এরপর ট্রানজেকশন আইডি / রেফারেন্স নম্বর নিচে প্রদান করে অর্ডার কনফার্ম করুন।',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  whatsappNumber: '+8801834355700',
  logoUrl: '',
  logoHeight: 80,
  heroBannerUrl: ''
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Farhana Akter',
    location: 'Dhaka (Mirpur)',
    rating: 5,
    date: '2 days ago',
    content: 'The fabric quality and embroidery work are truly premium! Received exactly as pictured. Chiffon dupatta is generous and prints are crisp. Delivered in Dhaka within 24 hours. Highly recommended!',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Sadia Nusrat',
    location: 'Chittagong (GEC)',
    rating: 5,
    date: '1 week ago',
    content: 'I ordered the Peach Rose color. The shade is wonderful and breathable cotton fabric is feather-soft. Perfect packaging.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Tanzila Haque',
    location: 'Sylhet',
    rating: 5,
    date: '2 weeks ago',
    content: 'Received within 2 days via Steadfast delivery. Sizing is spot on and stitching finish is excellent.',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Nusrat Jahan',
    location: 'Uttara, Dhaka',
    rating: 4,
    date: '3 weeks ago',
    content: 'Awesome fabric. Delivery courier was courteous and allowed checking parcel before payment.',
    verified: true
  }
];

export const BANGLADESH_DIVISIONS: { [division: string]: string[] } = {
  'Dhaka': ['Dhaka City', 'Gazipur', 'Narayanganj', 'Manikganj', 'Tangail', 'Narsingdi', 'Munshiganj', 'Faridpur'],
  'Chittagong': ['Chittagong Sadar', "Cox's Bazar", 'Cumilla', 'Feni', 'Brahmanbaria', 'Noakhali', 'Chandpur'],
  'Sylhet': ['Sylhet Sadar', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  'Rajshahi': ['Rajshahi Sadar', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore'],
  'Khulna': ['Khulna Sadar', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat'],
  'Barishal': ['Barishal Sadar', 'Patuakhali', 'Bhola', 'Pirojpur'],
  'Rangpur': ['Rangpur Sadar', 'Dinajpur', 'Kurigram', 'Gaibandha'],
  'Mymensingh': ['Mymensingh Sadar', 'Jamalpur', 'Netrokona', 'Sherpur']
};

export const DHAKA_THANAS = [
  'Mirpur 10',
  'Mirpur 1',
  'Mirpur 2',
  'Mirpur 12',
  'Dhanmondi',
  'Gulshan 1',
  'Gulshan 2',
  'Banani',
  'Uttara',
  'Mohammadpur',
  'Badda',
  'Motijheel',
  'Paltan',
  'Khilgaon',
  'Bashundhara R/A'
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Three Piece',
    nameBn: 'থ্রি পিস',
    slug: 'three-piece',
    icon: 'styler',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgl1mxD7xqCL0ynMNHnEYB4ly1czqvWwe1H5N3DUQh5cBDXWKPuDe4wdlPKjvknMiA_1e6M_VYLDaJ_rBBK9qywF2nVMtoDXxfFI-0xvBbtu7nzGUsrtjs7ZhldAGoo4UyhtHx5HoNoFu7ISoVKtXUeUXaGW2GSQW9h8XD7Z5oai92fBhLU8bzfeNS7TnUheeFZimFZPUgyAUFZhWDmHs9Ed1ClecfnBfKFB0GbHwgudWl2NNuyulyiw',
    description: 'প্রিমিয়াম কোয়ালিটি থ্রি পিস কালেকশন',
    isPopular: true
  },
  {
    id: 'cat-2',
    name: 'Saree',
    nameBn: 'শাড়ি',
    slug: 'saree',
    icon: 'woman',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUMFZmvcY_p5Ci-PIml_Bfhs3pRc9IEdin8J5lDPT7-OosOKk0HeJI4CzXmwIQHL-q_NtT4T4KHmZTYOJdhbW1u5euUsUMwGBdczNR3pHdd-1NvQUAxkEPmLopiFOhYknTRq8z1nlbZRrBdzAU-WS1u1tbsxwb8SeWHSRwx5g8sFAZw1dZMc6B9v77wk-MhrXCzelsLOj5zuz65w1c5DDPHV7mrCv9nff77p6CzXn1UTxn970tNMXyw',
    description: 'ঐতিহ্যবাহী ও আধুনিক সিল্ক ও জামদানি শাড়ি',
    isPopular: true
  },
  {
    id: 'cat-3',
    name: 'Kurti',
    nameBn: 'কুর্তি',
    slug: 'kurti',
    icon: 'apparel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7wruyNf5oPKZNBsyD2im6mOOe3YFEJA5VZz_Bb1LJdE4An0FDCTk4GDh4WOV9zycwxu_Z6IiRgaUBSGrWaHfUmCY_clJ7_bUHvFbkypUuaJN7LVO1aY_-a8ixMKScjfiPtRCKZPtKPqBXYAXNaIThYVGPQlU2bjjtayt7-QH3GBS41xzi3zt9y8Y9Hwx8rP6WkmJ8bnAf7q8dgflnq4mtgKRmQbY2J7wkTE2o6AE2QVh3YOtfXYzskg',
    description: 'ট্রেন্ডি ও ক্যাজুয়াল ডিজাইনার কুর্তি',
    isPopular: true
  },
  {
    id: 'cat-4',
    name: "Men's Wear",
    nameBn: 'পুরুষদের পোশাক',
    slug: 'mens-wear',
    icon: 'man',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHVvNf2_CmOAj53nasaS4aXy96Tj7G_n_nBIK6tazh4z2cjpd7N4GbLUuy4v37PVzNT1tFJNlSXLqXNpADYk5hYRgqp7u2q4QuyBre1haWQD10Z00GqR_8NstHjKhnSZrOz867pDzTIT8Ihddfhmsf8ixVfnVbiU0Bc9knV5NcGVRgFeqrawPyyDYH9OaueZjnr7Dw7ttVW6eJN077C0xrXmcRDLFl6QFSFjwHHDA0xB37uqyraXQi_w',
    description: 'প্রিমিয়াম পাঞ্জাবি, শার্ট ও ফরমাল ওয়্যার',
    isPopular: true
  },
  {
    id: 'cat-5',
    name: 'Kids Wear',
    nameBn: 'বাচ্চাদের পোশাক',
    slug: 'kids-wear',
    icon: 'child_care',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7knPnNbDULYX-WWrx9NVEQlA1rqtxOB1fW5Bvm-Fzdn7RWxzeWJKkXpYM8LpwIagupsoq0SInJeOl-ejzWT9XZMfyDhxtKQ4-GZ_WIK6Upzz4glgBHqSpL-RyUBzgsUkRSqaE6Pzl16dy7IvlZDcYGDpEvX2fO4PU8CBLjHm8D16C8G9t5NWF3D_TqLz7f2jI6_C75yg1tesY_zGOh2I9Vt-IAwqyW--zVfPT9G5hfqlRuU6NkuQz-w',
    description: 'আরামদায়ক ও আকর্ষণীয় কিডস কালেকশন'
  },
  {
    id: 'cat-6',
    name: 'T-Shirt',
    nameBn: 'টি-শার্ট',
    slug: 't-shirt',
    icon: 'dry_cleaning',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Dx4KnfNwolc1jFkTg3KqOLaPFHQSsURrNMhIEtGude4L1A-U3Gm7kByzVGuT_Loggup3dWoUPwZ11atJtY-Sa3cMeEydi9PZIJOp1PFCMiDgCylRUKp7nPATs-coNroooxBce0W9ZZBgUy1cCB7ssJAmovL7ErXIvLjkFmuTRLrhIIjI_UDc1wiJGLegWUzkjN2ATiKSuCZ0PUlB5S75J49GvzieCNtH5vzbFZsYOgSIYFHrH3JYXQ',
    description: '১০০% কম্বড কটন ক্যাজুয়াল টি-শার্ট'
  },
  {
    id: 'cat-7',
    name: 'Pants',
    nameBn: 'প্যান্ট ও ট্রাউজার',
    slug: 'pants',
    icon: 'straighten',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrZyRuQW56gx6SObu82JSclOKgv84Tj6YL6-3pLqTn4dgXu41KV2ZPYBU6xSZ2M9CJiuJwzZLcHvLVgnK3PdwdH5BzOZymPR-yHFya2XImx6kWDxx_-eIW5Z51ikMEfLC5aCwouJnf_2-2nuau01DoFISkXatjfajRzK36cwuYhdIic5VjS_RGCa6_oYcWI8DazyrsOf2bbqgpNv4OcUH7fWraFj6mQewQ_xv-PqHyJx2TRAwCP93NJg',
    description: 'জিন্স, চিনোস ও ক্যাজুয়াল ট্রাউজার্স'
  },
  {
    id: 'cat-8',
    name: 'Hijab',
    nameBn: 'হিজাব ও বোরকা',
    slug: 'hijab',
    icon: 'female',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6wwDrE_y3BP5tQPvMnmCXp43LZjoF8m6KTK-WoFcUo1T5t1ShubVL0yn9-rTc_7q3JR9GiUN1t66mhAlWwxDpHideZQD7M441BEfGYhqPNPQgClZgE6rLW53ZYkVPkm2_GR7GbjVkFgzfRBvHF_b1itTjsqzp_FD2B8vwPnAv2I91PDYWo5pbpqW3hVPbw2npNPiUxxEx-1wdMhTuyjlUappNLmyb3ze7JEsA5SNhdGU6LnTgTabZgw',
    description: 'প্রিমিয়াম জর্জেট ও শিফন হিজাব ও ওড়না',
    isPopular: true
  },
  {
    id: 'cat-9',
    name: 'Shoes',
    nameBn: 'জুতো ও জুতা',
    slug: 'shoes',
    icon: 'steps',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMVQCvL6vhVKdBAiHnhj5Hlan-Tv9p7RBQI_dvBTcUFFs_UP8As4TsfneqVyS-zKRCZ5fAtNJPhjGcc0NKBfn_WeEipTVRbVlBjK-Mcu19hgcdxS-oMzwB1m-8JiU4puJ9wMUXMbPXv77wb_Cm3avWR3JMRM5joOQWXOxIEWY-EtE2ULMFZmOV01msZrkYfb4LWvoqiAvPsygCmhxghq5lLtgCdbc99Wh5DN0U8zNDR3i3hDeS_4pUZw',
    description: 'স্নিকার্স, লোফার্স ও ক্যাজুয়াল ফুটওয়্যার',
    isPopular: true
  },
  {
    id: 'cat-10',
    name: 'Bags',
    nameBn: 'ব্যাগ ও পার্স',
    slug: 'bags',
    icon: 'shopping_bag',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-pkZ34lfLrZ0-UGT2wjkU-JC6SecQYpRMX-lzKfK8CeXOE6SiEHfkuZyVeKrfR1KR_HQ22Ax8N_IT1cBzQ4l0AuspcJv2BnnxIotBKGmAwG-lcE0C480Czjo3XMnW3PQPzKEdNWgLcHXajyd8rr88E5jEh3qgl1f7QssjnXUQLJdjeqJ9nbIB9jCCXg5_7ZV5AkDV8XS1gXurmsy9aT9chPClelhbZG94rBUT1C61SKkr8fU33zaHeg',
    description: 'লেডিস হ্যান্ডব্যাগ, ক্লাচ ও টোট ব্যাগ',
    isPopular: true
  },
  {
    id: 'cat-11',
    name: 'Beauty & Makeup',
    nameBn: 'সৌন্দর্য ও প্রসাধন',
    slug: 'beauty-makeup',
    icon: 'brush',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRtrBSWpU4kv2GcXpmaYlB9yfJoJo4YRHwtrj6fFtoWLU8TDqyLsUXn9mz2RZhy0aslz9CbytJsbJQwv9pxSH_ppKh2GDVb0FjNKeqdXR-vYYiElc_HgEiE2X9viTMnxu8Scdb7nqiRP2kv2ZpsM94SS29BO2Pl1CAN1Lzwq9nYrkCKCXVlXy7RAayd2SDJcaQde6iJoxKpmvofJt06wTSUDhKgChz0gtMQTTJgvxbHd-QeCOZT9kdOg',
    description: 'অরজিনাল স্কিনকেয়ার ও কসমেটিকস'
  },
  {
    id: 'cat-12',
    name: 'Electronics',
    nameBn: 'ইলেকট্রনিক্স ও গ্যাজেট',
    slug: 'electronics',
    icon: 'devices',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQwWovyKvkKiWd6JFv7pVBoAcupl5aBrsQobcwc24vjrZCojC_aDRF10ziLIDaqwENXkMQUYWoobFVS-vnVsqCNhCrxsSPWnddkMlF8xhxLDUNO8tnocbJrnc9jNAE2Sin-mNgBRZl6I2IQ9w8gU_dHmvvrcC9D9Skf_e0EbcMp1vpSPhNefuoDtwPSjxu5vD72QBBbfD8e4qYKCj5bm5Ik-wk8uQQKhIVg158EzBWb334_Cfa8fqYWQ',
    description: 'স্মার্ট ওয়াচ, ইয়ারবাডস ও লাইফস্টাইল গ্যাজেট'
  },
  {
    id: 'cat-13',
    name: 'Jewelry & Accessories',
    nameBn: 'গহনা ও অলঙ্কার',
    slug: 'jewelry-accessories',
    icon: 'diamond',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    description: 'এক্সক্লুসিভ গহনা ও ফ্যাশন এক্সেসরিজ'
  },
  {
    id: 'cat-14',
    name: 'Women Fashion',
    nameBn: 'নারীদের ফ্যাশন',
    slug: 'women-fashion',
    icon: 'female',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    description: 'লেটেস্ট ট্রেন্ডি নারীদের পোশাক'
  }
];

