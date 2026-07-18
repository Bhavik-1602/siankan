"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ZoomParallax } from "@/components/ZoomParallax";
import { Product } from "@/lib/mockData";
import HeroSection from "@/components/HeroSection";

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
    // Fetch products from backend Express API
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
  
  // Fallbacks in case products list is empty
  const storyImage = "/images/blue_dress_model.jpg";

  return (
    <div className="overflow-hidden bg-[#FAF8F5]">
      {/* Hero Section */}
      <HeroSection />

      {/* Info Bar */}
      <section className="border-y border-neutral-200/50 bg-[#FAF8F5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500">
          {["Complimentary shipping over ₹5,000", "Made-to-order in 10–14 days", "Easy 7-day exchange"].map((t, i, arr) => (
            <span key={t} className="contents">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
              >
                {t}
              </motion.span>
              {i < arr.length - 1 && <span className="hidden h-4 w-px bg-neutral-350 md:block" />}
            </span>
          ))}
        </div>
      </section>

      {/* Silhouette Headline */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <motion.p variants={fadeUp} className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">
              Shop by Silhouette
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-editorial text-4xl sm:text-5xl font-light text-neutral-800 tracking-wide">
              Cut for celebration
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link href="/collections" className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 hover:text-maroon-600 transition-colors md:inline">
              View all →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Product Sliding Carousel */}
      <section className="relative overflow-hidden pb-24">
        {products.length > 0 && (
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto no-scrollbar px-6 select-none"
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
              <Link
                key={`${p.id}-${i}`}
                href={`/product/${p.id}`}
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault();
                  }
                }}
                className="group relative block w-[280px] shrink-0 overflow-hidden bg-neutral-100 md:w-[340px] rounded-sm pointer-events-auto"
                draggable={false}
              >
                <div className="aspect-[3/4] overflow-hidden" draggable={false}>
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent p-6 text-white" draggable={false}>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#FAF8F5]/75">
                      {p.categories?.name || "Siankan Couture"}
                    </p>
                    <h3 className="mt-1 font-editorial text-xl font-light leading-snug tracking-wide text-white">
                      {p.name.split(" ").slice(0, 3).join(" ")}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Shop
                    <span className="inline-block h-px w-6 bg-white transition-all duration-500 group-hover:w-12" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Parallax Scroll Reveal */}
      <section className="relative bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400">The Atelier</p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light tracking-wide">New this season</h2>
          <p className="mx-auto mt-4 max-w-xl text-xs font-light leading-relaxed text-neutral-400 uppercase tracking-widest">
            Scroll to reveal — each piece is hand-dyed, mirror-worked and finished in our Gujarat studio in tiny batches.
          </p>
        </div>
        
        <ZoomParallax
          images={
            products.length > 0
              ? (featured.length > 0 ? featured : products)
                  .slice(0, 7)
                  .map((p) => ({ src: p.image_url, alt: p.name }))
              : [
                  { src: "/images/hero_image.jpg", alt: "Siankan Festive Wear" },
                  { src: "/images/blue_dress_model.jpg", alt: "Siankan Signature Dress" },
                  { src: "/images/group_2.jpg", alt: "Siankan Utsav Collection" },
                  { src: "/images/group_1.jpg", alt: "Siankan Group Collection" },
                  { src: "/images/kiran.jpg", alt: "Siankan Silk Saree" },
                  { src: "/images/nisha.jpg", alt: "Siankan Lehenga" },
                  { src: "/images/minjal.jpg", alt: "Siankan Bridal Wear" },
                ]
          }
        />
      </section>

      {/* Craft story Section */}
      <section className="relative isolate mx-auto max-w-7xl px-6 py-32 bg-[#FAF8F5]">
        <div className="grid items-center gap-16 md:grid-cols-2">
          
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease }}
            className="relative overflow-hidden rounded-sm"
          >
            <motion.img
              src={storyImage}
              alt="Siankan Studio Work"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.4, ease }}
              className="aspect-[4/5] w-full object-cover shadow-2xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
              className="absolute -bottom-8 -right-8 hidden h-32 w-32 rounded-full bg-[#FAF8F5] p-5 shadow-xl md:flex items-center justify-center border border-neutral-100"
            >
              <img 
                src="/logo.jpeg" 
                alt="" 
                className="h-16 w-16 object-contain" 
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <motion.p variants={fadeUp} className="text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">
              Since our first bolt of silk
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-editorial text-4xl sm:text-5xl font-light text-neutral-800 tracking-wide leading-tight">
              Craft, first. Always.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm leading-relaxed text-neutral-500 font-light">
              Siankan began as a conversation between three sisters and a bolt of naturally-dyed cotton silk. Today we work with a small circle of artisans across Gujarat — dyers, mirror-workers, tailors — to make pieces that feel like heirlooms the moment you slip them on.
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm leading-relaxed text-neutral-500 font-light">
              No mass production. No middlemen. Just careful hands and slow, thoughtful design.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-4">
              <Link href="/about" className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-850 hover:text-maroon-600 transition-colors">
                <span className="border-b border-neutral-800 pb-1">Read our story</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
