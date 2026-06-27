"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Send, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { createOrder, getAddresses, validateCoupon } from '@/lib/supabaseClient';
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

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

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

  // Fetch saved addresses
  useEffect(() => {
    if (user) {
      getAddresses(user.id).then(data => {
        setSavedAddresses(data || []);
        // Automatically prefill with default address if available
        const defaultAddr = data?.find((a: any) => a.is_default);
        if (defaultAddr) {
          setShippingAddress(defaultAddr.address_line1 + (defaultAddr.address_line2 ? ', ' + defaultAddr.address_line2 : ''));
          setCity(defaultAddr.city);
          setPostalCode(defaultAddr.postal_code);
          setPhone(defaultAddr.phone || '');
        }
      });
    }
  }, [user]);

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addrId = e.target.value;
    const addr = savedAddresses.find(a => a.id === addrId);
    if (addr) {
      setShippingAddress(addr.address_line1 + (addr.address_line2 ? ', ' + addr.address_line2 : ''));
      setCity(addr.city);
      setPostalCode(addr.postal_code);
      setPhone(addr.phone || '');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponFeedback(null);
    const res = await validateCoupon(couponCode);
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponFeedback({ success: true, message: `Coupon "${res.coupon.code}" applied!` });
    } else {
      setAppliedCoupon(null);
      setCouponFeedback({ success: false, message: res.error || 'Invalid coupon code.' });
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const customItemsCount = cart.filter(item => item.customizations !== null).length;
  const tailoringSurcharge = customItemsCount * 5000;

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (subtotal + tailoringSurcharge) * (appliedCoupon.discount_value / 100);
    } else {
      discount = appliedCoupon.discount_value;
    }
  }

  const grandTotal = Math.max(0, subtotal + tailoringSurcharge - discount);

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
      <div className="container mx-auto max-w-2xl px-4 py-28 text-center space-y-6 animate-fade-in-up">
        <HelpCircle className="mx-auto text-maroon-600 opacity-60" size={56} />
        <h2 className="font-editorial text-2xl text-neutral-800">Checkout is Empty</h2>
        <p className="text-neutral-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">You don't have any items in your shopping bag to checkout.</p>
        <Link href="/collections" className="bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-4 px-8 rounded-sm inline-block shadow-md transition-colors cursor-pointer">
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase block">
          Billing Coordinator
        </span>
        <h1 className="font-editorial text-4xl font-light text-neutral-800">
          Secure Checkout
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
      </section>

      {submitted ? (
        <div className="max-w-2xl mx-auto bg-white border border-neutral-200/50 p-8 sm:p-12 rounded-sm text-center shadow-lg space-y-6 animate-in zoom-in-95 duration-350">
          <CheckCircle2 className="mx-auto text-emerald-600" size={52} />
          <h2 className="font-editorial text-2xl text-neutral-800">Order Placed Successfully</h2>
          <p className="text-neutral-555 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Your purchase record has been created under reference number:
          </p>
          <div className="bg-gold-50/20 py-3 px-6 border border-dashed border-gold-300 text-neutral-855 font-mono text-sm inline-block rounded-sm font-bold select-all">
            {orderRef}
          </div>
          <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mx-auto">
            We have sent a copy of your receipt to <strong>{email}</strong>. Our custom tailoring team will contact you to review your sizes.
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Link href="/profile" className="bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 transition-colors rounded-sm shadow-sm cursor-pointer">
              My Orders
            </Link>
            <Link href="/collections" className="border border-neutral-300 text-neutral-500 hover:text-maroon-600 hover:border-maroon-600 text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 transition-colors rounded-sm cursor-pointer">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Form details */}
          <div className="lg:col-span-8 bg-white border border-neutral-200/50 rounded-sm p-6 sm:p-8 shadow-sm space-y-8">
            
            {error && <div className="border-l-2 border-red-500 bg-red-50 text-xs p-4 rounded-sm text-red-800">{error}</div>}

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* Shipping section */}
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="font-editorial text-xl text-neutral-800">
                    1. Shipping Information
                  </h3>
                  
                  {/* Saved Address Selection */}
                  {user && savedAddresses.length > 0 && (
                    <select
                      onChange={handleAddressSelect}
                      defaultValue=""
                      className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-500 focus:outline-none"
                    >
                      <option value="" disabled>Select Saved Address</option>
                      {savedAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.address_line1.substring(0, 20)}... ({addr.city})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Recipient Name *</label>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Email Coordinates *</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Contact Number *</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Street Address *</label>
                  <input 
                    type="text" 
                    placeholder="Suite, Building, Street coordinates"
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">City *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Postal Code *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 400001"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-5 pt-4">
                <h3 className="font-editorial text-xl text-neutral-800 border-b border-neutral-100 pb-3">
                  2. Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-4 select-none">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all duration-300 gap-2 cursor-pointer ${
                      paymentMethod === 'Card' 
                        ? 'border-maroon-650 bg-maroon-50/20 text-maroon-600 font-bold shadow-sm' 
                        : 'border-neutral-200 text-neutral-500 hover:border-maroon-600'
                    }`}
                  >
                    <CreditCard size={18} strokeWidth={1.8} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Credit/Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all duration-300 gap-2 cursor-pointer ${
                      paymentMethod === 'UPI' 
                        ? 'border-maroon-650 bg-maroon-50/20 text-maroon-600 font-bold shadow-sm' 
                        : 'border-neutral-200 text-neutral-500 hover:border-maroon-600'
                    }`}
                  >
                    <Send size={16} strokeWidth={1.8} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">UPI Transfer</span>
                  </button>
                </div>

                {paymentMethod === 'Card' ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          maxLength={3}
                          className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="username@okhdfc"
                      className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
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
                className="w-full bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all duration-300 shadow-md mt-6 cursor-pointer"
              >
                {loading ? 'Authorizing Payment...' : `Complete Checkout • ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>

            </form>
          </div>

          {/* Right Column: Order contents */}
          <div className="lg:col-span-4 bg-neutral-50 border border-neutral-200/50 rounded-sm p-6 sm:p-8 h-fit space-y-6">
            <h3 className="font-editorial text-lg text-neutral-800 border-b border-neutral-200/50 pb-3">Bag Items</h3>

            <div className="space-y-4 divide-y divide-neutral-200/30">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 pt-4 first:pt-0">
                  <img src={item.product.image_url} alt="" className="w-12 h-16 object-cover rounded-sm border border-neutral-200/50 select-none" />
                  <div className="flex-grow space-y-1 text-xs">
                    <h4 className="font-editorial font-bold text-neutral-800 line-clamp-1">{item.product.name}</h4>
                    <span className="text-neutral-400 block text-[9px] uppercase tracking-wider font-bold">
                      Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                    </span>
                    {item.customizations && (
                      <span className="text-gold-450 text-[9px] font-bold uppercase tracking-wider block">Bespoke Fit</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-850">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div className="border-t border-neutral-200/50 pt-4 space-y-2">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Promo / Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow bg-white border border-neutral-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#D4AF37] uppercase font-semibold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-1.5 bg-[#4A0E17] hover:bg-[#5C1620] text-white text-[10px] font-bold uppercase tracking-wider rounded"
                >
                  Apply
                </button>
              </div>
              {couponFeedback && (
                <p className={`text-[10px] ${couponFeedback.success ? 'text-green-600' : 'text-red-600'} font-semibold mt-1`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            <div className="space-y-3.5 border-t border-neutral-200/50 pt-4 text-xs">
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
              {discount > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Insured Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-800 pt-4 border-t border-neutral-200/50">
                <span>Total Amount</span>
                <span className="text-maroon-600">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[9px] text-neutral-400 font-bold uppercase tracking-wider pt-2 select-none">
              <ShieldCheck size={14} className="text-gold-300 flex-shrink-0" />
              <span>Complimentary insured shipping. SSL encryption active.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
