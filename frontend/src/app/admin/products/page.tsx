"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadImage } from '@/lib/supabaseClient';

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Single formData state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    fabric: '',
    colorsInput: '',
    embroidery: '',
    image_url: '',
    zoom_image_url: '',
    stock: '10',
    is_featured: false,
    artisan_notes: ''
  });

  // Modal and Toast state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 4000);
  };

  // Supabase Upload state
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingZoom, setUploadingZoom] = useState(false);

  const handleImageUpload = async (file: File, type: 'main' | 'zoom') => {
    if (type === 'main') setUploadingMain(true);
    else setUploadingZoom(true);

    try {
      const res = await uploadImage(file);
      if (!res.success) {
        throw new Error(res.error || 'Failed to upload image to Supabase');
      }

      if (type === 'main') {
        setFormData(prev => ({
          ...prev,
          image_url: res.url || ''
        }));
        showToast('Main image uploaded successfully to Supabase Storage!');
      } else {
        setFormData(prev => ({
          ...prev,
          zoom_image_url: res.url || ''
        }));
        showToast('Detail image uploaded successfully to Supabase Storage!');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error uploading image', 'error');
    } finally {
      if (type === 'main') setUploadingMain(false);
      else setUploadingZoom(false);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't scroll if user is editing text fields
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (!listRef.current || isModalOpen) return;

      const delta = 80; // scroll amount in pixels
      if (e.key === "ArrowUp") {
        e.preventDefault();
        listRef.current.scrollTop -= delta;
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        listRef.current.scrollTop += delta;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isModalOpen]);

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
        if (cats?.length > 0) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id }));
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);

    const name = formData.name.trim();
    const slug = formData.slug.trim();
    const priceNum = parseFloat(formData.price);
    const discountPriceNum = formData.discount_price ? parseFloat(formData.discount_price) : null;
    const stockNum = parseInt(formData.stock, 10);
    const category_id = formData.category_id;
    const image_url = formData.image_url.trim();

    if (!name) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!slug) {
      showToast('Product slug is required', 'error');
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      showToast('Product price must be a valid non-negative number', 'error');
      return;
    }
    if (discountPriceNum !== null && (isNaN(discountPriceNum) || discountPriceNum < 0)) {
      showToast('Discount price must be a valid non-negative number', 'error');
      return;
    }
    if (!category_id) {
      showToast('Product category is required', 'error');
      return;
    }
    if (!image_url) {
      showToast('Product main image is required', 'error');
      return;
    }

    const colors = formData.colorsInput.split(',').map(c => c.trim()).filter(Boolean);

    const productPayload = {
      name,
      slug,
      description: formData.description.trim() || null,
      price: priceNum,
      discount_price: discountPriceNum,
      category_id,
      fabric: formData.fabric.trim() || null,
      colors,
      embroidery: formData.embroidery.trim() || null,
      image_url,
      zoom_image_url: formData.zoom_image_url.trim() || null,
      stock: isNaN(stockNum) ? 0 : stockNum,
      is_featured: formData.is_featured,
      artisan_notes: formData.artisan_notes.trim() || null
    };

    console.log("Final product payload:", productPayload);

    try {
      if (editingId) {
        const res = await updateProduct(editingId, productPayload as any);
        if (res?.success) { 
          setProducts(products.map(p => p.id === editingId ? res.product : p)); 
          resetForm(); 
          showToast('Product updated successfully!');
        } else {
          showToast((res as any)?.error || 'Failed to update product', 'error');
        }
      } else {
        const res = await createProduct(productPayload as any);
        if (res?.success) { 
          setProducts([res.product, ...products]); 
          resetForm(); 
          showToast('Product created successfully!');
        } else {
          setError((res as any)?.error || 'Failed to create product.');
          showToast((res as any)?.error || 'Failed to create product', 'error');
        }
      }
    } catch (err: any) { 
      setError(err.message || 'An error occurred.'); 
      showToast(err.message || 'An error occurred', 'error');
    }
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || '',
      slug: p.slug || '',
      description: p.description || '',
      price: p.price ? p.price.toString() : '',
      discount_price: p.discount_price ? p.discount_price.toString() : '',
      category_id: p.category_id || '',
      fabric: p.fabric || '',
      colorsInput: p.colors ? p.colors.join(', ') : '',
      embroidery: p.embroidery || '',
      image_url: p.image_url || '',
      zoom_image_url: p.zoom_image_url || '',
      stock: p.stock !== undefined ? p.stock.toString() : '0',
      is_featured: !!p.is_featured,
      artisan_notes: p.artisan_notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter(p => p.id !== id));
      showToast('Product deleted successfully!');
    } else {
      setError('Failed to delete product.');
      showToast('Failed to delete product', 'error');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      discount_price: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      fabric: '',
      colorsInput: '',
      embroidery: '',
      image_url: '',
      zoom_image_url: '',
      stock: '10',
      is_featured: false,
      artisan_notes: ''
    });
  };

  if (authLoading || loading) return <div className="admin-loading">Loading product catalog…</div>;

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'oklch(0.977 0.008 85)', border: '1px solid oklch(0.9 0.012 80)', borderRadius: '10px', fontSize: '13px', color: 'oklch(0.22 0.012 60)', outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'oklch(0.52 0.014 65)', marginBottom: '7px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', position: 'relative' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-h1">Product Management</h1>
          <p className="admin-subtitle">Manage your ethnic wear catalogue — create, edit, and organise listings.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="admin-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ background: 'oklch(0.95 0.05 30)', border: '1px solid oklch(0.85 0.1 30)', color: 'oklch(0.4 0.15 30)', padding: '14px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 550 }}>
          {error}
        </div>
      )}

      {/* Catalogue list - Full Width */}
      <section className="admin-panel w-full">
        <h3 className="admin-h2" style={{ marginBottom: '20px' }}>Storefront Catalogue <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'oklch(0.52 0.014 65)', marginLeft: '8px' }}>{products.length} products</span></h3>
        {products.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'oklch(0.52 0.014 65)' }}>No products found in the catalog.</p>
        ) : (
          <div ref={listRef} tabIndex={0} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '800px', overflowY: 'auto', outline: 'none' }} className="no-scrollbar">
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
                    <span style={{ background: 'oklch(0.945 0.01 82)', color: 'oklch(0.22 0.012 60)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {p.categories?.name || p.category_name || "Uncategorized"}
                    </span>
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

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'oklch(0.995 0.004 90)',
              border: '1px solid oklch(0.9 0.012 80)',
              borderRadius: '16px',
              boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="admin-h2" style={{ margin: 0 }}>{editingId ? 'Edit Product' : 'Create Product'}</h3>
              <button
                onClick={resetForm}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'oklch(0.52 0.014 65)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 'normal',
                  padding: '4px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lbl}>Name</label><input type="text" required value={formData.name} onChange={e => handleNameChange(e.target.value)} style={inp} placeholder="Crimson Kanjivaram Saree" /></div>
              <div><label style={lbl}>Description</label><textarea required value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Describe the product…" /></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label style={lbl}>Price (₹)</label><input type="number" required value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} style={inp} placeholder="12000" /></div>
                <div><label style={lbl}>Discount Price</label><input type="number" value={formData.discount_price} onChange={e => setFormData(prev => ({ ...prev, discount_price: e.target.value }))} style={inp} placeholder="Optional" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={lbl}>Category</label>
                  <select 
                    name="category_id" 
                    value={formData.category_id} 
                    onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))} 
                    style={{ ...inp, cursor: 'pointer' }}
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Stock Qty</label><input type="number" required min="0" value={formData.stock} onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))} style={inp} /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label style={lbl}>Fabric</label><input type="text" value={formData.fabric} onChange={e => setFormData(prev => ({ ...prev, fabric: e.target.value }))} style={inp} placeholder="Pure Katan Silk" /></div>
                <div><label style={lbl}>Embroidery</label><input type="text" value={formData.embroidery} onChange={e => setFormData(prev => ({ ...prev, embroidery: e.target.value }))} style={inp} placeholder="Zardosi Handwork" /></div>
              </div>

              <div><label style={lbl}>Colours (comma-separated)</label><input type="text" value={formData.colorsInput} onChange={e => setFormData(prev => ({ ...prev, colorsInput: e.target.value }))} style={inp} placeholder="Blush Pink, Mint Green" /></div>
              
              <div>
                <label style={lbl}>Main Image URL</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" required value={formData.image_url} onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="https://…" />
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'oklch(0.945 0.01 82)',
                    color: 'oklch(0.22 0.012 60)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid oklch(0.9 0.012 80)',
                    transition: 'all 0.15s',
                  }}>
                    {uploadingMain ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingMain}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'main');
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={lbl}>Zoom / Detail Image URL</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" value={formData.zoom_image_url} onChange={e => setFormData(prev => ({ ...prev, zoom_image_url: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="https://…" />
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'oklch(0.945 0.01 82)',
                    color: 'oklch(0.22 0.012 60)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid oklch(0.9 0.012 80)',
                    transition: 'all 0.15s',
                  }}>
                    {uploadingZoom ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingZoom}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'zoom');
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div><label style={lbl}>Artisan Story Notes</label><textarea value={formData.artisan_notes} onChange={e => setFormData(prev => ({ ...prev, artisan_notes: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Handcrafted over 14 days…" /></div>
              <div><label style={lbl}>URL Slug</label><input type="text" required value={formData.slug} onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} style={{ ...inp, background: 'oklch(0.945 0.01 82)', color: 'oklch(0.52 0.014 65)' }} placeholder="crimson-kanjivaram-saree" /></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                <input type="checkbox" id="isFeatured" checked={formData.is_featured} onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'oklch(0.59 0.155 42)', cursor: 'pointer' }} />
                <label htmlFor="isFeatured" style={{ fontSize: '12px', color: 'oklch(0.22 0.012 60)', cursor: 'pointer' }}>Pin / Feature on Homepage</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button type="submit" className="admin-btn-primary" style={{ flex: 1, padding: '11px' }}>{editingId ? 'Update Product' : 'Create Product'}</button>
                <button type="button" onClick={resetForm} className="admin-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: toast.type === 'success' ? 'oklch(0.58 0.09 160)' : 'oklch(0.55 0.2 27)',
            color: 'oklch(0.98 0.01 85)',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeInUp 0.3s ease-out forwards',
          }}
        >
          {toast.type === 'success' ? (
            <span style={{ fontSize: '16px' }}>✓</span>
          ) : (
            <span style={{ fontSize: '16px' }}>✕</span>
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              marginLeft: '8px',
              opacity: 0.8,
              fontSize: '14px',
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
