import {
  Bill,
  ChatMessage,
  ParsedOrder,
  ParsedOrderItem,
  Product,
  ProductSalesPoint,
  StockStatus,
  TrendPoint,
} from "@/types/prototype";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return "Out of Stock";
  }

  if (stock <= 10) {
    return "Low Stock";
  }

  return "In Stock";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function findQuantity(message: string, productName: string): number {
  const normalizedName = productName.toLowerCase();
  const singularPattern = normalizedName;
  const pluralPattern = `${normalizedName}s`;
  const regex = new RegExp(`(\\d+)\\s*(?:x\\s*)?(?:${singularPattern}|${pluralPattern})`, "i");

  const match = message.match(regex);
  if (match?.[1]) {
    return Number(match[1]);
  }

  if (message.includes(singularPattern) || message.includes(pluralPattern)) {
    return 1;
  }

  return 0;
}

export function parseOrderFromChat(messages: ChatMessage[], products: Product[]): ParsedOrder {
  const customerText = messages
    .filter((message) => message.sender === "customer")
    .map((message) => message.text.toLowerCase())
    .join(" ");

  const orderItems: ParsedOrderItem[] = products
    .map((product) => {
      const quantity = findQuantity(customerText, product.name);
      if (quantity <= 0) {
        return null;
      }

      const subtotal = quantity * product.price;
      const available = product.stock >= quantity && product.stock > 0;

      return {
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: product.price,
        stockAvailable: available,
        subtotal,
      } as ParsedOrderItem;
    })
    .filter((item): item is ParsedOrderItem => item !== null);

  const timeMatch = customerText.match(/(?:by|at)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  const deliveryTime = timeMatch?.[1]?.toUpperCase() ?? "5:00 PM";

  const addressMatch = customerText.match(/(?:to|at)\s+([a-z0-9\-\s,]+)/i);
  const deliveryAddress = addressMatch?.[1]?.trim() ?? "B-17, Lajpat Nagar II";

  const missingDetails: string[] = [];
  if (!timeMatch) {
    missingDetails.push("Preferred delivery time");
  }
  if (!addressMatch) {
    missingDetails.push("Detailed delivery address");
  }

  return {
    items: orderItems,
    deliveryTime,
    deliveryAddress,
    missingDetails,
  };
}

export function createBill(parsedOrder: ParsedOrder, deliveryFee = 20): Bill {
  const subtotal = parsedOrder.items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    lineItems: parsedOrder.items,
    deliveryFee,
    subtotal,
    total: subtotal + deliveryFee,
  };
}

export function applyStockDeduction(products: Product[], items: ParsedOrderItem[]): Product[] {
  return products.map((product) => {
    const orderedItem = items.find((item) => item.productId === product.id);
    if (!orderedItem) {
      return product;
    }

    return {
      ...product,
      stock: Math.max(0, product.stock - orderedItem.quantity),
    };
  });
}

export function totalOrders(points: TrendPoint[]): number {
  return points.reduce((sum, point) => sum + point.value, 0);
}

export function totalRevenue(points: TrendPoint[]): number {
  return points.reduce((sum, point) => sum + point.value, 0);
}

export function topSeller(points: ProductSalesPoint[]): ProductSalesPoint | null {
  if (points.length === 0) {
    return null;
  }

  return [...points].sort((a, b) => b.units - a.units)[0] ?? null;
}
