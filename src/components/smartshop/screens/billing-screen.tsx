import { AppButton, EmptyState, SurfaceCard } from "@/components/smartshop/ui";
import { formatCurrency } from "@/lib/prototype-utils";
import { Bill, ParsedOrder } from "@/types/prototype";

interface BillingScreenProps {
  bill: Bill | null;
  parsedOrder: ParsedOrder | null;
  onProceedToPay: () => void;
  onBackToChat: () => void;
}

export function BillingScreen({ bill, parsedOrder, onProceedToPay, onBackToChat }: BillingScreenProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr] animate-fade-in">
      <SurfaceCard title="Generated Bill" subtitle="Auto itemization from parsed chat order">
        {!bill || !parsedOrder || parsedOrder.items.length === 0 ? (
          <EmptyState
            title="Bill not available"
            message="Run chat parsing first so SmartShop AI can create line items and totals."
            action={<AppButton onClick={onBackToChat}>Go To Chat Ordering</AppButton>}
          />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-[#e1ebfd]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f4f8ff] text-xs uppercase tracking-wide text-[#60749d]">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9f0ff]">
                  {bill.lineItems.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-3 py-2 font-semibold text-[#244276]">{item.name}</td>
                      <td className="px-3 py-2 text-[#4f6694]">{item.quantity}</td>
                      <td className="px-3 py-2 text-[#4f6694]">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-[#244276]">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 rounded-2xl bg-[#f8fbff] p-4 text-sm">
              <div className="flex items-center justify-between text-[#5a7099]">
                <span>Subtotal</span>
                <span>{formatCurrency(bill.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#5a7099]">
                <span>Delivery Fee</span>
                <span>{formatCurrency(bill.deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-[#204278]">
                <span>Total Amount</span>
                <span>{formatCurrency(bill.total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <AppButton onClick={onProceedToPay}>Proceed To Pay</AppButton>
              <AppButton variant="secondary" onClick={onBackToChat}>Back To Chat</AppButton>
            </div>
          </div>
        )}
      </SurfaceCard>

      <SurfaceCard title="Billing Intelligence" subtitle="What SmartShop AI did automatically">
        <div className="space-y-3 text-sm text-[#576e9a]">
          <p className="rounded-2xl bg-[#f5f9ff] p-3">
            Inventory check completed before billing, so unavailable items are flagged before checkout.
          </p>
          <p className="rounded-2xl bg-[#f5f9ff] p-3">
            Delivery charges are auto-applied based on distance and ETA to keep billing transparent.
          </p>
          <p className="rounded-2xl bg-[#f5f9ff] p-3">
            Bill data is ready to sync into ERP modules for payments, revenue, and stock deductions after success.
          </p>
        </div>
      </SurfaceCard>
    </div>
  );
}
