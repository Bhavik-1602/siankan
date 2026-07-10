"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Check } from 'lucide-react';
import { useApp } from '../../lib/AppContext';

export default function Checkout() {
  const { cart, clearCart } = useApp();
  const [placed, setPlaced] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const formatPrice = (n: number) => {
    return "₹" + n.toLocaleString("en-IN");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center bg-[#FAF8F5] min-h-[70vh] flex flex-col justify-center items-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-maroon-100">
          <Check className="h-8 w-8 text-maroon-600 animate-pulse" />
        </div>
        <h1 className="font-editorial text-4xl font-light text-neutral-800 tracking-wide">Order received</h1>
        <p className="mt-4 text-xs font-light uppercase tracking-widest text-neutral-500 max-w-md leading-relaxed">
          Thank you — a confirmation email is on its way. Our atelier will begin tailoring your bespoke pieces within 24 hours.
        </p>
        <Link
          href="/collections"
          className="mt-10 inline-block bg-neutral-950 hover:bg-maroon-800 text-white text-[10px] font-bold uppercase tracking-[0.25em] py-4 px-8 rounded-sm transition-colors shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center bg-[#FAF8F5] min-h-[70vh] flex flex-col justify-center items-center">
        <h1 className="font-editorial text-3xl font-light text-neutral-400">Your bag is empty</h1>
        <Link
          href="/collections"
          className="mt-8 inline-block bg-neutral-950 hover:bg-maroon-800 text-white text-[10px] font-bold uppercase tracking-[0.25em] py-4 px-8 transition-colors rounded-sm shadow-md"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-10">
          <div>
            <h1 className="font-editorial text-3xl font-light text-neutral-800 tracking-wide">Checkout</h1>
            <p className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
              <Lock className="h-3 w-3 text-maroon-600" /> Secure demo checkout
            </p>
          </div>

          {/* Contact info */}
          <section className="space-y-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-700">Contact Details</h2>
            <input 
              required 
              type="email" 
              placeholder="Email address" 
              className="w-full border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
            />
          </section>

          {/* Shipping Address */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-700">Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input 
                required 
                placeholder="First name" 
                className="border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="Last name" 
                className="border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="Delivery address (line 1)" 
                className="sm:col-span-2 border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="City" 
                className="border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="Pincode / Postal Code" 
                className="border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="Phone number" 
                className="sm:col-span-2 border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
            </div>
          </section>

          {/* Payment Info */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-700">Payment Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input 
                required 
                placeholder="Card number" 
                className="sm:col-span-2 border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="Expiry MM / YY" 
                className="border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
              <input 
                required 
                placeholder="Security CVV" 
                className="border border-neutral-350 bg-white px-4 py-3 text-xs outline-none focus:border-neutral-950 transition-colors rounded-sm text-neutral-800" 
              />
            </div>
            <p className="text-[10px] font-medium text-neutral-400 italic">Demo checkout only · no actual payment will be processed.</p>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-neutral-950 hover:bg-maroon-800 text-white py-4 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors rounded-sm shadow-xl"
          >
            Place order · {formatPrice(total)}
          </button>
        </form>

        {/* Sidebar Summary */}
        <aside className="h-fit border border-neutral-200 bg-white p-8 lg:sticky lg:top-28 rounded-sm shadow-sm space-y-6">
          <h2 className="font-editorial text-2xl font-light text-neutral-800 tracking-wide border-b border-neutral-100 pb-3">
            Order summary
          </h2>
          <ul className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {cart.map((item, idx) => {
              const { product, quantity, customizations, selectedColor } = item;
              const size = customizations?.size || 'M';

              return (
                <li key={`${product.id}-${idx}`} className="flex gap-4 border-b border-neutral-50 pb-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-neutral-55 rounded-sm">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="h-full w-full object-cover" 
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[9px] font-bold text-[#FAF8F5] shadow-md">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-neutral-850">{product.name}</p>
                    <p className="text-[10px] text-neutral-450 uppercase tracking-widest mt-0.5">
                      Size {size} {selectedColor ? `· ${selectedColor}` : ''}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-neutral-900 mt-0.5">
                    {formatPrice(product.price * quantity)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="space-y-2.5 pt-4 text-xs font-medium border-t border-neutral-100">
            <div className="flex justify-between text-neutral-500 uppercase tracking-wider">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-500 uppercase tracking-wider">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200/60 pt-4 text-sm font-bold text-neutral-950">
              <span className="uppercase tracking-wider">Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
