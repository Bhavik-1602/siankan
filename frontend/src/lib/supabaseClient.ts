// Supabase Client Wrapper Redirecting to Node.js / Express.js Backend API
import { Product } from './mockData';

// Set isUsingMock to true to instruct Next.js Auth Context (AppContext.tsx)
// to use the LocalStorage fallback path on page load (initializing user session from LocalStorage)
export const isUsingMock = true;

// Set supabase to null in the browser context since we query via HTTP requests to backend
export const supabase = null;

const isClient = typeof window !== 'undefined';

const getLocalStorageItem = (key: string, defaultValue: string): string => {
  if (!isClient) return defaultValue;
  return localStorage.getItem(key) || defaultValue;
};

// Authorization header helper
const getAuthHeaders = (isMultipart = false) => {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (isClient) {
    const token = localStorage.getItem('na_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// --- Products ---

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.error("API getProducts failed:", err);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    return await res.json();
  } catch (err) {
    console.error("API getProductById failed:", err);
    return null;
  }
};

export const createProduct = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<{ success: boolean; product: Product }> => {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to create product');
    }
    const data = await res.json();
    return { success: true, product: data };
  } catch (err: any) {
    console.error("API createProduct failed:", err);
    throw err;
  }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return { success: true };
  } catch (err) {
    console.error("API deleteProduct failed:", err);
    return { success: false };
  }
};

// --- Orders ---

export const createOrder = async (orderData: any, items: any[]): Promise<{ success: boolean; orderId: string }> => {
  try {
    // Map cart items format to backend Joi validated format
    const backendItems = items.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      customization_notes: item.customizations ? {
        ...item.customizations,
        selectedColor: item.selectedColor
      } : { selectedColor: item.selectedColor }
    }));

    const payload = {
      customer_name: orderData.customer_name,
      email: orderData.email,
      shipping_address: orderData.shipping_address,
      city: orderData.city,
      postal_code: orderData.postal_code,
      phone: orderData.phone || '',
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      items: backendItems
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to place order');
    }

    return await res.json();
  } catch (err: any) {
    console.error("API createOrder failed:", err);
    return { success: false, orderId: '' };
  }
};

export const getOrders = async (userId: string): Promise<any[]> => {
  try {
    const res = await fetch(`/api/orders/user/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.error("API getOrders failed:", err);
    return [];
  }
};

export const getAllOrders = async (): Promise<any[]> => {
  try {
    const res = await fetch('/api/orders', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch all orders');
    return await res.json();
  } catch (err) {
    console.error("API getAllOrders failed:", err);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return { success: true };
  } catch (err) {
    console.error("API updateOrderStatus failed:", err);
    return { success: false };
  }
};

// --- Inquiries ---

export const createInquiry = async (inquiryData: any): Promise<{ success: boolean; inquiryId: string }> => {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        customer_name: inquiryData.customer_name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        category: inquiryData.category,
        inquiry_type: inquiryData.inquiry_type,
        details: inquiryData.details || '',
        proposed_date: inquiryData.proposed_date || ''
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to submit inquiry');
    }

    return await res.json();
  } catch (err: any) {
    console.error("API createInquiry failed:", err);
    return { success: false, inquiryId: '' };
  }
};

export const getInquiries = async (userId: string): Promise<any[]> => {
  try {
    const res = await fetch(`/api/inquiries/user/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return await res.json();
  } catch (err) {
    console.error("API getInquiries failed:", err);
    return [];
  }
};

export const getAllInquiries = async (): Promise<any[]> => {
  try {
    const res = await fetch('/api/inquiries', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch all inquiries');
    return await res.json();
  } catch (err) {
    console.error("API getAllInquiries failed:", err);
    return [];
  }
};

export const updateInquiryStatus = async (inquiryId: string, status: string): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`/api/inquiries/${inquiryId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update inquiry status');
    return { success: true };
  } catch (err) {
    console.error("API updateInquiryStatus failed:", err);
    return { success: false };
  }
};

// --- Auth & User Profile ---

export const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });

    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: data.error || 'Signup failed' } };
    }

    // Save tokens and session locally
    if (data.session?.access_token) {
      localStorage.setItem('na_auth_token', data.session.access_token);
    }
    localStorage.setItem('na_next_auth_session', JSON.stringify({ user: data.user }));

    return { data: { user: data.user }, error: null };
  } catch (err: any) {
    console.error("API signUp failed:", err);
    return { data: null, error: { message: err.message || 'An error occurred during registration' } };
  }
};

export const signIn = async (email: string, password: string): Promise<any> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: data.error || 'Login failed' } };
    }

    // Save tokens and session locally
    if (data.session?.access_token) {
      localStorage.setItem('na_auth_token', data.session.access_token);
    }
    localStorage.setItem('na_next_auth_session', JSON.stringify({ user: data.user }));

    return { data: { user: data.user }, error: null };
  } catch (err: any) {
    console.error("API signIn failed:", err);
    return { data: null, error: { message: err.message || 'An error occurred during login' } };
  }
};

export const signOut = async (): Promise<any> => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch (err) {
    console.error("API logout call failed:", err);
  } finally {
    if (isClient) {
      localStorage.removeItem('na_auth_token');
      localStorage.removeItem('na_next_auth_session');
    }
  }
  return { error: null };
};

export const getCurrentUser = (): any => {
  if (!isClient) return null;
  const session = getLocalStorageItem('na_next_auth_session', 'null');
  return session !== 'null' ? JSON.parse(session).user : null;
};

export const getUserProfile = async (userId: string): Promise<any> => {
  try {
    const res = await fetch(`/api/users/profile/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to retrieve profile');
    return await res.json();
  } catch (err) {
    console.error("API getUserProfile failed:", err);
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: any): Promise<any> => {
  try {
    const res = await fetch(`/api/users/profile/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  } catch (err) {
    console.error("API updateUserProfile failed:", err);
    return { success: false };
  }
};
