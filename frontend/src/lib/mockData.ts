/**
 * Type Definitions for N&A Art of Design
 * Matches Supabase database schema
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'pastel' | 'festive' | 'garba' | 'indo-western' | 'bridesmaid';
  fabric: string;
  colors: string[];
  embroidery: string;
  image_url: string;
  zoom_image_url?: string | null;
  is_featured: boolean;
  artisan_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export type ProductCategory = 'pastel' | 'festive' | 'garba' | 'indo-western' | 'bridesmaid';

/**
 * DEPRECATED: Use getProducts() from lib/products.service.ts instead
 * These are kept for backward compatibility only
 */
export const mockProducts: Product[] = [
  {
    id: "na-pastel-silk-saree",
    name: "Blush & Sage Banarasi Silk Saree",
    description: "An elegant, pastel-themed Banarasi saree handwoven in premium raw silk. Features delicate sage green border motifs and a soft blush pink body designed to reflect luxury sophistication.",
    price: 115000.00,
    category: "pastel",
    fabric: "Raw Silk",
    colors: ["Blush Pink", "Sage Green", "Cream"],
    embroidery: "Zardosi",
    image_url: "/images/pastel_saree.png",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: true,
    artisan_notes: "Takes 140 hours of artisanal handloom weaving in Benares. Features silver-dipped gold threads for an editorial sheen.",
    created_at: new Date().toISOString()
  },
  {
    id: "na-festive-lilac-choli",
    name: "Aria Lilac Beadwork Choli Blouse",
    description: "A designer choli blouse tailored in soft lilac silk. Embellished with heavy handwork, including French knots, glass beads, and subtle zardosi wiring along the plunging sweetheart neckline.",
    price: 38000.00,
    category: "festive",
    fabric: "Mulberry Silk",
    colors: ["Pastel Lilac", "Champagne Gold"],
    embroidery: "Aari",
    image_url: "/images/festive_choli.png",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: true,
    artisan_notes: "Individually hand-stitched by our leading choli karigars. Features adjustable back tassel ties.",
    created_at: new Date().toISOString()
  },
  {
    id: "na-garba-mirror-lehenga",
    name: "Navratri Heritage Mirror Chaniya Choli",
    description: "Celebrate Navratri in royal grace. This Garba collection outfit features heavy real glass mirror work (sheesha) and colorful silk threads stitched on a soft cotton-silk foundation.",
    price: 78000.00,
    category: "garba",
    fabric: "Cotton Silk",
    colors: ["Marigold Orange", "Fuschia Pink", "Royal Blue"],
    embroidery: "Mirror Work",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: true,
    artisan_notes: "Includes a matching bandhani dupatta and detailed mirror border work. Features a 10-meter flare for graceful garba spins.",
    created_at: new Date().toISOString()
  },
  {
    id: "na-indowestern-peach-gown",
    name: "Serenade Pastel Peach Indo-Western Gown",
    description: "A contemporary drape gown merging traditional handwork details with modern cuts. Features a pre-draped georgette dupatta and an asymmetric embroidered belt.",
    price: 52000.00,
    category: "indo-western",
    fabric: "Georgette",
    colors: ["Pastel Peach", "Rose Gold"],
    embroidery: "Gota Patti",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: false,
    artisan_notes: "Designed for evening festive parties. Complemented with a structured inner corset.",
    created_at: new Date().toISOString()
  },
  {
    id: "na-bridesmaid-gold-lehenga",
    name: "Champagne Gold Bridesmaid Lehenga Set",
    description: "Drape your bridal party in luxury. This bridesmaid lehenga is tailored in premium champagne net, layered over cream silk, and embroidered with subtle silver gota patti ribbon work.",
    price: 145000.00,
    category: "bridesmaid",
    fabric: "Net & Silk",
    colors: ["Champagne Gold", "Ivory Cream"],
    embroidery: "Gota Patti",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: true,
    artisan_notes: "Features lightweight layers for easy movement during bridal celebrations.",
    created_at: new Date().toISOString()
  },
  {
    id: "na-pastel-mint-lehenga",
    name: "Mint Whispers Organza Lehenga",
    description: "A ethereal pastel lehenga crafted in mint sage organza. Features detailed floral aari stitching along the waistband and a matching light dupatta.",
    price: 88000.00,
    category: "pastel",
    fabric: "Organza",
    colors: ["Mint Sage", "Soft Lavender"],
    embroidery: "Aari",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: false,
    artisan_notes: "The organza fabric provides a beautiful structured drape. Takes 60 hours of direct embroidery work.",
    created_at: new Date().toISOString()
  },
  {
    id: "na-festive-pastel-choli",
    name: "Gilded Peach Sweetheart Choli",
    description: "A premium sweetheart choli tailored in raw silk. Embroidered with dense gold wire zardosi along the neckline, it is perfect to pair with a matching pastel saree or lehenga skirt.",
    price: 320000.00, // Matching bridal lehenga styling
    category: "festive",
    fabric: "Raw Silk",
    colors: ["Pastel Peach", "Ivory"],
    embroidery: "Zardosi",
    image_url: "/images/festive_choli.png",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: false,
    artisan_notes: "Features our signature gold metal wire layout which has a classic antique-gold finish.",
    created_at: new Date().toISOString()
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Collections" },
  { id: "pastel", name: "Pastel Collection" },
  { id: "festive", name: "Festive Wear" },
  { id: "garba", name: "Garba Collection" },
  { id: "indo-western", name: "Indo-Western" },
  { id: "bridesmaid", name: "Bridesmaid Wear" }
];

export const EMBROIDERIES = ["Zardosi", "Aari", "Mirror Work", "Gota Patti"];
export const FABRICS = ["Raw Silk", "Mulberry Silk", "Cotton Silk", "Georgette", "Net & Silk", "Organza"];
