"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAdminStats } from '@/lib/supabaseClient';
import { IndianRupee, ShoppingBag, Clock, Package, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

/* ── Monthly revenue series (derived from real revenue; months are illustrative) ── */
const buildRevenueSeries = (totalRevenue: number) => {
  const weights = [0.05, 0.045, 0.07, 0.08, 0.075, 0.09, 0.1, 0.095, 0.11, 0.12, 0.08, 0.065];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months.map((month, i) => ({
    month,
    revenue: Math.round(totalRevenue * weights[i]),
    profit: Math.round(totalRevenue * weights[i] * 0.38),
    orders: Math.round(20 + i * 8 + Math.random() * 15),
  }));
};

const categorySplit = [
  { name: 'Sarees',    value: 42, color: 'oklch(0.59 0.155 42)' },
  { name: 'Lehengas',  value: 28, color: 'oklch(0.55 0.07 165)' },
  { name: 'Suits',     value: 16, color: 'oklch(0.72 0.14 75)' },
  { name: 'Blouses',   value: 9,  color: 'oklch(0.48 0.09 250)' },
  { name: 'Others',    value: 5,  color: 'oklch(0.55 0.13 350)' },
];

/* ── Tiny inline sparkline ── */
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const W = 96, H = 36;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`).join(' ');
  const color = positive ? 'oklch(0.58 0.09 160)' : 'oklch(0.55 0.2 27)';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id={`sg${positive ? 'p' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#sg${positive ? 'p' : 'n'})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, delta, spark, icon }: { label: string; value: string; delta: number; spark: number[]; icon: React.ReactNode }) {
  const positive = delta >= 0;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.995 0.004 90)', padding: '20px', boxShadow: hovered ? '0 12px 40px -12px oklch(0.59 0.155 42 / 0.3)' : '0 1px 2px oklch(0.22 0.012 60 / 0.04), 0 8px 28px -12px oklch(0.22 0.012 60 / 0.1)', transition: 'all 0.2s', transform: hovered ? 'translateY(-2px)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'oklch(0.52 0.014 65)' }}>{label}</p>
          <p style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'oklch(0.22 0.012 60)', lineHeight: 1 }}>{value}</p>
        </div>
        <span style={{ display: 'grid', height: '40px', width: '40px', placeItems: 'center', borderRadius: '12px', background: 'oklch(0.945 0.01 82)', color: 'oklch(0.52 0.014 65)' }}>{icon}</span>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', borderRadius: '999px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, background: positive ? 'oklch(0.58 0.09 160 / 0.15)' : 'oklch(0.55 0.2 27 / 0.12)', color: positive ? 'oklch(0.45 0.09 160)' : 'oklch(0.45 0.2 27)' }}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(delta)}%
        </span>
        <Sparkline data={spark} positive={positive} />
      </div>
    </div>
  );
}

/* ── Panel wrapper ── */
function Panel({ title, description, action, children, style }: { title?: string; description?: string; action?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section style={{ borderRadius: '16px', border: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.995 0.004 90)', padding: '20px', boxShadow: '0 1px 2px oklch(0.22 0.012 60 / 0.04), 0 8px 28px -12px oklch(0.22 0.012 60 / 0.1)', ...style }}>
      {(title || action) && (
        <header style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            {title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', color: 'oklch(0.22 0.012 60)', margin: 0 }}>{title}</h2>}
            {description && <p style={{ marginTop: '3px', fontSize: '12px', color: 'oklch(0.52 0.014 65)', margin: 0 }}>{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/* ── Custom chart tooltip ── */
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ borderRadius: '10px', border: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.995 0.004 90)', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 20px oklch(0.22 0.012 60 / 0.1)' }}>
      <p style={{ marginBottom: '6px', fontWeight: 600, color: 'oklch(0.22 0.012 60)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'oklch(0.52 0.014 65)', margin: '3px 0' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>
          <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'oklch(0.22 0.012 60)' }}>
            {(p.dataKey === 'revenue' || p.dataKey === 'profit') ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ── Status badge config ── */
const statusMap: Record<string, { bg: string; color: string }> = {
  completed:  { bg: 'oklch(0.58 0.09 160 / 0.15)', color: 'oklch(0.42 0.09 160)' },
  shipped:    { bg: 'oklch(0.48 0.09 250 / 0.15)', color: 'oklch(0.35 0.09 250)' },
  processing: { bg: 'oklch(0.72 0.14 75 / 0.2)',   color: 'oklch(0.45 0.1 75)' },
  cancelled:  { bg: 'oklch(0.55 0.2 27 / 0.15)',   color: 'oklch(0.42 0.2 27)' },
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [stats, setStats] = useState<any>({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalCustomers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push('/admin/login'); return; }
      const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
      if (!isAdmin) router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getAdminStats().then(data => {
        if (data?.success) { setStats(data.stats); setRecentOrders(data.recentOrders || []); }
        setLoading(false);
      });
    }
  }, [user]);

  if (authLoading || loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'oklch(0.52 0.014 65)' }}>Loading dashboard…</div>;
  }

  const revenueSeries = buildRevenueSeries(stats.revenue || 420000);

  /* Top products from mock (replace with real API data if available) */
  const topProducts = [
    { name: 'Kanjivaram Crimson', sold: stats.totalOrders ? Math.round(stats.totalOrders * 0.22) : 84 },
    { name: 'Chikankari Ivory',   sold: stats.totalOrders ? Math.round(stats.totalOrders * 0.18) : 69 },
    { name: 'Banarasi Royal',     sold: stats.totalOrders ? Math.round(stats.totalOrders * 0.15) : 58 },
    { name: 'Lehenga Blush',      sold: stats.totalOrders ? Math.round(stats.totalOrders * 0.12) : 46 },
    { name: 'Anarkali Emerald',   sold: stats.totalOrders ? Math.round(stats.totalOrders * 0.09) : 34 },
  ];

  const kpis = [
    { label: 'Total Revenue',   value: `₹${(stats.revenue / 100000).toFixed(1)}L`,    delta: 12.4, spark: [42,48,45,52,58,55,64,62,71,78], icon: <IndianRupee size={18} /> },
    { label: 'Total Orders',    value: String(stats.totalOrders),                        delta: 8.1,  spark: [30,34,33,40,38,44,47,45,52,56], icon: <ShoppingBag size={18} /> },
    { label: 'Pending Orders',  value: String(stats.pendingOrders),                      delta: -3.2, spark: [18,20,17,22,19,24,20,26,22,28], icon: <Clock size={18} /> },
    { label: 'Customers',       value: String(stats.totalCustomers),                     delta: 5.0,  spark: [10,12,11,15,14,17,16,20,18,22], icon: <Users size={18} /> },
  ];

  const tickStyle = { fontSize: 11, fill: 'oklch(0.52 0.014 65)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'oklch(0.22 0.012 60)', margin: 0 }}>Overview</h1>
          <p style={{ marginTop: '4px', fontSize: '13px', color: 'oklch(0.52 0.014 65)', margin: '4px 0 0' }}>Here's how your boutique storefront is performing.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: 500, color: 'oklch(0.52 0.014 65)', border: '1px solid oklch(0.9 0.012 80)', padding: '8px 16px', borderRadius: '999px', background: 'oklch(0.995 0.004 90)', cursor: 'pointer' }}>Export</span>
          <Link href="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'oklch(0.98 0.01 85)', padding: '8px 16px', borderRadius: '999px', background: 'oklch(0.59 0.155 42)', textDecoration: 'none', boxShadow: '0 2px 8px oklch(0.59 0.155 42 / 0.35)' }}>
            + New order
          </Link>
        </div>
      </div>

      {/* ── KPI stat cards ── */}
      <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {kpis.map(k => <StatCard key={k.label} {...k} />)}
      </div>

      {/* ── Revenue + Category row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <Panel
          title="Revenue & Profit"
          description="Monthly performance across all channels"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'oklch(0.52 0.014 65)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'oklch(0.59 0.155 42)', display: 'inline-block' }} />Revenue</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'oklch(0.55 0.07 165)', display: 'inline-block' }} />Profit</span>
            </div>
          }
        >
          <div style={{ height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.59 0.155 42)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.59 0.155 42)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.07 165)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.55 0.07 165)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(0.9 0.012 80)" strokeDasharray="4 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={tickStyle} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tickLine={false} axisLine={false} tick={tickStyle} width={52} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.59 0.155 42)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="profit"  stroke="oklch(0.55 0.07 165)" strokeWidth={2.5} fill="url(#prof)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Sales by Category" description="Share of revenue">
          <div style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySplit} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={3} stroke="none">
                  {categorySplit.map(c => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div style={{ background: 'oklch(0.995 0.004 90)', border: '1px solid oklch(0.9 0.012 80)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: 'oklch(0.22 0.012 60)' }}>
                    {payload[0].name}: <strong>{payload[0].value}%</strong>
                  </div>
                ) : null} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
            {categorySplit.map(c => (
              <li key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ color: 'oklch(0.22 0.012 60)' }}>{c.name}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'oklch(0.52 0.014 65)' }}>{c.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* ── Recent orders + Top products row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <Panel
          title="Recent Orders"
          description="Latest activity across your channels"
          action={
            <Link href="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'oklch(0.59 0.155 42)', textDecoration: 'none', padding: '5px 10px', borderRadius: '999px', border: '1px solid oklch(0.9 0.012 80)' }}>
              View all <ArrowUpRight size={13} />
            </Link>
          }
        >
          <div style={{ marginLeft: '-4px', marginRight: '-4px' }}>
            {recentOrders.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'oklch(0.52 0.014 65)', padding: '12px 4px' }}>No recent orders.</p>
            ) : recentOrders.map(o => {
              const st = statusMap[o.status] || { bg: 'oklch(0.945 0.01 82)', color: 'oklch(0.52 0.014 65)' };
              const initials = (o.customer_name || 'CU').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 4px', borderBottom: '1px solid oklch(0.9 0.012 80)' }}>
                  <span style={{ display: 'grid', height: '36px', width: '36px', placeItems: 'center', borderRadius: '50%', background: 'oklch(0.945 0.01 82)', fontSize: '11px', fontWeight: 700, color: 'oklch(0.22 0.012 60)', flexShrink: 0 }}>{initials}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'oklch(0.22 0.012 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{o.customer_name}</p>
                    <p style={{ fontSize: '11px', color: 'oklch(0.52 0.014 65)', margin: 0 }}>{o.id}</p>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '3px 9px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: st.bg, color: st.color, flexShrink: 0 }}>{o.status}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'oklch(0.22 0.012 60)', width: '72px', textAlign: 'right', flexShrink: 0 }}>₹{parseFloat(o.total_amount).toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Top Products" description="Best sellers this period">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
            {topProducts.map((p, i) => {
              const max = topProducts[0].sold;
              return (
                <li key={p.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'oklch(0.22 0.012 60)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'oklch(0.52 0.014 65)', minWidth: '16px' }}>{String(i + 1).padStart(2, '0')}</span>
                      {p.name}
                    </span>
                    <span style={{ fontWeight: 600, color: 'oklch(0.52 0.014 65)' }}>{p.sold}</span>
                  </div>
                  <div style={{ height: '5px', width: '100%', borderRadius: '999px', background: 'oklch(0.945 0.01 82)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', background: 'oklch(0.59 0.155 42)', width: `${(p.sold / max) * 100}%`, transition: 'width 0.6s ease' }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* ── Orders volume bar chart ── */}
      <Panel title="Orders Volume" description="Units ordered per month">
        <div style={{ height: '210px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="oklch(0.9 0.012 80)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={tickStyle} />
              <YAxis tickLine={false} axisLine={false} tick={tickStyle} width={40} />
              <Tooltip cursor={{ fill: 'oklch(0.945 0.01 82)' }} content={<ChartTip />} />
              <Bar dataKey="orders" fill="oklch(0.59 0.155 42)" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

    </div>
  );
}
