"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, User, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../lib/AppContext';
import CartDrawer from './CartDrawer';

type NavItem = {
  href: string;
  label: string;
  panel?: {
    heading: string;
    tagline: string;
    links: { label: string; href: string }[];
  };
};

const navLinks: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    href: '/collections',
    label: 'New Arrivals',
    panel: {
      heading: "Festive Couture '26",
      tagline: "The newest hand-dyed pieces, fresh from the atelier.",
      links: [
        { label: "All New Pieces", href: "/collections" },
        { label: "Featured Lehengas", href: "/collections?category=lehenga" },
        { label: "Signature Gowns", href: "/collections?category=gown" },
      ],
    },
  },
  {
    href: '/collections',
    label: 'Collections',
    panel: {
      heading: "Shop by Silhouette",
      tagline: "Every piece is crafted in small batches by hand.",
      links: [
        { label: "Lehengas", href: "/collections?category=lehenga" },
        { label: "Gowns", href: "/collections?category=gown" },
        { label: "Kurti Sets", href: "/collections?category=kurti-set" },
        { label: "Anarkalis", href: "/collections?category=anarkali" },
        { label: "Sarees", href: "/collections?category=saree" },
      ],
    },
  },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Ateliers' },
  { href: '/services', label: 'Styling Services' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setCartOpen } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === '/';
  
  // Decide active header colors
  const isHeaderDark = isHome && !scrolled;
  const headerBgClass = isHeaderDark 
    ? 'bg-transparent border-transparent text-white' 
    : 'bg-[#FAF8F5]/90 backdrop-blur-md border-[#FAF8F5]/10 border-b border-[#f5e6d3]/20 text-[#171717] shadow-elegant';
  
  const iconColorClass = isHeaderDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-[#171717]/85 hover:text-brand-terracotta hover:bg-brand-terracotta/5';
  const logoInvertClass = isHeaderDark ? 'brightness-100' : 'brightness-90 contrast-125';

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onMouseLeave={() => setHovered(null)}
        className={`z-40 border-b transition-all duration-500 ${
          isHome ? 'fixed top-0 left-0 w-full' : 'sticky top-0'
        } ${headerBgClass}`}
      >
        {/* Navigation Wrapper */}
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 sm:px-8 ${
            scrolled ? 'h-16' : 'h-24'
          }`}
        >
          {/* Logo Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              src="/logo.jpeg"
              alt="SIANKAN"
              className={`shrink-0 object-contain transition-all duration-500 rounded-xs ${logoInvertClass} ${
                scrolled ? 'h-9 w-9' : 'h-14 w-14'
              }`}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div
                    key={item.label}
                    className="relative px-3.5 py-2.5 cursor-pointer"
                    onMouseEnter={() => setHovered(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 relative py-1 ${
                        isActive 
                          ? isHeaderDark ? 'text-white' : 'text-brand-terracotta'
                          : isHeaderDark ? 'text-white/60 hover:text-white' : 'text-[#171717]/65 hover:text-brand-terracotta'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span 
                          layoutId="activeNavLine" 
                          className={`absolute bottom-0 left-0 h-[1px] w-full ${isHeaderDark ? 'bg-white' : 'bg-brand-terracotta'}`}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1.5 pl-4 border-l border-neutral-200/10">
              <Link 
                href="/collections" 
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${iconColorClass}`}
                aria-label="Search"
              >
                <Search className="h-[17px] w-[17px]" strokeWidth={1.3} />
              </Link>
              <Link 
                href="/profile" 
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${iconColorClass}`}
                aria-label="Account"
              >
                <User className="h-[17px] w-[17px]" strokeWidth={1.3} />
              </Link>
              <Link 
                href="/wishlist" 
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${iconColorClass}`}
                aria-label="Wishlist"
              >
                <Heart className="h-[17px] w-[17px]" strokeWidth={1.3} />
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={() => setCartOpen(true)}
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer ${iconColorClass}`}
                aria-label="Open cart"
              >
                <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.3} />
                <AnimatePresence>
                  {totalItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
                        isHeaderDark ? 'bg-white text-neutral-900' : 'bg-brand-terracotta text-white'
                      }`}
                    >
                      {totalItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer md:hidden ${iconColorClass}`}
                aria-label="Toggle Menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Megamenu Panels for Hover */}
        <AnimatePresence>
          {hovered && navLinks.find((n) => n.label === hovered)?.panel && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full w-full bg-[#FAF8F5] border-b border-[#f5e6d3]/40 text-[#171717] shadow-luxury"
              onMouseEnter={() => setHovered(hovered)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="mx-auto grid max-w-7xl grid-cols-12 gap-12 px-10 py-12">
                <div className="col-span-4 space-y-3">
                  <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-brand-terracotta">ATELIER DROP</span>
                  <h4 className="font-editorial text-3xl font-light leading-snug">
                    {navLinks.find((n) => n.label === hovered)?.panel?.heading}
                  </h4>
                  <p className="text-xs text-[#171717]/50 leading-relaxed max-w-xs font-light">
                    {navLinks.find((n) => n.label === hovered)?.panel?.tagline}
                  </p>
                </div>
                <div className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-3 self-center pl-8 border-l border-[#f5e6d3]/40">
                  {navLinks
                    .find((n) => n.label === hovered)
                    ?.panel?.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setHovered(null)}
                        className="group flex items-center justify-between border-b border-stone-200/40 py-2.5 hover:border-brand-terracotta/30 transition-colors"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#171717]/85 transition-colors group-hover:text-brand-terracotta">
                          {link.label}
                        </span>
                        <ArrowRight className="h-3 w-3 text-stone-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-terracotta transition-all duration-355" />
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100vh", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-30 bg-[#FAF8F5] text-[#171717] md:hidden pt-28 px-8 overflow-y-auto"
            >
              <div className="flex flex-col justify-between h-[80vh]">
                <nav className="flex flex-col gap-6 font-serif text-2xl tracking-wide">
                  {navLinks.map((item) => (
                    <div key={item.label} className="border-b border-stone-250/20 pb-4">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="hover:text-brand-terracotta transition-colors flex justify-between items-center"
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] font-sans font-bold tracking-widest text-[#171717]/40">Explore</span>
                      </Link>
                    </div>
                  ))}
                </nav>

                <div className="space-y-4 border-t border-stone-250/30 pt-8 pb-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#171717]/45">SIANKAN STUDIO</p>
                  <p className="text-xs font-light text-stone-500">Handcrafted Contemporary Indian Wear. Surat Atelier.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </>
  );
}