/**
 * TypeScript Types for Supabase
 * types/index.ts
 * 
 * Updated Product interface to match Supabase schema
 */

/**
 * Product Category Union Type
 */
export type ProductCategory = 'pastel' | 'festive' | 'garba' | 'indo-western' | 'bridesmaid';

/**
 * Product Interface
 * Matches the Supabase products table schema
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  fabric: string;
  colors: string[];
  embroidery: string;
  image_url: string;
  zoom_image_url?: string | null;
  is_featured: boolean;
  artisan_notes?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Category Interface for collections
 */
export interface Category {
  id: string;
  name: string;
}

/**
 * Product Filter Interface
 * Used for filtering on product listing pages
 */
export interface ProductFilters {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  fabric?: string;
  embroidery?: string;
  colors?: string[];
  searchQuery?: string;
}

/**
 * API Response Interface
 * Generic response wrapper for API endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Pagination Interface
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Pagination Response Interface
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
