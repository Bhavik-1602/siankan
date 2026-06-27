"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAdminStats } from '@/lib/supabaseClient';

export default function AdminDashboardPage() {
  const { user, logout, loading: authLoading } = useApp();
  const router = useRouter();
  const [stats, setStats] = useState<any>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticate admin session
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
      setLoading(true);
      getAdminStats().then(data => {
        if (data && data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
        }
        setLoading(false);
      });
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 flex items-center justify-center font-sans text-gray-500 text-sm">
        Retrieving administration console analytics...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-[#F5E6D3] pb-6">
        <div>
          <span className="font-serif text-[#D4AF37] uppercase tracking-widest text-xs font-semibold">Couture Panel</span>
          <h1 className="font-serif text-3xl text-[#4A0E17] font-medium mt-1">Admin Dashboard</h1>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push('/admin/login');
          }}
          className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all"
        >
          Logout Console
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Nav card */}
        <div className="md:col-span-1 bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-6 shadow-sm space-y-3">
          <h3 className="font-serif text-sm text-[#4A0E17] font-semibold uppercase tracking-wider mb-4">Console Navigation</h3>
          <Link
            href="/admin/categories"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-[#F5E6D3]/30 transition-all border border-gray-150"
          >
            Category Management
          </Link>
          <Link
            href="/admin/products"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-[#F5E6D3]/30 transition-all border border-gray-150"
          >
            Product Management
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-[#F5E6D3]/30 transition-all border border-gray-150"
          >
            Order Management
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/70 border border-[#F5E6D3] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Total Sales Revenue</span>
            <span className="font-serif text-3xl text-[#4A0E17] font-medium mt-4">₹{stats.revenue.toLocaleString()}</span>
          </div>

          <div className="bg-white/70 border border-[#F5E6D3] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Total Orders</span>
            <span className="font-serif text-3xl text-[#4A0E17] font-medium mt-4">{stats.totalOrders}</span>
          </div>

          <div className="bg-white/70 border border-[#F5E6D3] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Pending Orders</span>
            <span className="font-serif text-3xl text-[#D4AF37] font-medium mt-4">{stats.pendingOrders}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white/70 border border-[#F5E6D3] rounded-xl p-8 shadow-sm">
        <h3 className="font-serif text-xl text-[#4A0E17] font-medium mb-6">Recent Customer Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No recent orders have been registered in the database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer Name</th>
                  <th className="py-3 px-4 font-bold">Total Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/50 transition-all">
                    <td className="py-4 px-4 font-medium text-gray-800 font-mono text-xs">{order.id}</td>
                    <td className="py-4 px-4">{order.customer_name}</td>
                    <td className="py-4 px-4 font-serif text-[#4A0E17] font-semibold">₹{parseFloat(order.total_amount).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                        order.status === 'completed' ? 'bg-green-50 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
