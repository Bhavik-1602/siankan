"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '@/lib/supabaseClient';

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [fabric, setFabric] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [embroidery, setEmbroidery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [zoomImageUrl, setZoomImageUrl] = useState('');
  const [stock, setStock] = useState('10');
  const [isFeatured, setIsFeatured] = useState(false);
  const [artisanNotes, setArtisanNotes] = useState('');
  const [slug, setSlug] = useState('');

  // Verify Admin Session
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
      } else {
        const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
        if (!isAdmin) {
          router.push('/login');
        }
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        getProducts(),
        getCategories(true)
      ]).then(([prods, cats]) => {
        setProducts(prods || []);
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setCategory(cats[0].name);
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const colors = colorsInput.split(',').map(c => c.trim()).filter(c => c.length > 0);
    const payload = {
      name,
      description,
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      category,
      fabric,
      colors,
      embroidery,
      image_url: imageUrl,
      zoom_image_url: zoomImageUrl || null,
      stock: parseInt(stock),
      is_featured: isFeatured,
      artisan_notes: artisanNotes || null,
      slug
    };

    try {
      if (editingId) {
        const res = await updateProduct(editingId, payload as any);

        if (res && res.success) {
          setProducts(products.map(p => p.id === editingId ? res.product : p));
          resetForm();
        }
      } else {
        // Create product
        const res = await createProduct(payload as any);
        if (res && res.success) {
          setProducts([res.product, ...products]);
          resetForm();
        } else {
          setError('Failed to create product.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    }
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug || '');
    setDescription(p.description || '');
    setPrice(p.price.toString());
    setDiscountPrice(p.discount_price ? p.discount_price.toString() : '');
    setCategory(p.category);
    setFabric(p.fabric || '');
    setColorsInput(p.colors ? p.colors.join(', ') : '');
    setEmbroidery(p.embroidery || '');
    setImageUrl(p.image_url);
    setZoomImageUrl(p.zoom_image_url || '');
    setStock((p.stock || 0).toString());
    setIsFeatured(!!p.is_featured);
    setArtisanNotes(p.artisan_notes || '');
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        setError('Failed to delete product.');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    if (categories.length > 0) setCategory(categories[0].name);
    setFabric('');
    setColorsInput('');
    setEmbroidery('');
    setImageUrl('');
    setZoomImageUrl('');
    setStock('10');
    setIsFeatured(false);
    setArtisanNotes('');
    setSlug('');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 flex items-center justify-center font-sans text-gray-500 text-sm">
        Retrieving store product catalog...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-[#F5E6D3] pb-6">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-[#D4AF37] hover:underline font-semibold uppercase tracking-widest">← Back to Dashboard</Link>
          <h1 className="font-serif text-3xl text-[#4A0E17] font-medium mt-2 font-medium">Product Management</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-6 shadow-sm self-start">
          <h3 className="font-serif text-lg text-[#4A0E17] font-semibold mb-6">{editingId ? 'Edit Product' : 'Create Product'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Blush Silk Saree"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">SEO Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-[#F5E6D3] rounded text-gray-500 focus:outline-none"
                placeholder="blush-silk-saree"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Enter detailed description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block uppercase text-gray-500 font-semibold mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="115000"
                />
              </div>
              <div>
                <label className="block uppercase text-gray-500 font-semibold mb-1">Discount Price (₹)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block uppercase text-gray-500 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {categories.length === 0 && <option value="pastel">pastel</option>}
                </select>
              </div>
              <div>
                <label className="block uppercase text-gray-500 font-semibold mb-1">Fabric</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                  placeholder="Raw Silk"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Colors (Comma separated)</label>
              <input
                type="text"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                placeholder="Blush Pink, Sage Green"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Embroidery / Embellishment</label>
              <input
                type="text"
                value={embroidery}
                onChange={(e) => setEmbroidery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                placeholder="Zardosi"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Stock Level</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Image URL</label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Zoom Fabric Details URL (Optional)</label>
              <input
                type="text"
                value={zoomImageUrl}
                onChange={(e) => setZoomImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                placeholder="High-res details image URL"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-500 font-semibold mb-1">Artisan Story Notes</label>
              <textarea
                value={artisanNotes}
                onChange={(e) => setArtisanNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-gray-800 focus:outline-none"
                placeholder="Karigar names, weave hours..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="pFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[#F5E6D3] text-[#4A0E17] focus:ring-[#D4AF37]"
              />
              <label htmlFor="pFeatured" className="text-gray-600 cursor-pointer font-semibold uppercase">Feature on Homepage</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium tracking-wider uppercase rounded-lg shadow-sm transition-all"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 tracking-wider uppercase rounded-lg transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listing Panel */}
        <div className="lg:col-span-2 bg-white/70 border border-[#F5E6D3] rounded-xl p-8 shadow-sm">
          <h3 className="font-serif text-xl text-[#4A0E17] font-medium mb-6">Product Catalog</h3>
          {products.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No products found in catalog.</p>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {products.map((p) => (
                <div key={p.id} className="flex gap-4 p-4 rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-all items-center">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded border border-gray-150 bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{p.name}</h4>
                      <span className="text-xs font-serif text-[#4A0E17] font-bold">₹{p.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{p.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      <span>Cat: {p.category}</span>
                      <span>•</span>
                      <span>Stock: {p.stock || 0}</span>
                      {p.is_featured && (
                        <>
                          <span>•</span>
                          <span className="text-[#D4AF37]">Featured</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
