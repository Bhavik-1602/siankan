import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Bell, CreditCard, PackageX, Receipt, Settings2, ShoppingBag, X, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { notifications as seed, type Notification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap: Record<Notification["category"], LucideIcon> = {
  payment: CreditCard,
  stock: PackageX,
  order: ShoppingBag,
  expense: Receipt,
  system: Settings2,
};

const catColor: Record<Notification["category"], string> = {
  payment: "bg-success/10 text-success",
  stock: "bg-warning/15 text-warning-foreground",
  order: "bg-primary/10 text-primary",
  expense: "bg-info/10 text-info",
  system: "bg-muted text-muted-foreground",
};

const filters: { key: "all" | Notification["category"]; label: string }[] = [
  { key: "all", label: "All" },
  { key: "payment", label: "Payments" },
  { key: "stock", label: "Stock" },
  { key: "order", label: "Orders" },
  { key: "expense", label: "Expenses" },
  { key: "system", label: "System" },
];

export function NotificationPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const unread = items.filter((i) => !i.read).length;
  const list = filter === "all" ? items : items.filter((i) => i.category === filter);

  const markAll = () => { setItems((prev) => prev.map((i) => ({ ...i, read: true }))); toast.success("All notifications marked as read"); };
  const markOne = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const dismiss = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 p-5">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unread > 0 && <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">{unread} new</span>}
          </SheetTitle>
          <SheetDescription className="text-left">You have {unread} unread notifications</SheetDescription>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === f.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-3">
          <AnimatePresence initial={false}>
            {list.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center px-4 py-16 text-center">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">You're all caught up</p>
                <p className="text-xs text-muted-foreground">No notifications in this category.</p>
              </motion.div>
            ) : (
              list.map((n, i) => {
                const Icon = iconMap[n.category];
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className={cn(
                      "group relative mb-2 flex gap-3 rounded-xl border p-3 transition-colors",
                      n.read ? "border-border/50 bg-background" : "border-primary/30 bg-primary/5",
                    )}
                    onClick={() => markOne(n.id)}
                  >
                    <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", catColor[n.category])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{n.title}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{n.detail}</p>
                    </div>
                    {!n.read && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                      className="absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-border/60 p-3">
          <Button variant="outline" className="w-full" onClick={markAll}>Mark all as read</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
