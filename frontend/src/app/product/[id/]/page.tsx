"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Ruler, Check, HelpCircle, MessageSquare } from 'lucide-react';
import { getProductById } from '../../../lib/supabaseClient';
import { useApp } from '../../../lib/AppContext';
import { Product } from '../../../lib/mockData';
import ImageZoom from '../../../components/ImageZoom';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isCustomFitting, setIsCustomFitting] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);

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
        const data = await res.json();
        if (data) {
          setProduct(data);
          setActiveImage(data.image_url);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#4A0E17] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-neutral-400">Loading garment files...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <HelpCircle className="mx-auto text-[#4A0E17] opacity-60" size={56} />
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Garment Not Found</h2>
        <p className="text-neutral-500 text-sm">We couldn't retrieve the specified fashion item. It may have been retired from our seasonal collections.</p>
        <Link href="/collections" className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-3 px-6 rounded-sm inline-block shadow-sm">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = (buyNow = false) => {
    let customizations = null;

    if (isCustomFitting) {
      if (!bust || !waist || !height) {
        alert("Please provide all three measurements (Bust, Waist, and Height) for custom tailoring.");
        return;
      }
      customizations = { bust, waist, height, neckline, notes };
    }

    addToCart(product, 1, customizations, selectedColor);

    if (buyNow) {
      router.push('/cart');
    } else {
      setCartFeedback(true);
      setTimeout(() => setCartFeedback(false), 5000);
    }
  };

  // WhatsApp pre-filled link builder
  const handleWhatsAppInquiry = () => {
    const phoneNumber = "919876543210"; // N&A Boutique WhatsApp Number
    const message = `Hello N&A Art of Design, I am interested in inquiring about the "${product.name}" (Fabric: ${product.fabric}, Price: ₹${product.price.toLocaleString('en-IN')}) from your catalog.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Back button */}
      <Link href="/collections" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-[#4A0E17] mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to collections
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Media Zoom Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-[480px] sm:h-[600px] w-full">
            <ImageZoom 
              src={activeImage} 
              zoomSrc={product.zoom_image_url} 
              alt={product.name}
            />
          </div>

          {/* Thumbnails */}
          {product.zoom_image_url && (
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setActiveImage(product.image_url)}
                className={`w-20 h-24 border-2 rounded overflow-hidden transition-all ${
                  activeImage === product.image_url ? 'border-[#D4AF37] scale-95' : 'border-transparent opacity-80'
                }`}
              >
                <img src={product.image_url} alt="Main view thumbnail" className="w-full h-full object-cover" />
              </button>
              <button 
                onClick={() => setActiveImage(product.zoom_image_url!)}
                className={`w-20 h-24 border-2 rounded overflow-hidden transition-all ${
                  activeImage === product.zoom_image_url ? 'border-[#D4AF37] scale-95' : 'border-transparent opacity-80'
                }`}
              >
                <img src={product.zoom_image_url} alt="Stitch zoom view thumbnail" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Garment Information & Bespoke Fitting */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main info header */}
          <div className="space-y-2 pb-6 border-b border-stone-150">
            <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
              {product.category} Collection
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-800 leading-tight">
              {product.name}
            </h1>
            <p className="text-lg font-bold text-[#4A0E17] font-sans pt-1">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          <p className="text-neutral-500 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Artisan box */}
          {product.artisan_notes && (
            <div className="bg-[#E8C5C8]/10 border border-[#E8C5C8]/30 rounded p-4 text-xs italic text-neutral-700 leading-relaxed">
              <span className="font-sans font-bold text-[10px] tracking-wider text-[#4A0E17] uppercase block mb-1.5 not-italic">
                Artisan Story
              </span>
              "{product.artisan_notes}"
            </div>
          )}

          {/* Fabric & Embroidery spec */}
          <div className="grid grid-cols-2 gap-4 border-b border-stone-150 pb-6">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Fabric base</span>
              <span className="text-sm font-semibold text-neutral-800">{product.fabric}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Embroidery Handwork</span>
              <span className="text-sm font-semibold text-neutral-800">{product.embroidery} Stitches</span>
            </div>
          </div>

          {/* Color Picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Selected shade</span>
              <div className="flex gap-3 items-center">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                      selectedColor === color 
                        ? 'border-[#4A0E17] text-[#4A0E17] font-semibold bg-[#E8C5C8]/10' 
                        : 'border-neutral-200 text-neutral-500 hover:border-[#4A0E17]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Fitting Form */}
          <div className="bg-stone-50 border border-stone-200/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-150 pb-3">
              <Ruler size={18} className="text-[#4A0E17]" />
              <h4 className="font-serif text-base font-bold text-neutral-800">Bespoke Fitting Size</h4>
            </div>

            <label className="flex items-center space-x-2.5 text-xs text-neutral-700 font-semibold cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={isCustomFitting}
                onChange={(e) => setIsCustomFitting(e.target.checked)}
                className="rounded text-[#4A0E17] focus:ring-[#4A0E17] border-neutral-300 w-4 h-4 cursor-pointer"
              />
              <span>Add Custom Boutique Measurements (+ ₹5,000)</span>
            </label>

            {isCustomFitting && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-3 border-t border-stone-200/60">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Bust (in)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 36"
                      className="w-full bg-white border border-neutral-200 rounded px-2.5 py-2 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                      value={bust}
                      onChange={(e) => setBust(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Waist (in)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 30"
                      className="w-full bg-white border border-neutral-200 rounded px-2.5 py-2 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Height (in)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 64"
                      className="w-full bg-white border border-neutral-200 rounded px-2.5 py-2 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Neckline styling</label>
                  <select
                    className="w-full bg-white border border-neutral-200 rounded px-2.5 py-2 text-xs text-neutral-700 outline-none focus:border-[#D4AF37] cursor-pointer"
                    value={neckline}
                    onChange={(e) => setNeckline(e.target.value)}
                  >
                    <option value="Standard">Standard Cut</option>
                    <option value="Sweetheart Neck">Sweetheart Neckline</option>
                    <option value="Deep V-Neck">Deep V-Neck</option>
                    <option value="Boat Neck">Boat Neckline</option>
                    <option value="Full Sleeve Addition">Include Long Sleeves</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Embroidery / alignment notes</label>
                  <textarea 
                    placeholder="Specify extra fabric extensions or embroidery preference changes..."
                    className="w-full bg-white border border-neutral-200 rounded px-2.5 py-2 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] min-h-[80px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => handleAddToCart(false)}
              className="flex-1 bg-transparent border border-[#4A0E17] text-[#4A0E17] hover:bg-[#4A0E17] hover:text-white text-xs font-bold tracking-widest uppercase py-4 rounded transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag size={16} /> Add to bag
            </button>
            <button 
              onClick={() => handleAddToCart(true)}
              className="flex-1 bg-[#4A0E17] text-white hover:bg-[#721C28] text-xs font-bold tracking-widest uppercase py-4 rounded transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Buy now
            </button>
          </div>

          {/* WhatsApp Direct Inquire Button */}
          <button
            onClick={handleWhatsAppInquiry}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold tracking-widest uppercase py-4 rounded transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <MessageSquare size={16} /> Inquire on WhatsApp
          </button>

          {/* Cart Feedback Notification */}
          {cartFeedback && (
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37] p-4 rounded text-xs flex justify-between items-center text-neutral-800 animate-in fade-in duration-300">
              <span>✓ Added to bag. Bespoke sizing files synced.</span>
              <Link href="/cart" className="text-[#4A0E17] font-bold hover:underline">
                View Bag →
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
