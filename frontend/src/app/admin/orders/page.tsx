"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllOrders, updateOrderStatus } from '@/lib/supabaseClient';

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Verify Admin Session
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
      } else {
        const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
        if (!isAdmin) {
          router.push('/login');
        }
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data || []);
    setFilteredOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    setError(null);
    const success = await updateOrderStatus(orderId, nextStatus);
    if (success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    } else {
      setError('Failed to update status for order ' + orderId);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 flex items-center justify-center font-sans text-gray-500 text-sm">
        Retrieving order status board...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#F5E6D3] pb-6 gap-4">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-[#D4AF37] hover:underline font-semibold uppercase tracking-widest">← Back to Dashboard</Link>
          <h1 className="font-serif text-3xl text-[#4A0E17] font-medium mt-2 font-medium">Order Management</h1>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#F5E6D3] rounded text-xs focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#F5E6D3]">
          <p className="text-gray-400 text-sm">No orders match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-[#F5E6D3] rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-100 gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-800">ORDER: {order.id}</span>
                  <p className="text-xs text-gray-400 mt-1">Placed: {new Date(order.created_at).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg text-[#4A0E17] font-bold">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                  
                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-semibold focus:outline-none"
                  >
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 text-xs text-gray-600">
                <div>
                  <p className="font-bold text-gray-400 uppercase mb-1">Customer Info</p>
                  <p className="font-medium text-gray-800">{order.customer_name}</p>
                  <p>{order.email}</p>
                  <p>Phone: {order.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase mb-1">Shipping Details</p>
                  <p className="font-medium text-gray-800">{order.shipping_address}</p>
                  <p>{order.city} - {order.postal_code}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase mb-1">Payment Method</p>
                  <p className="font-semibold text-[#D4AF37] uppercase">{order.payment_method}</p>
                </div>
              </div>

              {/* Items listing */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ordered Products</p>
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img
                      src={item.products?.image_url}
                      alt={item.products?.name}
                      className="w-10 h-10 object-cover rounded border border-gray-100 bg-white"
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-800">{item.products?.name}</h4>
                      <p className="text-[10px] text-gray-400">
                        Qty: {item.quantity} • Price: ₹{parseFloat(item.price).toLocaleString()}
                      </p>
                      {item.customization_notes && (
                        <p className="text-[10px] text-[#D4AF37] italic mt-0.5">
                          Custom size details: {typeof item.customization_notes === 'string' ? item.customization_notes : JSON.stringify(item.customization_notes)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
