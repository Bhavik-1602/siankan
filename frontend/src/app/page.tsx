"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Compass, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ZoomParallax } from "@/components/ZoomParallax";
import { Product } from "@/lib/mockData";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const interactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrollingByUser, setIsScrollingByUser] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const resetInactivityTimer = () => {
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    interactTimeoutRef.current = setTimeout(() => {
      setIsScrollingByUser(false);
    }, 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setIsDragging(false);
    setIsScrollingByUser(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeftStart(carouselRef.current?.scrollLeft || 0);
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
    }
    e.preventDefault();
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      resetInactivityTimer();
    }
  };

  const handleWheel = () => {
    setIsScrollingByUser(true);
    resetInactivityTimer();
  };

  const handleTouchStart = () => {
    setIsScrollingByUser(true);
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    resetInactivityTimer();
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || products.length === 0) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.04;

    const scroll = (time: number) => {
      const delta = time - lastTime;
      
      if (!isHovered && !isScrollingByUser && !isMouseDown) {
        el.scrollLeft += speed * delta;
      }

      // Infinite loop wrap-around logic
      const maxScroll = el.scrollWidth / 3;
      if (el.scrollLeft >= maxScroll * 2) {
        el.scrollLeft -= maxScroll;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += maxScroll;
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [products, isHovered, isScrollingByUser, isMouseDown]);

  useEffect(() => {
    return () => {
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featured = products.filter((p) => p.is_featured);
  const storyImage = "/images/blue_dress_model.jpg";

  // Collection categories definition for the new Featured Collections section
  const collections = [
    {
      id: "bridal",
      title: "Bridal Heritage",
      subtitle: "The bridal trousseau collection",
      description: "Intricately handwoven raw silks layered with heavy zardosi wiring and traditional floral motifs.",
      image: "/images/minjal.jpg",
      link: "/collections?category=lehenga"
    },
    {
      id: "pastel",
      title: "Pastel Alchemy",
      subtitle: "Soft shades for spring drop",
      description: "Whispering mint organzas, lavender georgettes, and blush pink silks woven for contemporary ease.",
      image: "/images/pastel_saree.png",
      link: "/collections?category=pastel"
    },
    {
      id: "utsav",
      title: "Utsav Festive",
      subtitle: "Stitched for celebration",
      description: "Real glass mirror chaniya cholis and heavy silk sweetheart blouses made in small boutique batches.",
      image: "/images/group_2.jpg",
      link: "/collections?category=festive"
    }
  ];

  return (
    <div className="overflow-hidden bg-[#FAF8F5] animate-page-fade-in">
      {/* Hero Section */}
      <HeroSection />

      {/* Info Announcement Bar */}
      <section className="border-y border-[#f5e6d3]/30 bg-[#FAF8F5] relative z-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-16 gap-y-4 px-6 py-6 text-[9px] font-bold uppercase tracking-[0.3em] text-[#171717]/60">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-brand-terracotta" strokeWidth={1.5} />
            <span>Complimentary shipping over ₹5,000</span>
          </div>
          <span className="hidden md:block h-4 w-px bg-stone-300/40" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-terracotta" strokeWidth={1.5} />
            <span>Made-to-order in 10–14 days</span>
          </div>
          <span className="hidden md:block h-4 w-px bg-stone-300/40" />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-brand-terracotta" strokeWidth={1.5} />
            <span>Easy 7-day exchange policy</span>
          </div>
        </div>
      </section>

      {/* ── Featured Collections (Editorial Grid Section) ── */}
      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-8">
        <div className="mb-16 text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-terracotta block">
            Curated Lines
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-stone-850 tracking-wide">
            Featured Collections
          </h2>
          <div className="w-12 h-[1.5px] bg-brand-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease }}
              className="group flex flex-col bg-white border border-[#f5e6d3]/30 rounded-xs overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-500"
            >
              {/* Image box */}
              <div className="relative aspect-[4/5] w-full overflow-hidden select-none bg-stone-50 border-b border-[#f5e6d3]/10">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#171717]/10 group-hover:bg-[#171717]/20 transition-colors duration-500" />
              </div>

              {/* Text info */}
              <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-terracotta block">
                    {col.subtitle}
                  </span>
                  <h3 className="font-editorial text-2xl font-light text-stone-850">
                    {col.title}
                  </h3>
                  <p className="text-xs font-light text-stone-500 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4">
                  <Link 
                    href={col.link}
                    className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-brand-black hover:text-brand-terracotta transition-colors"
                  >
                    <span className="border-b border-[#171717] group-hover:border-brand-terracotta pb-1 transition-colors">
                      Explore Collection
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Silhouette Headline */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-12 flex items-end justify-between border-b border-stone-250/20 pb-6"
        >
          <div>
            <motion.p variants={fadeUp} className="mb-2 text-[9px] font-bold uppercase tracking-[0.28em] text-brand-terracotta">
              Atelier Silhouettes
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-editorial text-4xl sm:text-5xl font-light text-stone-850 tracking-wide">
              Cut for celebration
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link 
              href="/collections" 
              className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#171717]/50 hover:text-brand-terracotta transition-colors flex items-center gap-2 border-b border-stone-300 hover:border-brand-terracotta pb-1"
            >
              View Catalogue <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Product Sliding Carousel */}
      <section className="relative overflow-hidden pb-32">
        {products.length > 0 && (
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto no-scrollbar px-6 sm:px-8 select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: isMouseDown ? "grabbing" : "grab",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              handleMouseUpOrLeave();
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {[...products, ...products, ...products].map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className="w-[280px] shrink-0 block pointer-events-auto"
                draggable={false}
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault();
                  }
                }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Parallax Scroll Reveal Section */}
      <section className="relative bg-[#171717] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-28 pb-12 text-center space-y-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold block">
            Inside The Atelier
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light tracking-wide text-brand-ivory">
            New this season
          </h2>
          <p className="mx-auto max-w-xl text-[10px] font-medium leading-relaxed text-stone-400 uppercase tracking-widest">
            Scroll to reveal — each piece is hand-dyed, mirror-worked and finished in our Gujarat studio in tiny batches.
          </p>
          <div className="w-10 h-[1px] bg-brand-gold/30 mx-auto pt-2" />
        </div>
        
        <ZoomParallax
          images={
            products.length > 0
              ? (featured.length > 0 ? featured : products)
                  .slice(0, 7)
                  .map((p) => ({ src: p.image_url, alt: p.name }))
              : [
                  { src: "/images/hero_image.jpg", alt: "Sainkai Festive Wear" },
                  { src: "/images/blue_dress_model.jpg", alt: "Sainkai Signature Dress" },
                  { src: "/images/group_2.jpg", alt: "Sainkai Utsav Collection" },
                  { src: "/images/group_1.jpg", alt: "Sainkai Group Collection" },
                  { src: "/images/kiran.jpg", alt: "Sainkai Silk Saree" },
                  { src: "/images/nisha.jpg", alt: "Sainkai Lehenga" },
                  { src: "/images/minjal.jpg", alt: "Sainkai Bridal Wear" },
                ]
          }
        />
      </section>

      {/* Craft Story Section */}
      <section className="relative isolate mx-auto max-w-7xl px-6 py-36 bg-[#FAF8F5] sm:px-8">
        <div className="grid items-center gap-16 md:grid-cols-2">
          
          {/* Story Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.0, ease }}
            className="relative overflow-hidden rounded-xs border border-[#f5e6d3]/40 shadow-luxury"
          >
            <motion.img
              src={storyImage}
              alt="Sainkai Studio Work"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1.2, ease }}
              className="aspect-[4/5] w-full object-cover"
            />
            
            {/* Spinning Brand Badge */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 45, ease: "linear", repeat: Infinity }}
              className="absolute -bottom-8 -right-8 hidden h-32 w-32 rounded-full bg-[#FAF8F5] p-5 shadow-luxury md:flex items-center justify-center border border-[#f5e6d3]/20"
            >
              <img 
                src="/logo.jpeg" 
                alt="" 
                className="h-16 w-16 object-contain rounded-xs brightness-95" 
              />
            </motion.div>
          </motion.div>

          {/* Story Right Text details */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 md:pl-6"
          >
            <motion.p variants={fadeUp} className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-terracotta">
              Craft First. Always.
            </motion.p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-stone-850 tracking-wide leading-tight">
              Sainkai Heritage
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold" />
            
            <motion.p variants={fadeUp} className="text-xs sm:text-sm leading-relaxed text-stone-500 font-light space-y-4">
              Sainkai began as a conversation between sisters and a single bolt of naturally-dyed silk. Today, we work with a small circle of veteran karigars across Gujarat—dyers, handloom weavers, and mirror-work embroiderers—to craft garments that carry the weight of heirlooms the moment you wear them.
            </motion.p>
            
            <motion.p variants={fadeUp} className="text-xs sm:text-sm leading-relaxed text-stone-500 font-light">
              No mass production. No shortcuts. Just deliberate hands, slow weaving cycles, and timeless editorial styling.
            </motion.p>
            
            <motion.div variants={fadeUp} className="pt-6">
              <Link 
                href="/about" 
                className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#171717] hover:text-brand-terracotta transition-colors"
              >
                <span className="border-b border-[#171717] group-hover:border-brand-terracotta pb-1 transition-colors">
                  Read Our Story
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
