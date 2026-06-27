import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getCoupons = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
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

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount_type, discount_value, active, expiry_date } = req.body;
    const { data, error } = await supabaseAdmin
      .from('coupons')
      .insert({ 
        code: code.toUpperCase(), 
        discount_type, 
        discount_value, 
        active, 
        expiry_date: expiry_date || null 
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

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount_type, discount_value, active, expiry_date } = req.body;
    const { data, error } = await supabaseAdmin
      .from('coupons')
      .update({ 
        code: code.toUpperCase(), 
        discount_type, 
        discount_value, 
        active, 
        expiry_date: expiry_date || null 
      })
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

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error || !coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or inactive coupon code' });
    }

    // Check expiry date
    if (coupon.expiry_date) {
      const expiry = new Date(coupon.expiry_date);
      const today = new Date();
      // Set hours to 0 to compare dates accurately
      today.setHours(0,0,0,0);
      if (expiry < today) {
        return res.status(400).json({ success: false, error: 'Coupon code has expired' });
      }
    }

    res.status(200).json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value
      }
    });
  } catch (err) {
    next(err);
  }
};
