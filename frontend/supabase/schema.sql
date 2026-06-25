-- PostgreSQL Schema for N&A Art of Design (Supabase)

-- 1. Create Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profiles" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically insert a profile when a new user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Create Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL, -- 'pastel', 'festive', 'garba', 'indo-western', 'bridesmaid'
    fabric TEXT,            -- 'Silk', 'Velvet', 'Organza', 'Georgette', etc.
    colors TEXT[],          -- Array of available colors e.g. ['Blush Pink', 'Lilac']
    embroidery TEXT,        -- 'Zardosi', 'Aari', 'Mirror Work', 'Gota Patti', etc.
    image_url TEXT NOT NULL,
    zoom_image_url TEXT,    -- High-resolution image for fabric detail zooming
    is_featured BOOLEAN DEFAULT false,
    artisan_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to products" ON public.products
    FOR ALL USING (true); -- Custom control inside next.js auth flow


-- 3. Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL, -- 'Card', 'UPI', 'PayPal'
    status TEXT DEFAULT 'processing' NOT NULL CHECK (status IN ('processing', 'shipped', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert access for anyone (guest/user)" ON public.orders
    FOR INSERT WITH CHECK (true);


-- 4. Create Order Items Table
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    customization_notes TEXT, -- Stores custom measurements (Bust, Waist, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to read order items" ON public.order_items
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access for order items" ON public.order_items
    FOR INSERT WITH CHECK (true);


-- 5. Create Custom Inquiries Table (for consultation requests & custom outfit forms)
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL,         -- 'pastel', 'festive', 'garba', 'indo-western', 'bridesmaid', 'custom'
    inquiry_type TEXT NOT NULL,     -- 'consultation', 'custom-outfit', 'alteration'
    details TEXT,                   -- Design directions / Custom measurements details
    proposed_date DATE,             -- Suggested date for styling consultation / fitting
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own inquiries" ON public.inquiries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow public to insert inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to manage inquiries" ON public.inquiries
    FOR ALL USING (true);
