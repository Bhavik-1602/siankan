"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register ScrollTrigger to sync with Lenis
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger updates with Lenis scrolling
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Run Lenis RAF loop inside GSAP ticker using performance.now() to ensure absolute smooth time tracking
    const updateScroll = () => {
      lenis.raf(performance.now());
    };

    gsap.ticker.add(updateScroll);
    gsap.ticker.lagSmoothing(0);

    // Trigger ScrollTrigger refresh once Lenis is initialized
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route/pathname changes to reset scroll position and recalculate page heights
  useEffect(() => {
    if (lenisRef.current) {
      // Instantly scroll to the top of the new page
      lenisRef.current.scrollTo(0, { immediate: true });

      // Small timeout to allow the DOM to render the new page content before resizing Lenis
      const timer = setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.resize();
        }
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
