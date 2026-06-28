"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabaseClient';

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      getCategories(false).then(data => { setCategories(data || []); setLoading(false); });
    }
  }, [user]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      if (editingId) {
        const res = await updateCategory(editingId, { name, slug, active });
        if (res?.id) { setCategories(categories.map(c => c.id === editingId ? res : c)); resetForm(); }
        else setError('Failed to update category.');
      } else {
        const res = await createCategory({ name, slug, active });
        if (res?.id) { setCategories([...categories, res]); resetForm(); }
        else setError('Failed to create category.');
      }
    } catch (err: any) { setError(err.message || 'Error occurred.'); }
  };

  const handleToggleActive = async (cat: any) => {
    const res = await updateCategory(cat.id, { name: cat.name, slug: cat.slug, active: !cat.active });
    if (res?.id) setCategories(categories.map(c => c.id === cat.id ? res : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const ok = await deleteCategory(id);
    if (ok) setCategories(categories.filter(c => c.id !== id));
    else setError('Failed to delete category.');
  };

  const resetForm = () => { setEditingId(null); setName(''); setSlug(''); setActive(true); };

  if (authLoading || loading) return <div className="admin-loading">Loading categories…</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'oklch(0.977 0.008 85)',
    border: '1px solid oklch(0.9 0.012 80)',
    borderRadius: '10px', fontSize: '13px',
    color: 'oklch(0.22 0.012 60)', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px' }}>

      {/* Header */}
      <div>
        <h1 className="admin-h1">Category Management</h1>
        <p className="admin-subtitle">Manage couture collections, active categories, and URLs.</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <section className="admin-panel">
          <h3 className="admin-h2" style={{ marginBottom: '20px' }}>{editingId ? 'Edit Category' : 'Create Category'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="admin-label" style={{ display: 'block', marginBottom: '8px' }}>Category Name</label>
              <input type="text" required value={name} onChange={e => handleNameChange(e.target.value)} style={inputStyle} placeholder="e.g. Pastel Collection" />
            </div>
            <div>
              <label className="admin-label" style={{ display: 'block', marginBottom: '8px' }}>Slug</label>
              <input type="text" required value={slug} onChange={e => setSlug(e.target.value)} style={{ ...inputStyle, background: 'oklch(0.945 0.01 82)', color: 'oklch(0.52 0.014 65)' }} placeholder="pastel-collection" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              <input type="checkbox" id="catActive" checked={active} onChange={e => setActive(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'oklch(0.59 0.155 42)', cursor: 'pointer' }} />
              <label htmlFor="catActive" style={{ fontSize: '12px', color: 'oklch(0.22 0.012 60)', cursor: 'pointer' }}>Active / Visible on Storefront</label>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button type="submit" className="admin-btn-primary" style={{ flex: 1, padding: '11px' }}>{editingId ? 'Update' : 'Create'}</button>
              {editingId && <button type="button" onClick={resetForm} className="admin-btn-ghost">Cancel</button>}
            </div>
          </form>
        </section>

        {/* List */}
        <section className="admin-panel">
          <h3 className="admin-h2" style={{ marginBottom: '20px' }}>Couture Categories</h3>
          {categories.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'oklch(0.52 0.014 65)', padding: '16px 0' }}>No categories configured in the store catalog.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Slug</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td style={{ paddingLeft: 0, fontWeight: 600 }}>{cat.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{cat.slug}</td>
                      <td>
                        <button onClick={() => handleToggleActive(cat)}
                          className={`admin-badge ${cat.active ? 'admin-badge-success' : 'admin-badge-muted'}`}
                          style={{ cursor: 'pointer', border: 'none' }}>
                          {cat.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => { setEditingId(cat.id); setName(cat.name); setSlug(cat.slug); setActive(cat.active); }}
                          style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.59 0.155 42)', background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px' }}>Edit</button>
                        <button onClick={() => handleDelete(cat.id)}
                          style={{ fontSize: '12px', fontWeight: 600, color: 'oklch(0.55 0.2 27)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
