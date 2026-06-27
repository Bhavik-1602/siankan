-- PostgreSQL Schema v2 updates for N&A Art of Design (Supabase)

-- 1. Update Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'admin'));

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage categories" ON public.categories
    FOR ALL USING (true); -- Managed via admin clients / service role bypass

-- 3. Modify Products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 4. Create Product Images Table (for multiple images)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to product images" ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage product images" ON public.product_images
    FOR ALL USING (true);

-- 5. Create Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    size TEXT,
    color TEXT,
    stock INTEGER DEFAULT 0 NOT NULL,
    price_override NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to product variants" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage product variants" ON public.product_variants
    FOR ALL USING (true);

-- 6. Create Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own wishlist" ON public.wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to manage their own wishlist" ON public.wishlist
    FOR ALL USING (auth.uid() = user_id);

-- 7. Create Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    phone TEXT,
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to manage their own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- 8. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- 9. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC(10, 2) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active coupons" ON public.coupons
    FOR SELECT USING (active = true);

CREATE POLICY "Allow admin manage coupons" ON public.coupons
    FOR ALL USING (true);

-- 10. Create Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active banners" ON public.banners
    FOR SELECT USING (active = true);

CREATE POLICY "Allow admin manage banners" ON public.banners
    FOR ALL USING (true);

-- 11. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage settings" ON public.settings
    FOR ALL USING (true);
