import { MiniBarChart, MiniLineChart } from "@/components/smartshop/charts";
import { EmptyState, SurfaceCard } from "@/components/smartshop/ui";
import { AnalyticsSnapshot, Product, StockUpdateLog } from "@/types/prototype";

interface ErpScreenProps {
  analytics: AnalyticsSnapshot;
  products: Product[];
  stockUpdateLogs: StockUpdateLog[];
}

export function ErpScreen({ analytics, products, stockUpdateLogs }: ErpScreenProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr] animate-fade-in">
      <SurfaceCard title="Mini ERP Modules" subtitle="Lightweight business control center">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "Inventory Management", hint: "Stock levels and reorder alerts" },
            { name: "Order Tracking", hint: "New, preparing, and delivery pipeline" },
            { name: "Payment Records", hint: "Paid and pending transactions" },
            { name: "Customer Database", hint: "Addresses, preferences, repeat users" },
            { name: "Business Analytics", hint: "Orders, revenue, top products" },
          ].map((module) => (
            <div key={module.name} className="rounded-2xl border border-[#dbe7ff] bg-[#f8fbff] p-4">
              <p className="text-sm font-semibold text-[#244276]">{module.name}</p>
              <p className="mt-1 text-xs text-[#5f749d]">{module.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 rounded-2xl border border-[#dbe7ff] bg-white p-4">
          <p className="text-sm font-semibold text-[#244276]">Stock Auto-Update After Confirmation</p>
          {stockUpdateLogs.length === 0 ? (
            <EmptyState
              title="No recent stock updates"
              message="Once a payment succeeds, SKU quantities automatically reduce and update this ERP sync log."
            />
          ) : (
            <div className="space-y-2">
              {stockUpdateLogs.map((log, index) => (
                <div key={`${log.productName}-${index}`} className="flex items-center justify-between rounded-xl bg-[#f4f8ff] p-3 text-sm">
                  <span className="font-semibold text-[#234174]">{log.productName}</span>
                  <span className="text-[#4f6694]">
                    {log.before} to {log.after}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard title="ERP Trends" subtitle="Orders, revenue, and stock movement snapshots">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#244276]">Orders Trend</p>
            <MiniLineChart data={analytics.dailyOrders} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#244276]">Revenue Trend</p>
            <MiniLineChart data={analytics.dailyRevenue} currency />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#244276]">Stock Pulse</p>
            <MiniBarChart
              data={products.map((product) => ({
                product: product.name,
                units: product.stock,
              }))}
            />
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
