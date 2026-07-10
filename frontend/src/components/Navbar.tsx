"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, User, Heart } from 'lucide-react';
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
      heading: "Autumn / Winter '26",
      tagline: "The newest hand-dyed pieces, fresh from the atelier.",
      links: [
        { label: "All new pieces", href: "/collections" },
        { label: "Featured lehengas", href: "/collections?category=lehenga" },
        { label: "Signature gowns", href: "/collections?category=gown" },
      ],
    },
  },
  {
    href: '/collections',
    label: 'Collections',
    panel: {
      heading: "Shop by silhouette",
      tagline: "Every piece is crafted in small batches by hand.",
      links: [
        { label: "Lehengas", href: "/collections?category=lehenga" },
        { label: "Gowns", href: "/collections?category=gown" },
        { label: "Kurti Sets", href: "/collections?category=kurti-set" },
        { label: "Anarkalis", href: "/collections?category=anarkali" },
      ],
    },
  },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Ateliers' },
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

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setHovered(null)}
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled
            ? 'border-white/10 bg-neutral-950/95 backdrop-blur-lg text-white shadow-lg'
            : 'border-transparent bg-neutral-950 text-white'
        }`}
      >
        {/* Announcement Bar */}
        <div className="overflow-hidden border-b border-white/10 bg-[#FAF8F5] text-neutral-900">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
            className="flex whitespace-nowrap py-2.5 text-[9px] font-bold uppercase tracking-[0.32em]"
            style={{ width: "max-content" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-4 px-8">
                <span>✦</span>
                Complimentary shipping across India
                <span>✦</span>
                Handcrafted in small batches
                <span>✦</span>
                Made to order in 10–14 days
              </span>
            ))}
          </motion.div>
        </div>

        {/* Navigation Wrapper */}
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-24'
          }`}
        >
          {/* Logo Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.img
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              src="/logo.jpeg"
              alt="SIANKAN"
              className={`shrink-0 object-contain invert brightness-0 transition-all duration-500 ${
                scrolled ? 'h-9 w-9' : 'h-12 w-12'
              }`}
            />
            <div className="hidden min-w-0 flex-col items-center leading-none md:flex">
              <span
                className={`truncate font-display tracking-[0.32em] text-[#FAF8F5] transition-all duration-500 ${
                  scrolled ? 'text-base' : 'text-xl'
                }`}
              >
                SIANKAN
              </span>
              <span className="mt-1 hidden text-[8px] uppercase tracking-[0.42em] text-white/50 lg:block">
                Maison — Est. 2019
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div
                    key={item.label}
                    className="relative px-4 py-2"
                    onMouseEnter={() => setHovered(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={`text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors hover:text-[#FAF8F5] ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1">
              <Link 
                href="/collections" 
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </Link>
              <Link 
                href="/profile" 
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </Link>
              <Link 
                href="/wishlist" 
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
                <AnimatePresence>
                  {totalItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-neutral-900"
                    >
                      {totalItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors md:hidden"
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
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-full w-full bg-neutral-950 border-b border-white/10 text-white"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-10">
                <div className="col-span-4">
                  <h4 className="font-editorial text-2xl font-light leading-snug">
                    {navLinks.find((n) => n.label === hovered)?.panel?.heading}
                  </h4>
                  <p className="mt-3 text-xs text-white/50 leading-relaxed max-w-xs font-light">
                    {navLinks.find((n) => n.label === hovered)?.panel?.tagline}
                  </p>
                </div>
                <div className="col-span-8 grid grid-cols-2 gap-4">
                  {navLinks
                    .find((n) => n.label === hovered)
                    ?.panel?.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setHovered(null)}
                        className="group flex flex-col justify-center border-l border-white/10 pl-6 py-2 hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="text-xs uppercase tracking-widest text-white transition-colors group-hover:text-maroon-400">
                          {link.label}
                        </span>
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
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 bg-neutral-950 text-white md:hidden"
            >
              <nav className="flex flex-col gap-4 px-6 py-6 font-display text-sm tracking-widest">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-maroon-400 transition-colors uppercase text-xs"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </>
  );
}