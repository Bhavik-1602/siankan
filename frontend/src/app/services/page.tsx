"use client";

import React, { useState } from 'react';
import { Compass, Users, Scissors, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
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
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Editorial Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          N&A Studio Services
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#4A0E17]">
          Personalized Fashion Architecture
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
        <p className="text-neutral-500 text-sm leading-relaxed">
          From custom pastel wedding lehengas to coordinate bridesmaid fitting consultations, our designers are at your service.
        </p>
      </section>

      {/* Services Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        
        <div className="bg-white border border-neutral-200/50 p-6 rounded-lg shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[#E8C5C8]/25 flex items-center justify-center text-[#4A0E17] border border-[#E8C5C8]/40">
            <Compass size={18} />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-800">Custom Outfit Design</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Co-design your dream outfit. Select pastel shades, handloom weaves, and zardosi borders tailored to your measurements.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/50 p-6 rounded-lg shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[#E8C5C8]/25 flex items-center justify-center text-[#4A0E17] border border-[#E8C5C8]/40">
            <Users size={18} />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-800">Group Outfit Design</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Coordinated pastel lehengas for bridesmaids or matching vibrant mirror-work chaniya cholis for Navratri Garba groups.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/50 p-6 rounded-lg shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[#E8C5C8]/25 flex items-center justify-center text-[#4A0E17] border border-[#E8C5C8]/40">
            <Scissors size={18} />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-800">Alteration Services</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Perfecting the silhouette. We provide precise draping and sleeve adjustment services to match your comfort requirements.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/50 p-6 rounded-lg shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[#E8C5C8]/25 flex items-center justify-center text-[#4A0E17] border border-[#E8C5C8]/40">
            <Sparkles size={18} />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-800">Styling Consultation</h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Virtual or in-person sessions with our designers. Discuss color coordinates, fabrics, and jewelry matching.
          </p>
        </div>

      </div>

      {/* Booking Form Layout */}
      <div className="max-w-3xl mx-auto">
        {submitted ? (
          <div className="bg-white border border-neutral-200/60 p-8 sm:p-12 rounded-lg text-center shadow-md space-y-6 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="mx-auto text-emerald-600" size={56} />
            <h2 className="font-serif text-2xl font-bold text-neutral-800">Booking Request Filed</h2>
            <p className="text-neutral-500 text-sm max-w-md mx-auto">
              Your inquiry has been successfully registered under reference number:
            </p>
            <div className="bg-[#E8C5C8]/10 py-3 px-6 border border-dashed border-[#D4AF37] text-neutral-800 font-mono text-sm inline-block rounded font-bold">
              {inquiryRef}
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mx-auto">
              We have dispatched a confirmation email to <strong>{email}</strong>. Our lead design planner will review your details and send a styling invite link for <strong>{proposedDate}</strong>.
            </p>
            <div className="pt-4 flex gap-4 justify-center">
              <Link href="/profile" className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-3 px-6 hover:bg-[#721C28] transition-colors rounded-sm shadow-sm">
                View Dashboard
              </Link>
              <button onClick={() => setSubmitted(false)} className="border border-neutral-300 text-neutral-500 text-xs font-bold tracking-widest uppercase py-3 px-6 hover:bg-stone-50 transition-colors rounded-sm">
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200/60 p-8 sm:p-12 rounded-lg shadow-md space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
              <Calendar className="text-[#4A0E17]" size={20} />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-800">Schedule Design Call</h2>
            </div>

            {error && <div className="border-l-4 border-red-500 bg-red-50 text-xs p-4 rounded text-red-800">{error}</div>}

            <form onSubmit={handleBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Phone Coordinate *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Proposed Consultation Date *</label>
                  <input 
                    type="date"
                    className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-700 outline-none focus:border-[#D4AF37] transition-all"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Garment Concept Category *</label>
                  <select 
                    className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-700 outline-none focus:border-[#D4AF37] transition-all"
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
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Service Type *</label>
                  <select 
                    className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-700 outline-none focus:border-[#D4AF37] transition-all"
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
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Inspiration Concept Details *</label>
                <textarea 
                  placeholder="Tell us about your colors, fabrics, theme preferences, necklines, sleeves, or references..."
                  className="w-full bg-stone-50 border border-neutral-200 rounded px-3 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#D4AF37] transition-all min-h-[120px]"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A0E17] text-white hover:bg-[#721C28] text-xs font-bold tracking-widest uppercase py-4 rounded transition-all shadow-md"
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
