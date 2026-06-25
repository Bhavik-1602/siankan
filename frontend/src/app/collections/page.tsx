"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, RefreshCw, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../lib/mockData';

function CollectionsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [embroideries, setEmbroideries] = useState<string[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedEmbroideries, setSelectedEmbroideries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products', err);
      }
      setLoading(false);
    }

    async function loadMeta() {
      try {
        const res = await fetch('/api/meta');
        const meta = await res.json();
        setCategories(meta.categories || []);
        setFabrics(meta.fabrics || []);
        setEmbroideries(meta.embroideries || []);
      } catch (err) {
        console.error('Failed to load meta', err);
      }
    }

    loadMeta();
    loadProducts();
  }, []);

  // Sync category state from URL query parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleFabricToggle = (fabric: string) => {
    if (selectedFabrics.includes(fabric)) {
      setSelectedFabrics(selectedFabrics.filter(f => f !== fabric));
    } else {
      setSelectedFabrics([...selectedFabrics, fabric]);
    }
  };

  const handleEmbroideryToggle = (embroidery: string) => {
    if (selectedEmbroideries.includes(embroidery)) {
      setSelectedEmbroideries(selectedEmbroideries.filter(e => e !== embroidery));
    } else {
      setSelectedEmbroideries([...selectedEmbroideries, embroidery]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFabrics([]);
    setSelectedEmbroideries([]);
    setSortBy('default');
  };

  // Filter Logic
  const filtered = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.embroidery.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesFabric = selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);
    const matchesEmbroidery = selectedEmbroideries.length === 0 || selectedEmbroideries.includes(product.embroidery);

    return matchesSearch && matchesCategory && matchesFabric && matchesEmbroidery;
  });

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // Featured default
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          N&A Catalogue
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#4A0E17]">
          Explore Fashion Collections
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-1" />
        <p className="text-neutral-500 text-sm leading-relaxed">
          Filter through our pastel silks, navratri Garba drapes, and designer bridal cholis tailored by master karigars.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="bg-white border border-neutral-200/60 rounded-lg p-6 h-fit space-y-6 shadow-sm">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search silk, mirror..." 
              className="w-full bg-stone-50 border border-neutral-200 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-all text-neutral-800 placeholder:text-neutral-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="border-b border-stone-100 pb-5">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3.5">
              Garment Category
            </h4>
            <div className="flex flex-col space-y-2">
              <button
                key="all"
                onClick={() => setSelectedCategory('all')}
                className={`text-left text-xs tracking-wider uppercase py-1.5 transition-colors flex justify-between items-center ${
                  selectedCategory === 'all' ? 'text-[#4A0E17] font-semibold' : 'text-neutral-500 hover:text-[#4A0E17]'
                }`}
              >
                <span>All</span>
                {selectedCategory === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs tracking-wider uppercase py-1.5 transition-colors flex justify-between items-center ${
                    selectedCategory === cat ? 'text-[#4A0E17] font-semibold' : 'text-neutral-500 hover:text-[#4A0E17]'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Checkboxes */}
          <div className="border-b border-stone-100 pb-5">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3.5">
              Fabric Foundations
            </h4>
            <div className="flex flex-col space-y-2.5">
              {fabrics.map(fabric => (
                <label key={fabric} className="flex items-center space-x-2.5 text-xs text-neutral-600 cursor-pointer select-none hover:text-[#4A0E17]">
                  <input 
                    type="checkbox"
                    checked={selectedFabrics.includes(fabric)}
                    onChange={() => handleFabricToggle(fabric)}
                    className="rounded text-[#4A0E17] focus:ring-[#4A0E17] border-neutral-300 w-4 h-4 cursor-pointer"
                  />
                  <span>{fabric}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Embroidery Checkboxes */}
          <div className="border-b border-stone-100 pb-5">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3.5">
              Embroidery Type
            </h4>
            <div className="flex flex-col space-y-2.5">
              {embroideries.map(emb => (
                <label key={emb} className="flex items-center space-x-2.5 text-xs text-neutral-600 cursor-pointer select-none hover:text-[#4A0E17]">
                  <input 
                    type="checkbox"
                    checked={selectedEmbroideries.includes(emb)}
                    onChange={() => handleEmbroideryToggle(emb)}
                    className="rounded text-[#4A0E17] focus:ring-[#4A0E17] border-neutral-300 w-4 h-4 cursor-pointer"
                  />
                  <span>{emb}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-2 border border-[#4A0E17] text-[#4A0E17] text-xs font-bold tracking-widest uppercase py-3 rounded hover:bg-[#4A0E17] hover:text-white transition-all shadow-sm"
          >
            <RefreshCw size={14} /> Clear All Filters
          </button>
        </aside>

        {/* Product Grid section */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Action Header */}
          <div className="flex justify-between items-center bg-white border border-neutral-200/60 p-4 rounded-lg shadow-sm">
            <span className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">
              Showing {sorted.length} of {products.length} garments
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-neutral-200 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-[#D4AF37] text-neutral-700"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#4A0E17] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-neutral-400">Loading catalog items...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200/50 rounded-lg shadow-sm space-y-4">
              <SlidersHorizontal className="mx-auto text-[#4A0E17] opacity-60" size={48} />
              <h3 className="font-serif text-xl font-bold text-neutral-800">No Outfits Match</h3>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto">We couldn't find any items matching your selected category, fabric foundations, or handwork parameters.</p>
              <button onClick={handleResetFilters} className="bg-[#4A0E17] text-white text-xs font-bold tracking-widest uppercase py-3 px-6 rounded-sm hover:bg-[#721C28] transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map(product => (
                <div key={product.id} className="bg-white rounded-lg border border-neutral-200/50 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  
                  {/* Image container */}
                  <Link href={`/product/${product.id}`} className="relative pt-[125%] block overflow-hidden bg-stone-100">
                    {product.is_featured && (
                      <span className="absolute top-4 left-4 z-10 bg-[#4A0E17] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border border-[#D4AF37]/30">
                        Signature
                      </span>
                    )}
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow space-y-2.5">
                    <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest block">
                      {product.category} • {product.fabric}
                    </span>
                    <h3 className="font-serif text-base font-bold text-neutral-800 hover:text-[#4A0E17] transition-colors leading-snug">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                      <span className="font-sans font-bold text-neutral-800 text-xs sm:text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-stone-50 border border-stone-200/60 py-1 px-2.5 rounded-sm">
                        {product.embroidery}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </main>
        
      </div>
      
    </div>
  );
}

export default function Collections() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#4A0E17] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-neutral-400">Loading catalog page...</p>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
