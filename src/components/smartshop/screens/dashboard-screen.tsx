import { AppButton, EmptyState, Pill, StatCard, SurfaceCard } from "@/components/smartshop/ui";
import { formatCurrency } from "@/lib/prototype-utils";
import { OrderRecord } from "@/types/prototype";

interface DashboardScreenProps {
  orders: OrderRecord[];
  newOrdersCount: number;
  revenueToday: number;
  pendingDeliveriesCount: number;
  lowStockAlerts: number;
  notification: string | null;
  onOpenErp: () => void;
  onOpenAnalytics: () => void;
}

export function DashboardScreen({
  orders,
  newOrdersCount,
  revenueToday,
  pendingDeliveriesCount,
  lowStockAlerts,
  notification,
  onOpenErp,
  onOpenAnalytics,
}: DashboardScreenProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New Orders" value={`${newOrdersCount}`} change="Awaiting acceptance and prep" tone="blue" />
        <StatCard label="Revenue Today" value={formatCurrency(revenueToday)} change="Paid via SmartShop checkout" tone="green" />
        <StatCard label="Pending Deliveries" value={`${pendingDeliveriesCount}`} tone="amber" />
        <StatCard label="Low Stock Alerts" value={`${lowStockAlerts}`} change="Auto-detected post payment" tone="slate" />
      </div>

      {notification && (
        <div className="rounded-2xl border border-[#bfead6] bg-[#ecfff5] p-4 text-sm text-[#0c7c57]">{notification}</div>
      )}

      <SurfaceCard title="Recent Orders" subtitle="Incoming paid orders with customer details">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="Once customers complete payment, new orders will appear here with details and status."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[#5f749d]">
                <tr>
                  <th className="pb-2 pr-3">Order ID</th>
                  <th className="pb-2 pr-3">Customer</th>
                  <th className="pb-2 pr-3">Items</th>
                  <th className="pb-2 pr-3">Address</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Payment</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6eefc]">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pr-3 font-semibold text-[#223f74]">{order.id}</td>
                    <td className="py-3 pr-3 text-[#4c6391]">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-[#6a80aa]">{order.placedAt}</p>
                    </td>
                    <td className="py-3 pr-3 text-[#4c6391]">{order.itemsSummary}</td>
                    <td className="py-3 pr-3 text-[#4c6391]">{order.address}</td>
                    <td className="py-3 pr-3">
                      <Pill tone={order.orderStatus === "New" ? "warning" : order.orderStatus === "Completed" ? "success" : "default"}>
                        {order.orderStatus}
                      </Pill>
                    </td>
                    <td className="py-3 pr-3">
                      <Pill tone={order.paymentStatus === "Paid" ? "success" : "warning"}>{order.paymentStatus}</Pill>
                    </td>
                    <td className="py-3 text-right font-semibold text-[#244276]">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <AppButton onClick={onOpenErp}>Open Mini ERP</AppButton>
          <AppButton variant="secondary" onClick={onOpenAnalytics}>Open Analytics</AppButton>
        </div>
      </SurfaceCard>
    </div>
  );
}
