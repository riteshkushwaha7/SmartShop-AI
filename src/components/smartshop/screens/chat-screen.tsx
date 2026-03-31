import { AppButton, EmptyState, LoadingState, Pill, SurfaceCard } from "@/components/smartshop/ui";
import { formatCurrency } from "@/lib/prototype-utils";
import { ChatMessage, ParsedOrder } from "@/types/prototype";

interface ChatScreenProps {
  merchantName: string;
  messages: ChatMessage[];
  chatInput: string;
  parsedOrder: ParsedOrder | null;
  parsingOrder: boolean;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
  onRunParsing: () => void;
  onReset: () => void;
  onGenerateBill: () => void;
  onCheckInventory: () => void;
}

export function ChatScreen({
  merchantName,
  messages,
  chatInput,
  parsedOrder,
  parsingOrder,
  onChatInputChange,
  onSendMessage,
  onRunParsing,
  onReset,
  onGenerateBill,
  onCheckInventory,
}: ChatScreenProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr] animate-fade-in">
      <SurfaceCard title="Customer Chat Panel" subtitle="Mobile-like ordering interface">
        <div className="mx-auto w-full max-w-[360px] rounded-[26px] border border-[#d7e5ff] bg-[#f5f9ff] p-3 shadow-inner">
          <div className="rounded-[22px] bg-white p-3">
            <div className="mb-3 flex items-center justify-between border-b border-[#edf2ff] pb-2">
              <p className="text-sm font-semibold text-[#1f4279]">{merchantName}</p>
              <Pill tone="success">Live</Pill>
            </div>

            <div className="h-[330px] space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                    message.sender === "customer"
                      ? "ml-auto bg-[#0d63e6] text-white"
                      : message.sender === "assistant"
                        ? "bg-[#edf4ff] text-[#1e427a]"
                        : "bg-[#f4f8ff] text-[#355a94]"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`mt-1 text-[10px] ${message.sender === "customer" ? "text-white/80" : "text-[#6b81aa]"}`}>
                    {message.timestamp}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 text-sm outline-none ring-[#70a4ff] focus:ring"
                value={chatInput}
                onChange={(event) => onChatInputChange(event.target.value)}
                placeholder="Type customer message"
              />
              <AppButton onClick={onSendMessage} variant="secondary">Send</AppButton>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <AppButton onClick={onRunParsing} disabled={parsingOrder}>
            {parsingOrder ? "Parsing..." : "Run AI Order Parsing"}
          </AppButton>
          <AppButton variant="secondary" onClick={onReset}>Reset Chat</AppButton>
        </div>
      </SurfaceCard>

      <SurfaceCard title="AI Extracted Order" subtitle="Items, quantity, delivery timing, and stock checks">
        {parsingOrder && <LoadingState text="SmartShop AI is extracting order details..." />}

        {!parsingOrder && !parsedOrder && (
          <EmptyState
            title="Order parsing not run"
            message="Click Run AI Order Parsing to transform chat into structured order data and generate a bill."
          />
        )}

        {!parsingOrder && parsedOrder && (
          <div className="space-y-4">
            <div className="grid gap-2 rounded-2xl bg-[#f8fbff] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#60749d]">Delivery Time</p>
                <p className="mt-1 text-sm font-semibold text-[#204278]">{parsedOrder.deliveryTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#60749d]">Delivery Address</p>
                <p className="mt-1 text-sm font-semibold text-[#204278]">{parsedOrder.deliveryAddress}</p>
              </div>
            </div>

            {parsedOrder.items.length === 0 ? (
              <EmptyState
                title="No items detected"
                message="Ask customer to mention product names and quantities, then run parser again."
              />
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#e1ebfd]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f4f8ff] text-xs uppercase tracking-wide text-[#60749d]">
                    <tr>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Qty</th>
                      <th className="px-3 py-2">Unit Price</th>
                      <th className="px-3 py-2">Inventory Check</th>
                      <th className="px-3 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e9f0ff]">
                    {parsedOrder.items.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-3 py-2 font-semibold text-[#244276]">{item.name}</td>
                        <td className="px-3 py-2 text-[#4f6694]">{item.quantity}</td>
                        <td className="px-3 py-2 text-[#4f6694]">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-3 py-2">
                          <Pill tone={item.stockAvailable ? "success" : "danger"}>
                            {item.stockAvailable ? "Available" : "Not enough stock"}
                          </Pill>
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-[#244276]">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {parsedOrder.missingDetails.length > 0 && (
              <div className="rounded-2xl border border-[#ffe4b8] bg-[#fff9eb] p-4 text-sm text-[#8a6100]">
                Assistant follow-up needed: {parsedOrder.missingDetails.join(", ")}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <AppButton onClick={onGenerateBill} disabled={parsedOrder.items.length === 0}>Generate Bill</AppButton>
              <AppButton variant="secondary" onClick={onCheckInventory}>Check Inventory</AppButton>
            </div>
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
