"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/10 bg-neutral-950 text-white mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        
        {/* Col 1 */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="inline-block">
            <img 
              src="/logo.jpeg" 
              alt="SIANKAN" 
              className="h-14 w-auto object-contain invert brightness-0" 
            />
          </Link>
          <p className="text-xs leading-relaxed text-neutral-400 font-light max-w-xs">
            Handcrafted contemporary Indian wear. Small batch. Made in India with love.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FAF8F5]">Shop</h4>
          <ul className="space-y-2.5 text-xs font-light text-neutral-400">
            <li>
              <Link href="/collections" className="hover:text-white transition-colors">
                All Pieces
              </Link>
            </li>
            <li>
              <Link href="/collections?category=lehenga" className="hover:text-white transition-colors">
                Lehengas
              </Link>
            </li>
            <li>
              <Link href="/collections?category=gown" className="hover:text-white transition-colors">
                Gowns
              </Link>
            </li>
            <li>
              <Link href="/collections?category=kurti-set" className="hover:text-white transition-colors">
                Kurti Sets
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FAF8F5]">Studio</h4>
          <ul className="space-y-2.5 text-xs font-light text-neutral-400">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Size Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Care Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FAF8F5]">Stay in touch</h4>
          <p className="mb-4 text-xs font-light text-neutral-400 max-w-xs leading-relaxed">
            Studio drops, atelier notes, first look at new collections.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b border-neutral-700 pb-1.5 max-w-xs"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-500 font-light"
            />
            <button type="submit" className="ml-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FAF8F5] hover:text-maroon-400 transition-colors">
              Join
            </button>
          </form>
          <div className="mt-6 flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Instagram className="h-4.5 w-4.5" strokeWidth={1.5} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Facebook className="h-4.5 w-4.5" strokeWidth={1.5} />
            </a>
            <a 
              href="mailto:hello@siankan.com" 
              aria-label="Email" 
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Mail className="h-4.5 w-4.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Under */}
      <div className="border-t border-neutral-900 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-[10px] font-medium tracking-wider text-neutral-500 sm:flex-row uppercase">
          <p>© {new Date().getFullYear()} Siankan Studio. All rights reserved.</p>
          <p className="tracking-[0.25em]">Handmade in India</p>
        </div>
      </div>
    </footer>
  );
}
