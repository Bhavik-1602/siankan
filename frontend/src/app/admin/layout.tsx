"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import { LayoutDashboard, ShoppingBag, Package, FolderTree, LogOut, Store } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useApp();

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
    <div className="flex min-h-screen w-full" style={{ background: 'oklch(0.977 0.008 85)', color: 'oklch(0.22 0.012 60)', fontFamily: 'var(--font-sans)' }}>

      {/* ── Dark Sidebar ── */}
      <aside style={{ width: '256px', background: 'oklch(0.21 0.012 60)', borderRight: '1px solid oklch(0.3 0.012 60)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid oklch(0.3 0.012 60)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'grid', height: '36px', width: '36px', placeItems: 'center', borderRadius: '10px', background: 'oklch(0.62 0.16 45)', color: 'oklch(0.98 0.01 85)', flexShrink: 0, boxShadow: '0 2px 8px oklch(0.59 0.155 42 / 0.35)' }}>
            <Store size={18} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.02em', color: 'oklch(0.9 0.008 80)' }}>N&A Boutique</span>
            <span style={{ fontSize: '10px', color: 'oklch(0.9 0.008 80)', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Admin Console</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'oklch(0.9 0.008 80)', opacity: 0.35, padding: '0 12px', marginBottom: '8px' }}>Workspace</p>
          {navItems.map((item) => {
            const active = pathname === item.url || pathname?.startsWith(item.url + '/');
            return (
              <Link
                key={item.title}
                href={item.url}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                  transition: 'all 0.15s',
                  background: active ? 'oklch(0.62 0.16 45)' : 'transparent',
                  color: active ? 'oklch(0.98 0.01 85)' : 'oklch(0.9 0.008 80)',
                  opacity: active ? 1 : 0.7,
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'oklch(0.27 0.012 60)'; (e.currentTarget as HTMLElement).style.opacity = '1'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.opacity = '0.7'; } }}
              >
                <item.icon size={16} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid oklch(0.3 0.012 60)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Insight pill */}
          <div style={{ borderRadius: '12px', background: 'oklch(0.27 0.012 60)', padding: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.96 0.008 80)', marginBottom: '4px' }}>Boutique performance</p>
            <p style={{ fontSize: '11px', color: 'oklch(0.9 0.008 80)', opacity: 0.55, lineHeight: 1.4 }}>Manage products, orders & categories from here.</p>
          </div>

          {/* User chip */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: 'oklch(0.27 0.012 60)' }}>
              <span style={{ display: 'grid', height: '30px', width: '30px', placeItems: 'center', borderRadius: '50%', background: 'oklch(0.62 0.16 45)', fontSize: '11px', fontWeight: 700, color: 'oklch(0.98 0.01 85)', flexShrink: 0 }}>{initials}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.9 0.008 80)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name || 'Admin User'}</p>
                <p style={{ fontSize: '10px', color: 'oklch(0.9 0.008 80)', opacity: 0.45, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'transparent', border: '1px solid oklch(0.55 0.2 27 / 0.3)', color: 'oklch(0.62 0.19 27)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.55 0.2 27 / 0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={15} />
            <span>Logout Console</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', height: '60px', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.977 0.008 85 / 0.85)', padding: '0 32px', backdropFilter: 'blur(12px)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'oklch(0.52 0.014 65)', background: 'oklch(0.945 0.01 82)', padding: '4px 10px', borderRadius: '6px' }}>
            Environment: Live
          </span>
          <Link
            href="/"
            style={{ fontSize: '12px', fontWeight: 500, color: 'oklch(0.52 0.014 65)', border: '1px solid oklch(0.9 0.012 80)', padding: '6px 14px', borderRadius: '999px', background: 'oklch(0.995 0.004 90)', textDecoration: 'none', boxShadow: '0 1px 2px oklch(0.22 0.012 60 / 0.04)' }}
          >
            Go to Storefront →
          </Link>
        </header>

        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
