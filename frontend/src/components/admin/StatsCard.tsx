import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Clock, DollarSign, Package, ShoppingBag, Users, Wallet, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { AnimatedCounter } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  dollar: DollarSign,
  shopping: ShoppingBag,
  users: Users,
  package: Package,
  clock: Clock,
  wallet: Wallet,
};

const gradientMap = {
  primary: "bg-gradient-primary",
  success: "bg-gradient-success",
  warning: "bg-gradient-warning",
  danger: "bg-gradient-danger",
  info: "bg-gradient-info",
} as const;

const strokeMap = {
  primary: "var(--chart-1)",
  success: "var(--chart-2)",
  warning: "var(--chart-3)",
  danger: "var(--chart-4)",
  info: "var(--chart-5)",
} as const;

interface Props {
  label: string;
  value: number;
  prefix?: string;
  delta: number;
  spark: number[];
  gradient: keyof typeof gradientMap;
  icon: keyof typeof iconMap;
  index: number;
}

export function StatsCard({ label, value, prefix, delta, spark, gradient, icon, index }: Props) {
  const Icon = iconMap[icon];
  const positive = delta >= 0;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, color-mix(in oklab, var(--primary) 12%, transparent), transparent 60%)`;
  const stroke = strokeMap[gradient];
  const chartId = `spark-${gradient}-${label.replace(/\s/g, "")}`;
  const data = spark.map((y, x) => ({ x, y }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: bg }} />
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25" style={{ background: `var(--gradient-${gradient === "primary" ? "primary" : gradient})` }} />

      <div className="relative flex items-start justify-between">
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl text-white shadow-md", gradientMap[gradient])}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold", positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1)}%
        </div>
      </div>

      <div className="relative mt-5">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1.5 text-3xl font-bold tracking-tight text-foreground">
          <AnimatedCounter value={value} prefix={prefix} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          vs last month · <span className={positive ? "text-success" : "text-destructive"}>{positive ? "+" : ""}{delta.toFixed(1)}%</span>
        </p>
      </div>

      <div className="relative mt-4 h-14 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="y" stroke={stroke} strokeWidth={2} fill={`url(#${chartId})`} isAnimationActive />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
