import { AppButton, LinearProgress, LoadingState, SurfaceCard } from "@/components/smartshop/ui";
import { formatCurrency } from "@/lib/prototype-utils";

interface PaymentScreenProps {
  total: number;
  paymentStep: "idle" | "link_generated" | "processing" | "success";
  paymentLink: string;
  onGenerateLink: () => void;
  onPayNow: () => void;
  onViewDashboard: () => void;
  onResetState: () => void;
  onBackToBill: () => void;
}

export function PaymentScreen({
  total,
  paymentStep,
  paymentLink,
  onGenerateLink,
  onPayNow,
  onViewDashboard,
  onResetState,
  onBackToBill,
}: PaymentScreenProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr] animate-fade-in">
      <SurfaceCard title="Paytm Payment Simulation" subtitle="Generate payment request and complete checkout">
        <div className="rounded-2xl bg-gradient-to-br from-[#005de2] to-[#00a3ff] p-5 text-white">
          <p className="text-sm text-white/85">Order payable</p>
          <p className="mt-2 text-4xl font-semibold">{formatCurrency(total)}</p>
          <p className="mt-3 text-xs text-white/80">Payment status: {paymentStep.replace("_", " ")}</p>
        </div>

        <div className="mt-4 space-y-3">
          {paymentStep === "idle" && <AppButton onClick={onGenerateLink}>Generate Payment Link</AppButton>}

          {paymentStep === "link_generated" && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#dbe7ff] bg-[#f8fbff] p-4 text-sm text-[#375b95]">
                <p className="font-semibold text-[#244276]">Payment request generated</p>
                <p className="mt-1 break-all">{paymentLink}</p>
              </div>
              <AppButton onClick={onPayNow}>Pay Now</AppButton>
            </div>
          )}

          {paymentStep === "processing" && <LoadingState text="Processing payment through Paytm rails..." />}

          {paymentStep === "success" && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#bfead6] bg-[#ecfff5] p-4 text-sm text-[#0c7c57]">
                <p className="font-semibold">Payment Successful</p>
                <p className="mt-1">Order is marked paid and merchant has been notified instantly.</p>
              </div>
              <AppButton onClick={onViewDashboard}>View Merchant Dashboard</AppButton>
            </div>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Flow Buttons" subtitle="Demo-friendly checkout state transitions">
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#f8fbff] p-4 text-sm text-[#4b6291]">
            1. Generate Payment Link
            <br />
            2. Pay Now
            <br />
            3. Payment Successful
          </div>
          <LinearProgress
            value={paymentStep === "idle" ? 15 : paymentStep === "link_generated" ? 48 : paymentStep === "processing" ? 78 : 100}
            label="Payment journey completion"
          />
          <div className="flex flex-wrap gap-2">
            <AppButton variant="secondary" onClick={onResetState}>Reset Payment State</AppButton>
            <AppButton variant="ghost" onClick={onBackToBill}>Back To Bill</AppButton>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
