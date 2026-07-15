"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { AdminSidebar, navItems } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NotificationPanel } from '@/components/admin/NotificationPanel';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Toaster, toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && pathname !== '/admin/login') {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push('/login');
      }
    }
  }, [user, authLoading, router, pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <Toaster position="top-right" theme="light" closeButton />
      </>
    );
  }

  if (authLoading || (!user && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-sm font-medium">
        Loading Admin Console…
      </div>
    );
  }

  // Calculate active sidebar key based on path
  let active = "dashboard";
  if (pathname?.includes("/admin/products")) active = "products";
  else if (pathname?.includes("/admin/categories")) active = "categories";
  else if (pathname?.includes("/admin/orders")) active = "orders";

  const activeLabel = navItems.find((n) => n.key === active)?.label ?? "Dashboard";

  const handleSelect = (key: string) => {
    if (key === "dashboard") router.push("/admin/dashboard");
    else if (key === "products") router.push("/admin/products");
    else if (key === "categories") router.push("/admin/categories");
    else if (key === "orders") router.push("/admin/orders");
    else if (key === "notifications") setNotifOpen(true);
    else {
      const label = navItems.find(item => item.key === key)?.label || key;
      toast(`Coming Soon: ${label}`, {
        description: `The ${label.toLowerCase()} module is scaffolded and ready to connect to your data source.`,
      });
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background text-foreground admin-root font-sans">
      {/* Ambient mesh backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-mesh opacity-70" />

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar
          active={active}
          onSelect={handleSelect}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[280px] p-0 border-none bg-background">
          <AdminSidebar
            active={active}
            onSelect={(k) => {
              handleSelect(k);
              setMobileNavOpen(false);
            }}
            collapsed={false}
            onToggleCollapsed={() => {}}
            className="h-full border-r-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          page={activeLabel}
          onOpenNotifications={() => setNotifOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />
      <Toaster position="top-right" theme="light" closeButton />
    </div>
  );
}
