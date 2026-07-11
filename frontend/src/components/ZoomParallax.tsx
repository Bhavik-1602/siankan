"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

// Inline dimensions and offsets to position the items in the grid.
// transform: translate(X, Y) relative to the centered parent container.
const positions = [
  { width: "25vw", height: "25vh", top: "0", left: "0" }, // Center image
  { width: "35vw", height: "30vh", top: "-30vh", left: "5vw" }, // Top-Right
  { width: "20vw", height: "45vh", top: "-10vh", left: "-25vw" }, // Top-Left
  { width: "25vw", height: "25vh", top: "0", left: "27.5vw" }, // Middle-Right
  { width: "20vw", height: "25vh", top: "27.5vh", left: "5vw" }, // Bottom-Right
  { width: "30vw", height: "25vh", top: "27.5vh", left: "-22.5vw" }, // Bottom-Left
  { width: "15vw", height: "15vh", top: "22.5vh", left: "25vw" }, // Small Middle-Far Right
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-neutral-950">
        {images.slice(0, 7).map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          const pos = positions[index] || { width: "25vw", height: "25vh", top: "0", left: "0" };

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute inset-0 flex h-full w-full items-center justify-center"
            >
              <div
                className="relative overflow-hidden rounded-sm shadow-2xl border border-white/5 transition-shadow duration-300"
                style={{
                  width: pos.width,
                  height: pos.height,
                  transform: `translate(${pos.left}, ${pos.top})`,
                }}
              >
                <img
                  src={src}
                  alt={alt ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
