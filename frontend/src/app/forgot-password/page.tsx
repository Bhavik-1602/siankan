"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending reset link (handled backend-side or in Supabase auth)
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="text-center mb-8">
          <span className="font-serif text-[#D4AF37] uppercase tracking-widest text-xs font-semibold">Security Portal</span>
          <h1 className="font-serif text-3xl text-[#4A0E17] mt-2 font-medium">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">We will send instructions to verify your identity</p>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#FAF8F5] border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37] text-2xl font-serif">
              ✓
            </div>
            <h2 className="font-serif text-xl text-[#4A0E17] font-medium">Check Your Inbox</h2>
            <p className="text-gray-500 text-sm mt-2 px-4">
              We have sent a password reset link to <strong>{email}</strong>.
            </p>
            <div className="mt-8">
              <Link href="/login" className="px-6 py-3 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium text-xs tracking-wider uppercase rounded-lg shadow-md transition-all">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-[#F5E6D3] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-gray-800 text-sm transition-all duration-200"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium text-sm tracking-wider uppercase rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>

            <div className="text-center text-xs">
              <Link href="/login" className="text-[#D4AF37] hover:underline font-semibold">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
