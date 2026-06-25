"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShieldCheck, Ruler, HelpCircle } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function Cart() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  // Custom tailoring surcharge: ₹5,000 for each item with custom sizing
  const customItemsCount = cart.filter(item => item.customizations !== null).length;
  const tailoringSurcharge = customItemsCount * 5000;
  
  const grandTotal = subtotal + tailoringSurcharge;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center space-y-6 animate-in fade-in duration-500">
        <HelpCircle className="mx-auto text-[#4A0E17] opacity-60" size={56} />
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Your Shopping Bag is Empty</h2>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto">Explore our premium pastel silks, designer cholis, and Garba collection drapes to find your outfit.</p>
        <Link href="/collections" className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-4 px-8 rounded-sm inline-block shadow-sm">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          Your Selection
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#4A0E17]">
          Couture Shopping Bag
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
      </section>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/60 rounded-lg overflow-hidden shadow-sm divide-y divide-neutral-100">
          {cart.map((item, index) => (
            <div key={`${item.product.id}-${index}`} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              
              {/* Product Image */}
              <img 
                src={item.product.image_url} 
                alt={item.product.name} 
                className="w-24 h-30 object-cover rounded border border-neutral-200/60 flex-shrink-0"
              />

              {/* Item Details */}
              <div className="flex-grow space-y-1.5 w-full">
                <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest block">
                  {item.product.category} • {item.product.fabric}
                </span>
                
                <h3 className="font-serif text-lg font-bold text-neutral-800 hover:text-[#4A0E17] transition-colors leading-snug">
                  <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                </h3>

                {item.selectedColor && (
                  <p className="text-xs text-neutral-400">
                    Shade Choice: <strong className="text-neutral-600">{item.selectedColor}</strong>
                  </p>
                )}

                {/* Sizing notes */}
                {item.customizations ? (
                  <div className="bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] p-3 rounded text-xs text-neutral-800 space-y-0.5">
                    <span className="font-semibold text-[10px] uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                      <Ruler size={12} /> Custom Boutique measurements
                    </span>
                    <p className="font-mono text-neutral-600">
                      Bust: {item.customizations.bust} in | Waist: {item.customizations.waist} in | Height: {item.customizations.height} in
                    </p>
                    <p className="text-neutral-500">
                      Neckline: {item.customizations.neckline}
                      {item.customizations.notes && ` | Notes: "${item.customizations.notes}"`}
                    </p>
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-400 font-semibold tracking-wide flex items-center gap-1">
                    ✓ Standard boutique draping size
                  </span>
                )}

                {/* Quantity + Price row */}
                <div className="flex items-center gap-6 pt-3">
                  <div className="flex border border-neutral-200 rounded overflow-hidden">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.customizations, item.quantity - 1)}
                      className="px-3 py-1 bg-stone-50 hover:bg-stone-100 text-neutral-500 text-sm font-semibold transition-colors outline-none"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs text-neutral-800 flex items-center font-bold bg-white min-w-[32px] justify-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.customizations, item.quantity + 1)}
                      className="px-3 py-1 bg-stone-50 hover:bg-stone-100 text-neutral-500 text-sm font-semibold transition-colors outline-none"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-sans font-bold text-neutral-800 text-sm">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

              {/* Trash btn */}
              <button
                onClick={() => removeFromCart(item.product.id, item.customizations)}
                className="text-neutral-400 hover:text-red-600 p-2.5 rounded-full hover:bg-red-50 transition-colors"
                title="Remove Item"
              >
                <Trash2 size={18} />
              </button>

            </div>
          ))}
        </div>

        {/* Right Column: Cart summary */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/60 rounded-lg p-6 sm:p-8 h-fit space-y-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-neutral-800 border-b border-stone-100 pb-4">Order Summary</h3>

          <div className="space-y-4 text-xs tracking-wide">
            <div className="flex justify-between text-neutral-500">
              <span>Couture Subtotal</span>
              <span className="font-bold text-neutral-800">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            {tailoringSurcharge > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>Bespoke Fitting Fee</span>
                <span className="font-bold text-neutral-800">₹{tailoringSurcharge.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-500">
              <span>Boutique Shipping</span>
              <span className="font-bold text-emerald-600">COMPLIMENTARY</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-neutral-800 pt-4 border-t border-stone-100">
              <span>Order Total</span>
              <span className="text-base text-[#4A0E17]">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 text-[10px] text-neutral-400 font-semibold leading-relaxed border-t border-stone-100">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={16} className="text-[#D4AF37] flex-shrink-0" />
              <span>Complimentary insured shipping nationwide.</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck size={16} className="text-[#D4AF37] flex-shrink-0" />
              <span>Custom alterations require 3-4 weeks crafting time.</span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#4A0E17] text-white hover:bg-[#721C28] text-xs font-bold tracking-widest uppercase py-4 rounded transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Proceed to Checkout <ArrowRight size={14} />
          </button>

          <div className="text-center pt-2">
            <Link href="/collections" className="text-xs font-semibold text-[#4A0E17] hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
