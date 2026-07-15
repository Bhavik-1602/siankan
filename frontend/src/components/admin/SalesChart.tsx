import { motion } from "framer-motion";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { categoryData, regionData } from "@/lib/mock-data";
import { AnimatedCounter } from "./AnimatedCounter";

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border/60 bg-popover/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur">
      <span className="font-semibold">{p.name}</span> · <span className="text-muted-foreground">${p.value.toLocaleString()}</span>
    </div>
  );
}

function CircleProgress({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--muted)" strokeWidth="7" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c - (c * value) / 100 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-lg font-bold text-foreground">
          <AnimatedCounter value={value} suffix="%" />
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export function SalesChart() {
  const total = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="grid gap-5"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="text-base font-semibold">Sales by Category</h3>
              <p className="text-sm text-muted-foreground">Distribution across product categories</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryData} innerRadius={62} outerRadius={90} paddingAngle={3} dataKey="value" stroke="var(--card)" strokeWidth={2}>
                    {categoryData.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-bold"><AnimatedCounter value={total} prefix="$" /></p>
                </div>
              </div>
            </div>
            <ul className="flex-1 space-y-2">
              {categoryData.map((c) => {
                const pct = ((c.value / total) * 100).toFixed(1);
                return (
                  <li key={c.name} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="min-w-0 truncate text-muted-foreground">{c.name}</span>
                    <span className="ml-auto font-semibold tabular-nums">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">Sales by Region</h3>
            <p className="text-sm text-muted-foreground">Regional performance this month</p>
          </div>
          <div className="mt-2 h-[220px]">
            <ResponsiveContainer>
              <BarChart data={regionData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="region" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<DonutTooltip />} cursor={{ fill: "color-mix(in oklab, var(--primary) 8%, transparent)" }} />
                <Bar dataKey="sales" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold">Performance KPIs</h3>
          <p className="text-sm text-muted-foreground">Monthly targets & conversion</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <CircleProgress value={78} label="Monthly Target" color="var(--primary)" />
          <CircleProgress value={64} label="Conversion Rate" color="var(--chart-2)" />
          <CircleProgress value={92} label="Customer Retention" color="var(--chart-5)" />
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 p-3">
            <span className="text-xs text-muted-foreground">Avg. Order Value</span>
            <span className="text-2xl font-bold text-foreground"><AnimatedCounter value={148} prefix="$" /></span>
            <span className="text-xs font-semibold text-success">+4.2%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
