"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signIn, signUp, signOut, createInquiry, isUsingMock, supabase } from './supabaseClient';
import { Product } from './mockData';

export interface CartItem {
  product: Product;
  quantity: number;
  customizations: {
    bust?: string;
    waist?: string;
    height?: string;
    neckline?: string;
    notes?: string;
  } | null;
  selectedColor?: string;
}

interface AppContextType {
  cart: CartItem[];
  user: any;
  loading: boolean;
  addToCart: (product: Product, quantity: number, customizations: any, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, customizations: any, quantity: number) => void;
  removeFromCart: (productId: string, customizations: any) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  submitInquiry: (inquiryData: any) => Promise<{ success: boolean; inquiryId?: string; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load cart & session on startup
  useEffect(() => {
    // 1. Cart initialization
    const storedCart = localStorage.getItem('na_next_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse local cart storage:", e);
      }
    }

    // 2. Auth initialization
    async function initAuth() {
      setLoading(true);
      if (!isUsingMock && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        const mockUser = getCurrentUser();
        setUser(mockUser);
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('na_next_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number, customizations: any, selectedColor?: string) => {
    const newCart = [...cart];
    
    // Find index matching product AND exact customizations
    const index = newCart.findIndex(item => {
      const idMatches = item.product.id === product.id;
      if (!idMatches) return false;

      // Color check
      const colorMatches = item.selectedColor === selectedColor;
      if (!colorMatches) return false;

      // Customization check
      if (item.customizations && customizations) {
        return JSON.stringify(item.customizations) === JSON.stringify(customizations);
      }
      return !item.customizations && !customizations;
    });

    if (index > -1) {
      newCart[index].quantity += quantity;
    } else {
      newCart.push({ product, quantity, customizations, selectedColor });
    }

    saveCart(newCart);
  };

  const updateCartQuantity = (productId: string, customizations: any, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, customizations);
      return;
    }

    const newCart = cart.map(item => {
      const idMatches = item.product.id === productId;
      let custMatches = false;

      if (item.customizations && customizations) {
        custMatches = JSON.stringify(item.customizations) === JSON.stringify(customizations);
      } else {
        custMatches = !item.customizations && !customizations;
      }

      if (idMatches && custMatches) {
        return { ...item, quantity };
      }
      return item;
    });

    saveCart(newCart);
  };

  const removeFromCart = (productId: string, customizations: any) => {
    const newCart = cart.filter(item => {
      const idMatches = item.product.id === productId;
      let custMatches = false;

      if (item.customizations && customizations) {
        custMatches = JSON.stringify(item.customizations) === JSON.stringify(customizations);
      } else {
        custMatches = !item.customizations && !customizations;
      }

      return !(idMatches && custMatches);
    });

    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) {
      return { success: false, error: error.message };
    }
    setUser(data.user);
    return { success: true };
  };

  const register = async (email: string, password: string, fullName: string) => {
    const { data, error } = await signUp(email, password, fullName);
    if (error) {
      return { success: false, error: error.message };
    }
    setUser(data.user);
    return { success: true };
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const submitInquiry = async (inquiryData: any) => {
    const res = await createInquiry({
      ...inquiryData,
      user_id: user?.id || null
    });
    if (res.success) {
      return { success: true, inquiryId: res.inquiryId };
    }
    return { success: false, error: "Failed to record inquiry in database." };
  };

  return (
    <AppContext.Provider value={{
      cart,
      user,
      loading,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      login,
      register,
      logout,
      submitInquiry
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
}
