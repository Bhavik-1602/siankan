import { motion } from "framer-motion";
import { FileBarChart, PackagePlus, Receipt, ShoppingCart, UserCog, UserPlus, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

interface Action { title: string; description: string; icon: LucideIcon; gradient: string; }

const actions: Action[] = [
  { title: "Add Product",       description: "List a new item in your catalog",        icon: PackagePlus, gradient: "bg-gradient-primary" },
  { title: "Create Order",      description: "Draft a new customer order",             icon: ShoppingCart, gradient: "bg-gradient-info" },
  { title: "Add Customer",      description: "Register a new customer profile",        icon: UserPlus,     gradient: "bg-gradient-success" },
  { title: "Record Expense",    description: "Log an operating cost",                  icon: Receipt,      gradient: "bg-gradient-warning" },
  { title: "Generate Report",   description: "Export analytics for the period",        icon: FileBarChart, gradient: "bg-gradient-info" },
  { title: "Manage Employees",  description: "Team roles and access control",          icon: UserCog,      gradient: "bg-gradient-danger" },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Common tasks you use every day</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((a, i) => (
          <motion.button
            key={a.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast(`${a.title}`, { description: a.description })}
            className="group relative overflow-hidden rounded-xl border border-border/60 bg-background p-4 text-left transition-shadow hover:shadow-md"
          >
            <div className={`grid h-10 w-10 place-items-center rounded-lg text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${a.gradient}`}>
              <a.icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{a.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{a.description}</p>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
