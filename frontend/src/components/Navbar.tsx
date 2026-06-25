"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Scissors, Menu, X, Landmark, Compass, Eye } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { isUsingMock } from '../lib/supabaseClient';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, user } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Total item count in shopping bag
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <>

      <header className="sticky top-0 z-40 w-full border-b border-[#D4AF37]/40 bg-[#F5E6D3] shadow-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            
         {/* Logo Brand */}
<Link href="/" className="flex items-center group flex-shrink-0">
  <div className="flex items-center pl-2"> {/* 💡 ડાબી બાજુ જગ્યા સરખી કરવા માટે pl-4 માંથી pl-2 કર્યું */}
    <Image 
      src="/logo.jpeg"  
      alt="SIANKAN Logo" 
      width={240}     
      height={96}       
      className="h-20 w-auto object-contain mix-blend-multiply scale-125 origin-left" 
     
      priority
    />
  </div>
</Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-12 flex-1 justify-center px-12">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 pb-1 ${
                      isActive 
                        ? 'text-[#4A0E17] font-bold' 
                        : 'text-[#5A5A5A] hover:text-[#4A0E17]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#D4AF37] to-[#E8C5C8] transition-all duration-300" />
                    )}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#D4AF37] to-[#E8C5C8] transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-6">
              
              {/* Cart Icon */}
              <Link 
                href="/cart" 
                className="relative p-2.5 text-[#5A5A5A] hover:text-[#4A0E17] transition-colors duration-300 rounded-md hover:bg-white/60"
                aria-label="Shopping Cart"
                title="Shopping Cart"
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-white">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* Profile Icon / Admin dashboard link */}
              {user ? (
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 border border-[#D4AF37]/60 px-3 py-1.5 rounded-md hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-colors duration-300"
                  title="Profile"
                >
                  <User size={18} className="text-[#4A0E17]" strokeWidth={1.5} />
                  <span className="hidden sm:inline text-[11px] font-semibold tracking-wider text-[#4A0E17] uppercase max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.user_metadata?.full_name || 'Account'}
                  </span>
                </Link>
              ) : (
                <Link 
                  href="/auth" 
                  className="p-2.5 text-[#5A5A5A] hover:text-[#4A0E17] transition-colors duration-300 rounded-md hover:bg-white/60"
                  title="Sign In"
                >
                  <User size={22} strokeWidth={1.5} />
                </Link>
              )}

              {/* Admin Portal Shortcut */}
              <Link 
                href="/admin"
                className="hidden sm:flex items-center space-x-1.5 border border-[#D4AF37]/60 px-3 py-1.5 rounded-md hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-colors duration-300"
                title="Admin"
              >
                <Compass size={16} className="text-[#D4AF37]" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase">
                  Admin
                </span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-[#5A5A5A] hover:text-[#4A0E17] lg:hidden rounded-md transition-colors duration-300 hover:bg-white/60"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#D4AF37]/20 bg-white px-4 py-4 space-y-2 shadow-md animate-in fade-in slide-in-from-top duration-300">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-md transition-colors duration-300 ${
                    isActive 
                      ? 'bg-[#D4AF37]/15 text-[#4A0E17] border-l-2 border-[#D4AF37]' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#4A0E17]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link 
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-md text-[#D4AF37] hover:bg-gray-100 transition-colors border border-[#D4AF37]/30 mt-2"
            >
              <Compass size={16} strokeWidth={1.5} />
              <span>Admin Panel</span>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
