import { supabase } from '../config/supabase.js';

export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Total Products
    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productError) {
      return res.status(400).json({ success: false, error: productError.message });
    }

    // 2. Total Orders
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (orderError) {
      return res.status(400).json({ success: false, error: orderError.message });
    }

    // 3. Pending Orders (status = 'processing')
    const { count: pendingCount, error: pendingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processing');

    if (pendingError) {
      return res.status(400).json({ success: false, error: pendingError.message });
    }

    // 4. Total Customers (profiles with role = 'customer' or all non-admin profiles)
    const { count: customerCount, error: customerError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    if (customerError) {
      return res.status(400).json({ success: false, error: customerError.message });
    }

    // 5. Revenue: select total_amount of all orders except cancelled ones and sum in JS
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .neq('status', 'cancelled');

    if (revenueError) {
      return res.status(400).json({ success: false, error: revenueError.message });
    }

    const revenue = (revenueData || []).reduce((acc, row) => acc + parseFloat(row.total_amount || 0), 0);

    // 6. Recent Orders list
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('id, customer_name, email, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentOrdersError) {
      return res.status(400).json({ success: false, error: recentOrdersError.message });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalProducts: productCount || 0,
        totalOrders: orderCount || 0,
        pendingOrders: pendingCount || 0,
        totalCustomers: customerCount || 0,
        revenue: revenue
      },
      recentOrders: recentOrders || []
    });
  } catch (err) {
    next(err);
  }
};
