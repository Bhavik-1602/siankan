import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getCategories = async (req, res, next) => {
  try {
    const { activeOnly } = req.query;
    let query = supabaseAdmin.from('categories').select('*').order('name', { ascending: true });

    if (activeOnly === 'true') {
      query = query.eq('active', true);
    }

    const { data, error } = await query;
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, active } = req.body;
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name, slug, active })
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

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, active } = req.body;
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ name, slug, active })
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

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};
