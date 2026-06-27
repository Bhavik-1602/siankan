"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { 
  getUserProfile, 
  updateUserProfile, 
  getAddresses, 
  createAddress, 
  deleteAddress, 
  getOrders 
} from '@/lib/supabaseClient';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [profile, setProfile] = useState<any>({ full_name: '', phone: '', avatar_url: '' });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Load Profile
      getUserProfile(user.id).then(data => {
        if (data) {
          setProfile(data);
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
        }
      });

      // Load Addresses
      getAddresses(user.id).then(data => {
        setAddresses(data || []);
      });

      // Load Orders
      getOrders(user.id).then(data => {
        setOrders(data || []);
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    const res = await updateUserProfile(user.id, {
      full_name: fullName,
      phone,
      avatar_url: profile.avatar_url
    });

    if (res.success) {
      setProfileMessage('Profile updated successfully!');
      setProfile(res.profile);
    } else {
      setProfileError('Failed to update profile details.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    try {
      const res = await createAddress({
        address_line1: line1,
        address_line2: line2,
        city,
        state,
        postal_code: postalCode,
        country: 'India',
        phone: addressPhone,
        is_default: isDefault
      });

      if (res && res.id) {
        // Refresh addresses
        const updated = await getAddresses(user.id);
        setAddresses(updated || []);
        
        // Reset form
        setLine1('');
        setLine2('');
        setCity('');
        setState('');
        setPostalCode('');
        setAddressPhone('');
        setIsDefault(false);
        setShowAddressForm(false);
      } else {
        setAddressError('Failed to save address.');
      }
    } catch (err: any) {
      setAddressError(err.message || 'Error occurred.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const success = await deleteAddress(addressId);
      if (success) {
        setAddresses(addresses.filter(a => a.id !== addressId));
      }
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 flex items-center justify-center font-sans text-gray-500 text-sm">
        Loading portal secure session...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-1/4 bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-6 shadow-sm self-start">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-[#D4AF37] object-cover bg-white"
            />
            <div>
              <h2 className="font-serif text-lg text-[#4A0E17] font-medium">{profile.full_name || 'Guest User'}</h2>
              <p className="text-gray-400 text-xs truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                activeTab === 'profile' ? 'bg-[#4A0E17] text-white font-medium' : 'text-gray-600 hover:bg-[#F5E6D3]/30'
              }`}
            >
              Account Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                activeTab === 'addresses' ? 'bg-[#4A0E17] text-white font-medium' : 'text-gray-600 hover:bg-[#F5E6D3]/30'
              }`}
            >
              Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                activeTab === 'orders' ? 'bg-[#4A0E17] text-white font-medium' : 'text-gray-600 hover:bg-[#F5E6D3]/30'
              }`}
            >
              Order History
            </button>
            
            <hr className="my-4 border-gray-100" />
            
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-700 hover:bg-red-50 font-medium transition-all"
            >
              Logout Securely
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4 bg-white/70 backdrop-blur-md border border-[#F5E6D3] rounded-xl p-8 shadow-sm min-h-[500px]">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              <h1 className="font-serif text-2xl text-[#4A0E17] mb-6 font-medium">Profile Settings</h1>
              {profileMessage && <div className="bg-green-50 text-green-700 text-xs px-4 py-3 rounded-lg mb-6 border border-green-200">{profileMessage}</div>}
              {profileError && <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-lg mb-6 border border-red-200">{profileError}</div>}
              
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#F5E6D3] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-gray-800 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#F5E6D3] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-gray-800 text-sm transition-all"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user.email || ''}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-lg text-gray-500 text-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Contact support if you need to alter your register email.</p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium text-xs tracking-wider uppercase rounded-lg shadow-md transition-all"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="font-serif text-2xl text-[#4A0E17] font-medium">Saved Addresses</h1>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[#D4AF37] font-medium text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  {showAddressForm ? 'Cancel' : 'Add Address'}
                </button>
              </div>

              {addressError && <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-lg mb-6 border border-red-200">{addressError}</div>}

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-[#FAF8F5] p-6 rounded-lg border border-[#F5E6D3] mb-8 space-y-4 max-w-xl">
                  <h3 className="font-serif text-md text-[#4A0E17] font-medium mb-4">New Shipping Address</h3>
                  
                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Street address, P.O. box, company name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Apartment, suite, unit, building, floor"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">State / Province</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Postal Code (PIN)</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="400001"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Phone Number for Delivery</label>
                      <input
                        type="text"
                        required
                        value={addressPhone}
                        onChange={(e) => setAddressPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#F5E6D3] rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="rounded border-[#F5E6D3] text-[#4A0E17] focus:ring-[#D4AF37]"
                    />
                    <label htmlFor="isDefault" className="text-xs text-gray-600 cursor-pointer">Set as default shipping address</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#4A0E17] hover:bg-[#5C1620] text-white font-medium text-xs tracking-wider uppercase rounded shadow transition-all"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">No saved shipping addresses found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-5 rounded-lg border bg-white flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.01)] ${addr.is_default ? 'border-[#D4AF37]' : 'border-[#F5E6D3]'}`}>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            {addr.is_default ? 'Default Address' : 'Shipping Address'}
                          </span>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-sm text-gray-800 font-medium mb-1">{addr.address_line1}</p>
                        {addr.address_line2 && <p className="text-sm text-gray-600 mb-1">{addr.address_line2}</p>}
                        <p className="text-sm text-gray-600 mb-2">{addr.city}, {addr.state} - {addr.postal_code}</p>
                        <p className="text-xs text-gray-400">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="font-serif text-2xl text-[#4A0E17] mb-6 font-medium">Order History</h1>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#F5E6D3] rounded-lg p-6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-100 gap-2 mb-4">
                        <div>
                          <p className="text-xs text-gray-400">Order ID: <span className="text-gray-700 font-semibold">{order.id}</span></p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full ${
                            order.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                            order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-serif text-md text-[#4A0E17] font-semibold">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex gap-4 items-center py-1">
                            <img
                              src={item.products?.image_url}
                              alt={item.products?.name}
                              className="w-12 h-12 object-cover rounded border border-[#F5E6D3] bg-white"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-800">{item.products?.name}</h4>
                              <p className="text-xs text-gray-400">Qty: {item.quantity} • price: ₹{parseFloat(item.price).toLocaleString()}</p>
                              {item.customization_notes && (
                                <p className="text-[10px] text-[#D4AF37] italic mt-0.5">
                                  Custom fits: {typeof item.customization_notes === 'string' ? item.customization_notes : JSON.stringify(item.customization_notes)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-150 text-xs text-gray-500 flex justify-between">
                        <p>Payment: <strong>{order.payment_method}</strong></p>
                        <p>Ship to: <strong>{order.shipping_address}, {order.city}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
