"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Users, Scissors, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import confetti from 'canvas-confetti';

export default function Services() {
  const { user, submitInquiry } = useApp();

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('pastel');
  const [inquiryType, setInquiryType] = useState('consultation');
  const [details, setDetails] = useState('');
  const [proposedDate, setProposedDate] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [inquiryRef, setInquiryRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inquiryData = {
      customer_name: customerName,
      email,
      phone,
      category,
      inquiry_type: inquiryType,
      details,
      proposed_date: proposedDate
    };

    try {
      const res = await submitInquiry(inquiryData);
      if (res.success) {
        setInquiryRef(res.inquiryId || '');
        setSubmitted(true);
        
        // Custom pastel gold confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E8C5C8', '#D4AF37', '#D1E2D3']
        });
      } else {
        setError(res.error || "Failed to submit booking.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Editorial Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase block">
          SIANKAN Studio Services
        </span>
        <h1 className="font-editorial text-4xl font-light text-neutral-800">
          Personalized Fashion Architecture
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
        <p className="text-neutral-505 text-xs sm:text-sm leading-relaxed">
          From custom pastel wedding lehengas to coordinate bridesmaid fitting consultations, our designers are at your service.
        </p>
      </section>

      {/* Services Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        
        <div className="bg-white border border-neutral-200/40 p-6 sm:p-8 rounded-sm shadow-sm space-y-5 hover:shadow-lg transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 group-hover:scale-105 transition-transform">
            <Compass size={18} strokeWidth={1.8} />
          </div>
          <h3 className="font-editorial text-lg text-neutral-800">Custom Outfit Design</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Co-design your dream outfit. Select pastel shades, handloom weaves, and zardosi borders tailored to your measurements.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/40 p-6 sm:p-8 rounded-sm shadow-sm space-y-5 hover:shadow-lg transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 group-hover:scale-105 transition-transform">
            <Users size={18} strokeWidth={1.8} />
          </div>
          <h3 className="font-editorial text-lg text-neutral-800">Group Outfit Design</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Coordinated pastel lehengas for bridesmaids or matching vibrant mirror-work chaniya cholis for Navratri Garba groups.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/40 p-6 sm:p-8 rounded-sm shadow-sm space-y-5 hover:shadow-lg transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 group-hover:scale-105 transition-transform">
            <Scissors size={18} strokeWidth={1.8} />
          </div>
          <h3 className="font-editorial text-lg text-neutral-800">Alteration Services</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Perfecting the silhouette. We provide precise draping and sleeve adjustment services to match your comfort requirements.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/40 p-6 sm:p-8 rounded-sm shadow-sm space-y-5 hover:shadow-lg transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 group-hover:scale-105 transition-transform">
            <Sparkles size={18} strokeWidth={1.8} />
          </div>
          <h3 className="font-editorial text-lg text-neutral-800">Styling Consultation</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Virtual or in-person sessions with our designers. Discuss color coordinates, fabrics, and jewelry matching.
          </p>
        </div>

      </div>

      {/* Booking Form Layout */}
      <div className="max-w-3xl mx-auto">
        {submitted ? (
          <div className="bg-white border border-neutral-200/50 p-8 sm:p-12 rounded-sm text-center shadow-lg space-y-6 animate-in zoom-in-95 duration-350">
            <CheckCircle2 className="mx-auto text-emerald-600" size={52} />
            <h2 className="font-editorial text-2xl text-neutral-800">Booking Request Filed</h2>
            <p className="text-neutral-550 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Your inquiry has been successfully registered under reference number:
            </p>
            <div className="bg-gold-50/20 py-3 px-6 border border-dashed border-gold-300 text-neutral-855 font-mono text-sm inline-block rounded-sm font-bold select-all">
              {inquiryRef}
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mx-auto">
              We have dispatched a confirmation email to <strong>{email}</strong>. Our lead design planner will review your details and send a styling invite link for <strong>{proposedDate}</strong>.
            </p>
            <div className="pt-4 flex gap-4 justify-center">
              <Link href="/profile" className="bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 transition-colors rounded-sm shadow-sm cursor-pointer">
                View Dashboard
              </Link>
              <button onClick={() => setSubmitted(false)} className="border border-neutral-300 text-neutral-500 hover:text-maroon-600 hover:border-maroon-600 text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 transition-colors rounded-sm cursor-pointer">
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200/50 rounded-sm p-8 sm:p-12 shadow-lg space-y-8">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <Calendar className="text-maroon-600" size={18} />
              <h2 className="font-editorial text-xl sm:text-2xl text-neutral-850">Schedule Design Call</h2>
            </div>

            {error && <div className="border-l-2 border-red-500 bg-red-50 text-xs p-4 rounded-sm text-red-800">{error}</div>}

            <form onSubmit={handleBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Phone Coordinate *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Proposed Consultation Date *</label>
                  <input 
                    type="date"
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-600 outline-none focus:border-maroon-600 transition-all font-sans cursor-pointer"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Garment Concept Category *</label>
                  <select 
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-600 outline-none focus:border-maroon-600 transition-all font-sans cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="pastel">Pastel Collection</option>
                    <option value="festive">Festive Wear</option>
                    <option value="garba">Garba Collection</option>
                    <option value="indo-western">Indo-Western Dress</option>
                    <option value="bridesmaid">Bridesmaid Wear</option>
                    <option value="custom">Bespoke Couture</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Service Type *</label>
                  <select 
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-600 outline-none focus:border-maroon-600 transition-all font-sans cursor-pointer"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                  >
                    <option value="consultation">Virtual Styling Consultation</option>
                    <option value="custom-outfit">Bespoke Design Commission</option>
                    <option value="alteration">Alteration & Draping Fitting</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Inspiration Concept Details *</label>
                <textarea 
                  placeholder="Tell us about your colors, fabrics, theme preferences, necklines, sleeves, or references..."
                  className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans min-h-[120px]"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all duration-300 shadow-md cursor-pointer mt-2"
              >
                {loading ? 'Submitting request...' : 'Book Styling Appointment'}
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
