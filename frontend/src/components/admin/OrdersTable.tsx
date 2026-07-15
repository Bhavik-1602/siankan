import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Copy, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orders, type Order, type OrderStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<OrderStatus, string> = {
  completed: "bg-success/10 text-success border-success/20",
  processing: "bg-info/10 text-info border-info/20",
  pending: "bg-warning/10 text-warning-foreground border-warning/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const paymentStyles = {
  paid: "bg-success/10 text-success",
  unpaid: "bg-warning/15 text-warning-foreground",
  refunded: "bg-muted text-muted-foreground",
} as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function StatusDot({ status }: { status: OrderStatus }) {
  const color = status === "completed" ? "bg-success" : status === "processing" ? "bg-info" : status === "pending" ? "bg-warning" : "bg-destructive";
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", color)} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}

interface OrdersTableProps {
  ordersData?: Order[];
}

export function OrdersTable({ ordersData }: OrdersTableProps) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [expanded, setExpanded] = useState<string | null>(null);

  const activeOrders = ordersData || orders;

  const filtered = useMemo(() => {
    let list = activeOrders.filter((o) =>
      (status === "all" || o.status === status) &&
      (q === "" ||
        o.id.toLowerCase().includes(q.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(q.toLowerCase()) ||
        o.product.toLowerCase().includes(q.toLowerCase())),
    );
    list = [...list].sort((a, b) => (sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount));
    return list;
  }, [q, status, sortDir, activeOrders]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-5">
        <div>
          <h3 className="text-base font-semibold">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Latest orders across all channels</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search orders…" className="h-9 w-56 pl-8" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v as any); setPage(1); }}>
            <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">
                <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
                  Amount <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {paged.map((o) => (
                <Row key={o.id} o={o} expanded={expanded === o.id} onToggle={() => setExpanded((e) => (e === o.id ? null : o.id))} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 p-4 md:hidden">
        {paged.map((o) => (
          <MobileCard key={o.id} o={o} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-sm">
        <span className="text-muted-foreground">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="px-3 text-xs font-medium">Page {page} / {totalPages}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ o, expanded, onToggle }: { o: Order; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border-b border-border/40 transition-colors hover:bg-muted/40"
      >
        <td className="px-5 py-4">
          <button onClick={onToggle} className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground hover:text-primary">
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
            {o.id}
          </button>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={o.customer.avatar} alt={o.customer.name} />
              <AvatarFallback>{o.customer.name.split(" ").map((s) => s[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{o.customer.name}</p>
              <p className="truncate text-xs text-muted-foreground">{o.customer.email}</p>
            </div>
          </div>
        </td>
        <td className="max-w-[200px] truncate px-5 py-4 text-muted-foreground">{o.product}</td>
        <td className="px-5 py-4 text-muted-foreground">{formatDate(o.date)}</td>
        <td className="px-5 py-4 font-semibold tabular-nums">₹{o.amount.toLocaleString()}</td>
        <td className="px-5 py-4">
          <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize", paymentStyles[o.payment])}>{o.payment}</span>
        </td>
        <td className="px-5 py-4">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize", statusStyles[o.status])}>
            <StatusDot status={o.status} />
            {o.status}
          </span>
        </td>
        <td className="px-5 py-4 text-right">
          <RowMenu id={o.id} />
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={8} className="bg-muted/30 px-5 py-0">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 py-4 sm:grid-cols-3">
                  <Info label="Shipping" value="Standard · 3-5 days" />
                  <Info label="Payment method" value="Visa ending 4242" />
                  <Info label="Notes" value="Gift wrap requested" />
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function RowMenu({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(id); toast.success("Order ID copied"); }}>
          <Copy className="mr-2 h-4 w-4" />Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Cancel order</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileCard({ o }: { o: Order }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9"><AvatarImage src={o.customer.avatar} /><AvatarFallback>{o.customer.name[0]}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{o.customer.name}</p>
          <p className="truncate text-xs text-muted-foreground">{o.product}</p>
        </div>
        <span className="text-sm font-bold tabular-nums">₹{o.amount}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge variant="outline" className={cn("gap-1.5 capitalize", statusStyles[o.status])}>
          <StatusDot status={o.status} />{o.status}
        </Badge>
        <span className="font-mono text-[11px] text-muted-foreground">{o.id}</span>
      </div>
    </div>
  );
}
