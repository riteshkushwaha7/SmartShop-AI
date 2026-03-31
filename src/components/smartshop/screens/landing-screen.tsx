import Link from "next/link";
import { AppButton, LinearProgress, StatCard, SurfaceCard } from "@/components/smartshop/ui";
import { customerJourneyScreens, merchantJourneyScreens, screenMeta } from "@/components/smartshop/screen-meta";
import { formatCurrency } from "@/lib/prototype-utils";
import { ScreenId } from "@/types/prototype";

interface LandingScreenProps {
  ordersCount: number;
  revenue: number;
  inventoryCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  paymentSuccessRate: number;
  demoRunning: boolean;
  demoStatus: string;
  onNavigate: (screen: ScreenId) => void;
  onRunDemo: () => void;
}

export function LandingScreen({
  ordersCount,
  revenue,
  inventoryCount,
  lowStockCount,
  outOfStockCount,
  paymentSuccessRate,
  demoRunning,
  demoStatus,
  onNavigate,
  onRunDemo,
}: LandingScreenProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <SurfaceCard>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f69a2]">Fintech Commerce Prototype</p>
            <h2 className="mt-2 text-4xl font-semibold leading-tight text-[#143874] md:text-5xl">Paytm SmartShop AI</h2>
            <p className="mt-3 max-w-xl text-base text-[#5c719b]">
              From chat to checkout to business management. Create virtual shops, manage inventory, parse chat orders,
              and run a mini ERP in one integrated flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppButton onClick={() => onNavigate("onboarding")}>Create Shop</AppButton>
              <AppButton variant="secondary" onClick={() => onNavigate("discovery")}>View Demo</AppButton>
              <AppButton variant="ghost" onClick={onRunDemo} disabled={demoRunning}>
                {demoRunning ? "Demo Running" : "Run Demo Mode"}
              </AppButton>
              <Link
                href="/pitch"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-[#e9f2ff] px-4 py-2.5 text-sm font-semibold text-[#1d4ca0] transition hover:bg-[#dce9ff]"
              >
                Pitch Assets
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#005ddf] via-[#1f8fff] to-[#5bc5ff] p-5 text-white">
            <p className="text-sm text-white/85">Live Prototype Highlights</p>
            <ul className="mt-4 space-y-3 text-sm text-white/95">
              <li>AI order parsing from natural language chat</li>
              <li>Inventory validation before checkout</li>
              <li>Auto-generated billing and payment simulation</li>
              <li>Paid order notification in merchant dashboard</li>
              <li>Mini ERP auto stock sync and analytics refresh</li>
            </ul>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders Today" value={`${ordersCount}`} change="Live updates from chat and app orders" tone="blue" />
        <StatCard label="Revenue" value={formatCurrency(revenue)} change="Paid orders auto-sync to analytics" tone="green" />
        <StatCard
          label="Inventory SKUs"
          value={`${inventoryCount}`}
          change={`${lowStockCount} low stock and ${outOfStockCount} out of stock`}
          tone="amber"
        />
        <StatCard
          label="Payment Success"
          value={`${paymentSuccessRate.toFixed(1)}%`}
          change="Simulated Paytm link + instant collection"
          tone="slate"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SurfaceCard title="Customer Journey" subtitle="Search, chat, bill, pay">
          <div className="space-y-2">
            {customerJourneyScreens.map((screen, index) => (
              <button
                key={screen}
                type="button"
                onClick={() => onNavigate(screen)}
                className="flex w-full items-center justify-between rounded-2xl bg-[#f4f8ff] px-3 py-2 text-left text-sm text-[#385a93] hover:bg-[#eaf2ff]"
              >
                <span>
                  {index + 1}. {screenMeta[screen].title}
                </span>
                <span className="text-xs">Open</span>
              </button>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Merchant Modules" subtitle="Onboarding, ERP, analytics">
          <div className="space-y-2">
            {merchantJourneyScreens.map((screen, index) => (
              <button
                key={screen}
                type="button"
                onClick={() => onNavigate(screen)}
                className="flex w-full items-center justify-between rounded-2xl bg-[#f4f8ff] px-3 py-2 text-left text-sm text-[#385a93] hover:bg-[#eaf2ff]"
              >
                <span>
                  {index + 1}. {screenMeta[screen].title}
                </span>
                <span className="text-xs">Open</span>
              </button>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Demo Status" subtitle="Autoplay showcase mode for judges">
          <p className="rounded-2xl bg-[#f4f8ff] p-3 text-sm text-[#4f6694]">{demoStatus}</p>
          <div className="mt-4">
            <LinearProgress
              value={demoRunning ? 65 : 100}
              label={demoRunning ? "Autoplay in progress" : "Ready for stage demo"}
            />
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
