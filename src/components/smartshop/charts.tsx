import { ProductSalesPoint, TrendPoint } from "@/types/prototype";
import { formatCurrency } from "@/lib/prototype-utils";

interface MiniLineChartProps {
  data: TrendPoint[];
  currency?: boolean;
}

export function MiniLineChart({ data, currency = false }: MiniLineChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - (point.value / maxValue) * 92;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 100" className="h-32 w-full rounded-2xl bg-[#f8fbff] p-2">
        <polyline fill="none" stroke="#cfe1ff" strokeWidth="1" points="0,90 100,90" />
        <polyline
          fill="none"
          stroke="#0a66ff"
          strokeWidth="2.6"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-[#61749a] sm:grid-cols-7">
        {data.map((point) => (
          <div key={point.label} className="rounded-xl bg-[#f2f7ff] p-2 text-center">
            <p>{point.label}</p>
            <p className="mt-1 font-semibold text-[#27447c]">{currency ? formatCurrency(point.value) : point.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MiniBarChartProps {
  data: ProductSalesPoint[];
}

export function MiniBarChart({ data }: MiniBarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.units), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.product}>
          <div className="mb-1 flex items-center justify-between text-xs text-[#4a6293]">
            <span>{item.product}</span>
            <span className="font-semibold text-[#244276]">{item.units} sold</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#dce7f9]">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-[#00a3ff] to-[#005de0]"
              style={{ width: `${(item.units / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface RingMetricProps {
  value: number;
  label: string;
}

export function RingMetric({ value, label }: RingMetricProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#d4e5ff] bg-[#f8fbff] p-4">
      <div
        className="relative h-20 w-20 rounded-full"
        style={{
          background: `conic-gradient(#0a65ff ${normalized * 3.6}deg, #d7e6ff 0deg)`,
        }}
      >
        <div className="absolute inset-2 grid place-items-center rounded-full bg-white text-base font-semibold text-[#1e3e7f]">
          {normalized.toFixed(1)}%
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#244276]">{label}</p>
        <p className="text-xs text-[#667aa2]">Successful UPI/Card collection ratio</p>
      </div>
    </div>
  );
}
