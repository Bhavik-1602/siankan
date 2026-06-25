import { supabaseAdmin } from '../config/supabase.js';

export const createInquiry = async (req, res, next) => {
  try {
    const {
      customer_name,
      email,
      phone,
      category,
      inquiry_type,
      details,
      proposed_date
    } = req.body;

    const user_id = req.user ? req.user.id : null;

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        user_id,
        customer_name,
        email,
        phone,
        category,
        inquiry_type,
        details,
        proposed_date: proposed_date || null
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, inquiryId: data.id });
  } catch (err) {
    next(err);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!req.user || (req.user.id !== userId && req.user.user_metadata?.role !== 'admin' && !req.user.email?.startsWith('admin@'))) {
      return res.status(403).json({ success: false, error: 'Forbidden: Cannot access inquiries of another user' });
    }

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const getAllInquiries = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json(data || []);
  } catch (err) {
    next(err);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, inquiry: data });
  } catch (err) {
    next(err);
  }
};
