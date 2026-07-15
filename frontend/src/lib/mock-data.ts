export type OrderStatus = "completed" | "processing" | "pending" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";

export interface Order {
  id: string;
  customer: { name: string; email: string; avatar: string };
  product: string;
  date: string;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
}

export const stats = [
  { key: "revenue", label: "Total Revenue", value: 284920, prefix: "$", delta: 12.4, spark: [30,42,38,55,48,62,72,68,80,86,92,98], gradient: "primary" as const, icon: "dollar" as const },
  { key: "orders", label: "Total Orders", value: 12483, delta: 8.2, spark: [20,25,22,28,30,34,32,38,42,44,48,52], gradient: "info" as const, icon: "shopping" as const },
  { key: "customers", label: "Total Customers", value: 5842, delta: 4.6, spark: [10,14,18,22,25,28,32,30,35,40,44,48], gradient: "success" as const, icon: "users" as const },
  { key: "products", label: "Total Products", value: 946, delta: 2.1, spark: [40,42,41,44,46,48,47,50,52,54,55,58], gradient: "warning" as const, icon: "package" as const },
  { key: "pending", label: "Pending Orders", value: 128, delta: -3.4, spark: [60,58,55,50,48,45,40,42,38,36,34,32], gradient: "danger" as const, icon: "clock" as const },
  { key: "expenses", label: "Monthly Expenses", value: 48210, prefix: "$", delta: -6.8, spark: [80,75,70,72,68,65,60,58,55,52,50,48], gradient: "info" as const, icon: "wallet" as const },
];

export const revenueData = [
  { m: "Jan", revenue: 42000, expenses: 24000 },
  { m: "Feb", revenue: 48000, expenses: 26500 },
  { m: "Mar", revenue: 51000, expenses: 27200 },
  { m: "Apr", revenue: 58000, expenses: 30100 },
  { m: "May", revenue: 65000, expenses: 32400 },
  { m: "Jun", revenue: 72000, expenses: 34200 },
  { m: "Jul", revenue: 78000, expenses: 36500 },
  { m: "Aug", revenue: 84000, expenses: 38100 },
  { m: "Sep", revenue: 92000, expenses: 40200 },
  { m: "Oct", revenue: 98000, expenses: 42500 },
  { m: "Nov", revenue: 106000, expenses: 44800 },
  { m: "Dec", revenue: 118000, expenses: 48210 },
];

export const weeklyRevenue = [
  { m: "Mon", revenue: 12400, expenses: 6200 },
  { m: "Tue", revenue: 14200, expenses: 6800 },
  { m: "Wed", revenue: 11800, expenses: 6100 },
  { m: "Thu", revenue: 16400, expenses: 7500 },
  { m: "Fri", revenue: 19200, expenses: 8400 },
  { m: "Sat", revenue: 22400, expenses: 9100 },
  { m: "Sun", revenue: 18600, expenses: 8200 },
];

export const yearlyRevenue = [
  { m: "2020", revenue: 420000, expenses: 240000 },
  { m: "2021", revenue: 560000, expenses: 300000 },
  { m: "2022", revenue: 720000, expenses: 380000 },
  { m: "2023", revenue: 940000, expenses: 460000 },
  { m: "2024", revenue: 1240000, expenses: 540000 },
  { m: "2025", revenue: 1580000, expenses: 620000 },
];

export const categoryData = [
  { name: "Electronics", value: 4820, color: "var(--chart-1)" },
  { name: "Fashion", value: 3240, color: "var(--chart-2)" },
  { name: "Home & Living", value: 2180, color: "var(--chart-3)" },
  { name: "Beauty", value: 1620, color: "var(--chart-4)" },
  { name: "Sports", value: 1280, color: "var(--chart-5)" },
];

export const regionData = [
  { region: "N. America", sales: 42800 },
  { region: "Europe", sales: 38400 },
  { region: "Asia", sales: 51200 },
  { region: "S. America", sales: 18600 },
  { region: "Africa", sales: 9400 },
  { region: "Oceania", sales: 12200 },
];

const names = [
  { n: "Sophia Bennett", e: "sophia@acme.co" },
  { n: "Liam Carter", e: "liam@stripe.dev" },
  { n: "Ava Nakamura", e: "ava@linear.app" },
  { n: "Noah Petrov", e: "noah@vercel.com" },
  { n: "Isabella Rossi", e: "bella@figma.co" },
  { n: "Ethan Kwon", e: "ethan@notion.so" },
  { n: "Mia Delacroix", e: "mia@raycast.com" },
  { n: "Lucas Andersen", e: "lucas@arc.net" },
];

const products = [
  "Aurora Wireless Headphones",
  "Nimbus Mechanical Keyboard",
  "Solstice Smart Watch",
  "Halo Desk Lamp Pro",
  "Vertex Ergonomic Chair",
  "Pulse Fitness Tracker",
  "Echo Studio Monitor",
  "Prism 4K Display",
];

const statuses: OrderStatus[] = ["completed", "processing", "pending", "cancelled"];
const payments: PaymentStatus[] = ["paid", "unpaid", "refunded"];

// Deterministic mock data — no Date.now / Math.random so SSR and CSR match.
const AMOUNTS = [249, 128, 1240, 452, 89, 780, 612, 195, 348, 924, 156, 543, 268, 812, 431, 108, 675, 289, 1085, 372, 96, 502, 738, 216];
const EPOCH = Date.UTC(2025, 10, 30); // fixed reference date
export const orders: Order[] = Array.from({ length: 24 }, (_, i) => {
  const c = names[i % names.length];
  return {
    id: `#ORD-${(10248 + i).toString()}`,
    customer: { name: c.n, email: c.e, avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(c.e)}` },
    product: products[i % products.length],
    date: new Date(EPOCH - i * 86400000 * 0.6).toISOString(),
    amount: AMOUNTS[i],
    payment: payments[i % payments.length],
    status: statuses[i % statuses.length],
  };
});

export const topProducts = [
  { name: "Aurora Wireless Headphones", category: "Electronics", sold: 1248, revenue: 149760, stock: "in", progress: 92, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" },
  { name: "Nimbus Mechanical Keyboard", category: "Electronics", sold: 986, revenue: 118320, stock: "low", progress: 78, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80" },
  { name: "Solstice Smart Watch", category: "Wearables", sold: 842, revenue: 210500, stock: "in", progress: 68, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" },
  { name: "Halo Desk Lamp Pro", category: "Home", sold: 624, revenue: 43680, stock: "in", progress: 54, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=80" },
  { name: "Vertex Ergonomic Chair", category: "Furniture", sold: 312, revenue: 156000, stock: "out", progress: 32, img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&q=80" },
] as const;

export type Activity = {
  id: string;
  type: "order" | "product" | "payment" | "expense" | "employee" | "customer";
  title: string;
  detail: string;
  time: string;
};

export const activities: Activity[] = [
  { id: "a1", type: "order", title: "New order received", detail: "#ORD-10271 · Aurora Wireless · $249", time: "2m ago" },
  { id: "a2", type: "payment", title: "Payment completed", detail: "Sophia Bennett paid $1,240", time: "14m ago" },
  { id: "a3", type: "product", title: "Product added", detail: "Prism 4K Display added to catalog", time: "1h ago" },
  { id: "a4", type: "customer", title: "Customer registered", detail: "Lucas Andersen joined", time: "2h ago" },
  { id: "a5", type: "expense", title: "Expense approved", detail: "Cloud infra · $842.00", time: "3h ago" },
  { id: "a6", type: "employee", title: "Employee updated", detail: "Mia moved to Ops team", time: "5h ago" },
  { id: "a7", type: "order", title: "New order received", detail: "#ORD-10270 · Halo Lamp · $128", time: "6h ago" },
];

export type Notification = {
  id: string;
  category: "payment" | "stock" | "order" | "expense" | "system";
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", category: "payment", title: "Payment received", detail: "$1,240 from Sophia Bennett", time: "2m", read: false },
  { id: "n2", category: "stock", title: "Low stock alert", detail: "Nimbus Keyboard: 8 units left", time: "18m", read: false },
  { id: "n3", category: "order", title: "New order", detail: "#ORD-10271 needs review", time: "42m", read: false },
  { id: "n4", category: "expense", title: "Expense pending approval", detail: "Marketing · $2,180", time: "1h", read: true },
  { id: "n5", category: "system", title: "System update available", detail: "v2.14.0 · security patches", time: "3h", read: true },
  { id: "n6", category: "order", title: "Order shipped", detail: "#ORD-10265 · delivered to carrier", time: "5h", read: true },
];