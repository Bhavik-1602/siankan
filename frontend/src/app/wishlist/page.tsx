"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWishlist, removeFromWishlist } from '@/lib/supabaseClient';

export default function WishlistPage() {
  const { user, addToCart, loading: authLoading } = useApp();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getWishlist(user.id).then(data => {
        setWishlistItems(data || []);
        setLoading(false);
      });
    }
  }, [user]);

  const handleRemove = async (productId: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
    }
  };

  const handleMoveToCart = (item: any) => {
    // Add to cart with default customizations
    addToCart(item.products, 1, null, item.products.colors?.[0]);
    // Remove from wishlist
    handleRemove(item.product_id);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 flex items-center justify-center font-sans text-gray-500 text-sm">
        Loading saved wishlist items...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 max-w-6xl mx-auto font-sans">
      <div className="text-center mb-10">
        <span className="font-serif text-[#D4AF37] uppercase tracking-widest text-xs font-semibold">Your Curated Collection</span>
        <h1 className="font-serif text-3xl text-[#4A0E17] font-medium mt-2 font-medium">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#F5E6D3] rounded-xl max-w-md mx-auto shadow-sm">
          <span className="text-4xl">❤️</span>
          <h3 className="font-serif text-lg text-[#4A0E17] font-medium mt-4">Wishlist is empty</h3>
          <p className="text-gray-400 text-xs mt-2 px-6">Explore the collections catalog and save your premium pieces.</p>
          <div className="mt-6">
            <Link href="/collections" className="px-6 py-2.5 bg-[#4A0E17] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md hover:bg-[#5C1620] transition-all">
              Browse Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white border border-[#F5E6D3] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div className="relative group">
                <img
                  src={item.products.image_url}
                  alt={item.products.name}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-red-500 text-sm hover:bg-white transition-all"
                  title="Remove from Wishlist"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.products.category}</span>
                  <h4 className="font-serif text-md text-[#4A0E17] font-medium mt-1 mb-2">{item.products.name}</h4>
                  <span className="font-serif text-[#4A0E17] font-bold">₹{item.products.price.toLocaleString()}</span>
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2 bg-[#4A0E17] hover:bg-[#5C1620] text-white text-xs font-semibold uppercase tracking-wider rounded transition-all"
                  >
                    Add To Cart
                  </button>
                  <Link
                    href={`/product/${item.product_id}`}
                    className="block text-center w-full py-2 border border-[#F5E6D3] hover:bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider rounded transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
