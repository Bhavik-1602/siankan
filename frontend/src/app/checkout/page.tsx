"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Send, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { createOrder } from '../lib/supabaseClient';
import confetti from 'canvas-confetti';

export default function Checkout() {
  const router = useRouter();
  const { cart, user, clearCart } = useApp();

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'UPI'>('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const customItemsCount = cart.filter(item => item.customizations !== null).length;
  const tailoringSurcharge = customItemsCount * 5000;
  const grandTotal = subtotal + tailoringSurcharge;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setError('');
    setLoading(true);

    const orderData = {
      user_id: user?.id || null,
      customer_name: customerName,
      email,
      shipping_address: shippingAddress,
      city,
      postal_code: postalCode,
      phone,
      total_amount: grandTotal,
      payment_method: paymentMethod
    };

    try {
      const res = await createOrder(orderData, cart);
      if (res.success) {
        setOrderRef(res.orderId);
        setSubmitted(true);
        clearCart();

        // Burst confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E8C5C8', '#D4AF37', '#D1E2D3']
        });
      } else {
        setError("Failed to record order. Check inputs.");
      }
    } catch (err) {
      setError("An error occurred during payment processing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !submitted) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center space-y-6">
        <HelpCircle className="mx-auto text-[#4A0E17] opacity-60" size={56} />
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Checkout is Empty</h2>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto">You don't have any items in your shopping bag to checkout.</p>
        <Link href="/collections" className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-4 px-8 rounded-sm inline-block shadow-sm">
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          Billing Coordinator
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#4A0E17]">
          Secure Checkout
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
      </section>

      {submitted ? (
        <div className="max-w-3xl mx-auto bg-white border border-neutral-200/60 p-8 sm:p-12 rounded-lg text-center shadow-md space-y-6 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="mx-auto text-emerald-600" size={56} />
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Order Placed Successfully</h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Your purchase record has been created under reference number:
          </p>
          <div className="bg-[#E8C5C8]/10 py-3 px-6 border border-dashed border-[#D4AF37] text-neutral-800 font-mono text-sm inline-block rounded font-bold">
            {orderRef}
          </div>
          <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mx-auto">
            We have sent a copy of your receipt to <strong>{email}</strong>. Our custom tailoring team will contact you to review your sizes.
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Link href="/profile" className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-3 px-6 hover:bg-[#721C28] transition-colors rounded-sm shadow-sm">
              My Orders
            </Link>
            <Link href="/collections" className="border border-neutral-300 text-neutral-500 text-xs font-bold tracking-widest uppercase py-3 px-6 hover:bg-stone-50 transition-colors rounded-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form details */}
          <div className="lg:col-span-8 bg-white border border-neutral-200/60 rounded-lg p-6 sm:p-8 shadow-sm space-y-8">
            
            {error && <div className="border-l-4 border-red-500 bg-red-50 text-xs p-4 rounded text-red-800">{error}</div>}

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* Shipping section */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-neutral-800 border-b border-stone-100 pb-3">
                  1. Shipping Information
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Recipient Name *</label>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Email Coordinates *</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Contact Number *</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Street Address *</label>
                  <input 
                    type="text" 
                    placeholder="Suite, Building, Street coordinates"
                    className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">City *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai"
                      className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Postal Code *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 400001"
                      className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4 pt-4">
                <h3 className="font-serif text-xl font-bold text-neutral-800 border-b border-stone-100 pb-3">
                  2. Simulated Payment
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-md transition-all gap-2 ${
                      paymentMethod === 'Card' 
                        ? 'border-[#D4AF37] bg-[#E8C5C8]/10 text-[#4A0E17]' 
                        : 'border-neutral-200 text-neutral-500 hover:border-[#D4AF37]'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Credit/Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-md transition-all gap-2 ${
                      paymentMethod === 'UPI' 
                        ? 'border-[#D4AF37] bg-[#E8C5C8]/10 text-[#4A0E17]' 
                        : 'border-neutral-200 text-neutral-500 hover:border-[#D4AF37]'
                    }`}
                  >
                    <Send size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">UPI Transfer</span>
                  </button>
                </div>

                {paymentMethod === 'Card' ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          maxLength={3}
                          className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="username@okhdfc"
                      className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37]"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A0E17] text-white hover:bg-[#721C28] text-xs font-bold tracking-widest uppercase py-4 rounded transition-all shadow-md mt-6"
              >
                {loading ? 'Authorizing Payment...' : `Complete Checkout • ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>

            </form>
          </div>

          {/* Right Column: Order contents */}
          <div className="lg:col-span-4 bg-stone-50 border border-neutral-200/60 rounded-lg p-6 sm:p-8 h-fit space-y-6">
            <h3 className="font-serif text-lg font-bold text-neutral-800 border-b border-stone-150 pb-3">Bag Items</h3>

            <div className="space-y-4 divide-y divide-neutral-200/40">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 pt-4 first:pt-0">
                  <img src={item.product.image_url} alt="" className="w-12 h-16 object-cover rounded border border-neutral-200/40" />
                  <div className="flex-grow space-y-1 text-xs">
                    <h4 className="font-serif font-bold text-neutral-800 line-clamp-1">{item.product.name}</h4>
                    <span className="text-neutral-400 block text-[10px]">
                      Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                    </span>
                    {item.customizations && (
                      <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider block">Bespoke Fit</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-800">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 border-t border-stone-200/60 pt-4 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {tailoringSurcharge > 0 && (
                <div className="flex justify-between text-neutral-500">
                  <span>Custom Tailoring Fee</span>
                  <span className="font-semibold text-neutral-800">₹{tailoringSurcharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Insured Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-800 pt-4 border-t border-stone-200/60">
                <span>Total Amount</span>
                <span className="text-[#4A0E17]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-neutral-400 font-semibold pt-2">
              <ShieldCheck size={16} className="text-[#D4AF37] flex-shrink-0" />
              <span>Complimentary insured shipping. SSL encryption active.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
