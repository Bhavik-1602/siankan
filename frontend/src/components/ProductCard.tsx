"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/mockData";
import { useApp } from "@/lib/AppContext";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { user } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync wishlist status
  useEffect(() => {
    if (user) {
      getWishlist(user.id).then((items) => {
        const found = items?.some((item: any) => item.product_id === product.id);
        setIsLiked(!!found);
      });
    }
  }, [user, product.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save pieces to your wishlist", {
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }
      });
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        const success = await removeFromWishlist(product.id);
        if (success) {
          setIsLiked(false);
          toast.success("Removed from wishlist");
        }
      } else {
        const success = await addToWishlist(user.id, product.id);
        if (success) {
          setIsLiked(true);
          toast.success("Saved to wishlist");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice = "₹" + product.price.toLocaleString("en-IN");
  
  // Custom mock discount calculation to show luxury price styling
  const originalPrice = product.price * 1.25;
  const formattedOriginalPrice = "₹" + Math.round(originalPrice).toLocaleString("en-IN");
  
  // Decide badge to display
  let badgeText = "";
  if (product.is_featured) {
    badgeText = "New Drop";
  } else if (product.price > 100000) {
    badgeText = "Atelier Couture";
  } else if (product.fabric?.toLowerCase().includes("silk")) {
    badgeText = "Limited";
  }

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group relative block w-full text-left"
    >
      {/* Aspect Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 rounded-xs border border-stone-200/20 select-none">
        
        {/* Primary Image */}
        <img 
          src={product.image_url} 
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out ${
            product.zoom_image_url ? "group-hover:opacity-0" : ""
          } group-hover:scale-105`}
          loading={priority ? "eager" : "lazy"}
        />

        {/* Secondary Image on Hover */}
        {product.zoom_image_url && (
          <img 
            src={product.zoom_image_url} 
            alt={`${product.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[1250ms] ease-out group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Shadow Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-stone-250/20 shadow-sm text-stone-755 hover:bg-white hover:text-brand-terracotta hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`h-4.5 w-4.5 transition-colors ${
              isLiked ? "fill-brand-terracotta text-brand-terracotta animate-pulse" : "text-stone-700"
            }`} 
            strokeWidth={1.4}
          />
        </button>

        {/* Luxury Badge */}
        {badgeText && (
          <span className="absolute left-3 top-3 z-20 bg-[#171717]/90 text-brand-gold border border-brand-gold/30 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.25em] rounded-xs shadow-sm">
            {badgeText}
          </span>
        )}

        {/* Quick View Slide Up indicator */}
        <div className="absolute inset-x-0 bottom-0 py-3 bg-[#FAF8F5]/90 backdrop-blur-xs text-center border-t border-brand-cream/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-10 hidden sm:block">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#171717] flex items-center justify-center gap-2">
            <ShoppingBag size={10} className="text-brand-terracotta" /> View Details
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="mt-4.5 space-y-1.5 px-1">
        
        {/* Category */}
        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-terracotta block">
          {product.categories?.name || product.category || "Signature Couture"}
        </span>

        {/* Name */}
        <h3 className="font-editorial text-base sm:text-lg text-stone-850 tracking-wide font-light line-clamp-1 leading-snug group-hover:text-brand-terracotta transition-colors duration-300">
          {product.name}
        </h3>

        {/* Color Swatch Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 py-1">
            {product.colors.slice(0, 4).map((c, i) => (
              <span 
                key={i} 
                className="h-1.5 w-1.5 rounded-full border border-stone-300 bg-stone-100" 
                title={c}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[7px] font-sans font-bold text-stone-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <span className="text-xs font-bold text-brand-black tracking-wide">
            {formattedPrice}
          </span>
          <span className="text-[10px] text-stone-400 line-through font-light">
            {formattedOriginalPrice}
          </span>
          <span className="text-[9px] font-bold text-emerald-600 tracking-wider">
            (25% OFF)
          </span>
        </div>
      </div>
    </Link>
  );
}
