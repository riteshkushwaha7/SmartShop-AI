import {
  AnalyticsSnapshot,
  ChatMessage,
  DemoStep,
  MerchantCard,
  OrderRecord,
  Product,
  ShopProfile,
} from "@/types/prototype";

export const defaultShopProfile: ShopProfile = {
  shopName: "Sharma Snacks",
  businessCategory: "Snacks & Daily Essentials",
  location: "Lajpat Nagar, New Delhi",
  openingTime: "08:00",
  closingTime: "22:00",
  fulfillmentOption: "Both",
};

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Samosa",
    category: "Snacks",
    price: 20,
    stock: 44,
    imageHint: "Golden triangular snack",
  },
  {
    id: "p2",
    name: "Chai",
    category: "Beverages",
    price: 15,
    stock: 62,
    imageHint: "Masala tea in kulhad",
  },
  {
    id: "p3",
    name: "Kachori",
    category: "Snacks",
    price: 30,
    stock: 11,
    imageHint: "Crispy stuffed kachori",
  },
  {
    id: "p4",
    name: "Perfume",
    category: "Personal Care",
    price: 320,
    stock: 7,
    imageHint: "Pocket perfume bottle",
  },
  {
    id: "p5",
    name: "Beauty Cream",
    category: "Personal Care",
    price: 180,
    stock: 0,
    imageHint: "Skin cream jar",
  },
];

export const nearbyShops: MerchantCard[] = [
  {
    id: "m1",
    name: "Sharma Snacks",
    category: "Snacks & Chai",
    rating: 4.8,
    distanceKm: 0.8,
    status: "Open",
    etaMinutes: 18,
  },
  {
    id: "m2",
    name: "Gupta Fresh Mart",
    category: "Groceries",
    rating: 4.5,
    distanceKm: 1.2,
    status: "Open",
    etaMinutes: 22,
  },
  {
    id: "m3",
    name: "City Beauty Hub",
    category: "Beauty & Personal Care",
    rating: 4.2,
    distanceKm: 2.4,
    status: "Busy",
    etaMinutes: 35,
  },
  {
    id: "m4",
    name: "Metro Daily Needs",
    category: "General Store",
    rating: 4.0,
    distanceKm: 3.1,
    status: "Closed",
    etaMinutes: 0,
  },
];

export const preloadedChat: ChatMessage[] = [
  {
    id: "c1",
    sender: "customer",
    text: "I want 2 samosas and 1 chai",
    timestamp: "4:34 PM",
  },
  {
    id: "c2",
    sender: "customer",
    text: "Please deliver by 5 PM",
    timestamp: "4:35 PM",
  },
  {
    id: "a1",
    sender: "assistant",
    text: "Got it. I am checking stock and preparing your order summary.",
    timestamp: "4:35 PM",
  },
];

export const seededOrders: OrderRecord[] = [
  {
    id: "PSA-2091",
    customerName: "Riya Kapoor",
    itemsSummary: "1x Kachori, 2x Chai",
    total: 60,
    paymentStatus: "Paid",
    orderStatus: "Out for Delivery",
    address: "B-12 Amar Colony",
    placedAt: "11:42 AM",
  },
  {
    id: "PSA-2089",
    customerName: "Arjun Verma",
    itemsSummary: "3x Samosa",
    total: 70,
    paymentStatus: "Paid",
    orderStatus: "Completed",
    address: "C-44 Lajpat Nagar",
    placedAt: "10:05 AM",
  },
];

export const analyticsSeed: AnalyticsSnapshot = {
  dailyOrders: [
    { label: "Mon", value: 18 },
    { label: "Tue", value: 22 },
    { label: "Wed", value: 27 },
    { label: "Thu", value: 25 },
    { label: "Fri", value: 33 },
    { label: "Sat", value: 39 },
    { label: "Sun", value: 29 },
  ],
  dailyRevenue: [
    { label: "Mon", value: 1280 },
    { label: "Tue", value: 1490 },
    { label: "Wed", value: 1780 },
    { label: "Thu", value: 1700 },
    { label: "Fri", value: 2120 },
    { label: "Sat", value: 2460 },
    { label: "Sun", value: 1910 },
  ],
  productSales: [
    { product: "Samosa", units: 210 },
    { product: "Chai", units: 182 },
    { product: "Kachori", units: 94 },
    { product: "Perfume", units: 28 },
    { product: "Beauty Cream", units: 14 },
  ],
  paymentSuccessRate: 97.3,
};

export const demoSteps: DemoStep[] = [
  { screen: "onboarding", title: "Merchant creates a virtual shop", delayMs: 1400 },
  { screen: "inventory", title: "Products and stock configured", delayMs: 1500 },
  { screen: "discovery", title: "Customer discovers nearby shop", delayMs: 1300 },
  { screen: "chat", title: "Customer places chat-based order", delayMs: 1600 },
  { screen: "billing", title: "AI generates instant bill", delayMs: 1300 },
  { screen: "payment", title: "Payment link sent and paid", delayMs: 1700 },
  { screen: "dashboard", title: "Paid order appears for merchant", delayMs: 1400 },
  { screen: "erp", title: "ERP modules sync inventory and payment", delayMs: 1400 },
  { screen: "analytics", title: "Business analytics auto-refresh", delayMs: 1500 },
];
