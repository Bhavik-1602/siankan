"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { useApp } from '../../lib/AppContext';

export default function Contact() {
  const { submitInquiry } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const result = await submitInquiry({
        name,
        email,
        subject: subject || 'General Inquiry',
        message
      });
      if (result.success) {
        setSent(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        alert(result.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 bg-[#FAF8F5] text-neutral-800">
      
      {/* Title */}
      <div className="mb-16 text-center">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">Say Hello</p>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-neutral-800 tracking-wide">Talk to the studio</h1>
        <p className="mx-auto mt-4 max-w-xl text-xs font-light leading-relaxed text-neutral-400 uppercase tracking-widest">
          Bespoke pieces, sizing help, press or wholesale — we'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-16 md:grid-cols-2">
        {/* Info Col */}
        <div>
          <h2 className="font-editorial text-2xl font-light text-neutral-800">Get in touch</h2>
          <div className="mt-8 space-y-6">
            {[
              { Icon: Mail, l: "Email", v: "na@siankan.com" },
              { Icon: Phone, l: "Phone / WhatsApp", v: "+91 8141477327" },
              { Icon: MapPin, l: "Studio", v: "rajkot, Gujarat · India" },
              { Icon: Instagram, l: "Instagram", v: "na@siankan.com" },
            ].map(({ Icon, l, v }) => (
              <div key={l} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                  <Icon className="h-4.5 w-4.5 text-maroon-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-400">{l}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-800">{v}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-neutral-200/50 pt-6">
            <h3 className="font-editorial text-xl font-light text-neutral-800">Studio hours</h3>
            <p className="mt-2 text-xs font-light text-neutral-400 uppercase tracking-widest">Monday — Saturday · 10 AM to 7 PM IST</p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 md:p-10 rounded-sm border border-neutral-200/50 shadow-sm"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Name</span>
              <input 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border-b border-neutral-350 bg-transparent py-2 text-xs outline-none focus:border-neutral-950 transition-colors text-neutral-800" 
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Email</span>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-b border-neutral-350 bg-transparent py-2 text-xs outline-none focus:border-neutral-950 transition-colors text-neutral-800" 
              />
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Subject</span>
            <input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full border-b border-neutral-350 bg-transparent py-2 text-xs outline-none focus:border-neutral-950 transition-colors text-neutral-800" 
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Message</span>
            <textarea 
              required 
              rows={4} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full border-b border-neutral-350 bg-transparent py-2 text-xs outline-none focus:border-neutral-950 transition-colors text-neutral-800 resize-none" 
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-neutral-950 hover:bg-maroon-800 text-white py-4 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors rounded-sm shadow-md disabled:opacity-50"
          >
            {sent 
              ? "Thank you — we'll be in touch" 
              : (sending ? "Sending..." : "Send message")
            }
          </button>
        </form>
      </div>
    </div>
  );
}
