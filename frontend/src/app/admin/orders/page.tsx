"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { getAllOrders, updateOrderStatus } from '@/lib/supabaseClient';

const statusMap: Record<string, { bg: string; color: string }> = {
  completed:  { bg: 'oklch(0.58 0.09 160 / 0.15)', color: 'oklch(0.45 0.09 160)' },
  shipped:    { bg: 'oklch(0.48 0.09 250 / 0.15)', color: 'oklch(0.38 0.09 250)' },
  processing: { bg: 'oklch(0.72 0.14 75 / 0.2)',   color: 'oklch(0.48 0.1 75)' },
  cancelled:  { bg: 'oklch(0.55 0.2 27 / 0.15)',   color: 'oklch(0.45 0.2 27)' },
};

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push('/admin/login'); return; }
      const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
      if (!isAdmin) router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => { if (user) loadOrders(); }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data || []); setFilteredOrders(data || []); setLoading(false);
  };

  useEffect(() => {
    setFilteredOrders(statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter));
  }, [statusFilter, orders]);

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    setError(null);
    const ok = await updateOrderStatus(orderId, nextStatus);
    if (ok) setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    else setError('Failed to update order ' + orderId);
  };

  if (authLoading || loading) return <div className="admin-loading">Loading orders…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
        <div>
          <h1 className="admin-h1">Order Management</h1>
          <p className="admin-subtitle">Monitor sales orders, update shipment statuses, and view customizations.</p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'oklch(0.995 0.004 90)', border: '1px solid oklch(0.9 0.012 80)', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 1px 2px oklch(0.22 0.012 60 / 0.04)' }}>
          <label className="admin-label">Filter:</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 600, color: 'oklch(0.22 0.012 60)', cursor: 'pointer', outline: 'none' }}>
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {filteredOrders.length === 0 ? (
        <div className="admin-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ fontSize: '13px', color: 'oklch(0.52 0.014 65)' }}>No orders match the selected filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => {
            const st = statusMap[order.status] || { bg: 'oklch(0.945 0.01 82)', color: 'oklch(0.52 0.014 65)' };
            return (
              <section key={order.id} className="admin-panel">
                {/* Order header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid oklch(0.9 0.012 80)', marginBottom: '16px', gap: '16px' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: 'oklch(0.22 0.012 60)' }}>ORDER: {order.id}</span>
                    <p style={{ fontSize: '11px', color: 'oklch(0.52 0.014 65)', marginTop: '2px' }}>Placed: {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'oklch(0.59 0.155 42)' }}>
                      ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                    </span>
                    <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}
                      style={{ padding: '6px 12px', background: st.bg, border: `1px solid ${st.color}30`, borderRadius: '10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: st.color, cursor: 'pointer', outline: 'none' }}>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer / shipping / payment */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '20px', fontSize: '12px' }}>
                  <div>
                    <p className="admin-label" style={{ marginBottom: '6px' }}>Customer Info</p>
                    <p style={{ fontWeight: 600, fontSize: '13px', color: 'oklch(0.22 0.012 60)' }}>{order.customer_name}</p>
                    <p style={{ color: 'oklch(0.52 0.014 65)', marginTop: '2px' }}>{order.email}</p>
                    <p style={{ color: 'oklch(0.52 0.014 65)' }}>Phone: {order.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="admin-label" style={{ marginBottom: '6px' }}>Shipping</p>
                    <p style={{ fontWeight: 600, color: 'oklch(0.22 0.012 60)' }}>{order.shipping_address}</p>
                    <p style={{ color: 'oklch(0.52 0.014 65)', marginTop: '2px' }}>{order.city} — {order.postal_code}</p>
                  </div>
                  <div>
                    <p className="admin-label" style={{ marginBottom: '6px' }}>Payment</p>
                    <span style={{ display: 'inline-block', background: 'oklch(0.945 0.01 82)', color: 'oklch(0.22 0.012 60)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {order.payment_method}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ borderTop: '1px solid oklch(0.9 0.012 80)', paddingTop: '16px' }}>
                  <p className="admin-label" style={{ marginBottom: '12px' }}>Ordered Products</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'oklch(0.977 0.008 85)', padding: '12px', borderRadius: '12px', border: '1px solid oklch(0.9 0.012 80)' }}>
                        <img src={item.products?.image_url} alt={item.products?.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.995 0.004 90)' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'oklch(0.22 0.012 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.products?.name}</h4>
                          <p style={{ fontSize: '12px', color: 'oklch(0.52 0.014 65)', marginTop: '2px' }}>
                            Qty: {item.quantity} · Price: ₹{parseFloat(item.price).toLocaleString('en-IN')}
                          </p>
                          {item.customization_notes && (
                            <div style={{ background: 'oklch(0.72 0.14 75 / 0.12)', border: '1px solid oklch(0.72 0.14 75 / 0.25)', borderRadius: '8px', padding: '8px 10px', marginTop: '8px', fontSize: '11px', color: 'oklch(0.4 0.1 75)', lineHeight: 1.5 }}>
                              <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'oklch(0.5 0.12 75)', marginBottom: '2px' }}>Bespoke Size Profile</span>
                              {typeof item.customization_notes === 'string' ? item.customization_notes : JSON.stringify(item.customization_notes)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
