import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify authorized user
    if (req.user.id !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied: Unauthorized user session' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('id, product_id, products(*)')
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    if (!product_id) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    // Insert into wishlist table
    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .insert({ user_id, product_id })
      .select('id, product_id, products(*)')
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique violation, item already in wishlist
        return res.status(200).json({ success: true, message: 'Item already in wishlist' });
      }
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, item: data });
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user_id = req.user.id;

    const { error } = await supabaseAdmin
      .from('wishlist')
      .delete()
      .eq('user_id', user_id)
      .eq('product_id', productId);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, message: 'Item removed from wishlist' });
  } catch (err) {
    next(err);
  }
};
