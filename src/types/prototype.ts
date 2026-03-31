export type ScreenId =
  | "landing"
  | "onboarding"
  | "inventory"
  | "discovery"
  | "chat"
  | "billing"
  | "payment"
  | "dashboard"
  | "erp"
  | "analytics";

export type MerchantScreenId =
  | "onboarding"
  | "inventory"
  | "dashboard"
  | "erp"
  | "analytics";

export type DeliveryOption = "Delivery" | "Pickup" | "Both";

export interface ShopProfile {
  shopName: string;
  businessCategory: string;
  location: string;
  openingTime: string;
  closingTime: string;
  fulfillmentOption: DeliveryOption;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageHint: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface MerchantCard {
  id: string;
  name: string;
  category: string;
  rating: number;
  distanceKm: number;
  status: "Open" | "Busy" | "Closed";
  etaMinutes: number;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "assistant" | "system";
  text: string;
  timestamp: string;
}

export interface ParsedOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  stockAvailable: boolean;
  subtotal: number;
}

export interface ParsedOrder {
  items: ParsedOrderItem[];
  deliveryTime: string;
  deliveryAddress: string;
  missingDetails: string[];
}

export interface Bill {
  lineItems: ParsedOrderItem[];
  deliveryFee: number;
  subtotal: number;
  total: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  itemsSummary: string;
  total: number;
  paymentStatus: "Paid" | "Pending";
  orderStatus: "New" | "Preparing" | "Out for Delivery" | "Completed";
  address: string;
  placedAt: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface ProductSalesPoint {
  product: string;
  units: number;
}

export interface AnalyticsSnapshot {
  dailyOrders: TrendPoint[];
  dailyRevenue: TrendPoint[];
  productSales: ProductSalesPoint[];
  paymentSuccessRate: number;
}

export interface StockUpdateLog {
  productName: string;
  before: number;
  after: number;
}

export interface DemoStep {
  screen: ScreenId;
  title: string;
  delayMs: number;
}
