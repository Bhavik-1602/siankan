"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, RefreshCw, Eye } from 'lucide-react';
import { Product } from '@/lib/mockData';

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
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-gold-300 uppercase block">
          SIANKAN Catalogue
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-light text-neutral-800">
          Explore Fashion Collections
        </h1>
        <div className="w-10 h-[1.5px] bg-gold-300 mx-auto" />
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
          Filter through our pastel silks, navratri Garba drapes, and designer bridal cholis tailored by master karigars.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sidebar Filters */}
        <aside className="bg-white border border-neutral-200/50 rounded-sm p-6 h-fit space-y-6 shadow-sm">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            <input 
              type="text" 
              placeholder="Search silk, mirror..." 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-sm py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-maroon-600 transition-all text-neutral-800 placeholder:text-neutral-400 font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="border-b border-neutral-100 pb-5">
            <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest mb-4">
              Garment Category
            </h4>
            <div className="flex flex-col space-y-1">
              <button
                key="all"
                onClick={() => setSelectedCategory('all')}
                className={`text-left text-[11px] tracking-widest uppercase py-2 transition-colors flex justify-between items-center cursor-pointer ${
                  selectedCategory === 'all' ? 'text-maroon-600 font-bold' : 'text-neutral-500 hover:text-maroon-600'
                }`}
              >
                <span>All</span>
                {selectedCategory === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-gold-300" />}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-[11px] tracking-widest uppercase py-2 transition-colors flex justify-between items-center cursor-pointer ${
                    selectedCategory === cat ? 'text-maroon-600 font-bold' : 'text-neutral-500 hover:text-maroon-600'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-gold-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Checkboxes */}
          <div className="border-b border-neutral-100 pb-5">
            <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest mb-4">
              Fabric Foundations
            </h4>
            <div className="flex flex-col space-y-3">
              {fabrics.map(fabric => (
                <label key={fabric} className="flex items-center space-x-3 text-xs text-neutral-600 cursor-pointer select-none hover:text-maroon-600 transition-colors">
                  <input 
                    type="checkbox"
                    checked={selectedFabrics.includes(fabric)}
                    onChange={() => handleFabricToggle(fabric)}
                    className="rounded text-maroon-600 focus:ring-maroon-500 border-neutral-300 w-4 h-4 cursor-pointer accent-maroon-600"
                  />
                  <span>{fabric}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Embroidery Checkboxes */}
          <div className="border-b border-neutral-100 pb-5">
            <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest mb-4">
              Embroidery Type
            </h4>
            <div className="flex flex-col space-y-3">
              {embroideries.map(emb => (
                <label key={emb} className="flex items-center space-x-3 text-xs text-neutral-600 cursor-pointer select-none hover:text-maroon-600 transition-colors">
                  <input 
                    type="checkbox"
                    checked={selectedEmbroideries.includes(emb)}
                    onChange={() => handleEmbroideryToggle(emb)}
                    className="rounded text-maroon-600 focus:ring-maroon-500 border-neutral-300 w-4 h-4 cursor-pointer accent-maroon-600"
                  />
                  <span>{emb}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-2 border border-maroon-600 text-maroon-600 hover:bg-maroon-600 hover:text-white text-[10px] font-bold tracking-widest uppercase py-3 rounded-sm transition-all duration-300 shadow-sm cursor-pointer"
          >
            <RefreshCw size={12} /> Clear All Filters
          </button>
        </aside>

        {/* Product Grid section */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Action Header */}
          <div className="flex justify-between items-center bg-white border border-neutral-200/50 p-4 rounded-sm shadow-sm">
            <span className="text-[10px] text-neutral-500 font-bold tracking-wider uppercase">
              Showing {sorted.length} of {products.length} garments
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-sm py-1.5 px-3 text-xs focus:outline-none focus:border-maroon-600 text-neutral-700 font-sans cursor-pointer"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="w-8 h-8 border-4 border-neutral-200 border-t-maroon-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-neutral-400 tracking-wider">Loading catalog items...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200/50 rounded-sm shadow-sm space-y-5">
              <SlidersHorizontal className="mx-auto text-maroon-600 opacity-60" size={44} />
              <h3 className="font-editorial text-xl text-neutral-850">No Outfits Match</h3>
              <p className="text-neutral-550 text-xs max-w-sm mx-auto leading-relaxed">We couldn't find any items matching your selected category, fabric foundations, or handwork parameters.</p>
              <button onClick={handleResetFilters} className="bg-maroon-600 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 px-8 rounded-sm hover:bg-maroon-500 transition-colors cursor-pointer shadow-md">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map(product => (
                <div key={product.id} className="bg-white rounded-sm border border-neutral-200/40 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col group">
                  
                  {/* Image container */}
                  <Link href={`/product/${product.id}`} className="relative pt-[125%] block overflow-hidden bg-neutral-50 select-none">
                    {product.is_featured && (
                      <span className="absolute top-4 left-4 z-10 bg-[#4A0E17] text-white text-[8px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border border-gold-300/30">
                        Signature
                      </span>
                    )}
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay Quick View */}
                    <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-[2px] text-neutral-800 text-[10px] font-bold tracking-widest uppercase py-2.5 px-5 rounded-sm flex items-center gap-1.5 shadow-md">
                        <Eye size={12} /> View Details
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow space-y-3.5">
                    <span className="text-gold-400 text-[9px] font-bold uppercase tracking-wider block">
                      {product.category} • {product.fabric}
                    </span>
                    <h3 className="font-editorial text-base text-neutral-850 hover:text-maroon-600 transition-colors leading-snug">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-neutral-450 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                      <span className="font-sans font-bold text-neutral-800 text-xs tracking-wider">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-semibold text-neutral-500 bg-neutral-50 border border-neutral-200/50 py-1 px-2.5 rounded-sm">
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
      <div className="text-center py-32">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-maroon-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-neutral-400 tracking-wider">Loading catalog page...</p>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
