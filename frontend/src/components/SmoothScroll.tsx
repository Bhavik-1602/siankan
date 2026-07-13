"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isAdminRoute) return;

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

    // ResizeObserver to automatically resize Lenis whenever document height changes (like filtering categories)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    // Keyboard navigation helper to fix ArrowUp / ArrowDown scrolling with Lenis
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      // Skip if editing text fields
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const delta = 100; // Scroll amount in pixels
      if (e.key === "ArrowUp") {
        e.preventDefault();
        lenis.scrollTo(lenis.scroll - delta);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        lenis.scrollTo(lenis.scroll + delta);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        lenis.scrollTo(lenis.scroll - window.innerHeight * 0.8);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        lenis.scrollTo(lenis.scroll + window.innerHeight * 0.8);
      } else if (e.key === "Home") {
        e.preventDefault();
        lenis.scrollTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        lenis.scrollTo("bottom");
      } else if (e.key === " ") {
        e.preventDefault();
        if (e.shiftKey) {
          lenis.scrollTo(lenis.scroll - window.innerHeight * 0.8);
        } else {
          lenis.scrollTo(lenis.scroll + window.innerHeight * 0.8);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      gsap.ticker.remove(updateScroll);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdminRoute]);

  // Handle route/pathname changes to reset scroll position and recalculate page heights
  useEffect(() => {
    if (isAdminRoute) return;
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
  }, [pathname, isAdminRoute]);

  return null;
}
