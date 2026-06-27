import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      search, 
      fabric, 
      embroidery, 
      priceMin, 
      priceMax, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    let query = supabaseAdmin.from('products').select('*', { count: 'exact' });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (fabric) {
      query = query.eq('fabric', fabric);
    }
    if (embroidery) {
      query = query.eq('embroidery', embroidery);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (priceMin) {
      query = query.gte('price', parseFloat(priceMin));
    }
    if (priceMax) {
      query = query.lte('price', parseFloat(priceMax));
    }

    // Sort order
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination (only apply if limit is present and valid)
    if (limit && limit !== 'all') {
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);
      const from = (parsedPage - 1) * parsedLimit;
      const to = from + parsedLimit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // The Next.js frontend expects the raw array from fetch('/api/products')
    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discount_price,
      stock,
      category_id,
      image_url,
      zoom_image_url,
      colors,
      is_featured,
      active,
      fabric,
      embroidery,
      artisan_notes
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        slug,
        description,
        price,
        discount_price,
        stock,
        category_id,
        image_url,
        zoom_image_url,
        colors,
        is_featured,
        active,
        fabric,
        embroidery,
        artisan_notes
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getProductsMeta = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category, fabric, embroidery');

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const categories = new Set();
    const fabrics = new Set();
    const embroideries = new Set();

    (data || []).forEach(row => {
      if (row.category) categories.add(row.category);
      if (row.fabric) fabrics.add(row.fabric);
      if (row.embroidery) embroideries.add(row.embroidery);
    });

    res.status(200).json({
      categories: Array.from(categories),
      fabrics: Array.from(fabrics),
      embroideries: Array.from(embroideries)
    });
  } catch (err) {
    next(err);
  }
};
