import { AppButton, EmptyState, Pill, SurfaceCard } from "@/components/smartshop/ui";
import { MerchantCard } from "@/types/prototype";

interface DiscoveryScreenProps {
  query: string;
  shops: MerchantCard[];
  selectedShop: MerchantCard;
  selectedShopId: string;
  onQueryChange: (value: string) => void;
  onSelectShop: (id: string) => void;
  onOpenChat: () => void;
}

export function DiscoveryScreen({
  query,
  shops,
  selectedShop,
  selectedShopId,
  onQueryChange,
  onSelectShop,
  onOpenChat,
}: DiscoveryScreenProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr] animate-fade-in">
      <SurfaceCard title="Nearby Shop Search" subtitle="Customer experience inside Paytm-like app">
        <label className="block text-sm text-[#3a5383]">
          Search shops near your location
          <input
            className="mt-1 w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search shops near your location"
          />
        </label>

        <div className="mt-4 space-y-3">
          {shops.length === 0 ? (
            <EmptyState
              title="No shops found"
              message="Try a different keyword or remove filters to discover merchants around you."
            />
          ) : (
            shops.map((shop) => {
              const selected = shop.id === selectedShopId;
              return (
                <button
                  key={shop.id}
                  type="button"
                  onClick={() => onSelectShop(shop.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#79aafc] bg-[#edf4ff]"
                      : "border-[#dce7fa] bg-[#f9fbff] hover:bg-[#f2f7ff]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#244276]">{shop.name}</p>
                      <p className="text-sm text-[#5f749c]">{shop.category}</p>
                    </div>
                    <Pill tone={shop.status === "Open" ? "success" : shop.status === "Busy" ? "warning" : "danger"}>
                      {shop.status}
                    </Pill>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#4f6694]">
                    <span className="rounded-full bg-[#e6efff] px-3 py-1">Rating: {shop.rating}</span>
                    <span className="rounded-full bg-[#e6efff] px-3 py-1">{shop.distanceKm} km away</span>
                    {shop.status !== "Closed" && (
                      <span className="rounded-full bg-[#e6efff] px-3 py-1">ETA {shop.etaMinutes} min</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Selected Merchant" subtitle="Move from discovery to chat checkout">
        <div className="rounded-2xl bg-gradient-to-br from-[#005ce0] to-[#00a1ff] p-4 text-white">
          <p className="text-sm text-white/90">Recommended shop</p>
          <h3 className="mt-1 text-2xl font-semibold">{selectedShop.name}</h3>
          <p className="mt-1 text-sm text-white/90">{selectedShop.category}</p>
          <div className="mt-4 grid gap-2 text-xs text-white/90 sm:grid-cols-3">
            <span className="rounded-full bg-white/20 px-3 py-1">Rating {selectedShop.rating}</span>
            <span className="rounded-full bg-white/20 px-3 py-1">{selectedShop.distanceKm} km</span>
            <span className="rounded-full bg-white/20 px-3 py-1">{selectedShop.status}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-[#576e9a]">
            Tap into this shop and continue your order through conversational AI. Inventory and pricing are validated
            in real time from the merchant catalog.
          </p>
          <AppButton onClick={onOpenChat}>Open Shop Chat</AppButton>
        </div>
      </SurfaceCard>
    </div>
  );
}
