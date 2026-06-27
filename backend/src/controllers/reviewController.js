import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('id, product_id, rating, comment, created_at, profiles(id, full_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!product_id || !rating) {
      return res.status(400).json({ success: false, error: 'Product ID and Rating are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({ product_id, user_id, rating, comment })
      .select('id, product_id, rating, comment, created_at, profiles(id, full_name, avatar_url)')
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, review: data });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if review belongs to user or user is admin
    const { data: review, error: findError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError || !review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const isAdmin = req.user.user_metadata?.role === 'admin' || 
                    req.user.email?.startsWith('admin@') || 
                    req.user.app_metadata?.role === 'admin';

    if (review.user_id !== user_id && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Access denied: Unauthorized operation' });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(400).json({ success: false, error: deleteError.message });
    }

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};
