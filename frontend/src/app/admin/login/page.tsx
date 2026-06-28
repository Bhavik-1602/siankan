"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const { login, user } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if logged in user is admin
  useEffect(() => {
    if (!user) return;

    const isAdmin = user.role === "admin" || user.email?.startsWith("admin@") || user.user_metadata?.role === "admin";
    if (isAdmin) {
      router.push("/admin/dashboard");
    } else {
      setError("Access denied: User is not authorized as administrator.");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);

      if (!res.success) {
        setError(res.error || "Authentication failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-admin-bg flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-admin-card border border-admin-border rounded-2xl p-8 shadow-sm">

        <div className="text-center mb-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-admin-primary text-white shadow-sm font-semibold mx-auto mb-4 text-lg">
            N&A
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-admin-fg">
            Admin Console
          </h1>
          <p className="text-xs text-admin-muted-fg mt-1.5">Sign in to manage inventory and boutique operations</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-admin-muted-fg font-semibold mb-2">Email Address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary text-admin-fg text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-admin-muted-fg font-semibold mb-2">Console Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary text-admin-fg text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-admin-primary hover:bg-[#833124] text-white font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-sm transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Access Console"}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-admin-border">
          <Link href="/login" className="text-xs text-admin-primary hover:underline font-semibold">
            ← Go to Customer Login
          </Link>
        </div>

      </div>
    </main>
  );
}