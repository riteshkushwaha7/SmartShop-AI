"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "@/components/smartshop/sidebar";
import { screenMeta } from "@/components/smartshop/screen-meta";
import { AnalyticsScreen } from "@/components/smartshop/screens/analytics-screen";
import { BillingScreen } from "@/components/smartshop/screens/billing-screen";
import { ChatScreen } from "@/components/smartshop/screens/chat-screen";
import { DashboardScreen } from "@/components/smartshop/screens/dashboard-screen";
import { DiscoveryScreen } from "@/components/smartshop/screens/discovery-screen";
import { ErpScreen } from "@/components/smartshop/screens/erp-screen";
import { InventoryScreen, ProductFormState } from "@/components/smartshop/screens/inventory-screen";
import { LandingScreen } from "@/components/smartshop/screens/landing-screen";
import { OnboardingScreen } from "@/components/smartshop/screens/onboarding-screen";
import { PaymentScreen } from "@/components/smartshop/screens/payment-screen";
import { AppButton, LoadingState, SurfaceCard } from "@/components/smartshop/ui";
import {
  analyticsSeed,
  defaultShopProfile,
  demoSteps,
  initialProducts,
  nearbyShops,
  preloadedChat,
  seededOrders,
} from "@/data/mock-data";
import { applyStockDeduction, createBill, formatCurrency, parseOrderFromChat } from "@/lib/prototype-utils";
import {
  AnalyticsSnapshot,
  Bill,
  ChatMessage,
  OrderRecord,
  ParsedOrder,
  Product,
  ScreenId,
  ShopProfile,
  StockUpdateLog,
} from "@/types/prototype";

const initialProductForm: ProductFormState = {
  name: "",
  category: "Snacks",
  price: "",
  stock: "",
  imageHint: "",
};

function nowTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function createOrderId() {
  return `PSA-${Math.floor(1000 + Math.random() * 9000)}`;
}

function buildOrderSummary(items: { name: string; quantity: number }[]) {
  return items.map((item) => `${item.quantity}x ${item.name}`).join(", ");
}

export function SmartShopPrototype() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("landing");
  const [isSwitchingScreen, setIsSwitchingScreen] = useState(false);
  const [switchingLabel, setSwitchingLabel] = useState("Loading module...");
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStatus, setDemoStatus] = useState("Demo ready");

  const [shopProfile, setShopProfile] = useState<ShopProfile>(defaultShopProfile);
  const [onboardingDraft, setOnboardingDraft] = useState<ShopProfile>(defaultShopProfile);
  const [shopCreated, setShopCreated] = useState(true);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [inventoryBusy, setInventoryBusy] = useState(false);

  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState("m1");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(preloadedChat);
  const [chatInput, setChatInput] = useState("");
  const [parsingOrder, setParsingOrder] = useState(false);
  const [parsedOrder, setParsedOrder] = useState<ParsedOrder | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);

  const [paymentStep, setPaymentStep] = useState<"idle" | "link_generated" | "processing" | "success">("idle");
  const [paymentLink, setPaymentLink] = useState("");

  const [orders, setOrders] = useState<OrderRecord[]>(seededOrders);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot>(analyticsSeed);
  const [stockUpdateLogs, setStockUpdateLogs] = useState<StockUpdateLog[]>([]);
  const [merchantNotification, setMerchantNotification] = useState<string | null>(null);
  const [analyticsRefreshing, setAnalyticsRefreshing] = useState(false);

  const switchTimerRef = useRef<number | null>(null);
  const paymentTimerRef = useRef<number | null>(null);
  const demoTimersRef = useRef<number[]>([]);
  const orderCommittedRef = useRef(false);
  const nextProductIdRef = useRef(6000);
  const productsRef = useRef<Product[]>(products);
  const parsedOrderRef = useRef<ParsedOrder | null>(parsedOrder);
  const billRef = useRef<Bill | null>(bill);

  const selectedMerchant = useMemo(
    () => nearbyShops.find((shop) => shop.id === selectedMerchantId) ?? nearbyShops[0],
    [selectedMerchantId],
  );

  const filteredShops = useMemo(() => {
    if (!discoveryQuery.trim()) {
      return nearbyShops;
    }

    const query = discoveryQuery.toLowerCase();
    return nearbyShops.filter((shop) => {
      return (
        shop.name.toLowerCase().includes(query) ||
        shop.category.toLowerCase().includes(query) ||
        shop.status.toLowerCase().includes(query)
      );
    });
  }, [discoveryQuery]);

  const lowStockCount = useMemo(() => products.filter((product) => product.stock > 0 && product.stock <= 10).length, [products]);
  const outOfStockCount = useMemo(() => products.filter((product) => product.stock === 0).length, [products]);
  const revenueToday = useMemo(() => orders.filter((order) => order.paymentStatus === "Paid").reduce((sum, order) => sum + order.total, 0), [orders]);
  const newOrdersCount = useMemo(() => orders.filter((order) => order.orderStatus === "New").length, [orders]);

  function clearSwitchTimer() {
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }
  }

  function clearPaymentTimer() {
    if (paymentTimerRef.current) {
      window.clearTimeout(paymentTimerRef.current);
      paymentTimerRef.current = null;
    }
  }

  function clearDemoTimers() {
    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    demoTimersRef.current = [];
  }

  function navigate(screen: ScreenId, label?: string) {
    if (screen === currentScreen) {
      return;
    }

    clearSwitchTimer();
    setSwitchingLabel(label ?? `Opening ${screenMeta[screen].title}...`);
    setIsSwitchingScreen(true);
    switchTimerRef.current = window.setTimeout(() => {
      setCurrentScreen(screen);
      setIsSwitchingScreen(false);
    }, 420);
  }

  function resetCustomerJourneyState() {
    setChatMessages(preloadedChat);
    setChatInput("");
    setParsedOrder(null);
    setBill(null);
    parsedOrderRef.current = null;
    billRef.current = null;
    setPaymentStep("idle");
    setPaymentLink("");
    orderCommittedRef.current = false;
  }

  function resetAllStateForDemo() {
    setShopProfile(defaultShopProfile);
    setOnboardingDraft(defaultShopProfile);
    setShopCreated(true);
    setProducts(initialProducts);
    productsRef.current = initialProducts;
    setProductForm(initialProductForm);
    setEditingProductId(null);
    setDiscoveryQuery("");
    setSelectedMerchantId("m1");
    setChatMessages(preloadedChat);
    setChatInput("");
    setParsingOrder(false);
    setParsedOrder(null);
    setBill(null);
    parsedOrderRef.current = null;
    billRef.current = null;
    setPaymentStep("idle");
    setPaymentLink("");
    setOrders(seededOrders);
    setAnalytics(analyticsSeed);
    setStockUpdateLogs([]);
    setMerchantNotification(null);
    orderCommittedRef.current = false;
  }

  function updateProductForm<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setProductForm((prev) => ({ ...prev, [key]: value }));
  }

  function getNextProductId() {
    nextProductIdRef.current += 1;
    return `p${nextProductIdRef.current}`;
  }

  function handleInventorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!productForm.name.trim() || !productForm.category.trim() || !productForm.price || !productForm.stock) {
      return;
    }

    setInventoryBusy(true);

    const normalizedProduct: Product = {
      id: editingProductId ?? getNextProductId(),
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      imageHint: productForm.imageHint.trim() || "Product image",
    };

    window.setTimeout(() => {
      setProducts((prev) => {
        let nextProducts: Product[];
        if (editingProductId) {
          nextProducts = prev.map((product) => (product.id === editingProductId ? normalizedProduct : product));
        } else {
          nextProducts = [normalizedProduct, ...prev];
        }
        productsRef.current = nextProducts;
        return nextProducts;
      });
      setProductForm(initialProductForm);
      setEditingProductId(null);
      setInventoryBusy(false);
    }, 550);
  }

  function handleRunOrderParsing(sourceMessages?: ChatMessage[]) {
    const snapshot = sourceMessages ?? chatMessages;
    setParsingOrder(true);

    window.setTimeout(() => {
      const extracted = parseOrderFromChat(snapshot, productsRef.current);
      const nextBill = createBill(extracted, selectedMerchant.etaMinutes > 20 ? 28 : 20);

      setParsedOrder(extracted);
      setBill(nextBill);
      parsedOrderRef.current = extracted;
      billRef.current = nextBill;

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text:
            extracted.items.length === 0
              ? "I could not detect items. Please send quantity with product names."
              : extracted.missingDetails.length > 0
                ? `Parsed ${extracted.items.length} items. Please confirm: ${extracted.missingDetails.join(" and ")}.`
                : "Order parsed successfully. Bill is ready.",
          timestamp: nowTime(),
        },
      ]);

      setParsingOrder(false);
      setPaymentStep("idle");
      setPaymentLink("");
      orderCommittedRef.current = false;
    }, 900);
  }

  function updateAnalyticsAfterOrder(total: number, items: ParsedOrder["items"]) {
    setAnalytics((prev) => {
      const dailyOrders = [...prev.dailyOrders];
      const dailyRevenue = [...prev.dailyRevenue];

      if (dailyOrders.length > 0) {
        dailyOrders[dailyOrders.length - 1] = {
          ...dailyOrders[dailyOrders.length - 1],
          value: dailyOrders[dailyOrders.length - 1].value + 1,
        };
      }

      if (dailyRevenue.length > 0) {
        dailyRevenue[dailyRevenue.length - 1] = {
          ...dailyRevenue[dailyRevenue.length - 1],
          value: dailyRevenue[dailyRevenue.length - 1].value + total,
        };
      }

      const productSales = prev.productSales.map((entry) => {
        const ordered = items.find((item) => item.name.toLowerCase() === entry.product.toLowerCase());
        if (!ordered) {
          return entry;
        }

        return {
          ...entry,
          units: entry.units + ordered.quantity,
        };
      });

      return {
        ...prev,
        dailyOrders,
        dailyRevenue,
        productSales,
        paymentSuccessRate: Number((Math.min(99.4, prev.paymentSuccessRate + 0.1)).toFixed(1)),
      };
    });
  }

  function finalizeSuccessfulPayment() {
    const latestParsedOrder = parsedOrderRef.current;
    const latestBill = billRef.current;
    const latestProducts = productsRef.current;

    if (!latestParsedOrder || !latestBill || orderCommittedRef.current) {
      return;
    }

    const before = new Map(latestProducts.map((product) => [product.id, product.stock]));
    const updatedProducts = applyStockDeduction(latestProducts, latestParsedOrder.items);

    const logs: StockUpdateLog[] = latestParsedOrder.items.map((item) => ({
      productName: item.name,
      before: before.get(item.productId) ?? 0,
      after: updatedProducts.find((product) => product.id === item.productId)?.stock ?? 0,
    }));

    const newOrder: OrderRecord = {
      id: createOrderId(),
      customerName: "Ananya Mehta",
      itemsSummary: buildOrderSummary(latestParsedOrder.items.map((item) => ({ name: item.name, quantity: item.quantity }))),
      total: latestBill.total,
      paymentStatus: "Paid",
      orderStatus: "New",
      address: latestParsedOrder.deliveryAddress,
      placedAt: nowTime(),
    };

    productsRef.current = updatedProducts;
    setProducts(updatedProducts);
    setStockUpdateLogs(logs);
    setOrders((prev) => [newOrder, ...prev]);
    setMerchantNotification(`New paid order ${newOrder.id} received for ${formatCurrency(newOrder.total)}.`);
    updateAnalyticsAfterOrder(newOrder.total, latestParsedOrder.items);

    orderCommittedRef.current = true;
  }

  function handlePayNow() {
    if (paymentStep !== "link_generated") {
      return;
    }

    clearPaymentTimer();
    setPaymentStep("processing");
    paymentTimerRef.current = window.setTimeout(() => {
      setPaymentStep("success");
      finalizeSuccessfulPayment();
    }, 1300);
  }

  function handleRunDemoMode() {
    clearSwitchTimer();
    clearPaymentTimer();
    clearDemoTimers();

    resetAllStateForDemo();
    setCurrentScreen("landing");
    setDemoRunning(true);
    setDemoStatus("Demo running...");

    let elapsed = 600;

    demoSteps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        setCurrentScreen(step.screen);
        setDemoStatus(step.title);

        if (step.screen === "chat") {
          handleRunOrderParsing(preloadedChat);
        }

        if (step.screen === "payment") {
          setPaymentStep("processing");
          const localTimer = window.setTimeout(() => {
            setPaymentStep("success");
            finalizeSuccessfulPayment();
          }, 850);
          demoTimersRef.current.push(localTimer);
        }

        if (index === demoSteps.length - 1) {
          const endTimer = window.setTimeout(() => {
            setDemoRunning(false);
            setDemoStatus("Demo complete. Ready to rerun.");
          }, 1100);
          demoTimersRef.current.push(endTimer);
        }
      }, elapsed);

      demoTimersRef.current.push(timer);
      elapsed += step.delayMs;
    });
  }

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    parsedOrderRef.current = parsedOrder;
  }, [parsedOrder]);

  useEffect(() => {
    billRef.current = bill;
  }, [bill]);

  useEffect(() => {
    return () => {
      clearSwitchTimer();
      clearPaymentTimer();
      clearDemoTimers();
    };
  }, []);

  useEffect(() => {
    if (!merchantNotification) {
      return;
    }

    const timer = window.setTimeout(() => setMerchantNotification(null), 4400);
    return () => window.clearTimeout(timer);
  }, [merchantNotification]);

  function renderCurrentScreen() {
    if (isSwitchingScreen) {
      return (
        <SurfaceCard>
          <LoadingState text={switchingLabel} />
        </SurfaceCard>
      );
    }

    switch (currentScreen) {
      case "landing":
        return (
          <LandingScreen
            ordersCount={orders.length}
            revenue={revenueToday}
            inventoryCount={products.length}
            lowStockCount={lowStockCount}
            outOfStockCount={outOfStockCount}
            paymentSuccessRate={analytics.paymentSuccessRate}
            demoRunning={demoRunning}
            demoStatus={demoStatus}
            onNavigate={navigate}
            onRunDemo={handleRunDemoMode}
          />
        );
      case "onboarding":
        return (
          <OnboardingScreen
            draft={onboardingDraft}
            preview={shopProfile}
            shopCreated={shopCreated}
            onDraftChange={setOnboardingDraft}
            onCreateShop={() => {
              setShopProfile(onboardingDraft);
              setShopCreated(true);
              navigate("inventory", "Virtual shop created. Opening inventory setup...");
            }}
            onViewInventory={() => navigate("inventory")}
          />
        );
      case "inventory":
        return (
          <InventoryScreen
            products={products}
            productForm={productForm}
            editingProductId={editingProductId}
            busy={inventoryBusy}
            lowStockCount={lowStockCount}
            outOfStockCount={outOfStockCount}
            onFormChange={updateProductForm}
            onSubmit={handleInventorySubmit}
            onEdit={(product) => {
              setEditingProductId(product.id);
              setProductForm({
                name: product.name,
                category: product.category,
                price: String(product.price),
                stock: String(product.stock),
                imageHint: product.imageHint,
              });
            }}
            onDelete={(id) => {
              setProducts((prev) => {
                const nextProducts = prev.filter((product) => product.id !== id);
                productsRef.current = nextProducts;
                return nextProducts;
              });
              if (editingProductId === id) {
                setEditingProductId(null);
                setProductForm(initialProductForm);
              }
            }}
            onCancelEdit={() => {
              setEditingProductId(null);
              setProductForm(initialProductForm);
            }}
            onNext={() => navigate("discovery")}
          />
        );
      case "discovery":
        return (
          <DiscoveryScreen
            query={discoveryQuery}
            shops={filteredShops}
            selectedShop={selectedMerchant}
            selectedShopId={selectedMerchantId}
            onQueryChange={setDiscoveryQuery}
            onSelectShop={setSelectedMerchantId}
            onOpenChat={() => navigate("chat", "Opening chat ordering for selected shop...")}
          />
        );
      case "chat":
        return (
          <ChatScreen
            merchantName={selectedMerchant.name}
            messages={chatMessages}
            chatInput={chatInput}
            parsedOrder={parsedOrder}
            parsingOrder={parsingOrder}
            onChatInputChange={setChatInput}
            onSendMessage={() => {
              if (!chatInput.trim()) {
                return;
              }

              setChatMessages((prev) => [
                ...prev,
                {
                  id: `u-${Date.now()}`,
                  sender: "customer",
                  text: chatInput.trim(),
                  timestamp: nowTime(),
                },
              ]);
              setChatInput("");
            }}
            onRunParsing={() => handleRunOrderParsing()}
            onReset={() => {
              resetCustomerJourneyState();
              setMerchantNotification("Chat journey reset with preload messages.");
            }}
            onGenerateBill={() => {
              if (!parsedOrder || parsedOrder.items.length === 0) {
                return;
              }

              setBill(createBill(parsedOrder, selectedMerchant.etaMinutes > 20 ? 28 : 20));
              navigate("billing", "Generating itemized bill...");
            }}
            onCheckInventory={() => navigate("inventory")}
          />
        );
      case "billing":
        return (
          <BillingScreen
            bill={bill}
            parsedOrder={parsedOrder}
            onProceedToPay={() => navigate("payment")}
            onBackToChat={() => navigate("chat")}
          />
        );
      case "payment":
        return (
          <PaymentScreen
            total={bill?.total ?? 0}
            paymentStep={paymentStep}
            paymentLink={paymentLink}
            onGenerateLink={() => {
              if (!bill) {
                return;
              }

              setPaymentStep("link_generated");
              setPaymentLink(`https://paytm.me/pay/PSA-${Math.floor(100000 + Math.random() * 899999)}`);
            }}
            onPayNow={handlePayNow}
            onViewDashboard={() => navigate("dashboard")}
            onResetState={() => {
              setPaymentStep("idle");
              setPaymentLink("");
              orderCommittedRef.current = false;
            }}
            onBackToBill={() => navigate("billing")}
          />
        );
      case "dashboard":
        return (
          <DashboardScreen
            orders={orders}
            newOrdersCount={newOrdersCount}
            revenueToday={revenueToday}
            pendingDeliveriesCount={orders.filter((order) => order.orderStatus === "Out for Delivery").length}
            lowStockAlerts={lowStockCount + outOfStockCount}
            notification={merchantNotification}
            onOpenErp={() => navigate("erp")}
            onOpenAnalytics={() => navigate("analytics")}
          />
        );
      case "erp":
        return <ErpScreen analytics={analytics} products={products} stockUpdateLogs={stockUpdateLogs} />;
      case "analytics":
        return (
          <AnalyticsScreen
            analytics={analytics}
            refreshing={analyticsRefreshing}
            onRefresh={() => {
              setAnalyticsRefreshing(true);
              window.setTimeout(() => {
                setAnalyticsRefreshing(false);
                setMerchantNotification("Analytics refreshed with latest payments, orders, and stock signals.");
              }, 900);
            }}
            onBackDashboard={() => navigate("dashboard")}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcecff_0%,#f7fbff_40%,#f4f7fd_100%)] px-4 py-4 text-[#163670] md:px-6 md:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[280px_1fr]">
        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <Sidebar active={currentScreen} onNavigate={navigate} onRunDemo={handleRunDemoMode} demoRunning={demoRunning} />
        </div>

        <main className="rounded-3xl border border-[#dce7fc] bg-white/80 p-4 shadow-[0_22px_44px_rgba(16,63,160,0.08)] md:p-6">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#e4ecfb] pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#5e739c]">Prototype Screen</p>
              <h2 className="text-2xl font-semibold text-[#123877]">{screenMeta[currentScreen].title}</h2>
              <p className="text-sm text-[#60749d]">{screenMeta[currentScreen].subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AppButton variant="secondary" onClick={() => navigate("landing")}>Overview</AppButton>
              <AppButton variant="ghost" onClick={() => navigate("dashboard")}>Merchant View</AppButton>
            </div>
          </header>

          {renderCurrentScreen()}
        </main>
      </div>
    </div>
  );
}
