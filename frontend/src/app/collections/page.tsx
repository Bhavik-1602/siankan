"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/mockData';

type Category = {
  id: string;
  name: string;
  slug: string;
};

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<"featured" | "asc" | "desc">("featured");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch products
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData || []);
        }

        // Fetch categories
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData || []);
        }
      } catch (err) {
        console.error('Failed to load products or categories', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Sync category state from URL query parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategorySlug(cat);
    } else {
      setSelectedCategorySlug('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    // Update URL query parameters
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/collections?${params.toString()}`);
  };

  // Helper: map category_id to Category slug
  const getProductCategorySlug = (product: any): string => {
    if (!product.category_id) return '';
    const cat = categories.find(c => c.id === product.category_id);
    return cat ? cat.slug : '';
  };

  const getProductCategoryName = (product: any): string => {
    if (!product.category_id) return 'Signature Piece';
    const cat = categories.find(c => c.id === product.category_id);
    return cat ? cat.name : 'Signature Piece';
  };

  // Filter Logic
  const filtered = products
    .filter(p => {
      if (selectedCategorySlug === 'all') return true;
      const slug = getProductCategorySlug(p);
      return slug === selectedCategorySlug;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'asc') return a.price - b.price;
      if (sortBy === 'desc') return b.price - a.price;
      // Default / Featured
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  const formatPrice = (n: number) => {
    return "₹" + n.toLocaleString("en-IN");
  };

  const mainCategories = [
    { name: "All", slug: "all" },
    { name: "Lehenga", slug: "lehenga" },
    { name: "Gown", slug: "gown" },
    { name: "Kurti Set", slug: "kurti-set" },
    { name: "Anarkali", slug: "anarkali" },
    { name: "Saree", slug: "saree" },
    { name: "Pastel Wear", slug: "pastel" },
    { name: "Festive Wear", slug: "festive" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 bg-[#FAF8F5]">
      
      {/* Title */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">The Collection</p>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-neutral-800 tracking-wide">Shop All</h1>
        <p className="mx-auto mt-4 max-w-xl text-xs font-light leading-relaxed text-neutral-400 uppercase tracking-widest">
          {loading ? "Loading..." : `${filtered.length} pieces · hand-crafted, made to order in 10–14 days.`}
        </p>
      </div>

      {/* Filter and Sort Headers */}
      <div className="mb-10 flex flex-col items-center justify-between gap-4 border-y border-neutral-200/50 py-4 md:flex-row">
        <div className="flex flex-wrap justify-center gap-1.5">
          {mainCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => handleCategoryChange(c.slug)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors rounded-sm ${
                selectedCategorySlug === c.slug 
                  ? "bg-neutral-950 text-[#FAF8F5] shadow-md" 
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "featured" | "asc" | "desc")}
          className="border border-neutral-300 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] outline-none rounded-sm text-neutral-700 hover:border-neutral-400 transition-colors"
        >
          <option value="featured">Sort: Featured</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-32">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-maroon-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-neutral-400 tracking-wider">Loading Siankan catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-sm text-neutral-500 uppercase tracking-widest">No products found in this category.</p>
          <button 
            onClick={() => handleCategoryChange('all')}
            className="mt-6 border border-neutral-800 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors hover:bg-neutral-800 hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p: any) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm">
                <img 
                  src={p.image_url} 
                  alt={p.name} 
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" 
                />
                {p.is_featured && (
                  <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-850 rounded-xs shadow-sm">
                    New
                  </span>
                )}
              </div>
              
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-maroon-600">
                    {getProductCategoryName(p)}
                  </p>
                  <h3 className="mt-1 font-editorial text-lg font-light leading-snug tracking-wide text-neutral-800">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-medium tracking-wide text-neutral-400 uppercase">
                    {p.colors ? p.colors.join(" & ") : "Custom Color"} · {p.fabric || "Premium Base"}
                  </p>
                </div>
                <p className="whitespace-nowrap text-xs font-bold text-neutral-900 tracking-wide mt-1">
                  {formatPrice(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Collections() {
  return (
    <Suspense fallback={
      <div className="text-center py-32 bg-[#FAF8F5]">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-maroon-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-neutral-400 tracking-wider">Loading catalog page...</p>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
