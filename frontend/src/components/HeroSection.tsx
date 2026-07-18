"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Ruler, Award, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll hooks
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 600], [0, -60]);
  const yPlatform = useTransform(scrollY, [0, 600], [0, 40]);
  const yGarment1 = useTransform(scrollY, [0, 600], [0, -30]);
  const yGarment2 = useTransform(scrollY, [0, 600], [0, -80]);
  const yStatPanel = useTransform(scrollY, [0, 600], [0, -50]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100vh] lg:h-[105vh] w-full overflow-hidden bg-[#131313] text-white pt-24 pb-16 flex items-center"
    >
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-terracotta/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-brand-gold/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[#131313]/40" />
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side: Luxury Headline & CTAs */}
        <motion.div 
          style={{ y: yText }}
          className="lg:col-span-6 space-y-8 text-left mt-8 lg:mt-0"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold/20 bg-brand-gold/5 text-brand-gold text-[9px] font-bold uppercase tracking-[0.3em]"
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>The Utsav Couture Drop</span>
            </motion.div>
            
            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-wide text-brand-ivory">
              Hand-dyed <br />
              <span className="italic text-brand-gold">heirlooms</span>, <br />
              made to move.
            </h1>
            
            <p className="text-stone-400 text-xs sm:text-sm font-light max-w-lg leading-relaxed tracking-wide">
              Designed in Surat ateliers, Sainkai garments weave traditional mirror embroidery with contemporary drapes. Handloomed in small batches for celebrations.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/collections"
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-brand-terracotta border border-brand-terracotta px-8 py-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white transition-colors duration-500 rounded-sm shadow-glow"
            >
              <span className="absolute inset-0 bg-[#721C28] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 z-0" />
              <span className="relative z-10 flex items-center gap-3">
                Shop the Collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Link>
            
            <Link
              href="/about"
              className="group relative overflow-hidden inline-flex items-center gap-3 border border-stone-700 bg-stone-900/40 backdrop-blur-sm px-8 py-4 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-300 transition-colors duration-500 rounded-sm"
            >
              <span className="absolute inset-0 bg-stone-850 scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 z-0" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Our Story
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Right Side: 3D Miniature Diorama Stage */}
        <div className="lg:col-span-6 flex justify-center items-center h-[500px] sm:h-[580px] w-full relative">
          
          {/* Main 3D Container with Perspective */}
          <div className="w-full h-full relative flex items-center justify-center select-none" style={{ perspective: "1500px" }}>
            
            {/* Dark Matte Platform Base (Atelier Stage) */}
            <motion.div 
              style={{ y: yPlatform }}
              initial={{ opacity: 0, rotateX: 65, rotateZ: -18, scale: 0.8 }}
              animate={{ opacity: 1, rotateX: 60, rotateZ: -12, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] bg-gradient-to-tr from-[#111111] via-[#1a1a1a] to-[#222222] border-[1.5px] border-brand-gold/30 rounded-[10%] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),_0_0_80px_-10px_rgba(150,60,45,0.25)] flex items-center justify-center transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Gold Accent Circular Stage Inset */}
              <div 
                className="w-[85%] h-[85%] rounded-full border border-dashed border-brand-gold/15 flex items-center justify-center"
                style={{ transform: "translateZ(1px)" }}
              >
                <div className="w-[60%] h-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_60%)] border border-brand-gold/5" />
              </div>
            </motion.div>

            {/* Layered Garment/Model Cutout 1 (Background Layer) */}
            <motion.div
              style={{ y: yGarment1 }}
              initial={{ opacity: 0, z: -50, y: 120 }}
              animate={{ opacity: 1, z: 40, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="absolute left-[8%] sm:left-[15%] bottom-[26%] w-[180px] sm:w-[220px] aspect-[3/4] rounded-sm overflow-hidden border border-brand-gold/15 shadow- luxury transform-gpu group cursor-pointer"
              style={{ 
                transform: "translateZ(80px) rotateY(15deg)",
                transformStyle: "preserve-3d"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img 
                src="/images/kiran.jpg" 
                alt="Sainkai Raw Silk Saree"
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" 
              />
              <div className="absolute bottom-4 left-4 z-20 space-y-1">
                <span className="text-[7px] font-bold tracking-[0.25em] text-brand-gold uppercase">Raw Silk</span>
                <h3 className="font-editorial text-sm text-brand-ivory tracking-wide leading-tight">Banarasi Saree</h3>
              </div>
            </motion.div>

            {/* Layered Garment/Model Cutout 2 (Foreground Layer) */}
            <motion.div
              style={{ y: yGarment2 }}
              initial={{ opacity: 0, z: -20, y: 140 }}
              animate={{ opacity: 1, z: 120, y: -20 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="absolute right-[8%] sm:right-[12%] bottom-[20%] w-[190px] sm:w-[230px] aspect-[3/4] rounded-sm overflow-hidden border border-brand-gold/25 shadow- luxury transform-gpu group cursor-pointer"
              style={{ 
                transform: "translateZ(180px) rotateY(-10deg)",
                transformStyle: "preserve-3d"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img 
                src="/images/disha.jpg" 
                alt="Sainkai Handcrafted Lehenga"
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" 
              />
              <div className="absolute bottom-4 left-4 z-20 space-y-1">
                <span className="text-[7px] font-bold tracking-[0.25em] text-brand-gold uppercase">Bespoke Gota Patti</span>
                <h3 className="font-editorial text-sm text-brand-ivory tracking-wide leading-tight">Utsav Lehenga</h3>
              </div>
            </motion.div>

            {/* Floating Editorial Stat Panel (Foreground Detail Panel) */}
            <motion.div
              style={{ y: yStatPanel }}
              initial={{ opacity: 0, x: 40, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="absolute right-[2%] top-[12%] z-20 p-4 border border-[#f5e6d3]/15 bg-[#171717]/90 backdrop-blur-md rounded-sm w-[150px] sm:w-[170px] space-y-3.5 shadow- luxury"
              style={{ transform: "translateZ(240px)" }}
            >
              <div className="flex items-center gap-2 border-b border-stone-850 pb-2">
                <Award className="h-4 w-4 text-brand-gold" />
                <span className="text-[8px] font-bold tracking-[0.25em] text-brand-ivory uppercase">Craft Specs</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[7px] font-bold text-stone-500 uppercase tracking-widest block">Atelier</span>
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Surat Studio</span>
                </div>
                <div>
                  <span className="text-[7px] font-bold text-stone-500 uppercase tracking-widest block">Handwork Hours</span>
                  <span className="text-[9px] font-bold text-brand-ivory uppercase tracking-wider block">140 Craft Hrs</span>
                </div>
                <div>
                  <span className="text-[7px] font-bold text-stone-500 uppercase tracking-widest block">Batch Size</span>
                  <span className="text-[9px] font-bold text-brand-ivory uppercase tracking-wider block">Limited (1 of 5)</span>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>

      </div>

      {/* Elegant Vertical Scroll Indicator with Fade-in */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 cursor-pointer z-20"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.95, behavior: "smooth" })}
      >
        <span className="text-[8px] uppercase tracking-[0.35em] text-brand-ivory/50">Scroll Atelier</span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold"
          />
        </div>
      </div>
    </section>
  );
}
