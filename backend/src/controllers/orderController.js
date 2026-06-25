import { supabaseAdmin } from '../config/supabase.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      customer_name,
      email,
      shipping_address,
      city,
      postal_code,
      phone,
      total_amount,
      payment_method,
      items
    } = req.body;

    // Determine user_id from auth token if present
    const user_id = req.user ? req.user.id : null;

    // 1. Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id,
        customer_name,
        email,
        shipping_address,
        city,
        postal_code,
        phone,
        total_amount,
        payment_method
      })
      .select()
      .single();

    if (orderError) {
      return res.status(400).json({ success: false, error: orderError.message });
    }

    // 2. Prepare order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      customization_notes: item.customization_notes ? JSON.stringify(item.customization_notes) : null
    }));

    // 3. Insert order items
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Cleanup created order on fail (simulated transaction)
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return res.status(400).json({ success: false, error: itemsError.message });
    }

    res.status(201).json({ success: true, orderId: order.id });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Verify requesting user is retrieving their own orders (unless admin)
    if (!req.user || (req.user.id !== userId && req.user.user_metadata?.role !== 'admin' && !req.user.email?.startsWith('admin@'))) {
      return res.status(403).json({ success: false, error: 'Forbidden: Cannot access orders of another user' });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // Convert stringified customization notes back to JSON objects if needed
    const parsedData = (data || []).map(order => ({
      ...order,
      order_items: order.order_items.map((item) => {
        let customizations = item.customization_notes;
        if (typeof item.customization_notes === 'string') {
          try {
            customizations = JSON.parse(item.customization_notes);
          } catch (e) {
            customizations = item.customization_notes;
          }
        }
        return { ...item, customization_notes: customizations };
      })
    }));

    res.status(200).json(parsedData);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // Parse customization_notes if string
    const parsedData = (data || []).map(order => ({
      ...order,
      order_items: order.order_items.map((item) => {
        let customizations = item.customization_notes;
        if (typeof item.customization_notes === 'string') {
          try {
            customizations = JSON.parse(item.customization_notes);
          } catch (e) {
            customizations = item.customization_notes;
          }
        }
        return { ...item, customization_notes: customizations };
      })
    }));

    res.status(200).json(parsedData);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, order: data });
  } catch (err) {
    next(err);
  }
};
