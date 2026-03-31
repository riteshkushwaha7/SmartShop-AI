import { ReactNode } from "react";
import { StockStatus } from "@/types/prototype";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function SurfaceCard({ title, subtitle, children, className = "", action }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-[#dbe7ff] bg-white/95 p-5 shadow-[0_14px_32px_rgba(11,77,196,0.09)] ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-wide text-[#1e3a75] uppercase">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-[#62739b]">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  tone?: "blue" | "green" | "amber" | "slate";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  blue: "from-[#e9f3ff] to-[#f6f9ff] border-[#d6e7ff]",
  green: "from-[#ecfff7] to-[#f6fffb] border-[#c8f3e1]",
  amber: "from-[#fff7e8] to-[#fffdf5] border-[#ffe6b5]",
  slate: "from-[#f3f6fb] to-[#f9fbff] border-[#dde5f5]",
};

export function StatCard({ label, value, change, tone = "blue" }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 ${toneClasses[tone]} transition-transform duration-300 hover:-translate-y-0.5`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[#5d6f98]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0f2b63]">{value}</p>
      {change && <p className="mt-2 text-xs text-[#4a5f91]">{change}</p>}
    </div>
  );
}

interface StockBadgeProps {
  status: StockStatus;
}

export function StockBadge({ status }: StockBadgeProps) {
  const map: Record<StockStatus, string> = {
    "In Stock": "bg-[#e8fbf3] text-[#0e7d58]",
    "Low Stock": "bg-[#fff6e4] text-[#9f6b00]",
    "Out of Stock": "bg-[#ffe9ea] text-[#b32329]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#c9d8f3] bg-[#f9fbff] px-6 py-12 text-center">
      <div className="mx-auto mb-3 h-9 w-9 rounded-xl bg-[#dce8ff]" />
      <h4 className="text-base font-semibold text-[#244276]">{title}</h4>
      <p className="mx-auto mt-1 max-w-md text-sm text-[#62739b]">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface PillProps {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}

export function Pill({ children, tone = "default" }: PillProps) {
  const map: Record<NonNullable<PillProps["tone"]>, string> = {
    default: "bg-[#e9f2ff] text-[#1b4fa5]",
    success: "bg-[#e8fbf3] text-[#0c7b57]",
    warning: "bg-[#fff6e4] text-[#9f6b00]",
    danger: "bg-[#ffe9ea] text-[#b32329]",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[tone]}`}>{children}</span>;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function AppButton({ children, className = "", variant = "primary", ...rest }: ButtonProps) {
  const baseClass = "rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";
  const variantClass =
    variant === "primary"
      ? "bg-[#0066ff] text-white shadow-[0_10px_20px_rgba(0,102,255,0.28)] hover:bg-[#0a57d6]"
      : variant === "secondary"
        ? "bg-[#e9f2ff] text-[#1d4ca0] hover:bg-[#dce9ff]"
        : "text-[#315ea8] hover:bg-[#eef4ff]";

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
}

interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = "Loading smart insights..." }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#dbe7ff] bg-[#f3f8ff] p-4 text-sm text-[#355c98]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#7ba6ea] border-t-[#0058d8]" />
      <span>{text}</span>
    </div>
  );
}

interface LinearProgressProps {
  value: number;
  label?: string;
}

export function LinearProgress({ value, label }: LinearProgressProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div>
      {label && <p className="mb-2 text-xs text-[#5f749e]">{label}</p>}
      <div className="h-2.5 rounded-full bg-[#dbe7ff]">
        <div
          style={{ width: `${normalized}%` }}
          className="h-2.5 rounded-full bg-gradient-to-r from-[#0093ff] to-[#0b59dd] transition-all duration-500"
        />
      </div>
    </div>
  );
}
