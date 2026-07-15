import { motion } from "framer-motion";
import { Bell, Calendar, ChevronRight, Command, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/lib/theme";
import { useApp } from "@/lib/AppContext";

interface Props {
  page: string;
  onOpenNotifications: () => void;
  onOpenMobileNav: () => void;
}

export function AdminHeader({ page, onOpenNotifications, onOpenMobileNav }: Props) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useApp();
  const label = page.charAt(0).toUpperCase() + page.slice(1);

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const userAvatar = user?.email ? `https://i.pravatar.cc/80?u=${encodeURIComponent(user.email)}` : "https://i.pravatar.cc/80?u=admin@nadesign.com";

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-6"
    >
      <button onClick={onOpenMobileNav} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted md:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <p className="hidden text-sm font-semibold text-foreground sm:block">Welcome back, {user?.full_name || 'Admin'} 👋</p>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{label}</span>
        </nav>
      </div>

      <div className="relative ml-auto hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search orders, products, customers…" className="h-10 pl-9 pr-16 bg-muted/40 border-transparent focus-visible:bg-background" />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:ml-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Last 30 days</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-1">
              {["Today", "Yesterday", "Last 7 days", "Last 30 days", "This month", "This quarter"].map((r) => (
                <button key={r} className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">{r}</button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button size="sm" className="hidden gap-1.5 bg-gradient-primary text-white shadow-md hover:opacity-95 hover:shadow-glow md:inline-flex">
          <Plus className="h-4 w-4" />
          Quick Add
        </Button>

        <button
          onClick={toggle}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="grid place-items-center"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 rounded-full ring-2 ring-transparent transition hover:ring-primary/30">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{user?.full_name || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'admin@nadesign.com'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
