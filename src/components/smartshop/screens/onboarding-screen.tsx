import { AppButton, EmptyState, LinearProgress, SurfaceCard } from "@/components/smartshop/ui";
import { ShopProfile } from "@/types/prototype";

interface OnboardingScreenProps {
  draft: ShopProfile;
  preview: ShopProfile;
  shopCreated: boolean;
  onDraftChange: (value: ShopProfile) => void;
  onCreateShop: () => void;
  onViewInventory: () => void;
}

export function OnboardingScreen({
  draft,
  preview,
  shopCreated,
  onDraftChange,
  onCreateShop,
  onViewInventory,
}: OnboardingScreenProps) {
  const setField = <K extends keyof ShopProfile>(key: K, value: ShopProfile[K]) => {
    onDraftChange({ ...draft, [key]: value });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] animate-fade-in">
      <SurfaceCard title="Create Virtual Shop" subtitle="Merchant onboarding flow">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-[#3c5484]">
            <span>Shop Name</span>
            <input
              className="w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={draft.shopName}
              onChange={(event) => setField("shopName", event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm text-[#3c5484]">
            <span>Business Category</span>
            <input
              className="w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={draft.businessCategory}
              onChange={(event) => setField("businessCategory", event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm text-[#3c5484] sm:col-span-2">
            <span>Location</span>
            <input
              className="w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={draft.location}
              onChange={(event) => setField("location", event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm text-[#3c5484]">
            <span>Opening Time</span>
            <input
              type="time"
              className="w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={draft.openingTime}
              onChange={(event) => setField("openingTime", event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm text-[#3c5484]">
            <span>Closing Time</span>
            <input
              type="time"
              className="w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={draft.closingTime}
              onChange={(event) => setField("closingTime", event.target.value)}
            />
          </label>
          <div className="space-y-1 text-sm text-[#3c5484] sm:col-span-2">
            <span>Delivery / Pickup Options</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["Delivery", "Pickup", "Both"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setField("fulfillmentOption", option)}
                  className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                    draft.fulfillmentOption === option
                      ? "border-[#72a6ff] bg-[#eaf2ff] text-[#1650ab]"
                      : "border-[#d6e3ff] bg-[#f9fbff] text-[#43618f] hover:bg-[#eef4ff]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <AppButton onClick={onCreateShop}>Create My Shop</AppButton>
          <AppButton variant="secondary" onClick={onViewInventory}>View Inventory Setup</AppButton>
        </div>
      </SurfaceCard>

      <SurfaceCard title="Shop Preview" subtitle="How this merchant appears to nearby customers">
        {!shopCreated ? (
          <EmptyState
            title="No shop created yet"
            message="Complete onboarding details and click Create My Shop to publish your virtual storefront."
          />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#0e62e6] to-[#06a1ff] p-4 text-white">
              <h3 className="text-xl font-semibold">{preview.shopName}</h3>
              <p className="mt-1 text-sm text-white/90">{preview.businessCategory}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-white/85">
                <span>{preview.location}</span>
                <span>
                  {preview.openingTime} - {preview.closingTime}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dbe7ff] bg-[#f9fbff] p-4">
              <p className="text-xs uppercase tracking-wide text-[#63759d]">Fulfillment</p>
              <p className="mt-1 text-sm font-semibold text-[#1f447e]">{preview.fulfillmentOption}</p>
            </div>

            <LinearProgress value={shopCreated ? 100 : 35} label="Onboarding completion" />
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
