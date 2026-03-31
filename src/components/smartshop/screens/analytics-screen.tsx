import { MiniBarChart, MiniLineChart, RingMetric } from "@/components/smartshop/charts";
import { AppButton, LoadingState, StatCard, SurfaceCard } from "@/components/smartshop/ui";
import { formatCurrency, topSeller, totalOrders, totalRevenue } from "@/lib/prototype-utils";
import { AnalyticsSnapshot } from "@/types/prototype";

interface AnalyticsScreenProps {
  analytics: AnalyticsSnapshot;
  refreshing: boolean;
  onRefresh: () => void;
  onBackDashboard: () => void;
}

export function AnalyticsScreen({ analytics, refreshing, onRefresh, onBackDashboard }: AnalyticsScreenProps) {
  const bestSeller = topSeller(analytics.productSales);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Weekly Orders" value={`${totalOrders(analytics.dailyOrders)}`} tone="blue" />
        <StatCard label="Weekly Revenue" value={formatCurrency(totalRevenue(analytics.dailyRevenue))} tone="green" />
        <StatCard
          label="Best Seller"
          value={bestSeller?.product ?? "N/A"}
          change={bestSeller ? `${bestSeller.units} units sold` : "No sales yet"}
          tone="amber"
        />
        <StatCard label="Payment Success" value={`${analytics.paymentSuccessRate.toFixed(1)}%`} tone="slate" />
      </div>

      {refreshing && <LoadingState text="Refreshing reports with latest order events..." />}

      <div className="grid gap-4 xl:grid-cols-2">
        <SurfaceCard title="Daily Orders">
          <MiniLineChart data={analytics.dailyOrders} />
        </SurfaceCard>

        <SurfaceCard title="Daily Revenue">
          <MiniLineChart data={analytics.dailyRevenue} currency />
        </SurfaceCard>

        <SurfaceCard title="Best-Selling Products">
          <MiniBarChart data={analytics.productSales} />
        </SurfaceCard>

        <SurfaceCard title="Payment Success Rate">
          <RingMetric value={analytics.paymentSuccessRate} label="Collection Reliability" />
        </SurfaceCard>
      </div>

      <div className="flex flex-wrap gap-2">
        <AppButton onClick={onRefresh}>Refresh Reports</AppButton>
        <AppButton variant="secondary" onClick={onBackDashboard}>Back To Dashboard</AppButton>
      </div>
    </div>
  );
}
