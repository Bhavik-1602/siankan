"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase block">
          Studio Coordinates
        </span>
        <h1 className="font-editorial text-4xl font-light text-neutral-850">
          Connect With Us
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
          Reach out to schedule an alterations fitting, discuss bespoke designs, or send general inquiry messages.
        </p>
      </section>

      {/* Grid: Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="font-editorial text-2xl text-neutral-800">
            Studio Information
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
            Our luxury studio in Mumbai is open for personalized custom appointments. Feel free to reach out via phone, email, or write directly using our contact form.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 flex-shrink-0">
                <Phone size={15} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest">Phone & WhatsApp</h4>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1">+91 98765 43210</p>
                <p className="text-neutral-400 text-[10px] mt-0.5 font-sans uppercase">Mon - Sat: 10:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 flex-shrink-0">
                <Mail size={15} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest">Email Channels</h4>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1 font-sans">couture@naartdesign.com</p>
                <p className="text-neutral-400 text-[10px] mt-0.5 font-sans uppercase">Response within 24 boutique hours.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-50/20 flex items-center justify-center text-maroon-600 border border-gold-300/30 flex-shrink-0">
                <MapPin size={15} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest">Boutique Atelier</h4>
                <p className="text-neutral-505 text-xs sm:text-sm mt-1 leading-relaxed">
                  Studio 4B, Pastel Arcade, Colaba Causeway, Mumbai, MH - 400001, India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Write to us form */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/50 p-8 sm:p-10 rounded-sm shadow-sm">
          <h3 className="font-editorial text-xl text-neutral-800 mb-6">Write to the Atelier</h3>

          {submitted && (
            <div className="bg-emerald-50/20 border border-emerald-400/50 p-4 rounded-sm text-xs text-emerald-800 mb-6 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your message has been sent successfully. We will follow up shortly.</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Your Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Subject</label>
              <input 
                type="text" 
                className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Message Details</label>
              <textarea 
                className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-maroon-600 transition-all font-sans min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A0E17] hover:bg-maroon-500 text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Send size={12} />
              {loading ? 'Sending message...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
