"use client";

import React from 'react';
import Link from 'next/link';
import { Compass, Users, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Header Banner */}
      <section className="text-center max-w-2xl mx-auto mb-20 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase block">
          SIANKAN Art of Design
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-neutral-850 font-light">
          Our Brand Story
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
          Discover our philosophy, craft roots, and dedication to pastel elegance in ethnic and bespoke couture fashion.
        </p>
      </section>

      {/* Grid Story details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        <div className="space-y-6">
          <h2 className="font-editorial text-2.5xl sm:text-3.5xl text-neutral-800 leading-tight">
            The Philosophy of <br />
            <span className="italic text-maroon-600">Pastel Elegance</span>
          </h2>
          <div className="w-10 h-[1.5px] bg-gold-300" />
          
          <p className="text-neutral-505 text-xs sm:text-sm leading-relaxed">
            At SIANKAN, we believe that premium ethnic wear should feel light, elegant, and deeply personal. We specialize in custom-tailored, pastel-themed outfits that diverge from heavy, garish colors to present a soft, luxurious palette.
          </p>
          <p className="text-neutral-505 text-xs sm:text-sm leading-relaxed">
            Our designs combine raw silk foundations, georgettes, and translucent organzas with traditional handwork techniques like zardosi, aari beads, and real glass mirrors. Every motif is conceptualized by our lead designers and sewn by karigars.
          </p>
          <div className="pt-4">
            <Link href="/collections" className="bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 px-8 transition-colors rounded-sm inline-block shadow-md cursor-pointer">
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Brand Image showcase */}
        <div className="relative h-[440px] rounded-sm overflow-hidden border border-neutral-200/50 shadow-lg select-none">
          <img 
            src="/images/pastel_saree.png" 
            alt="Artisans weaving silk threads" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#4A0E17]/5" />
        </div>
      </div>

      {/* Objectives / Pillars */}
      <section className="bg-neutral-50 border border-neutral-200/40 rounded-sm p-8 sm:p-12 mb-10">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold-400 uppercase block">Boutique Core</span>
          <h3 className="font-editorial text-2.5xl text-neutral-800 font-light">Our Core Pillars</h3>
          <div className="w-8 h-[1.5px] bg-gold-300 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center space-y-4 p-4 bg-white border border-neutral-200/30 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gold-50/20 rounded-full flex items-center justify-center text-maroon-600 mx-auto border border-gold-300/30">
              <Compass size={18} strokeWidth={1.8} />
            </div>
            <h4 className="font-editorial text-lg text-neutral-800">Modern Ethnic Vision</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Updating traditional silhouettes with clean lines, pre-draped options, and contemporary structures.
            </p>
          </div>

          <div className="text-center space-y-4 p-4 bg-white border border-neutral-200/30 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gold-50/20 rounded-full flex items-center justify-center text-maroon-600 mx-auto border border-gold-300/30">
              <Sparkles size={18} strokeWidth={1.8} />
            </div>
            <h4 className="font-editorial text-lg text-neutral-800">Premium Craftsmanship</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Refusing prints and machine-copy work. We are dedicated strictly to genuine hand looms and hand-stitch embroidery.
            </p>
          </div>

          <div className="text-center space-y-4 p-4 bg-white border border-neutral-200/30 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gold-50/20 rounded-full flex items-center justify-center text-maroon-600 mx-auto border border-gold-300/30">
              <Users size={18} strokeWidth={1.8} />
            </div>
            <h4 className="font-editorial text-lg text-neutral-800">Personalized Experiences</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Every client has a custom coordinate file. We consult on fabric weight, neckline cut, and custom sleeve layouts.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
