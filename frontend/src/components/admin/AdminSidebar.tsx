import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, ChevronLeft, ChevronsUpDown, LayoutDashboard, LogOut, Package, PieChart, Receipt, Settings, ShoppingBag, Sparkles, Tag, Users, UserSquare2,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";

export interface NavItem { key: string; label: string; icon: LucideIcon; badge?: string | number; }

export const navItems: NavItem[] = [
  { key: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { key: "products",      label: "Products",      icon: Package },
  { key: "categories",    label: "Categories",    icon: Tag },
  { key: "orders",        label: "Orders",        icon: ShoppingBag, badge: 12 },
  { key: "customers",     label: "Customers",     icon: Users },
  { key: "employees",     label: "Employees",     icon: UserSquare2 },
  { key: "expenses",      label: "Expenses",      icon: Receipt },
  { key: "reports",       label: "Reports",       icon: PieChart },
  { key: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  { key: "settings",      label: "Settings",      icon: Settings },
];

interface Props {
  active: string;
  onSelect: (k: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  className?: string;
}

export function AdminSidebar({ active, onSelect, collapsed, onToggleCollapsed, className }: Props) {
  const { user, logout } = useApp();

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const userAvatar = user?.email ? `https://i.pravatar.cc/80?u=${encodeURIComponent(user.email)}` : "https://i.pravatar.cc/80?u=admin@nadesign.com";

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn("relative flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", className)}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-md">
            <Sparkles className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="truncate text-sm font-bold tracking-tight">N & A Design</p>
                <p className="truncate text-[11px] text-muted-foreground">Admin Console</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggleCollapsed}
            className="ml-auto hidden h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:grid"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            const button = (
              <motion.button
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(item.key)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground hover:text-sidebar-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebarActive"
                    className="absolute inset-0 rounded-lg bg-sidebar-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="sidebarActiveBar"
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={cn("relative h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-primary")} strokeWidth={2.2} />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="relative flex-1 truncate text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge != null && (
                  <span className="relative ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">{item.badge}</span>
                )}
                {collapsed && item.badge != null && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </motion.button>
            );
            return collapsed ? (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.key}>{button}</div>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="border-t border-sidebar-border p-3">
          <button className={cn("flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent", collapsed && "justify-center")}>
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-semibold">{user?.full_name || 'Admin User'}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email || 'admin@nadesign.com'}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
          {!collapsed && (
            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
