import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Package, Heart, ShoppingBag, LogOut, Plus, Edit2, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage = () => {
  const { user, token, logout, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [isEditing, setIsEditing] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New Address Form State
  const [addrFullName, setAddrFullName] = useState(user ? user.name : '');
  const [addrPhone, setAddrPhone] = useState(user ? user.phone : '');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrType, setAddrType] = useState('Home');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name);
    setPhone(user.phone || '');

    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const ok = await updateProfile(name, phone);
    if (ok) setIsEditing(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrFullName || !addrPhone || !addrStreet || !addrCity || !addrState || !addrPincode) {
      addToast('Please fill in all address fields.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: addrFullName,
          phone: addrPhone,
          address: addrStreet,
          city: addrCity,
          state: addrState,
          pincode: addrPincode,
          addressType: addrType,
          isDefault: addrIsDefault ? 1 : 0,
        }),
      });

      if (res.ok) {
        addToast('Address added successfully!');
        setShowAddAddressModal(false);
        setAddrStreet('');
        setAddrCity('');
        setAddrState('');
        setAddrPincode('');
        fetchAddresses();
      }
    } catch (err) {
      addToast('Failed to add address.', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        addToast('Address removed.');
        fetchAddresses();
      }
    } catch (err) {
      addToast('Failed to delete address.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      {/* Profile Overview Card Header */}
      <div style={profileHeaderCardStyle}>
        <div style={avatarCircleStyle}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <span style={roleBadgeStyle}>MEMBER</span>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: '700', margin: '2px 0' }}>
            {user.name}
          </h1>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            ✉️ {user.email} | 📞 {user.phone || 'No phone added'}
          </div>
        </div>

        <button className="btn btn-outline btn-sm" onClick={logout} style={{ color: '#dc2626', borderColor: '#dc2626' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main Account Tabs / Sections */}
      <div style={sectionsGridStyle}>
        {/* Quick Nav Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardBoxStyle}>
            <h3 style={sectionHeadingStyle}>Account Navigation</h3>
            <div style={navLinksListStyle}>
              <Link to="/orders" style={navLinkItemStyle}>
                <Package size={18} color="var(--primary-rose)" /> My Orders
              </Link>
              <Link to="/wishlist" style={navLinkItemStyle}>
                <Heart size={18} color="var(--primary-rose)" /> Wishlist
              </Link>
              <Link to="/cart" style={navLinkItemStyle}>
                <ShoppingBag size={18} color="var(--primary-rose)" /> Shopping Cart
              </Link>
            </div>
          </div>

          {/* Profile Information Edit Form */}
          <div style={cardBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ ...sectionHeadingStyle, marginBottom: 0, borderBottom: 'none' }}>Personal Details</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 size={14} /> {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-rose btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Save Changes
                </button>
              </form>
            ) : (
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Phone:</strong> {user.phone || 'Not specified'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Address Management Section */}
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--primary-rose)" /> Saved Delivery Addresses
            </h3>
            <button className="btn btn-rose btn-sm" onClick={() => setShowAddAddressModal(true)}>
              <Plus size={16} /> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No saved addresses yet. Click "Add Address" to save your shipping details.
            </div>
          ) : (
            <div style={addressGridStyle}>
              {addresses.map((addr) => (
                <div key={addr.id} style={addressCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={typeBadgeStyle}>{addr.address_type || 'Home'}</span>
                    {addr.is_default === 1 && (
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Default
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', marginTop: '8px' }}>
                    {addr.full_name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                    📞 {addr.phone}
                  </div>

                  <button
                    style={deleteAddrBtnStyle}
                    onClick={() => handleDeleteAddress(addr.id)}
                    title="Delete Address"
                  >
                    <Trash2 size={14} color="#dc2626" /> Delete Address
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddAddressModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>Add New Address</h3>

            <form onSubmit={handleAddAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  className="input-field"
                  value={addrFullName}
                  onChange={(e) => setAddrFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  className="input-field"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Street Address *</label>
                <input
                  type="text"
                  className="input-field"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="House No, Apartment, Street"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  className="input-field"
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>State *</label>
                <input
                  type="text"
                  className="input-field"
                  value={addrState}
                  onChange={(e) => setAddrState(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Pincode *</label>
                <input
                  type="text"
                  className="input-field"
                  value={addrPincode}
                  onChange={(e) => setAddrPincode(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Address Type</label>
                <select
                  value={addrType}
                  onChange={(e) => setAddrType(e.target.value)}
                  className="input-field"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn btn-rose btn-full">
                  Save Address
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => setShowAddAddressModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const profileHeaderCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
  padding: '24px 32px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  marginBottom: '32px',
};

const avatarCircleStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary-rose)',
  color: '#ffffff',
  fontSize: '1.8rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const roleBadgeStyle = {
  fontSize: '0.72rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: 'var(--primary-rose)',
};

const sectionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gap: '32px',
};

const cardBoxStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  padding: '24px',
};

const sectionHeadingStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
  marginBottom: '16px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--border-color)',
};

const navLinksListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const navLinkItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 14px',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-main)',
  fontWeight: '600',
  fontSize: '0.9rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '600',
  marginBottom: '4px',
};

const addressGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '16px',
};

const addressCardStyle = {
  backgroundColor: 'var(--bg-primary)',
  borderRadius: '14px',
  padding: '16px',
  border: '1px solid var(--border-color)',
};

const typeBadgeStyle = {
  fontSize: '0.72rem',
  fontWeight: '700',
  padding: '2px 8px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-main)',
};

const deleteAddrBtnStyle = {
  fontSize: '0.78rem',
  color: '#dc2626',
  fontWeight: '600',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const modalContentStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '32px',
  width: '100%',
  maxWidth: '520px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
};
