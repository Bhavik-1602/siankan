"use client";

import React, { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  zoomSrc?: string;
  alt?: string;
}

export default function ImageZoom({ src, zoomSrc, alt = "Garment fabric details" }: ImageZoomProps) {
  const [showLens, setShowLens] = useState(false);
  const [lensStyle, setLensStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Position of cursor relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Bounds check to hide if outside
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setShowLens(false);
      return;
    }
    
    // Position the lens centered on the cursor
    // Background size is scaled (e.g. 2.5x width/height of container)
    const zoomFactor = 2.5;
    const bgWidth = rect.width * zoomFactor;
    const bgHeight = rect.height * zoomFactor;
    
    // Offset background inside 180px lens
    const bgX = (x * zoomFactor) - 90;
    const bgY = (y * zoomFactor) - 90;

    setLensStyle({
      left: `${x}px`,
      top: `${y}px`,
      backgroundImage: `url(${zoomSrc || src})`,
      backgroundSize: `${bgWidth}px ${bgHeight}px`,
      backgroundPosition: `-${bgX}px -${bgY}px`,
      display: 'block'
    });
    
    setShowLens(true);
  };

  const handleMouseLeave = () => {
    setShowLens(false);
  };

  return (
    <div 
      className="relative overflow-hidden cursor-zoom-in rounded-lg border border-neutral-200/60 shadow-md inline-block w-full h-full select-none"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img 
        src={src} 
        alt={alt} 
        className="block w-full h-full object-cover transition-all duration-300"
        style={{ filter: showLens ? 'brightness(0.92)' : 'none' }}
      />
      
      <div 
        className="absolute pointer-events-none w-[180px] h-[180px] rounded-full border-3 border-[#D4AF37] shadow-[0_0_20px_rgba(0,0,0,0.3),inset_0_0_12px_rgba(0,0,0,0.2)] bg-no-repeat z-10 -translate-x-1/2 -translate-y-1/2 bg-white"
        style={lensStyle}
      />
      
      <div className={`absolute bottom-4 right-4 bg-[#4A0E17]/85 backdrop-blur-[4px] text-white text-[10px] tracking-wider font-semibold py-1.5 px-3 rounded-full pointer-events-none flex items-center gap-1.5 border border-[#D4AF37]/30 transition-all duration-300 ${
        showLens ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <span>🔍 Hover to zoom handwork stitches</span>
      </div>
    </div>
  );
}
