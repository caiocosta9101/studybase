import { cn } from "@/lib/styles";

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  tone: "sky" | "emerald" | "amber" | "rose";
};

const toneClasses: Record<MetricCardProps["tone"], string> = {
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700"
};

export function MetricCard({ label, value, helper, tone }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5 shadow-soft">
      <div className={cn("mb-4 w-fit rounded-full border px-3 py-1 text-xs font-semibold", toneClasses[tone])}>
        {label}
      </div>
      <p className="text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}
