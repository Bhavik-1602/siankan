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
    { id: 'handwork', label: 'Handwork Stitches', icon: Sparkles },
    { id: 'showcase', label: 'Client Showcase', icon: UserCheck }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          Artistry Catalogue
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#4A0E17]">
          Design & Craft Gallery
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
        <p className="text-neutral-500 text-sm leading-relaxed">
          Scroll through our high-end fashion shoots, close-up dabka handwork swatches, and client draped presentations.
        </p>
      </section>

      {/* Filter tab buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filters.map(filt => {
          const IconComponent = filt.icon;
          const isActive = activeFilter === filt.id;
          return (
            <button
              key={filt.id}
              onClick={() => setActiveFilter(filt.id as any)}
              className={`flex items-center gap-2 text-xs font-semibold tracking-widest uppercase py-2.5 px-5 rounded-full border transition-all ${
                isActive 
                  ? 'bg-[#4A0E17] text-white border-[#4A0E17] shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-[#4A0E17] hover:text-[#4A0E17]'
              }`}
            >
              <IconComponent size={14} />
              <span>{filt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="group bg-white rounded-lg border border-neutral-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative pt-[100%] overflow-hidden bg-stone-100">
              <img 
                src={item.src} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#4A0E17]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-5 space-y-1">
              <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest block">
                {item.categoryLabel}
              </span>
              <h3 className="font-serif text-sm font-semibold text-neutral-800 line-clamp-1">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
