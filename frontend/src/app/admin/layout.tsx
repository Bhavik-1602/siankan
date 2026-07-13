"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import { LayoutDashboard, ShoppingBag, Package, FolderTree, LogOut, Store, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;

  const navItems = [
    { title: "Overview",   url: "/admin/dashboard",  icon: LayoutDashboard },
    { title: "Orders",     url: "/admin/orders",     icon: ShoppingBag },
    { title: "Products",   url: "/admin/products",   icon: Package },
    { title: "Categories", url: "/admin/categories", icon: FolderTree },
  ];

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('')
    : 'AD';

  return (
    <div 
      className="flex h-screen w-full overflow-hidden" 
      style={{ 
        background: 'oklch(0.977 0.008 85)', 
        color: 'oklch(0.22 0.012 60)', 
        fontFamily: 'var(--font-sans)' 
      }}
    >

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Dark Sidebar ── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 h-full ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          background: 'oklch(0.18 0.01 60)', 
          borderColor: 'oklch(0.25 0.01 60)',
          flexShrink: 0 
        }}
      >

        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid oklch(0.25 0.01 60)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'grid', height: '36px', width: '36px', placeItems: 'center', borderRadius: '10px', background: 'oklch(0.59 0.155 42)', color: 'oklch(0.98 0.01 85)', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <Store size={18} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', color: 'oklch(0.95 0.005 85)' }}>N&A Boutique</span>
              <span style={{ fontSize: '10px', color: 'oklch(0.9 0.008 80)', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Admin Console</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'inline-flex', background: 'transparent', border: 'none', color: 'oklch(0.9 0.008 80)', cursor: 'pointer', opacity: 0.7 }}
            className="lg:hidden hover:opacity-100 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation - Independent scrollable list */}
        <nav className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'oklch(0.9 0.008 80)', opacity: 0.35, padding: '0 12px', marginBottom: '8px' }}>Workspace</p>
          {navItems.map((item) => {
            const active = pathname === item.url || pathname?.startsWith(item.url + '/');
            return (
              <Link
                key={item.title}
                href={item.url}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 550, textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: active ? 'oklch(0.59 0.155 42)' : 'transparent',
                  color: active ? 'oklch(0.98 0.01 85)' : 'oklch(0.85 0.008 80)',
                  boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'oklch(0.24 0.01 60)'; (e.currentTarget as HTMLElement).style.color = 'oklch(0.95 0.005 85)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'oklch(0.85 0.008 80)'; } }}
              >
                <item.icon size={17} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid oklch(0.25 0.01 60)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* User chip */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px', background: 'oklch(0.24 0.01 60)', border: '1px solid oklch(0.28 0.01 60)' }}>
              <span style={{ display: 'grid', height: '32px', width: '32px', placeItems: 'center', borderRadius: '50%', background: 'oklch(0.59 0.155 42)', fontSize: '12px', fontWeight: 700, color: 'oklch(0.98 0.01 85)', flexShrink: 0 }}>{initials}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.95 0.005 85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user.full_name || 'Admin User'}</p>
                <p style={{ fontSize: '10px', color: 'oklch(0.8 0.008 80)', opacity: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '10px', 
              width: '100%', 
              padding: '11px', 
              borderRadius: '10px', 
              background: 'transparent', 
              border: '1px solid oklch(0.55 0.2 27 / 0.5)', 
              color: 'oklch(0.68 0.18 27)', 
              fontSize: '13px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'all 0.15s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'oklch(0.55 0.2 27)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'oklch(0.68 0.18 27)';
            }}
          >
            <LogOut size={15} />
            <span>Logout Console</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* Top bar */}
        <header 
          style={{ 
            display: 'flex', 
            height: '60px', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid oklch(0.9 0.012 80)', 
            background: 'oklch(0.977 0.008 85 / 0.85)', 
            backdropFilter: 'blur(12px)',
            flexShrink: 0
          }}
          className="px-6 lg:px-10"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'inline-flex',
                background: 'transparent',
                border: 'none',
                color: 'oklch(0.22 0.012 60)',
                cursor: 'pointer',
              }}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-200/50"
            >
              <Menu size={20} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'oklch(0.52 0.014 65)', background: 'oklch(0.945 0.01 82)', padding: '4px 10px', borderRadius: '6px' }}>
              Environment: Live
            </span>
          </div>
          <Link
            href="/"
            style={{ fontSize: '12px', fontWeight: 500, color: 'oklch(0.52 0.014 65)', border: '1px solid oklch(0.9 0.012 80)', padding: '6px 14px', borderRadius: '999px', background: 'oklch(0.995 0.004 90)', textDecoration: 'none', boxShadow: '0 1px 2px oklch(0.22 0.012 60 / 0.04)' }}
          >
            Go to Storefront →
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
