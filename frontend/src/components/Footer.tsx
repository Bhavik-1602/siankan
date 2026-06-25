"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-neutral-900 border-t border-[#D4AF37]/30 text-stone-300 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-stone-100">
                N & A
              </span>
              <span className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#D4AF37] uppercase -mt-1">
                Art of Design
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              Specializing in pastel-themed ethnic and indo-western fashion. Combining traditional handwork stitches with modern luxury silhouettes.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 bg-stone-800 text-stone-300 hover:bg-[#D4AF37] hover:text-neutral-950 rounded-full transition-all duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="p-2 bg-stone-800 text-stone-300 hover:bg-[#D4AF37] hover:text-neutral-950 rounded-full transition-all duration-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links Col */}
          <div>
            <h4 className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6 font-sans">
              Our Collections
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/collections?category=pastel" className="hover:text-stone-100 transition-colors">Pastel Collection</Link></li>
              <li><Link href="/collections?category=festive" className="hover:text-stone-100 transition-colors">Festive Wear</Link></li>
              <li><Link href="/collections?category=garba" className="hover:text-stone-100 transition-colors">Garba Collection</Link></li>
              <li><Link href="/collections?category=indo-western" className="hover:text-stone-100 transition-colors">Indo-Western Dresses</Link></li>
              <li><Link href="/collections?category=bridesmaid" className="hover:text-stone-100 transition-colors">Bridesmaid Wear</Link></li>
            </ul>
          </div>
          
          {/* Services Col */}
          <div>
            <h4 className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6 font-sans">
              Bespoke Services
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/services" className="hover:text-stone-100 transition-colors">Custom Outfit Design</Link></li>
              <li><Link href="/services" className="hover:text-stone-100 transition-colors">Group Outfit Design</Link></li>
              <li><Link href="/services" className="hover:text-stone-100 transition-colors">Alteration Services</Link></li>
              <li><Link href="/services" className="hover:text-stone-100 transition-colors">Personalized Color Selection</Link></li>
              <li><Link href="/services" className="hover:text-stone-100 transition-colors">Styling Consultation</Link></li>
            </ul>
          </div>
          
          {/* Contact & News Col */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6 font-sans">
                Contact & Newsletter
              </h4>
              <p className="text-sm text-stone-400 mb-4">
                Subscribe to receive seasonal styling consultation invites and preview alerts.
              </p>
              
              {subscribed ? (
                <div className="text-xs border border-[#D4AF37] py-2 px-4 rounded text-[#D4AF37] bg-[#D4AF37]/5">
                  ✓ added to seasonal preview alerts.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex overflow-hidden rounded bg-stone-800 border border-stone-700 focus-within:border-[#D4AF37]">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="bg-transparent px-4 py-2.5 text-sm w-full text-stone-200 outline-none placeholder:text-stone-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-[#D4AF37] text-neutral-950 text-xs font-bold tracking-wider px-4 hover:bg-[#F1D278] transition-colors uppercase">
                    Join
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-2.5 text-sm text-stone-400">
              <div className="flex items-center space-x-2.5">
                <Phone size={14} className="text-[#D4AF37]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail size={14} className="text-[#D4AF37]" />
                <span>couture@naartdesign.com</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Col */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} N & A Art of Design. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
            <a href="#" className="hover:text-stone-300">Bespoke Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
