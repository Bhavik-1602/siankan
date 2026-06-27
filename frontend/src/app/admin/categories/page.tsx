"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabaseClient';

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useApp();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      getCategories(false).then(data => {
        setCategories(data || []);
        setLoading(false);
      });
    }
  }, [user]);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto generate slug
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        // Update
        const res = await updateCategory(editingId, { name, slug, active });
        if (res && res.id) {
          setCategories(categories.map(c => c.id === editingId ? res : c));
          resetForm();
        } else {
          setError('Failed to update category.');
        }
      } else {
        // Create
        const res = await createCategory({ name, slug, active });
        if (res && res.id) {
          setCategories([...categories, res]);
          resetForm();
        } else {
          setError('Failed to create category.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    }
  };

  const handleEditClick = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setActive(cat.active);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const success = await deleteCategory(id);
      if (success) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        setError('Failed to delete category.');
      }
    }
  };

  const handleToggleActive = async (cat: any) => {
    try {
      const res = await updateCategory(cat.id, {
        name: cat.name,
        slug: cat.slug,
        active: !cat.active
      });
      if (res && res.id) {
        setCategories(categories.map(c => c.id === cat.id ? res : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setActive(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 flex items-center justify-center font-sans text-gray-500 text-sm">
        Retrieving store categories list...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-[#F5E6D3] pb-6">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-[#D4AF37] hover:underline font-semibold uppercase tracking-widest">← Back to Dashboard</Link>
          <h1 className="font-serif text-3xl text-[#4A0E17] font-medium mt-2">Category Management</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg mb-6 max-w-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-6 shadow-sm self-start">
          <h3 className="font-serif text-lg text-[#4A0E17] font-semibold mb-6">{editingId ? 'Edit Category' : 'Create Category'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#F5E6D3] rounded-lg focus:outline-none focus:border-[#D4AF37] text-gray-800 text-sm"
                placeholder="e.g. Pastel Collection"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Category Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-[#F5E6D3] rounded-lg focus:outline-none text-gray-500 text-sm"
                placeholder="pastel-collection"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="catActive"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded border-[#F5E6D3] text-[#4A0E17] focus:ring-[#D4AF37]"
              />
              <label htmlFor="catActive" className="text-xs text-gray-600 cursor-pointer">Active / Visible on Storefront</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium text-xs tracking-wider uppercase rounded-lg shadow-sm transition-all"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs tracking-wider uppercase rounded-lg transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Listing Grid */}
        <div className="md:col-span-2 bg-white/70 border border-[#F5E6D3] rounded-xl p-8 shadow-sm">
          <h3 className="font-serif text-xl text-[#4A0E17] font-medium mb-6">Couture Categories</h3>
          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No categories configured in the store catalog.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 font-bold">Name</th>
                    <th className="py-3 px-4 font-bold">Slug</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#FAF8F5]/50 transition-all">
                      <td className="py-4 px-4 font-semibold text-gray-800">{cat.name}</td>
                      <td className="py-4 px-4 text-xs font-mono">{cat.slug}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(cat)}
                          className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                            cat.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {cat.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right space-x-3">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="text-xs text-[#D4AF37] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
