"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, ArrowRight } from 'lucide-react';

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
    <footer className="bg-neutral-950 border-t border-gold-300/20 text-neutral-400 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-neutral-900">
          
          {/* Brand Col */}
          <div className="space-y-5">
            <div className="flex flex-col">
              <span className="font-editorial text-3xl font-bold tracking-wider text-[#FAF8F5]">
                N & A
              </span>
              <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-gold-300 uppercase -mt-0.5">
                Art of Design
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 max-w-xs">
              Specializing in pastel-themed ethnic and bespoke Indo-Western couture. Bringing Varanasi's traditional heritage to modern luxury silhouettes.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 border border-neutral-800 hover:border-gold-300 text-neutral-400 hover:text-gold-300 rounded-full transition-all duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="p-2 border border-neutral-800 hover:border-gold-300 text-neutral-400 hover:text-gold-300 rounded-full transition-all duration-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links Col */}
          <div>
            <h4 className="text-gold-300 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">
              Our Collections
            </h4>
            <ul className="space-y-3 text-xs">
              <li><Link href="/collections?category=pastel" className="hover:text-gold-100 transition-colors duration-300">Pastel Collection</Link></li>
              <li><Link href="/collections?category=festive" className="hover:text-gold-100 transition-colors duration-300">Festive Wear</Link></li>
              <li><Link href="/collections?category=garba" className="hover:text-gold-100 transition-colors duration-300">Garba Collection</Link></li>
              <li><Link href="/collections?category=indo-western" className="hover:text-gold-100 transition-colors duration-300">Indo-Western Dresses</Link></li>
              <li><Link href="/collections?category=bridesmaid" className="hover:text-gold-100 transition-colors duration-300">Bridesmaid Wear</Link></li>
            </ul>
          </div>
          
          {/* Services Col */}
          <div>
            <h4 className="text-gold-300 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">
              Bespoke Services
            </h4>
            <ul className="space-y-3 text-xs">
              <li><Link href="/services" className="hover:text-gold-100 transition-colors duration-300">Custom Outfit Design</Link></li>
              <li><Link href="/services" className="hover:text-gold-100 transition-colors duration-300">Group Outfit Design</Link></li>
              <li><Link href="/services" className="hover:text-stone-100 transition-colors duration-300">Alteration Services</Link></li>
              <li><Link href="/services" className="hover:text-gold-100 transition-colors duration-300">Color Consultations</Link></li>
              <li><Link href="/services" className="hover:text-gold-100 transition-colors duration-300">Styling Consultation</Link></li>
            </ul>
          </div>
          
          {/* Contact & News Col */}
          <div className="space-y-6">
            <div>
              <h4 className="text-gold-300 text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                Join The Circle
              </h4>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                Subscribe for private invitations to seasonal preview alerts and styling consultation bookings.
              </p>
              
              {subscribed ? (
                <div className="text-[11px] border border-gold-300/40 py-2.5 px-4 rounded-sm text-gold-300 bg-gold-50/5">
                  ✓ added to seasonal preview alerts.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex rounded-sm bg-neutral-900 border border-neutral-800 focus-within:border-gold-300/60 overflow-hidden transition-all duration-300">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="bg-transparent px-3 py-2.5 text-xs w-full text-neutral-200 outline-none placeholder:text-neutral-600 font-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-[#4A0E17] text-white hover:bg-maroon-500 text-[10px] font-bold tracking-wider px-4 transition-colors uppercase flex items-center gap-1 cursor-pointer">
                    Join <ArrowRight size={10} />
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-2 text-xs text-neutral-500">
              <div className="flex items-center space-x-2.5 hover:text-gold-300 transition-colors duration-300 cursor-pointer">
                <Phone size={13} className="text-gold-300" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2.5 hover:text-gold-300 transition-colors duration-300 cursor-pointer">
                <Mail size={13} className="text-gold-300" />
                <span>couture@naartdesign.com</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Col */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-neutral-600 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} N & A Art of Design. Handcrafted in Benares.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Bespoke Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
