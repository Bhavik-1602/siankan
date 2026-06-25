import { supabaseAdmin } from '../config/supabase.js';

export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!req.user || (req.user.id !== userId && req.user.user_metadata?.role !== 'admin' && !req.user.email?.startsWith('admin@'))) {
      return res.status(403).json({ success: false, error: 'Forbidden: Cannot access profile of another user' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!req.user || (req.user.id !== userId && req.user.user_metadata?.role !== 'admin' && !req.user.email?.startsWith('admin@'))) {
      return res.status(403).json({ success: false, error: 'Forbidden: Cannot update profile of another user' });
    }

    const { full_name, phone, avatar_url } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name,
        phone,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, profile: data });
  } catch (err) {
    next(err);
  }
};
