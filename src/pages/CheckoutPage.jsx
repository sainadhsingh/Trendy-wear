import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Smartphone, Building, ShieldCheck, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = () => {
  const { user, token } = useAuth();
  const { cart, subtotal, discountAmount, deliveryCharge, totalAmount, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Form State
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (user && token) {
      fetch('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            const defaultAddr = data.addresses.find((a) => a.is_default) || data.addresses[0];
            setSelectedAddressId(defaultAddr.id);
            fillFormWithAddress(defaultAddr);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user, token]);

  const fillFormWithAddress = (addr) => {
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setAddress(addr.address);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    fillFormWithAddress(addr);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !address || !city || !state || !pincode) {
      addToast('Please fill in all required delivery fields.', 'error');
      return;
    }

    if (cart.length === 0) {
      addToast('Your cart is empty.', 'error');
      navigate('/cart');
      return;
    }

    setLoading(true);

    const deliveryDetails = {
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    };

    try {
      if (user && token) {
        // Authenticated order API
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart,
            deliveryAddress: deliveryDetails,
            paymentMethod,
            totalAmount,
            discountAmount,
            deliveryCharge,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          addToast('Order Placed Successfully!');
          clearCart();
          navigate(`/order-success/${data.orderId}`, { state: { order: data } });
        } else {
          throw new Error(data.error || 'Failed to place order.');
        }
      } else {
        // Guest order fallback simulation
        const orderNumber = `TW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const estDate = new Date();
        estDate.setDate(estDate.getDate() + 4);
        const estimatedDelivery = estDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        const guestOrder = {
          orderId: Date.now(),
          orderNumber,
          estimatedDelivery,
          totalAmount,
          items: cart,
          deliveryAddress: deliveryDetails,
          paymentMethod,
        };

        addToast('Order Placed Successfully!');
        clearCart();
        navigate(`/order-success/${guestOrder.orderId}`, { state: { order: guestOrder } });
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={titleStyle}>Checkout</h1>

      <form onSubmit={handlePlaceOrder} style={layoutGridStyle}>
        {/* Left Side: Delivery & Payment Details */}
        <div style={{ flex: 1 }}>
          {/* Saved Addresses Section */}
          {savedAddresses.length > 0 && (
            <div style={sectionBoxStyle}>
              <h3 style={sectionHeadingStyle}>
                <MapPin size={18} color="var(--primary-rose)" /> Select Saved Address
              </h3>
              <div style={addressesGridStyle}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={addressCardStyle(selectedAddressId === addr.id)}
                    onClick={() => handleSelectSavedAddress(addr)}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{addr.full_name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      📞 {addr.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Information Form */}
          <div style={sectionBoxStyle}>
            <h3 style={sectionHeadingStyle}>
              <Truck size={18} color="var(--primary-rose)" /> Delivery Address Details
            </h3>

            <div style={formGridStyle}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  className="input-field"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Street Address *</label>
                <input
                  type="text"
                  className="input-field"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat No., Apartment, Street Name"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  className="input-field"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>State *</label>
                <input
                  type="text"
                  className="input-field"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Pincode *</label>
                <input
                  type="text"
                  className="input-field"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="400001"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={sectionBoxStyle}>
            <h3 style={sectionHeadingStyle}>
              <CreditCard size={18} color="var(--primary-rose)" /> Select Payment Method
            </h3>

            <div style={paymentOptionsGridStyle}>
              {[
                { name: 'Cash on Delivery', icon: Truck, desc: 'Pay with cash upon delivery' },
                { name: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                { name: 'UPI Payment', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                { name: 'Net Banking', icon: Building, desc: 'All major Indian banks' },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.name;
                return (
                  <div
                    key={pm.name}
                    style={paymentCardStyle(isSelected)}
                    onClick={() => setPaymentMethod(pm.name)}
                  >
                    <Icon size={22} color={isSelected ? 'var(--primary-rose)' : 'var(--text-muted)'} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{pm.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pm.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Final Order Review */}
        <aside style={sidebarSummaryStyle}>
          <h3 style={summaryTitleStyle}>Order Review</h3>

          <div style={itemsListPreviewStyle}>
            {cart.map((item) => (
              <div key={item.cart_item_id} style={previewItemStyle}>
                <img src={item.product.image} alt={item.product.name} style={previewImgStyle} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} | Size: {item.selected_size}
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                  ₹{item.product.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

          <div style={summaryRowStyle}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div style={summaryRowStyle}>
            <span>Delivery Fee</span>
            <span>{deliveryCharge === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${deliveryCharge}`}</span>
          </div>

          <div style={{ ...summaryRowStyle, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            type="submit"
            className="btn btn-rose btn-lg btn-full"
            style={{ marginTop: '24px' }}
            disabled={loading}
          >
            {loading ? 'Processing Order...' : 'Place Order Now'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--primary-rose)" /> Encrypted SSL Payment
          </div>
        </aside>
      </form>
    </div>
  );
};

const titleStyle = {
  fontSize: '2.2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  marginBottom: '32px',
};

const layoutGridStyle = {
  display: 'flex',
  gap: '36px',
};

const sectionBoxStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  padding: '24px',
  marginBottom: '24px',
};

const sectionHeadingStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid var(--border-color)',
};

const addressesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '12px',
};

const addressCardStyle = (isSelected) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  border: isSelected ? '2px solid var(--primary-rose)' : '1px solid var(--border-color)',
  backgroundColor: isSelected ? 'var(--primary-rose-light)' : 'transparent',
  cursor: 'pointer',
});

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '6px',
  color: 'var(--text-main)',
};

const paymentOptionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const paymentCardStyle = (isSelected) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 18px',
  borderRadius: '14px',
  border: isSelected ? '2px solid var(--primary-rose)' : '1px solid var(--border-color)',
  backgroundColor: isSelected ? 'var(--primary-rose-light)' : '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const sidebarSummaryStyle = {
  width: '360px',
  flexShrink: 0,
  backgroundColor: '#ffffff',
  padding: '28px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  height: 'fit-content',
};

const summaryTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  marginBottom: '16px',
};

const itemsListPreviewStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  maxHeight: '260px',
  overflowY: 'auto',
  paddingRight: '4px',
};

const previewItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const previewImgStyle = {
  width: '48px',
  height: '56px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.92rem',
  marginBottom: '8px',
};
