"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Successful login - route dynamically
        const currentUser = res.error ? null : user; 
        // AppContext updates user state, which triggers useEffect redirect
      } else {
        setError(res.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(212,175,55,0.05)]">
        <div className="text-center mb-8">
          <span className="font-serif text-[#D4AF37] uppercase tracking-widest text-xs font-semibold">Welcome Back</span>
          <h1 className="font-serif text-3xl text-[#4A0E17] mt-2 font-medium">Customer Login</h1>
          <p className="text-gray-500 text-sm mt-1">Access your premium wardrobe & order history</p>
        </div>

        {error && (
          <div className="bg-[#4A0E17]/5 border border-[#4A0E17]/25 text-[#4A0E17] text-xs px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#D4AF37] hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-[#F5E6D3] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-gray-800 text-sm transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium text-sm tracking-wider uppercase rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          New to N&A Art of Design?{' '}
          <Link href="/register" className="text-[#D4AF37] hover:underline font-semibold">Create an account</Link>
        </div>
      </div>
    </main>
  );
}
