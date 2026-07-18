"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#f5e6d3]/10 bg-[#171717] text-white mt-32 relative overflow-hidden">
      {/* Decorative subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(at_top_right,rgba(150,60,45,0.06),transparent_50%)] pointer-events-none" />
      
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 sm:px-8 relative z-10">
        
        {/* Col 1: Brand Info */}
        <div className="md:col-span-1 space-y-6">
          <Link href="/" className="inline-block">
            <img 
              src="/logo.jpeg" 
              alt="SAINKAI" 
              className="h-16 w-auto object-contain brightness-110 contrast-125 rounded-xs" 
            />
          </Link>
          <p className="text-xs leading-relaxed text-stone-400 font-light max-w-xs">
            Handcrafted luxury women's ethnic fashion. Slow-made in India, designed for timeless celebrations.
          </p>
        </div>

        {/* Col 2: Shop Catalog */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#faf8f5]/60">Shop Catalog</h4>
          <ul className="space-y-3.5 text-xs font-light text-stone-400">
            <li>
              <Link href="/collections" className="hover:text-[#FAF8F5] transition-colors flex items-center justify-between group max-w-[150px]">
                <span>All Pieces</span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-gold" />
              </Link>
            </li>
            <li>
              <Link href="/collections?category=lehenga" className="hover:text-[#FAF8F5] transition-colors flex items-center justify-between group max-w-[150px]">
                <span>Lehengas</span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-gold" />
              </Link>
            </li>
            <li>
              <Link href="/collections?category=gown" className="hover:text-[#FAF8F5] transition-colors flex items-center justify-between group max-w-[150px]">
                <span>Signature Gowns</span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-gold" />
              </Link>
            </li>
            <li>
              <Link href="/collections?category=kurti-set" className="hover:text-[#FAF8F5] transition-colors flex items-center justify-between group max-w-[150px]">
                <span>Kurti Sets</span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-gold" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Studio Coordinates */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#faf8f5]/60">Studio</h4>
          <ul className="space-y-3.5 text-xs font-light text-stone-400">
            <li>
              <Link href="/about" className="hover:text-[#FAF8F5] transition-colors">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#FAF8F5] transition-colors">
                Studio Ateliers
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[#FAF8F5] transition-colors">
                Styling Consultations
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-[#FAF8F5] transition-colors">
                Bespoke Size Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter Sign-up */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#faf8f5]/60">Stay Connected</h4>
          <p className="text-xs font-light text-stone-400 max-w-xs leading-relaxed">
            Join the inner circle for collections drops, studio previews, and bespoke events notes.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b border-stone-700 pb-2.5 max-w-xs group transition-colors focus-within:border-brand-gold"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-stone-600 font-light"
            />
            <button type="submit" className="ml-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold hover:text-white transition-colors cursor-pointer">
              Join
            </button>
          </form>
          <div className="mt-6 flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-850 hover:border-brand-gold hover:text-brand-gold transition-colors text-stone-450"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-850 hover:border-brand-gold hover:text-brand-gold transition-colors text-stone-450"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <a 
              href="mailto:hello@sainkai.com" 
              aria-label="Email" 
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-850 hover:border-brand-gold hover:text-brand-gold transition-colors text-stone-450"
            >
              <Mail className="h-4 w-4" strokeWidth={1.4} />
            </a>
          </div>
        </div>
      </div>

      {/* Under Footer */}
      <div className="border-t border-[#f5e6d3]/5 py-8 bg-[#131313] relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-[10px] font-semibold tracking-widest text-stone-500 sm:flex-row uppercase sm:px-8">
          <p>© {new Date().getFullYear()} Sainkai Studio. All rights reserved.</p>
          <p className="tracking-[0.3em] text-stone-450">Handmade in India</p>
        </div>
      </div>
    </footer>
  );
}
