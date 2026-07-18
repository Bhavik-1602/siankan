"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Slide = {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  btn1Text: string;
  btn1Link: string;
  btn2Text: string;
  btn2Link: string;
  kenBurns: {
    initial: { scale: number; x: string; y: string };
    animate: { scale: number; x: string; y: string };
  };
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/group_2.jpg",
    subtitle: "The Utsav Collection · Summer '26",
    title: "Hand-dyed heirlooms, made to move.",
    btn1Text: "Shop the Collection",
    btn1Link: "/collections",
    btn2Text: "Our Story",
    btn2Link: "/about",
    kenBurns: {
      initial: { scale: 1.0, x: "0%", y: "1.5%" },
      animate: { scale: 1.12, x: "0%", y: "-1.5%" }
    }
  },
];

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const slide = slides[0];

  // GSAP Bounded Scroll Parallax
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    const container = parallaxRef.current;
    if (!container) return;

    const bgImages = container.querySelectorAll("[data-parallax-image]");
    const textLayer = container.querySelector("[data-parallax-text]");

    let tl: gsap.core.Timeline | undefined;

    if (bgImages.length > 0 || textLayer) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Smooth out parallax scroll stutter
        },
      });

      // Animate background image relative position within safe overflow bounds (scale is 1.15)
      bgImages.forEach((img) => {
        tl!.fromTo(
          img,
          { yPercent: -5 },
          { yPercent: 5, ease: "none" },
          0
        );
      });

      // Lift text layer upwards relative to viewport scroll to give a layered depth effect
      if (textLayer) {
        tl!.to(
          textLayer,
          { yPercent: -8, ease: "none" },
          0
        );
      }
    }

    return () => {
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, []);

  return (
    <section 
      ref={parallaxRef} 
      className="relative h-[100dvh] min-h-[680px] w-full overflow-hidden bg-neutral-950 text-white"
    >
      {/* Background Image with slow, looping Ken Burns zoom/pan and initial fade-in */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, ...slide.kenBurns.initial }}
          animate={{ opacity: 1, ...slide.kenBurns.animate }}
          transition={{
            opacity: { duration: 1.8, ease: "easeOut" },
            scale: { duration: 24, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
            x: { duration: 24, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
            y: { duration: 24, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
          }}
          className="relative h-full w-full overflow-hidden"
        >
          <img
            data-parallax-image
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
            style={{ height: "110%", top: "-5%" }} // 10% overflow for parallax
          />
        </motion.div>

        {/* Premium Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/20" />
        {/* Soft top gradient to ensure navbar links remain visible and legible over any background */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-neutral-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-neutral-950/10" />
      </div>

      {/* Foreground Content */}
      <div 
        data-parallax-text
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:px-12 md:pb-24"
      >
        <div className="max-w-4xl min-h-[300px] flex flex-col justify-end">
          <div className="space-y-6">
            {/* Subtitle */}
            <div className="overflow-hidden">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#FAF8F5]/90"
              >
                <span className="h-px w-6 bg-white/40" />
                {slide.subtitle}
              </motion.p>
            </div>

            {/* Title with Staggered Mask Reveal */}
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-wide text-[#FAF8F5]">
              {slide.title.split(" ").map((word, i) => (
                <span key={i} className="relative inline-block overflow-hidden mr-3 pb-1 sm:mr-4">
                  <motion.span
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.05,
                      duration: 1.1,
                      ease: [0.215, 0.61, 0.355, 1.0] // perfect cubic bezier for text reveal
                    }}
                    className="inline-block"
                  >
                    {word
                  }</motion.span>
                </span>
              ))}
            </h1>

            {/* Action Buttons with Sweep Hover Fill Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href={slide.btn1Link}
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-white border border-white px-8 py-4.5 text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-950 transition-colors duration-500 rounded-sm shadow-xl"
              >
                <span className="absolute inset-0 bg-neutral-950 scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100 z-0" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                  {slide.btn1Text}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
              <Link
                href={slide.btn2Link}
                className="group relative overflow-hidden inline-flex items-center gap-3 border border-white/60 bg-black/10 backdrop-blur-sm px-8 py-4.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white transition-colors duration-500 rounded-sm"
              >
                <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100 z-0" />
                <span className="relative z-10 group-hover:text-neutral-950 transition-colors duration-500">
                  {slide.btn2Text}
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Elegant Vertical Scroll Indicator with Fade-in */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 cursor-pointer z-20"
      >
        <span className="text-[8px] uppercase tracking-[0.35em] text-[#FAF8F5]/50">Scroll</span>
        <div className="w-[1px] h-12 bg-[#FAF8F5]/10 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
