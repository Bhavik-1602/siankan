"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Scissors, Clock } from 'lucide-react';
import ImageZoom from '../components/ImageZoom';
import type { Product } from '../lib/mockData';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const products: Product[] = await res.json();
        // Get first 3 featured products
        setFeatured(products.filter(p => p.is_featured).slice(0, 3));
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-stone-100 min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-transparent z-10" />
        
        <img 
          src="/images/pastel_saree.png" 
          alt="Premium draped pastel saree" 
          className="absolute right-0 top-0 h-full w-full lg:w-[60%] object-cover object-center animate-in zoom-in-95 duration-1000"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-20 py-20">
          <div className="max-w-xl space-y-6">
            <span className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase block">
              N & A Art of Design
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-white leading-[1.15]">
              Pastel Luxury, <br/>
              <span className="text-[#E8C5C8] font-normal italic">Handcrafted</span> Couture
            </h1>
            <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed">
              Explore our exclusive collections of pastel Banarasi sarees, custom-tailored designer cholis, festive wear, and bespoke bridesmaid lehengas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/collections" 
                className="bg-[#4A0E17] border border-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-4 px-8 hover:bg-[#721C28] hover:border-[#721C28] transition-all text-center rounded-sm shadow-md"
              >
                View Collections
              </Link>
              <Link 
                href="/services" 
                className="bg-transparent border border-white/60 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold tracking-widest uppercase py-4 px-8 transition-all text-center rounded-sm backdrop-blur-[2px]"
              >
                Bespoke Consultations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
            Curated Banners
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 font-bold">
            The Design Spotlights
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Pastel Saree */}
          <div className="relative h-[480px] rounded-lg overflow-hidden group shadow-md border border-stone-200/40">
            <img src="/images/pastel_saree.png" alt="Pastel Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E17]/90 via-[#4A0E17]/30 to-transparent flex flex-col justify-end p-8 z-20" />
            <div className="absolute bottom-8 left-8 z-30 space-y-3">
              <h3 className="font-serif text-2xl text-white font-bold">Pastel Collection</h3>
              <Link href="/collections?category=pastel" className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
                Browse Silks <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Festive Choli */}
          <div className="relative h-[480px] rounded-lg overflow-hidden group shadow-md border border-stone-200/40">
            <img src="/images/festive_choli.png" alt="Festive Wear" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E17]/90 via-[#4A0E17]/30 to-transparent flex flex-col justify-end p-8 z-20" />
            <div className="absolute bottom-8 left-8 z-30 space-y-3">
              <h3 className="font-serif text-2xl text-white font-bold">Festive Wear</h3>
              <Link href="/collections?category=festive" className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
                Explore Blouses <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: Garba/Indowestern */}
          <div className="relative h-[480px] rounded-lg overflow-hidden group shadow-md border border-stone-200/40">
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" alt="Garba Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E17]/90 via-[#4A0E17]/30 to-transparent flex flex-col justify-end p-8 z-20" />
            <div className="absolute bottom-8 left-8 z-30 space-y-3">
              <h3 className="font-serif text-2xl text-white font-bold">Garba Collection</h3>
              <Link href="/collections?category=garba" className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
                View Mirrors <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Artisan Showcase: Image Zoom */}
      <section className="bg-stone-50 border-y border-stone-200/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Zoom Magnifier Wrapper */}
            <div className="lg:col-span-7 h-[420px] sm:h-[520px]">
              <ImageZoom 
                src="/images/festive_choli.png" 
                zoomSrc="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Intricate zardosi handwork details close-up"
              />
            </div>

            {/* Description Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase block">
                Artisanal Stitches
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 font-bold leading-tight">
                The Precision of Handwork Embroidery
              </h2>
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              
              <p className="text-neutral-500 text-sm leading-relaxed">
                Luxury fashion is defined in millimeters. Our interactive magnifier lens allows you to inspect the stitch alignment, wire loops, and pearl placements executed by our skilled karigars.
              </p>
              
              <p className="text-sm font-serif italic text-[#4A0E17]">
                "Every pastel thread and gold wire is laid by hand on pure foundations, creating depth that no machine can duplicate."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Zardosi & Aari</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Classic metallic thread coils and chain stitch patterns.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Scissors className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Bespoke Sizing</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Individual pattern tailoring to match size files.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ShieldCheck className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Insured Shipping</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Complimentary secure delivery for signature wear.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Heritage Legacy</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Supporting artisan weaving units in Varanasi.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
            Signature Pieces
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 font-bold">
            Curated Highlights
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-stone-100 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.length > 0 ? (
                featured.map(product => (
                  <div key={product.id} className="bg-white rounded-lg border border-neutral-200/50 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    {/* Image Banner */}
                    <div className="relative pt-[125%] overflow-hidden bg-stone-100">
                      {product.is_featured && (
                        <span className="absolute top-4 left-4 z-10 bg-[#4A0E17] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border border-[#D4AF37]/40 shadow-sm">
                          Signature
                        </span>
                      )}
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    {/* Info panel */}
                    <div className="p-6 flex flex-col flex-grow space-y-3">
                      <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest block">
                        {product.category} • {product.fabric}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-neutral-800 hover:text-[#4A0E17] transition-colors leading-snug">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                        <span className="font-sans font-bold text-neutral-800 text-sm">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <Link 
                          href={`/product/${product.id}`}
                          className="text-[#4A0E17] hover:text-[#721C28] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"
                        >
                          View Details <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  No featured products available
                </div>
              )}
            </div>
          </>
        )}

        <div className="text-center pt-16">
          <Link 
            href="/collections" 
            className="inline-flex bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-4 px-10 hover:bg-[#721C28] transition-all rounded-sm shadow-md"
          >
            Explore Full Boutique Catalog <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>

    </div>
  );
}
