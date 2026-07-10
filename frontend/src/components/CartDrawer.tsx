"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus } from 'lucide-react';
import { useApp } from '../lib/AppContext';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateCartQuantity, removeFromCart } = useApp();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatPrice = (n: number) => {
    return "₹" + n.toLocaleString("en-IN");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FAF8F5] text-neutral-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!cartOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/60 px-6 py-5">
          <h3 className="font-editorial text-xl font-light tracking-wide">Your Bag ({count})</h3>
          <button
            onClick={() => setCartOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-editorial text-2xl font-light text-neutral-400">Your bag is empty</p>
              <p className="mt-2 text-xs text-neutral-500 uppercase tracking-widest">
                Discover our new hand-dyed collections.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-6 border border-neutral-800 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors hover:bg-neutral-800 hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.map((item, idx) => {
                const { product, quantity, customizations, selectedColor } = item;
                const size = customizations?.size || 'M';
                
                return (
                  <li key={`${product.id}-${idx}`} className="flex gap-4 border-b border-neutral-100 pb-6">
                    <div className="h-28 w-20 shrink-0 overflow-hidden bg-neutral-100 rounded-sm">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-neutral-800">{product.name}</p>
                          <p className="mt-1 text-[10px] text-neutral-500 uppercase tracking-widest">
                            Size {size} {selectedColor ? `· ${selectedColor}` : ''}
                          </p>
                          {customizations && Object.keys(customizations).some(k => k !== 'size') && (
                            <p className="mt-1 text-[9px] text-maroon-600 italic">Custom Sized</p>
                          )}
                        </div>
                        <p className="text-xs font-bold text-neutral-900">{formatPrice(product.price * quantity)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center border border-neutral-300 rounded-sm">
                          <button
                            onClick={() => updateCartQuantity(product.id, customizations, quantity - 1)}
                            className="p-1.5 hover:bg-neutral-100 transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, customizations, quantity + 1)}
                            className="p-1.5 hover:bg-neutral-100 transition-colors"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id, customizations)}
                          className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-maroon-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-200/60 px-6 py-6 bg-white">
            <div className="mb-4 flex justify-between text-xs font-medium">
              <span className="text-neutral-500 uppercase tracking-wider">Subtotal</span>
              <span className="font-bold text-neutral-950">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-6 text-[10px] text-neutral-400 italic">
              Taxes and shipping calculated at checkout. Custom tailoring included.
            </p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block bg-neutral-950 hover:bg-maroon-800 text-white py-4 text-center text-[10px] font-bold uppercase tracking-[0.25em] transition-colors rounded-sm"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
