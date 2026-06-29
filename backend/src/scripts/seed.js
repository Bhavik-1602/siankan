import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

const mockProducts = [
  {
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
    artisan_notes: "Takes 140 hours of artisanal handloom weaving in Benares. Features silver-dipped gold threads for an editorial sheen."
  },
  {
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
    artisan_notes: "Individually hand-stitched by our leading choli karigars. Features adjustable back tassel ties."
  },
  {
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
    artisan_notes: "Includes a matching bandhani dupatta and detailed mirror border work. Features a 10-meter flare for graceful garba spins."
  },
  {
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
    artisan_notes: "Designed for evening festive parties. Complemented with a structured inner corset."
  },
  {
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
    artisan_notes: "Features lightweight layers for easy movement during bridal celebrations."
  },
  {
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
    artisan_notes: "The organza fabric provides a beautiful structured drape. Takes 60 hours of direct embroidery work."
  },
  {
    name: "Gilded Peach Sweetheart Choli",
    description: "A premium sweetheart choli tailored in raw silk. Embroidered with dense gold wire zardosi along the neckline, it is perfect to pair with a matching pastel saree or lehenga skirt.",
    price: 32000.00,
    category: "festive",
    fabric: "Raw Silk",
    colors: ["Pastel Peach", "Ivory"],
    embroidery: "Zardosi",
    image_url: "/images/festive_choli.png",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    is_featured: false,
    artisan_notes: "Features our signature gold metal wire layout which has a classic antique-gold finish."
  },
  {
    name: "Royal Crimson Bridal Lehenga",
    description: "Luxurious bridal lehenga crafted with rich velvet and intricate zardosi embroidery.",
    price: 185000.00,
    category: "bridal",
    fabric: "Velvet",
    colors: ["Crimson Red", "Gold"],
    embroidery: "Zardosi",
    image_url: "https://images.unsplash.com/photo-1583391733981-849840b7c4f8?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1583391733981-849840b7c4f8?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
    artisan_notes: "Handcrafted by master artisans with over 180 hours of embroidery work."
  },
  {
    name: "Ivory Pearl Reception Gown",
    description: "Elegant reception gown with pearl embellishments and flowing silhouette.",
    price: 95000.00,
    category: "gown",
    fabric: "Net",
    colors: ["Ivory", "Pearl White"],
    embroidery: "Pearl Work",
    image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
    artisan_notes: "Features hand-sewn pearl detailing across bodice and sleeves."
  },
  {
    name: "Emerald Heritage Silk Saree",
    description: "Traditional silk saree with rich emerald tones and gold woven motifs.",
    price: 128000.00,
    category: "saree",
    fabric: "Kanjivaram Silk",
    colors: ["Emerald Green", "Gold"],
    embroidery: "Weaving",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    is_featured: false,
    artisan_notes: "Woven using authentic South Indian silk weaving techniques."
  },
  {
    name: "Rose Gold Cocktail Lehenga",
    description: "Contemporary lehenga with sequin and bead embellishments for cocktail events.",
    price: 67000.00,
    category: "cocktail",
    fabric: "Georgette",
    colors: ["Rose Gold", "Blush Pink"],
    embroidery: "Sequin Work",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
    artisan_notes: "Designed for lightweight comfort and elegant evening styling."
  },
  {
    name: "Midnight Blue Designer Gown",
    description: "Sophisticated designer gown with crystal embellishments and dramatic flair.",
    price: 89000.00,
    category: "gown",
    fabric: "Satin",
    colors: ["Midnight Blue", "Silver"],
    embroidery: "Crystal Work",
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    is_featured: false,
    artisan_notes: "Premium imported crystals hand-applied throughout the design."
  },
  {
    name: "Sunset Orange Bandhani Saree",
    description: "Traditional Bandhani saree showcasing vibrant craftsmanship from Gujarat.",
    price: 58000.00,
    category: "traditional",
    fabric: "Gajji Silk",
    colors: ["Sunset Orange", "Yellow"],
    embroidery: "Bandhani",
    image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
    artisan_notes: "Hand-tied and dyed using centuries-old Bandhani techniques."
  },
  {
    name: "Lavender Bloom Bridesmaid Lehenga",
    description: "Graceful bridesmaid lehenga featuring floral embroidery and soft pastel hues.",
    price: 76000.00,
    category: "bridesmaid",
    fabric: "Organza",
    colors: ["Lavender", "Silver"],
    embroidery: "Floral Thread Work",
    image_url: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80",
    is_featured: false,
    artisan_notes: "Perfect for destination weddings and luxury celebrations."
  },
  {
    name: "Golden Radiance Choli",
    description: "Statement choli featuring dense gold embroidery and mirror accents.",
    price: 42000.00,
    category: "festive",
    fabric: "Raw Silk",
    colors: ["Gold", "Champagne"],
    embroidery: "Mirror Work",
    image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
    artisan_notes: "Features handcrafted mirrors and detailed finishing."
  },
  {
    name: "Ruby Velvet Wedding Saree",
    description: "Royal wedding saree crafted in luxurious velvet with intricate detailing.",
    price: 155000.00,
    category: "bridal",
    fabric: "Velvet",
    colors: ["Ruby Red", "Gold"],
    embroidery: "Zardosi",
    image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
    artisan_notes: "Inspired by royal Indian wedding traditions."
  },
  {
    name: "Sky Blue Fusion Indo-Western Set",
    description: "Modern Indo-Western ensemble blending traditional embroidery with contemporary cuts.",
    price: 62000.00,
    category: "indo-western",
    fabric: "Crepe",
    colors: ["Sky Blue", "Silver"],
    embroidery: "Thread Work",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    zoom_image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    is_featured: false,
    artisan_notes: "Ideal for engagement ceremonies and festive gatherings."
  }
];

const seed = async () => {
  try {
    logger.info('Starting database seeding...');

    // 1️⃣ check products table
    const { count, error: countError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    if (count > 0) {
      logger.info(`Database already has ${count} products. Skipping seeding.`);
      process.exit(0);
    }

    // 2️⃣ fetch categories (IMPORTANT - inside try)
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('id, slug');

    if (error) throw error;

    // 3️⃣ build dynamic map
    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.slug] = c.id;
    });

    logger.info('Products table is empty. Preparing data...');

    // 4️⃣ transform products
    const fixedProducts = mockProducts.map((p) => {
      const { category, ...rest } = p;

      return {
        ...rest,

        category_id: categoryMap[category],

        slug: p.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")
      };
    });

    // 5️⃣ insert into DB
    const { error: insertError } = await supabaseAdmin
      .from('products')
      .insert(fixedProducts);

    if (insertError) throw insertError;

    logger.info('Successfully seeded products table!');
    process.exit(0);

  } catch (err) {
    logger.error(`Failed to seed database: ${err.message}`);
    process.exit(1);
  }
};

seed();