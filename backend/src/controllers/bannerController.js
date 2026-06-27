import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getBanners = async (req, res, next) => {
  try {
    const { activeOnly } = req.query;
    let query = supabaseAdmin.from('banners').select('*').order('created_at', { ascending: true });

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

export const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, image_url, link_url, active } = req.body;
    const { data, error } = await supabaseAdmin
      .from('banners')
      .insert({ title, subtitle, image_url, link_url, active })
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

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image_url, link_url, active } = req.body;
    const { data, error } = await supabaseAdmin
      .from('banners')
      .update({ title, subtitle, image_url, link_url, active })
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

export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    next(err);
  }
};
