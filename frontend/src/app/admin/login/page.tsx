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
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Admin Login
        </h1>

        {error && (
          <div className="mb-5 rounded bg-red-100 border border-red-300 p-3 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Admin Email"
            className="w-full border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-[#4A0E17] text-white p-3 rounded-lg"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        <div className="text-center mt-5">
          <Link href="/login">
            Customer Login
          </Link>
        </div>

      </div>
    </main>
  );
}