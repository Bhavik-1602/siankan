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

export const getAddresses = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden: Cannot access addresses of another user' });
    }

    const { data, error } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const createAddress = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { address_line1, address_line2, city, state, postal_code, country, phone, is_default } = req.body;

    if (is_default) {
      // Set all other user addresses to not default
      await supabaseAdmin
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user_id);
    }

    const { data, error } = await supabaseAdmin
      .from('addresses')
      .insert({
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country: country || 'India',
        phone,
        is_default: !!is_default
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

export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user_id = req.user.id;
    const { address_line1, address_line2, city, state, postal_code, country, phone, is_default } = req.body;

    // Verify address owner
    const { data: address, error: findError } = await supabaseAdmin
      .from('addresses')
      .select('user_id')
      .eq('id', addressId)
      .single();

    if (findError || !address) {
      return res.status(404).json({ success: false, error: 'Address not found' });
    }

    if (address.user_id !== user_id) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    if (is_default) {
      // Set all other user addresses to not default
      await supabaseAdmin
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user_id);
    }

    const { data, error } = await supabaseAdmin
      .from('addresses')
      .update({
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country: country || 'India',
        phone,
        is_default: !!is_default
      })
      .eq('id', addressId)
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

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user_id = req.user.id;

    // Verify address owner
    const { data: address, error: findError } = await supabaseAdmin
      .from('addresses')
      .select('user_id')
      .eq('id', addressId)
      .single();

    if (findError || !address) {
      return res.status(404).json({ success: false, error: 'Address not found' });
    }

    if (address.user_id !== user_id) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (deleteError) {
      return res.status(400).json({ success: false, error: deleteError.message });
    }

    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (err) {
    next(err);
  }
};

