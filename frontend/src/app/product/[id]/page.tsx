"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Ruler, Check, HelpCircle, MessageSquare, ChevronDown, Award, Globe, Heart } from 'lucide-react';
import { useApp } from '../../../lib/AppContext';
import { Product } from '../../../lib/mockData';
import ImageZoom from '../../../components/ImageZoom';
import ProductCard from '../../../components/ProductCard';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../../lib/supabaseClient';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, user } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isCustomFitting, setIsCustomFitting] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Accordion toggles
  const [activeAccordion, setActiveAccordion] = useState<string | null>("craftsmanship");

  // Custom measurement forms
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [height, setHeight] = useState('');
  const [neckline, setNeckline] = useState('Standard');
  const [notes, setNotes] = useState('');

  // Fetch product detail and catalog
  useEffect(() => {
    async function loadData() {
      if (!id || typeof id !== 'string') return;
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.image_url);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }

        // Load all products for related items
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products`);
        if (allRes.ok) {
          const allData = await allRes.json();
          setAllProducts(allData || []);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  // Sync wishlist status
  useEffect(() => {
    if (user && product) {
      getWishlist(user.id).then((items) => {
        const found = items?.some((item: any) => item.product_id === product.id);
        setIsLiked(!!found);
      });
    }
  }, [user, product]);

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!user) {
      toast.error("Please login to save pieces to your wishlist", {
        action: {
          label: "Login",
          onClick: () => router.push('/login')
        }
      });
      return;
    }

    setWishlistLoading(true);
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
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-48 bg-[#FAF8F5]">
        <div className="w-8 h-8 border border-stone-300 border-t-brand-terracotta rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-400 uppercase tracking-widest">Retrieving Garment Archives...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto max-w-2xl px-6 py-32 text-center space-y-6 bg-[#FAF8F5]">
        <HelpCircle className="mx-auto text-brand-terracotta opacity-60" size={56} />
        <h2 className="font-editorial text-3xl font-light text-stone-850">Garment Not Found</h2>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">We couldn't retrieve the specified fashion item. It may have been retired from our seasonal collections.</p>
        <Link href="/collections" className="border border-[#171717] hover:bg-[#171717] hover:text-[#FAF8F5] text-[9px] font-bold tracking-widest uppercase py-3.5 px-8 rounded-sm inline-block transition-all">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = (buyNow = false) => {
    let customizations = null;

    if (isCustomFitting) {
      if (!bust || !waist || !height) {
        toast.error("Please provide Bust, Waist, and Height measurements for custom tailoring.");
        return;
      }
      customizations = { bust, waist, height, neckline, notes };
    }

    addToCart(product, 1, customizations, selectedColor);

    if (buyNow) {
      router.push('/cart');
    } else {
      setCartFeedback(true);
      toast.success("Added to bag with bespoke details");
      setTimeout(() => setCartFeedback(false), 5000);
    }
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = "919876543210";
    const message = `Hello Sainkai Couture, I am interested in inquiring about the "${product.name}" (Fabric: ${product.fabric}, Price: ₹${product.price.toLocaleString('en-IN')}) from your collection catalog.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  // Filter Related Products (same category, max 3)
  const relatedProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 py-16">
        
        {/* Back navigation */}
        <Link href="/collections" className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-stone-400 hover:text-brand-terracotta mb-10 transition-colors">
          <ArrowLeft size={12} /> Back to collections
        </Link>

        {/* Product Spec dual columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery Viewer */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-[480px] sm:h-[620px] w-full">
              <ImageZoom 
                src={activeImage} 
                zoomSrc={product.zoom_image_url || undefined} 
                alt={product.name}
              />
            </div>

            {/* Thumbnails switcher */}
            {product.zoom_image_url && (
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setActiveImage(product.image_url)}
                  className={`w-20 h-26 border overflow-hidden transition-all duration-300 rounded-xs bg-stone-100 cursor-pointer ${
                    activeImage === product.image_url ? 'border-brand-gold scale-[1.02] shadow-sm' : 'border-stone-200/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.image_url} alt="Front thumbnail" className="w-full h-full object-cover" />
                </button>
                
                <button 
                  onClick={() => setActiveImage(product.zoom_image_url!)}
                  className={`w-20 h-26 border overflow-hidden transition-all duration-300 rounded-xs bg-stone-100 cursor-pointer ${
                    activeImage === product.zoom_image_url ? 'border-brand-gold scale-[1.02] shadow-sm' : 'border-stone-200/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.zoom_image_url} alt="Embroidery detail thumbnail" className="w-full h-full object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Garment Information & Custom Ordering */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header metadata */}
            <div className="space-y-3 pb-6 border-b border-stone-200/50">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[9px] font-bold tracking-[0.25em] text-brand-terracotta uppercase">
                  {product.categories?.name || product.category || 'Couture'} Collection
                </span>
                
                {/* Wishlist Toggle Heart */}
                <button 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="text-stone-400 hover:text-brand-terracotta transition-colors cursor-pointer"
                  title="Add to wishlist"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-brand-terracotta text-brand-terracotta' : ''}`} strokeWidth={1.4} />
                </button>
              </div>
              
              <h1 className="font-editorial text-3xl sm:text-4xl font-light text-stone-850 leading-snug">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-xl font-bold text-brand-black font-sans">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400 line-through font-light">
                  ₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 tracking-wider">
                  (25% OFF)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {/* Artisan story bubble */}
            {product.artisan_notes && (
              <div className="bg-brand-terracotta/[0.03] border-l-2 border-brand-terracotta/40 p-5 rounded-xs text-xs italic text-stone-600 leading-relaxed space-y-1">
                <span className="font-sans font-bold text-[9px] tracking-wider text-brand-terracotta uppercase block not-italic">
                  Karigar Notes
                </span>
                "{product.artisan_notes}"
              </div>
            )}

            {/* Specs row */}
            <div className="grid grid-cols-2 gap-6 border-y border-stone-200/50 py-5">
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">Fabric Base</span>
                <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide">{product.fabric}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">Embroidery Handwork</span>
                <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide">{product.embroidery} Handwork</span>
              </div>
            </div>

            {/* Color Shade Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-stone-450 uppercase tracking-widest block">Selected Shade</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-4 py-2 border rounded-xs transition-all cursor-pointer ${
                        selectedColor === color 
                          ? 'border-brand-terracotta text-brand-terracotta bg-brand-terracotta/[0.04] font-semibold' 
                          : 'border-stone-200/80 text-stone-500 hover:border-brand-terracotta/55 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bespoke Boutique Sizing Fitting Form */}
            <div className="border border-stone-200 bg-white rounded-xs p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Ruler size={16} className="text-brand-terracotta" />
                <h4 className="font-editorial text-lg font-light text-stone-800">Bespoke Size Tailoring</h4>
              </div>

              <label className="flex items-center space-x-3 text-xs text-stone-700 font-semibold cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={isCustomFitting}
                  onChange={(e) => setIsCustomFitting(e.target.checked)}
                  className="rounded border-stone-300 text-brand-terracotta focus:ring-brand-terracotta w-4 h-4 cursor-pointer"
                />
                <span>Add Custom Atelier Measurements (+ ₹5,000)</span>
              </label>

              {isCustomFitting && (
                <div className="space-y-4 pt-3 border-t border-stone-100 animate-fade-in-up">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-stone-500 uppercase tracking-widest block">Bust (in)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 36"
                        className="w-full bg-[#FAF8F5] border border-stone-200/80 rounded-xs px-3 py-2.5 text-xs text-stone-800 outline-none focus:border-brand-terracotta transition-colors font-sans"
                        value={bust}
                        onChange={(e) => setBust(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-stone-500 uppercase tracking-widest block">Waist (in)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 30"
                        className="w-full bg-[#FAF8F5] border border-stone-200/80 rounded-xs px-3 py-2.5 text-xs text-stone-800 outline-none focus:border-brand-terracotta transition-colors font-sans"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-stone-500 uppercase tracking-widest block">Height (in)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 64"
                        className="w-full bg-[#FAF8F5] border border-stone-200/80 rounded-xs px-3 py-2.5 text-xs text-stone-800 outline-none focus:border-brand-terracotta transition-colors font-sans"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-stone-500 uppercase tracking-widest block">Neckline styling</label>
                    <select
                      className="w-full bg-[#FAF8F5] border border-stone-200/80 rounded-xs px-3 py-2.5 text-xs text-stone-700 outline-none focus:border-brand-terracotta transition-colors cursor-pointer"
                      value={neckline}
                      onChange={(e) => setNeckline(e.target.value)}
                    >
                      <option value="Standard">Standard Atelier Cut</option>
                      <option value="Sweetheart Neck">Sweetheart Neckline</option>
                      <option value="Deep V-Neck">Deep Plunging V-Neck</option>
                      <option value="Boat Neck">Boat Neckline</option>
                      <option value="Full Sleeve Addition">Include Long Sleeves</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-stone-500 uppercase tracking-widest block">Embroidery / styling notes</label>
                    <textarea 
                      placeholder="Specify custom sleeve extensions, border adjustments, or design notes..."
                      className="w-full bg-[#FAF8F5] border border-stone-200/80 rounded-xs px-3 py-2.5 text-xs text-stone-800 outline-none focus:border-brand-terracotta transition-colors min-h-[80px] resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => handleAddToCart(false)}
                className="flex-1 bg-transparent border border-brand-terracotta text-brand-terracotta hover:bg-brand-terracotta hover:text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
              >
                <ShoppingBag size={15} /> Add to Bag
              </button>
              <button 
                onClick={() => handleAddToCart(true)}
                className="flex-1 bg-brand-terracotta text-white hover:bg-brand-terracotta-dark text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all flex items-center justify-center gap-2.5 shadow-glow cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* WhatsApp Inquiry Button */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              <MessageSquare size={15} /> Inquire on WhatsApp
            </button>

            {/* Accordion Specification Cards */}
            <div className="space-y-1 border-t border-stone-200/60 pt-6">
              
              {/* Box 1: Craftsmanship */}
              <div className="border-b border-stone-200/40">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "craftsmanship" ? null : "craftsmanship")}
                  className="w-full py-4 flex justify-between items-center text-left text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-brand-terracotta transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Award size={14} className="text-brand-gold" /> Craftsmanship & Origin</span>
                  <ChevronDown className={`h-4.5 w-4.5 transition-transform text-stone-400 ${activeAccordion === "craftsmanship" ? "rotate-180" : ""}`} />
                </button>
                {activeAccordion === "craftsmanship" && (
                  <div className="pb-4 text-xs font-light text-stone-500 leading-relaxed space-y-2 animate-fade-in-up">
                    <p>Every Sainkai couture garment is hand-dyed and custom embroidered in Surat, India. We weave raw silk foundations and details over 10-14 days on order.</p>
                    <p>Features 100% genuine glass mirror sheesha stitches and champagne wire zardosi details.</p>
                  </div>
                )}
              </div>

              {/* Box 2: Delivery & Timelines */}
              <div className="border-b border-stone-200/40">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "delivery" ? null : "delivery")}
                  className="w-full py-4 flex justify-between items-center text-left text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-brand-terracotta transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Globe size={14} className="text-brand-gold" /> Delivery & Alterations</span>
                  <ChevronDown className={`h-4.5 w-4.5 transition-transform text-stone-400 ${activeAccordion === "delivery" ? "rotate-180" : ""}`} />
                </button>
                {activeAccordion === "delivery" && (
                  <div className="pb-4 text-xs font-light text-stone-500 leading-relaxed space-y-2 animate-fade-in-up">
                    <p><strong>Insured Shipping:</strong> Complimentary insured nationwide shipping across India. Orders leave Surat atelier in 10-14 days.</p>
                    <p><strong>Custom Fittings:</strong> If custom measurements are selected, tailoring requires 3-4 weeks. Free sizing alterations within 7 days of delivery.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Related products catalog list */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-stone-250/20 pt-16 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-terracotta block">ATELIER COMPLEMENTS</span>
              <h2 className="font-editorial text-3xl font-light text-stone-850">Related Garments</h2>
              <div className="w-10 h-[1px] bg-brand-gold mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-t border-[#f5e6d3]/30 px-6 py-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider truncate max-w-[140px]">{product.name}</span>
          <span className="text-sm font-bold text-brand-terracotta">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleAddToCart(false)}
            className="bg-[#171717] hover:bg-stone-900 text-white text-[9px] font-bold tracking-widest uppercase px-5 py-3 rounded-xs transition-all shadow-sm"
          >
            Add to Bag
          </button>
          <button 
            onClick={handleWhatsAppInquiry}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold tracking-widest uppercase p-3 rounded-xs transition-all shadow-sm"
            title="WhatsApp inquiry"
          >
            <MessageSquare size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
