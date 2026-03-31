import { ScreenId } from "@/types/prototype";

export interface ScreenMeta {
  title: string;
  subtitle: string;
}

export const screenMeta: Record<ScreenId, ScreenMeta> = {
  landing: {
    title: "Paytm SmartShop AI",
    subtitle: "From chat to checkout to business management",
  },
  onboarding: {
    title: "Merchant Onboarding",
    subtitle: "Create your virtual shop in under one minute",
  },
  inventory: {
    title: "Inventory Setup",
    subtitle: "Manage products and stock like a mini ERP",
  },
  discovery: {
    title: "Customer Discovery",
    subtitle: "Nearby search and shop selection experience",
  },
  chat: {
    title: "Chat-Based Ordering",
    subtitle: "AI parses customer messages into a structured order",
  },
  billing: {
    title: "Order Summary & Billing",
    subtitle: "Auto-generated bill with line items and delivery fee",
  },
  payment: {
    title: "Paytm Payment Flow",
    subtitle: "Payment link creation and instant success simulation",
  },
  dashboard: {
    title: "Merchant Dashboard",
    subtitle: "Track paid orders and fulfillment in one view",
  },
  erp: {
    title: "Mini ERP",
    subtitle: "Inventory, order, payment, customer, and analytics modules",
  },
  analytics: {
    title: "Analytics & Reports",
    subtitle: "Daily orders, revenue, product trends, and payment success",
  },
};

export const customerJourneyScreens: ScreenId[] = ["discovery", "chat", "billing", "payment", "dashboard"];
export const merchantJourneyScreens: ScreenId[] = ["onboarding", "inventory", "dashboard", "erp", "analytics"];
