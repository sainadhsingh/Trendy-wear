import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Calendar, Truck, Package } from 'lucide-react';
import { OrderTracker } from '../components/OrderTracker';
import { useAuth } from '../context/AuthContext';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (user && token) {
        try {
          const res = await fetch(`/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setOrder(data.order);
          }
        } catch (err) {
          console.error('Error loading order details:', err);
        }
      } else {
        const local = localStorage.getItem('tw_guest_orders');
        if (local) {
          const parsed = JSON.parse(local);
          const match = parsed.find((o) => String(o.id) === String(id) || o.orderNumber === id);
          if (match) setOrder(match);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [id, user, token]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading order information...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Order Details Not Found</h2>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/orders')}>
          Return to My Orders
        </button>
      </div>
    );
  }

  const addr = order.delivery_address || order.deliveryAddress || {};

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <button className="btn btn-outline btn-sm" onClick={() => navigate('/orders')} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </button>

      <div style={headerCardStyle}>
        <div>
          <span style={tagStyle}>ORDER DETAILS</span>
          <h1 style={titleStyle}>{order.order_number || order.orderNumber || `Order #${order.id}`}</h1>
          <div style={dateMetaStyle}>
            <Calendar size={14} color="var(--text-muted)" /> Estimated Delivery: <strong>{order.estimated_delivery || order.estimatedDelivery}</strong>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Amount
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
            ₹{order.total_amount || order.totalAmount}
          </div>
        </div>
      </div>

      {/* Visual Timeline Tracking */}
      <div style={trackerBoxStyle}>
        <h3 style={sectionHeadingStyle}>Live Delivery Tracking</h3>
        <OrderTracker status={order.order_status || order.orderStatus || 'Order Placed'} />
      </div>

      <div style={gridTwoColsStyle}>
        {/* Left: Product Items List */}
        <div style={cardBoxStyle}>
          <h3 style={sectionHeadingStyle}>
            <Package size={18} color="var(--primary-rose)" /> Ordered Items
          </h3>
          <div style={itemsListStyle}>
            {order.items &&
              order.items.map((item) => (
                <div key={item.id || item.product_name} style={itemRowStyle}>
                  <img src={item.product_image || item.product?.image} alt="" style={itemImgStyle} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                      {item.product_name || item.product?.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Size: <strong>{item.selected_size}</strong> | Color: <strong>{item.selected_color}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      Quantity: <strong>{item.quantity}</strong> × ₹{item.price}
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Address & Payment Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Delivery Address */}
          <div style={cardBoxStyle}>
            <h3 style={sectionHeadingStyle}>
              <MapPin size={18} color="var(--primary-rose)" /> Delivery Address
            </h3>
            <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
              <div style={{ fontWeight: '700' }}>{addr.fullName || addr.full_name}</div>
              <div>{addr.address}</div>
              <div>
                {addr.city}, {addr.state} - {addr.pincode}
              </div>
              <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                📞 {addr.phone} | ✉️ {addr.email}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={cardBoxStyle}>
            <h3 style={sectionHeadingStyle}>
              <CreditCard size={18} color="var(--primary-rose)" /> Payment Information
            </h3>
            <div style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Method:</span>
              <strong style={{ color: 'var(--text-main)' }}>{order.payment_method || order.paymentMethod}</strong>
            </div>
            <div style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span>Payment Status:</span>
              <strong style={{ color: '#16a34a' }}>Completed / Verified</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const headerCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  padding: '24px 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
};

const tagStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: 'var(--primary-rose)',
};

const titleStyle = {
  fontSize: '2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  margin: '4px 0',
};

const dateMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.88rem',
  color: 'var(--text-muted)',
};

const trackerBoxStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  padding: '24px',
  marginBottom: '24px',
};

const sectionHeadingStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--border-color)',
};

const gridTwoColsStyle = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',
  gap: '24px',
};

const cardBoxStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  padding: '24px',
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const itemRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid var(--border-color)',
};

const itemImgStyle = {
  width: '64px',
  height: '76px',
  objectFit: 'cover',
  borderRadius: '8px',
};
