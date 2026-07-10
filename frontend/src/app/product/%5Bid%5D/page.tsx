"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Ruler, Check, HelpCircle, Sparkles, Truck, RotateCcw } from 'lucide-react';
import { useApp } from '../../../lib/AppContext';
import { Product } from '../../../lib/mockData';
import ImageZoom from '../../../components/ImageZoom';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, setCartOpen } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isCustomFitting, setIsCustomFitting] = useState(false);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);

  // Custom measurement forms
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [height, setHeight] = useState('');
  const [neckline, setNeckline] = useState('Standard');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadProduct() {
      if (!id || typeof id !== 'string') return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.image_url);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    async function loadRelated() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const items = data.filter((p: any) => p.id !== product.id).slice(0, 3);
          setRelated(items);
        }
      } catch (err) {
        console.error('Failed to load related products', err);
      }
    }
    loadRelated();
  }, [product]);

  if (loading) {
    return (
      <div className="text-center py-32 bg-[#FAF8F5]">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-maroon-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-neutral-400 tracking-wider">Loading garment files...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center space-y-6 bg-[#FAF8F5]">
        <HelpCircle className="mx-auto text-maroon-600 opacity-60 animate-bounce" size={48} />
        <h2 className="font-editorial text-2xl font-light text-neutral-800">Garment Not Found</h2>
        <p className="text-neutral-500 text-xs tracking-wider leading-relaxed">
          We couldn't retrieve the specified fashion item. It may have been retired from our seasonal collections.
        </p>
        <Link href="/collections" className="bg-neutral-950 text-white text-[10px] font-bold tracking-[0.25em] uppercase py-4 px-8 rounded-sm inline-block shadow-lg">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    let customizations: any = { size: selectedSize };

    if (isCustomFitting) {
      if (!bust || !waist || !height) {
        alert("Please provide Bust, Waist, and Height measurements for custom tailoring.");
        return;
      }
      customizations = { bust, waist, height, neckline, notes, size: 'Custom' };
    } else if (!selectedSize) {
      alert("Please select a size or choose custom sizing.");
      return;
    }

    addToCart(product, 1, customizations, selectedColor);
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sizes = ["XS", "S", "M", "L", "XL"];
  const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-8 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
        <Link href="/" className="hover:text-neutral-800 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-neutral-800 transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800 font-semibold">{product.name}</span>
      </div>

      {/* Detail Block */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 md:grid-cols-2">
        
        {/* Left Gallery */}
        <div className="space-y-6">
          <div className="h-[480px] sm:h-[620px] w-full bg-neutral-100 rounded-sm overflow-hidden shadow-sm">
            <ImageZoom 
              src={activeImage} 
              zoomSrc={product.zoom_image_url || undefined} 
              alt={product.name}
            />
          </div>

          {/* Thumbnails */}
          {product.zoom_image_url && (
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setActiveImage(product.image_url)}
                className={`w-16 h-20 border rounded-sm overflow-hidden transition-all ${
                  activeImage === product.image_url ? 'border-neutral-950 scale-95 shadow-sm' : 'border-neutral-200 opacity-60'
                }`}
              >
                <img src={product.image_url} alt="Main view" className="w-full h-full object-cover" />
              </button>
              <button 
                onClick={() => setActiveImage(product.zoom_image_url)}
                className={`w-16 h-20 border rounded-sm overflow-hidden transition-all ${
                  activeImage === product.zoom_image_url ? 'border-neutral-950 scale-95 shadow-sm' : 'border-neutral-200 opacity-60'
                }`}
              >
                <img src={product.zoom_image_url} alt="Close-up view" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="md:sticky md:top-28 md:self-start space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">
              {product.fabric || "Premium cotton silk"} · {product.embroidery || "Artisanal handwork"}
            </p>
            <h1 className="mt-2 font-editorial text-4xl md:text-5xl font-light text-neutral-800 leading-tight tracking-wide">
              {product.name}
            </h1>
            <p className="mt-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              {product.colors ? product.colors.join(" & ") : "Custom color"}
            </p>
          </div>

          <div className="border-y border-neutral-200/50 py-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-neutral-950 tracking-wide">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider italic">
              Custom tailoring & shipping included
            </span>
          </div>

          <p className="text-sm leading-relaxed text-neutral-500 font-light">
            {product.description}
          </p>

          {/* Sizing Section */}
          <div className="pt-4">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-700">Size Options</span>
              <button 
                onClick={() => {
                  setIsCustomFitting(!isCustomFitting);
                  setSelectedSize(null);
                }}
                className="text-[10px] font-bold uppercase tracking-[0.22em] text-maroon-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5 underline underline-offset-4"
              >
                <Ruler className="h-3 w-3" />
                {isCustomFitting ? "Standard Sizes" : "Bespoke Custom Fitting"}
              </button>
            </div>

            {isCustomFitting ? (
              <div className="space-y-4 bg-neutral-50 p-4 rounded-sm border border-neutral-200/50 animate-in fade-in duration-300">
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  Provide your measurements (in inches):
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Bust</label>
                    <input 
                      type="text" 
                      placeholder="34" 
                      value={bust} 
                      onChange={(e) => setBust(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-600 transition-colors text-neutral-700" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Waist</label>
                    <input 
                      type="text" 
                      placeholder="28" 
                      value={waist} 
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-600 transition-colors text-neutral-700" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Height</label>
                    <input 
                      type="text" 
                      placeholder="5'4\" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-600 transition-colors text-neutral-700" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Neckline Preference</label>
                  <select 
                    value={neckline} 
                    onChange={(e) => setNeckline(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-600 transition-colors text-neutral-700"
                  >
                    <option value="Standard">Standard (As Shown)</option>
                    <option value="Deep Neck">Deep Sweetheart</option>
                    <option value="High Neck">Modest High Neck</option>
                    <option value="Boat Neck">Classic Boat Neck</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Additional Notes</label>
                  <textarea 
                    placeholder="E.g. want 3/4 sleeves, shorter peplum height..." 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-600 transition-colors text-neutral-700 resize-none" 
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-11 w-12 border text-xs font-semibold rounded-sm transition-colors ${
                      selectedSize === s
                        ? "border-neutral-950 bg-neutral-950 text-white shadow-md scale-95"
                        : "border-neutral-300 hover:border-neutral-950 text-neutral-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6">
            <button
              onClick={handleAddToCart}
              className="w-full inline-flex items-center justify-center gap-3 bg-neutral-950 hover:bg-maroon-800 text-white py-4.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors rounded-sm shadow-xl"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> 
                  {isCustomFitting ? "Add Custom Piece to Bag" : (selectedSize ? "Add to Bag" : "Select a size")}
                </>
              )}
            </button>
          </div>

          {/* Boutique Badges */}
          <div className="mt-10 space-y-4 border-t border-neutral-200/50 pt-6 text-xs text-neutral-500 font-light">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-maroon-600" strokeWidth={1.5} />
              <span>{product.artisan_notes || "Hand-dyed & mirror-worked in our Gujarat atelier"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-maroon-600" strokeWidth={1.5} />
              <span>Made-to-order · dispatched in 10–14 days</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-maroon-600" strokeWidth={1.5} />
              <span>7-day easy exchange on all pieces</span>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 border-t border-neutral-200/40 mt-16">
          <h2 className="mb-12 text-center font-editorial text-3xl font-light text-neutral-800 tracking-wide">
            You may also love
          </h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm">
                  <img 
                    src={p.image_url} 
                    alt={p.name} 
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-104" 
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <h3 className="font-editorial text-lg font-light text-neutral-800">{p.name}</h3>
                  <p className="text-xs font-bold text-neutral-900 mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
