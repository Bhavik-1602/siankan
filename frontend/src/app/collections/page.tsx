"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';

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
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/collections?${params.toString()}`);
  };

  const getProductCategorySlug = (product: any): string => {
    if (!product.category_id) return '';
    const cat = categories.find(c => c.id === product.category_id);
    return cat ? cat.slug : '';
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
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  const mainCategories = [
    { name: "All Collections", slug: "all" },
    { name: "Lehengas", slug: "lehenga" },
    { name: "Signature Gowns", slug: "gown" },
    { name: "Kurti Sets", slug: "kurti-set" },
    { name: "Anarkalis", slug: "anarkali" },
    { name: "Sarees", slug: "saree" },
    { name: "Pastel Wear", slug: "pastel" },
    { name: "Festive Wear", slug: "festive" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 bg-[#FAF8F5] sm:px-8">
      
      {/* Title */}
      <div className="mb-16 text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-terracotta block">The Catalogue</span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-stone-850 tracking-wide">Shop All</h1>
        <div className="w-12 h-[1px] bg-brand-gold mx-auto" />
        <p className="mx-auto max-w-xl text-[9px] font-bold leading-relaxed text-stone-400 uppercase tracking-widest pt-2">
          {loading ? "Syncing atelier archive..." : `${filtered.length} pieces · hand-crafted, made to order in 10–14 days.`}
        </p>
      </div>

      {/* Filter and Sort Headers */}
      <div className="mb-14 flex flex-col items-center justify-between gap-6 border-y border-[#f5e6d3]/30 py-6 md:flex-row">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {mainCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => handleCategoryChange(c.slug)}
              className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-colors relative py-1.5 cursor-pointer ${
                selectedCategorySlug === c.slug 
                  ? "text-brand-terracotta" 
                  : "text-stone-400 hover:text-stone-800"
              }`}
            >
              {c.name}
              {selectedCategorySlug === c.slug && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-terracotta" />
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={13} className="text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "asc" | "desc")}
            className="border-b border-stone-300 bg-transparent py-1 pr-4 text-[10px] font-bold uppercase tracking-[0.2em] outline-none text-stone-750 hover:border-brand-terracotta transition-colors cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        // Staggered Skeleton Shimmer Panel Grid
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] w-full shimmer-panel rounded-xs" />
              <div className="space-y-2">
                <div className="h-2 w-16 shimmer-panel rounded-xs" />
                <div className="h-4 w-3/4 shimmer-panel rounded-xs" />
                <div className="h-3 w-1/4 shimmer-panel rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-[#f5e6d3]/30 rounded-xs bg-white/40">
          <p className="text-sm text-stone-500 uppercase tracking-widest">No products found in this collection.</p>
          <button 
            onClick={() => handleCategoryChange('all')}
            className="mt-6 border border-stone-850 px-8 py-3.5 text-[9px] font-bold uppercase tracking-[0.25em] transition-all hover:bg-[#171717] hover:text-white cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Collections() {
  return (
    <Suspense fallback={
      <div className="text-center py-40 bg-[#FAF8F5]">
        <div className="w-8 h-8 border border-stone-300 border-t-brand-terracotta rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-400 tracking-widest uppercase">Syncing Collections...</p>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
