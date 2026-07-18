"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

const positions = [
  { width: "25vw", height: "25vh", top: "0", left: "0" },
  { width: "35vw", height: "30vh", top: "-30vh", left: "5vw" },
  { width: "20vw", height: "45vh", top: "-10vh", left: "-25vw" },
  { width: "25vw", height: "25vh", top: "0", left: "27.5vw" },
  { width: "20vw", height: "25vh", top: "27.5vh", left: "5vw" },
  { width: "30vw", height: "25vh", top: "27.5vh", left: "-22.5vw" },
  { width: "15vw", height: "15vh", top: "22.5vh", left: "25vw" },
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  /*
   * Complete the zoom slightly before the section ends.
   * The last part holds the final image instead of showing empty black space.
   */
  const scale4 = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 4.5, 4.5]
  );

  const scale5 = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 5, 5]
  );

  const scale6 = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 6, 6]
  );

  const scale8 = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 8, 8]
  );

  const scale9 = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 9, 9]
  );

  const scales = [
    scale4,
    scale5,
    scale6,
    scale5,
    scale6,
    scale8,
    scale9,
  ];

  return (
    /*
     * Changed from 300vh to 220vh.
     * This removes the excessive scroll area.
     */
    <div   
      ref={container}
      className="relative h-[160vh] bg-neutral-950"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-neutral-950">
        {images.slice(0, 7).map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          const pos = positions[index] ?? {
            width: "25vw",
            height: "25vh",
            top: "0",
            left: "0",
          };

          return (
            <motion.div
              key={`${src}-${index}`}
              style={{ scale }}
              className="absolute inset-0 flex h-full w-full items-center justify-center"
            >
              <div
                className="relative overflow-hidden rounded-sm border border-white/5 shadow-2xl"
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
                  draggable={false}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );   
}