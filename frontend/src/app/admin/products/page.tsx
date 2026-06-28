"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '@/lib/supabaseClient';

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push('/admin/login'); return; }
      const isAdmin = user.role === 'admin' || user.email?.startsWith('admin@') || user.user_metadata?.role === 'admin';
      if (!isAdmin) router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([getProducts(), getCategories(true)]).then(([prods, cats]) => {
        setProducts(prods || []); setCategories(cats || []);
        if (cats?.length > 0) setCategory(cats[0].name);
        setLoading(false);
      });
    }
  }, [user]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const colors = colorsInput.split(',').map(c => c.trim()).filter(Boolean);
    const payload = { name, description, price: parseFloat(price), discount_price: discountPrice ? parseFloat(discountPrice) : null, category, fabric, colors, embroidery, image_url: imageUrl, zoom_image_url: zoomImageUrl || null, stock: parseInt(stock), is_featured: isFeatured, artisan_notes: artisanNotes || null, slug };
    try {
      if (editingId) {
        const res = await updateProduct(editingId, payload as any);
        if (res?.success) { setProducts(products.map(p => p.id === editingId ? res.product : p)); resetForm(); }
      } else {
        const res = await createProduct(payload as any);
        if (res?.success) { setProducts([res.product, ...products]); resetForm(); }
        else setError('Failed to create product.');
      }
    } catch (err: any) { setError(err.message || 'An error occurred.'); }
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id); setName(p.name); setSlug(p.slug || ''); setDescription(p.description || '');
    setPrice(p.price.toString()); setDiscountPrice(p.discount_price ? p.discount_price.toString() : '');
    setCategory(p.category); setFabric(p.fabric || ''); setColorsInput(p.colors ? p.colors.join(', ') : '');
    setEmbroidery(p.embroidery || ''); setImageUrl(p.image_url); setZoomImageUrl(p.zoom_image_url || '');
    setStock((p.stock || 0).toString()); setIsFeatured(!!p.is_featured); setArtisanNotes(p.artisan_notes || '');
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await deleteProduct(id);
    if (res.success) setProducts(products.filter(p => p.id !== id));
    else setError('Failed to delete product.');
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setDescription(''); setPrice(''); setDiscountPrice('');
    if (categories.length > 0) setCategory(categories[0].name);
    setFabric(''); setColorsInput(''); setEmbroidery(''); setImageUrl(''); setZoomImageUrl('');
    setStock('10'); setIsFeatured(false); setArtisanNotes(''); setSlug('');
  };

  if (authLoading || loading) return <div className="admin-loading">Loading product catalog…</div>;

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'oklch(0.977 0.008 85)', border: '1px solid oklch(0.9 0.012 80)', borderRadius: '10px', fontSize: '13px', color: 'oklch(0.22 0.012 60)', outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'oklch(0.52 0.014 65)', marginBottom: '7px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px' }}>
      <div>
        <h1 className="admin-h1">Product Management</h1>
        <p className="admin-subtitle">Manage your ethnic wear catalogue — create, edit, and organise listings.</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <section className="admin-panel">
          <h3 className="admin-h2" style={{ marginBottom: '20px' }}>{editingId ? 'Edit Product' : 'Create Product'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div><label style={lbl}>Name</label><input type="text" required value={name} onChange={e => handleNameChange(e.target.value)} style={inp} placeholder="Crimson Kanjivaram Saree" /></div>
            <div><label style={lbl}>Description</label><textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Describe the product…" /></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>Price (₹)</label><input type="number" required value={price} onChange={e => setPrice(e.target.value)} style={inp} placeholder="12000" /></div>
              <div><label style={lbl}>Discount Price</label><input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} style={inp} placeholder="Optional" /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Stock Qty</label><input type="number" required min="0" value={stock} onChange={e => setStock(e.target.value)} style={inp} /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>Fabric</label><input type="text" value={fabric} onChange={e => setFabric(e.target.value)} style={inp} placeholder="Pure Katan Silk" /></div>
              <div><label style={lbl}>Embroidery</label><input type="text" value={embroidery} onChange={e => setEmbroidery(e.target.value)} style={inp} placeholder="Zardosi Handwork" /></div>
            </div>

            <div><label style={lbl}>Colours (comma-separated)</label><input type="text" value={colorsInput} onChange={e => setColorsInput(e.target.value)} style={inp} placeholder="Blush Pink, Mint Green" /></div>
            <div><label style={lbl}>Main Image URL</label><input type="text" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inp} placeholder="https://…" /></div>
            <div><label style={lbl}>Zoom / Detail Image URL</label><input type="text" value={zoomImageUrl} onChange={e => setZoomImageUrl(e.target.value)} style={inp} placeholder="https://…" /></div>
            <div><label style={lbl}>Artisan Story Notes</label><textarea value={artisanNotes} onChange={e => setArtisanNotes(e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Handcrafted over 14 days…" /></div>
            <div><label style={lbl}>URL Slug</label><input type="text" required value={slug} onChange={e => setSlug(e.target.value)} style={{ ...inp, background: 'oklch(0.945 0.01 82)', color: 'oklch(0.52 0.014 65)' }} placeholder="crimson-kanjivaram-saree" /></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'oklch(0.59 0.155 42)', cursor: 'pointer' }} />
              <label htmlFor="isFeatured" style={{ fontSize: '12px', color: 'oklch(0.22 0.012 60)', cursor: 'pointer' }}>Pin / Feature on Homepage</label>
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button type="submit" className="admin-btn-primary" style={{ flex: 1, padding: '11px' }}>{editingId ? 'Update Product' : 'Create Product'}</button>
              {editingId && <button type="button" onClick={resetForm} className="admin-btn-ghost">Cancel</button>}
            </div>
          </form>
        </section>

        {/* Catalogue list */}
        <section className="admin-panel">
          <h3 className="admin-h2" style={{ marginBottom: '20px' }}>Storefront Catalogue <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'oklch(0.52 0.014 65)', marginLeft: '8px' }}>{products.length} products</span></h3>
          {products.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'oklch(0.52 0.014 65)' }}>No products found in the catalog.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '800px', overflowY: 'auto' }} className="no-scrollbar">
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px', borderRadius: '12px', border: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.977 0.008 85)', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px oklch(0.22 0.012 60 / 0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  <img src={p.image_url} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid oklch(0.9 0.012 80)', background: 'oklch(0.995 0.004 90)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'oklch(0.22 0.012 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.name}</h4>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'oklch(0.59 0.155 42)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                        {p.discount_price && <p style={{ fontSize: '10px', color: 'oklch(0.52 0.014 65)', textDecoration: 'line-through' }}>₹{p.discount_price.toLocaleString('en-IN')}</p>}
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'oklch(0.52 0.014 65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '3px' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <span style={{ background: 'oklch(0.945 0.01 82)', color: 'oklch(0.22 0.012 60)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.category}</span>
                      <span style={{ fontSize: '10px', color: p.stock === 0 ? 'oklch(0.55 0.2 27)' : 'oklch(0.52 0.014 65)', fontWeight: 600 }}>Stock: {p.stock || 0}</span>
                      {p.is_featured && <span style={{ fontSize: '10px', color: 'oklch(0.72 0.14 75)', fontWeight: 700 }}>★ Featured</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => handleEditClick(p)} style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.59 0.155 42)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteClick(p.id)} style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.55 0.2 27)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
