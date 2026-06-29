"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Scissors } from 'lucide-react';
import ImageZoom from '@/components/ImageZoom';
import type { Product } from '@/lib/mockData';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load products
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products`);
        if (!res.ok) throw new Error('Failed to load catalog');
        const products: Product[] = await res.json();
        setFeatured(products.filter(p => p.is_featured).slice(0, 3));

        // Load banners
        const bannerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/banners?activeOnly=true`);
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          setBanners(bannerData || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load signature pieces');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeBanner = banners.length > 0 ? banners[0] : {
    title: "Pastel Luxury,",
    subtitle: "Handcrafted Couture",
    image_url: "/images/pastel_saree.png",
    link_url: "/collections"
  };

  return (
    <div className="animate-fade-in-up">
      
      {/* Hero Section - Split Screen Editorial style */}
      <section className="relative bg-neutral-950 text-neutral-100 min-h-[85vh] flex items-center overflow-hidden border-b border-gold-300/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon-700/10 via-transparent to-transparent z-10" />
        
        {/* Background Image Panel */}
        <div className="absolute right-0 top-0 h-full w-full lg:w-[50%] z-0 select-none">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 lg:via-neutral-950/20 to-transparent z-10" />
          <img 
            src={activeBanner.image_url} 
            alt={activeBanner.title} 
            className="h-full w-full object-cover object-center animate-[zoomIn_1.5s_ease-out_forwards]"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-20 py-24">
          <div className="max-w-xl space-y-8">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gold-300 uppercase block">
              N & A Art of Design
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6.5xl font-light tracking-wide text-[#FAF8F5] leading-[1.1] animate-fade-in-up">
              {activeBanner.title} <br/>
              <span className="text-maroon-200 font-normal italic">{activeBanner.subtitle}</span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-md">
              Discover our exclusive collections of pastel Banarasi sarees, custom-tailored designer cholis, festive wear, and bespoke bridesmaid lehengas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href={activeBanner.link_url || "/collections"} 
                className="bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-4 px-8 transition-all text-center rounded-sm border border-[#4A0E17] hover:border-maroon-500 shadow-lg cursor-pointer"
              >
                View Collections
              </Link>
              <Link 
                href="/services" 
                className="bg-transparent border border-neutral-700 hover:border-gold-300 text-[#FAF8F5] hover:text-gold-300 text-[10px] font-bold tracking-[0.2em] uppercase py-4 px-8 transition-all text-center rounded-sm backdrop-blur-[2px] cursor-pointer"
              >
                Bespoke Consultations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center max-w-xl mx-auto mb-20 space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-gold-300 uppercase block">
            Curated Lines
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-neutral-800 font-light">
            The Design Spotlights
          </h2>
          <div className="w-10 h-[1.5px] bg-gold-300 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Pastel Saree */}
          <div className="relative h-[500px] rounded-sm overflow-hidden group shadow-lg border border-neutral-200/20">
            <img src="/images/pastel_saree.png" alt="Pastel Collection" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent flex flex-col justify-end p-8 z-20" />
            <div className="absolute bottom-8 left-8 z-30 space-y-3">
              <h3 className="font-editorial text-2xl text-[#FAF8F5] font-light">Pastel Collection</h3>
              <Link href="/collections?category=pastel" className="text-gold-300 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:text-white transition-colors">
                Browse Silks <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 2: Festive Choli */}
          <div className="relative h-[500px] rounded-sm overflow-hidden group shadow-lg border border-neutral-200/20">
            <img src="/images/festive_choli.png" alt="Festive Wear" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent flex flex-col justify-end p-8 z-20" />
            <div className="absolute bottom-8 left-8 z-30 space-y-3">
              <h3 className="font-editorial text-2xl text-[#FAF8F5] font-light">Festive Wear</h3>
              <Link href="/collections?category=festive" className="text-gold-300 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:text-white transition-colors">
                Explore Blouses <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 3: Garba/Indowestern */}
          <div className="relative h-[500px] rounded-sm overflow-hidden group shadow-lg border border-neutral-200/20">
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" alt="Garba Collection" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent flex flex-col justify-end p-8 z-20" />
            <div className="absolute bottom-8 left-8 z-30 space-y-3">
              <h3 className="font-editorial text-2xl text-[#FAF8F5] font-light">Garba Collection</h3>
              <Link href="/collections?category=garba" className="text-gold-300 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:text-white transition-colors">
                View Mirrors <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Artisan Showcase: Magnifier section */}
      <section className="bg-neutral-50 border-y border-neutral-200/40 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Zoom Magnifier Wrapper */}
            <div className="lg:col-span-7 h-[440px] sm:h-[540px]">
              <ImageZoom 
                src="/images/festive_choli.png" 
                zoomSrc="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Intricate zardosi handwork details close-up"
              />
            </div>

            {/* Description Info */}
            <div className="lg:col-span-5 space-y-8">
              <span className="text-[10px] font-bold tracking-[0.25em] text-gold-300 uppercase block">
                Artisanal Stitches
              </span>
              <h2 className="font-editorial text-3.5xl text-neutral-800 font-light leading-tight">
                The Precision of Handwork Embroidery
              </h2>
              <div className="w-10 h-[1.5px] bg-gold-300" />
              
              <p className="text-neutral-500 text-xs leading-relaxed">
                Luxury fashion is defined in millimeters. Our interactive magnifier lens allows you to inspect the stitch alignment, wire loops, and pearl placements executed by our skilled karigars.
              </p>
              
              <p className="text-sm font-editorial italic text-maroon-600 border-l border-gold-300/40 pl-4 py-1">
                "Every pastel thread and gold wire is laid by hand on pure foundations, creating depth that no machine can duplicate."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex items-start space-x-3">
                  <Sparkles className="text-gold-300 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Zardosi & Aari</h4>
                    <p className="text-neutral-400 text-[10px] mt-0.5">Classic metallic thread coils and chain stitch patterns.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Scissors className="text-gold-300 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Bespoke Sizing</h4>
                    <p className="text-neutral-400 text-[10px] mt-0.5">Individual pattern tailoring to match size files.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ShieldCheck className="text-gold-300 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Insured Shipping</h4>
                    <p className="text-neutral-400 text-[10px] mt-0.5">Complimentary secure delivery for signature wear.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="text-gold-300 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Heritage Legacy</h4>
                    <p className="text-neutral-400 text-[10px] mt-0.5">Supporting artisan weaving units in Varanasi.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center max-w-xl mx-auto mb-20 space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-gold-300 uppercase block">
            Signature Pieces
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-neutral-800 font-light">
            Curated Highlights
          </h2>
          <div className="w-10 h-[1.5px] bg-gold-300 mx-auto mt-4" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/50 text-red-700 text-xs px-4 py-3 rounded-sm mb-8 text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-neutral-100 rounded-sm h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.length > 0 ? (
                featured.map(product => (
                  <div key={product.id} className="bg-white rounded-sm border border-neutral-200/40 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col group">
                    
                    {/* Image Banner */}
                    <div className="relative pt-[125%] overflow-hidden bg-neutral-50 select-none">
                      {product.is_featured && (
                        <span className="absolute top-4 left-4 z-10 bg-[#4A0E17] text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm border border-gold-300/30 shadow-sm">
                          Signature
                        </span>
                      )}
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                      />
                    </div>

                    {/* Info panel */}
                    <div className="p-6 flex flex-col flex-grow space-y-3.5">
                      <span className="text-gold-400 text-[9px] font-bold uppercase tracking-wider block">
                        {product.category} • {product.fabric}
                      </span>
                      <h3 className="font-editorial text-lg text-neutral-800 hover:text-maroon-600 transition-colors leading-snug">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                        <span className="font-sans font-bold text-neutral-800 text-xs tracking-wider">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <Link 
                          href={`/product/${product.id}`}
                          className="text-[#4A0E17] hover:text-maroon-500 text-[9px] font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 transition-colors"
                        >
                          View Details <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-neutral-400 py-12 text-xs">
                  No signature products available at this time
                </div>
              )}
            </div>
          </>
        )}

        <div className="text-center pt-20">
          <Link 
            href="/collections" 
            className="inline-flex bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-[0.25em] uppercase py-4 px-10 transition-all rounded-sm shadow-lg cursor-pointer"
          >
            Explore Full Catalogue <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </section>

    </div>
  );
}
