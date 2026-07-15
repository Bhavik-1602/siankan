import { motion } from "framer-motion";
import { topProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stockLabel = {
  in: { text: "In Stock", cls: "bg-success/10 text-success" },
  low: { text: "Low Stock", cls: "bg-warning/15 text-warning-foreground" },
  out: { text: "Out of Stock", cls: "bg-destructive/10 text-destructive" },
} as const;

export interface ProductItem {
  name: string;
  category: string;
  sold: number;
  revenue: number;
  stock: "in" | "low" | "out";
  progress: number;
  img: string;
}

interface TopProductsProps {
  productsData?: ProductItem[];
}

export function TopProducts({ productsData }: TopProductsProps) {
  const activeProducts = productsData || topProducts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold">Top Products</h3>
        <p className="text-sm text-muted-foreground">Best performers this month</p>
      </div>
      <ul className="space-y-3">
        {activeProducts.map((p, i) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
            className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-border hover:bg-muted/40"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                <span className="shrink-0 text-sm font-bold tabular-nums">₹{(p.revenue / 1000).toFixed(1)}k</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{p.category}</span>
                <span>·</span>
                <span>{p.sold.toLocaleString()} sold</span>
                <span className={cn("ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold", stockLabel[p.stock].cls)}>{stockLabel[p.stock].text}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${p.progress}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.45 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-primary"
                />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
