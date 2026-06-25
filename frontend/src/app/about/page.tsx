"use client";

import React from 'react';
import Link from 'next/link';
import { Compass, Users, Sparkles, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          N&A Art of Design
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#4A0E17] font-bold">
          Our Brand Story
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
        <p className="text-neutral-500 text-sm leading-relaxed">
          Discover our philosophy, craft roots, and dedication to pastel elegance in ethnic and indo-western fashion.
        </p>
      </section>

      {/* Grid Story details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-800 font-bold">
            The Philosophy of Pastel Elegance
          </h2>
          <div className="w-8 h-[1.5px] bg-[#D4AF37]" />
          
          <p className="text-neutral-500 text-sm leading-relaxed">
            At N&A Art of Design, we believe that premium ethnic wear should feel light, elegant, and deeply personal. We specialize in custom-tailored, pastel-themed outfits that diverge from heavy, garish colors to present a soft, luxurious palette.
          </p>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Our designs combine raw silk foundations, georgettes, and translucent organzas with traditional handwork techniques like zardosi, aari beads, and real glass mirrors. Every motif is conceptualized by our lead designers and sewn by karigars.
          </p>
          <div className="pt-4">
            <Link href="/collections" className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-3.5 px-7 hover:bg-[#721C28] transition-colors rounded-sm inline-block shadow-sm">
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Brand Image showcase */}
        <div className="relative h-[400px] rounded-lg overflow-hidden border border-neutral-200/50 shadow-md">
          <img 
            src="/images/pastel_saree.png" 
            alt="Artisans weaving silk threads" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#4A0E17]/10" />
        </div>
      </div>

      {/* Objectives / Pillars */}
      <section className="bg-stone-50 border border-stone-200/40 rounded-lg p-8 sm:p-12 mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.15em] text-[#D4AF37] uppercase">Boutique Core</span>
          <h3 className="font-serif text-2xl text-neutral-800 font-bold mt-1">Our Core Pillars</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 bg-[#E8C5C8]/25 rounded-full flex items-center justify-center text-[#4A0E17] mx-auto border border-[#E8C5C8]/40">
              <Compass size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-neutral-800">Modern Ethnic Vision</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Updating traditional silhouettes with clean lines, pre-draped options, and contemporary structures.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 bg-[#E8C5C8]/25 rounded-full flex items-center justify-center text-[#4A0E17] mx-auto border border-[#E8C5C8]/40">
              <Sparkles size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-neutral-800">Premium Craftsmanship</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Refusing prints and machine-copy work. We are dedicated strictly to genuine hand looms and hand-stitch embroidery.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 bg-[#E8C5C8]/25 rounded-full flex items-center justify-center text-[#4A0E17] mx-auto border border-[#E8C5C8]/40">
              <Users size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-neutral-800">Personalized Experiences</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Every client has a custom coordinate file. We consult on fabric weight, neckline cut, and custom sleeve layouts.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
