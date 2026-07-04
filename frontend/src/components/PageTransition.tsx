"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Snappy transition for administrative control panels - no layout animation
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="animate-page-fade-in">
      {children}
    </div>
  );
}
