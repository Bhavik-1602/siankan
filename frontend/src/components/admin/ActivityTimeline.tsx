import { motion } from "framer-motion";
import { Package, ShoppingCart, CreditCard, Receipt, UserCog, UserPlus, type LucideIcon } from "lucide-react";
import { activities, type Activity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<Activity["type"], LucideIcon> = {
  order: ShoppingCart,
  product: Package,
  payment: CreditCard,
  expense: Receipt,
  employee: UserCog,
  customer: UserPlus,
};

const colorMap: Record<Activity["type"], string> = {
  order: "bg-primary/10 text-primary",
  product: "bg-info/10 text-info",
  payment: "bg-success/10 text-success",
  expense: "bg-warning/15 text-warning-foreground",
  employee: "bg-accent text-accent-foreground",
  customer: "bg-chart-4/10 text-chart-4",
};

export function ActivityTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Live feed across your workspace</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
        </span>
      </div>
      <ol className="relative mt-6">
        <span className="absolute left-[19px] top-1 bottom-1 w-px bg-border" />
        {activities.map((a, i) => {
          const Icon = iconMap[a.type];
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.35 }}
              className="relative flex gap-3 pb-4 last:pb-0"
            >
              <div className={cn("relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ring-4 ring-card", colorMap[a.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}
