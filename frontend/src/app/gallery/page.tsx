"use client";

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, UserCheck } from 'lucide-react';

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: 'photoshoot' | 'handwork' | 'showcase';
  categoryLabel: string;
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photoshoot' | 'handwork' | 'showcase'>('all');

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      src: "/images/pastel_saree.png",
      title: "Sage & Blush Weaving Portrait",
      category: "photoshoot",
      categoryLabel: "Fashion Photoshoot"
    },
    {
      id: 2,
      src: "/images/festive_choli.png",
      title: "Lilac Choli Sweetheart Embroidery Details",
      category: "handwork",
      categoryLabel: "Handwork Detail"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      title: "Antique Gold Zardosi Stitches macro view",
      category: "handwork",
      categoryLabel: "Handwork Detail"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      title: "Bridal Lehenga Panel Drape Showcase",
      category: "photoshoot",
      categoryLabel: "Fashion Photoshoot"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      title: "Pastel Gown alignment layout showcase",
      category: "showcase",
      categoryLabel: "Customer Showcase"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      title: "Bridesmaid champagne golden group photo",
      category: "showcase",
      categoryLabel: "Customer Showcase"
    }
  ];

  const filtered = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const filters = [
    { id: 'all', label: 'All Media', icon: ImageIcon },
    { id: 'photoshoot', label: 'Photoshoots', icon: Camera },
    { id: 'handwork', label: 'Handwork', icon: Sparkles },
    { id: 'showcase', label: 'Client Showcase', icon: UserCheck }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase block">
          Artistry Catalogue
        </span>
        <h1 className="font-editorial text-4xl font-light text-neutral-850">
          Design & Craft Gallery
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
          Scroll through our high-end fashion shoots, close-up dabka handwork swatches, and client draped presentations.
        </p>
      </section>

      {/* Filter tab buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 select-none">
        {filters.map(filt => {
          const IconComponent = filt.icon;
          const isActive = activeFilter === filt.id;
          return (
            <button
              key={filt.id}
              onClick={() => setActiveFilter(filt.id as any)}
              className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase py-2.5 px-5 rounded-full border transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'bg-[#4A0E17] text-white border-[#4A0E17] shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-maroon-600 hover:text-maroon-600'
              }`}
            >
              <IconComponent size={12} />
              <span>{filt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="group bg-white rounded-sm border border-neutral-200/40 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="relative pt-[100%] overflow-hidden bg-neutral-50 select-none">
              <img 
                src={item.src} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#4A0E17]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="p-6 space-y-1.5 flex-grow flex flex-col justify-center border-t border-neutral-100">
              <span className="text-gold-400 text-[9px] font-bold uppercase tracking-wider block">
                {item.categoryLabel}
              </span>
              <h3 className="font-editorial text-base text-neutral-800 line-clamp-1 leading-snug">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
