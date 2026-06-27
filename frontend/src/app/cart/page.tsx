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
      <div className="container mx-auto max-w-2xl px-4 py-28 text-center space-y-6 animate-fade-in-up">
        <HelpCircle className="mx-auto text-maroon-600 opacity-60" size={56} />
        <h2 className="font-editorial text-2xl text-neutral-800">Your Shopping Bag is Empty</h2>
        <p className="text-neutral-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">Explore our premium pastel silks, designer cholis, and Garba collection drapes to find your outfit.</p>
        <Link href="/collections" className="bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-4 px-8 rounded-sm inline-block shadow-md transition-colors cursor-pointer">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase block">
          Your Selection
        </span>
        <h1 className="font-editorial text-4xl font-light text-neutral-800">
          Couture Shopping Bag
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
      </section>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/50 rounded-sm overflow-hidden shadow-sm divide-y divide-neutral-100">
          {cart.map((item, index) => (
            <div key={`${item.product.id}-${index}`} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-neutral-50/30 transition-colors">
              
              {/* Product Image */}
              <img 
                src={item.product.image_url} 
                alt={item.product.name} 
                className="w-20 h-24 object-cover rounded-sm border border-neutral-200/50 flex-shrink-0 select-none"
              />

              {/* Item Details */}
              <div className="flex-grow space-y-2 w-full">
                <span className="text-gold-400 text-[9px] font-bold uppercase tracking-wider block">
                  {item.product.category} • {item.product.fabric}
                </span>
                
                <h3 className="font-editorial text-base sm:text-lg text-neutral-800 hover:text-maroon-600 transition-colors leading-snug">
                  <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                </h3>

                {item.selectedColor && (
                  <p className="text-[11px] text-neutral-450 font-sans">
                    Shade Choice: <strong className="text-neutral-700">{item.selectedColor}</strong>
                  </p>
                )}

                {/* Sizing notes */}
                {item.customizations ? (
                  <div className="bg-gold-50/20 border-l border-gold-300 p-3 rounded-sm text-xs text-neutral-700 space-y-1 mt-2">
                    <span className="font-bold text-[9px] uppercase tracking-wider text-gold-400 flex items-center gap-1">
                      <Ruler size={10} /> Custom Boutique measurements
                    </span>
                    <p className="font-mono text-[10px] text-neutral-600">
                      Bust: {item.customizations.bust} in | Waist: {item.customizations.waist} in | Height: {item.customizations.height} in
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Neckline: {item.customizations.neckline}
                      {item.customizations.notes && ` | Notes: "${item.customizations.notes}"`}
                    </p>
                  </div>
                ) : (
                  <span className="text-[9px] text-neutral-400 font-bold tracking-widest uppercase flex items-center gap-1 select-none">
                    ✓ Standard boutique draping size
                  </span>
                )}

                {/* Quantity + Price row */}
                <div className="flex items-center gap-6 pt-3">
                  <div className="flex border border-neutral-200 rounded-sm overflow-hidden select-none">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.customizations, item.quantity - 1)}
                      className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 text-xs font-bold transition-colors outline-none cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1 text-xs text-neutral-800 flex items-center font-bold bg-white min-w-[32px] justify-center font-sans">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.customizations, item.quantity + 1)}
                      className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 text-xs font-bold transition-colors outline-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-sans font-bold text-neutral-800 text-xs sm:text-sm tracking-wider">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

              {/* Trash btn */}
              <button
                onClick={() => removeFromCart(item.product.id, item.customizations)}
                className="text-neutral-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50/60 transition-colors self-end sm:self-center cursor-pointer"
                title="Remove Item"
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}
        </div>

        {/* Right Column: Cart summary */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/50 rounded-sm p-6 sm:p-8 h-fit space-y-6 shadow-sm">
          <h3 className="font-editorial text-lg text-neutral-800 border-b border-neutral-100 pb-4">Order Summary</h3>

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

            <div className="flex justify-between text-sm font-bold text-neutral-800 pt-4 border-t border-neutral-100">
              <span>Order Total</span>
              <span className="text-base text-maroon-600">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 text-[9px] text-neutral-400 font-bold uppercase tracking-wider leading-relaxed border-t border-neutral-100 select-none">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={14} className="text-gold-300 flex-shrink-0" />
              <span>Complimentary insured shipping nationwide.</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck size={14} className="text-gold-300 flex-shrink-0" />
              <span>Custom alterations require 3-4 weeks crafting time.</span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            Proceed to Checkout <ArrowRight size={12} />
          </button>

          <div className="text-center pt-2">
            <Link href="/collections" className="text-xs font-bold text-maroon-600 hover:text-maroon-500 transition-colors uppercase tracking-wider">
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
