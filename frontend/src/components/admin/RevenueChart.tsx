import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revenueData, weeklyRevenue, yearlyRevenue } from "@/lib/mock-data";
import { toast } from "sonner";

type Range = "week" | "month" | "year";
const dataMap: Record<Range, typeof revenueData> = {
  week: weeklyRevenue as unknown as typeof revenueData,
  month: revenueData,
  year: yearlyRevenue as unknown as typeof revenueData,
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="mt-1 flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize text-muted-foreground">{p.dataKey}</span>
          <span className="ml-auto font-semibold text-foreground">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const [range, setRange] = useState<Range>("month");
  const data = dataMap[range];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Revenue Analytics</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Revenue vs expenses across the selected period</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted/50 p-1">
            {(["week", "month", "year"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="relative rounded-md px-3 py-1.5 text-xs font-medium capitalize text-muted-foreground transition-colors data-[active=true]:text-foreground"
                data-active={range === r}
              >
                {range === r && (
                  <motion.div
                    layoutId="rangePill"
                    className="absolute inset-0 rounded-md bg-card shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{r}</span>
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toast.success("Report exported", { description: "Your revenue report is downloading." })}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--chart-4)" }} />
          <span className="text-muted-foreground">Expenses</span>
        </div>
      </div>

      <div className="mt-2 h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={range}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--chart-4)" strokeWidth={2} fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
