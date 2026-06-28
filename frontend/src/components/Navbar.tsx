"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Compass, Menu, X, Heart } from 'lucide-react';
import { useApp } from '../lib/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, user } = useApp();

  // Hide navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md border-b border-gold-300/20 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.02)]' 
          : 'bg-[#F5E6D3] border-b border-[#D4AF37]/30 py-4'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            
            {/* Logo Brand */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="flex items-center pl-2 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image 
                  src="/logo.jpeg"  
                  alt="SIANKAN Logo" 
                  width={200}     
                  height={80}       
                  className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply scale-110 origin-left" 
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 flex-1 justify-center px-6">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 pb-1.5 group ${
                      isActive 
                        ? 'text-maroon-600 font-bold' 
                        : 'text-neutral-500 hover:text-maroon-600'
                    }`}
                  >
                    {link.label}
                    {/* Active line */}
                    <span className={`absolute bottom-0 left-0 h-[1.5px] bg-gold-300 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Wishlist Link */}
              <Link 
                href="/wishlist" 
                className="relative p-2 text-neutral-600 hover:text-maroon-600 transition-colors duration-300 rounded-full hover:bg-neutral-100/50"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>

              {/* Cart Icon */}
              <Link 
                href="/cart" 
                className="relative p-2 text-neutral-600 hover:text-maroon-600 transition-colors duration-300 rounded-full hover:bg-neutral-100/50"
                aria-label="Shopping Cart"
                title="Shopping Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-300 text-[8px] font-bold text-white ring-2 ring-white">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* Profile Icon / Account Info */}
              {user ? (
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-1.5 border border-gold-300/40 hover:border-gold-300 px-2.5 py-1.5 rounded-sm hover:bg-gold-50/50 transition-all duration-300"
                  title="Profile"
                >
                  <User size={15} className="text-maroon-600" strokeWidth={1.8} />
                  <span className="hidden md:inline text-[9px] font-bold tracking-widest text-maroon-600 uppercase max-w-[65px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="p-2 text-neutral-600 hover:text-maroon-600 transition-colors duration-300 rounded-full hover:bg-neutral-100/50"
                  title="Sign In"
                >
                  <User size={20} strokeWidth={1.5} />
                </Link>
              )}



              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-neutral-600 hover:text-maroon-600 lg:hidden rounded-full transition-colors duration-300 hover:bg-neutral-100/50"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gold-100 bg-[#FAF8F5] px-4 py-4 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top duration-300">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2 text-[11px] font-semibold tracking-widest uppercase rounded-sm transition-colors duration-300 ${
                    isActive 
                      ? 'bg-gold-50 text-maroon-600 border-l-2 border-gold-300' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-maroon-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

          </div>
        )}
      </header>
    </>
  );
}
