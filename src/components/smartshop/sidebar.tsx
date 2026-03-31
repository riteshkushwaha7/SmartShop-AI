import { ScreenId } from "@/types/prototype";
import { AppButton } from "@/components/smartshop/ui";

interface SideNavItem {
  id: ScreenId;
  label: string;
  hint: string;
}

const navItems: SideNavItem[] = [
  { id: "landing", label: "Overview", hint: "Story + KPIs" },
  { id: "onboarding", label: "Onboarding", hint: "Create virtual shop" },
  { id: "inventory", label: "Inventory", hint: "Mini ERP stock setup" },
  { id: "discovery", label: "Discovery", hint: "Nearby search" },
  { id: "chat", label: "Chat Orders", hint: "AI order parsing" },
  { id: "billing", label: "Billing", hint: "Auto bill generation" },
  { id: "payment", label: "Payment", hint: "Paytm flow" },
  { id: "dashboard", label: "Merchant Dashboard", hint: "Live paid orders" },
  { id: "erp", label: "Mini ERP", hint: "Modules + stock sync" },
  { id: "analytics", label: "Analytics", hint: "Reports and trends" },
];

interface SidebarProps {
  active: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onRunDemo: () => void;
  demoRunning: boolean;
}

export function Sidebar({ active, onNavigate, onRunDemo, demoRunning }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-4 rounded-3xl border border-[#dbe7ff] bg-white/90 p-4 shadow-[0_16px_40px_rgba(13,76,186,0.12)]">
      <div className="rounded-2xl bg-gradient-to-br from-[#005ee2] to-[#00a2ff] p-4 text-white">
        <p className="text-xs uppercase tracking-wide text-white/80">Paytm SmartShop AI</p>
        <h1 className="mt-1 text-lg font-semibold">Merchant Console</h1>
        <p className="mt-2 text-xs text-white/90">From chat to checkout to business management</p>
      </div>

      <AppButton onClick={onRunDemo} disabled={demoRunning} className="w-full" variant="secondary">
        {demoRunning ? "Demo Running..." : "Demo Mode: Auto Journey"}
      </AppButton>

      <nav className="grid gap-1 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`rounded-2xl px-3 py-2 text-left transition ${
              active === item.id
                ? "bg-[#e5f0ff] text-[#104498]"
                : "text-[#4e6593] hover:bg-[#f2f7ff] hover:text-[#24457f]"
            }`}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="text-xs opacity-90">{item.hint}</p>
          </button>
        ))}
      </nav>
    </aside>
  );
}
