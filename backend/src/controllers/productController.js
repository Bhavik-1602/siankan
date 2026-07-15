import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category_id,
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

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    const selectedCategoryId = category_id || req.query.category;
    if (selectedCategoryId && selectedCategoryId !== 'all') {
      query = query.eq('category_id', selectedCategoryId);
    }

    if (fabric) {
      query = query.eq('fabric', fabric);
    }

    if (embroidery) {
      query = query.eq('embroidery', embroidery);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    if (priceMin) {
      query = query.gte('price', Number(priceMin));
    }

    if (priceMax) {
      query = query.lte('price', Number(priceMax));
    }

    query = query.order(sortBy, {
      ascending: sortOrder === 'asc'
    });

    if (limit && limit !== 'all') {
      const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
      const parsedLimit = Math.max(parseInt(limit, 10) || 50, 1);

      const from = (parsedPage - 1) * parsedLimit;
      const to = from + parsedLimit - 1;

      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

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
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
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

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!category_id || !uuidRegex.test(category_id)) {
      return res.status(400).json({ success: false, error: 'Invalid or missing category_id UUID' });
    }

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
        active: active !== undefined ? active : true,
        fabric,
        embroidery,
        artisan_notes
      })
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
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

    const allowedFields = [
      'name', 'slug', 'description', 'price', 'discount_price', 'stock',
      'category_id', 'image_url', 'zoom_image_url', 'colors', 'is_featured',
      'active', 'fabric', 'embroidery', 'artisan_notes'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.category_id !== undefined) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!updateData.category_id || !uuidRegex.test(updateData.category_id)) {
        return res.status(400).json({ success: false, error: 'Invalid category_id UUID' });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
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
    const { data: prodData, error: prodError } = await supabaseAdmin
      .from('products')
      .select('fabric, embroidery');

    if (prodError) {
      return res.status(400).json({ success: false, error: prodError.message });
    }

    const { data: catData, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, active')
      .eq('active', true)
      .order('name');

    if (catError) {
      return res.status(400).json({ success: false, error: catError.message });
    }

    const fabrics = new Set();
    const embroideries = new Set();

    (prodData || []).forEach(row => {
      if (row.fabric) fabrics.add(row.fabric);
      if (row.embroidery) embroideries.add(row.embroidery);
    });

    res.status(200).json({
      categories: catData || [],
      fabrics: Array.from(fabrics),
      embroideries: Array.from(embroideries)
    });
  } catch (err) {
    next(err);
  }
};
