import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.order || {
    orderNumber: `TW-2026-${id || Math.floor(1000 + Math.random() * 9000)}`,
    estimatedDelivery: '3–5 Business Days',
    totalAmount: 2499,
    items: [],
  };

  return (
    <div className="container" style={{ marginTop: '60px', marginBottom: '80px' }}>
      <div style={cardStyle}>
        <div style={iconWrapperStyle}>
          <CheckCircle size={64} color="#16a34a" strokeWidth={1.5} />
        </div>

        <span style={tagStyle}>CONFIRMED</span>
        <h1 style={titleStyle}>Order Placed Successfully!</h1>
        <p style={subTitleStyle}>
          Thank you for shopping with TRENDY WEAR. Your order has been placed and is being prepared for dispatch.
        </p>

        {/* Order Info Summary Pills */}
        <div style={infoRowStyle}>
          <div style={infoPillStyle}>
            <span style={pillLabelStyle}>Order ID</span>
            <span style={pillValueStyle}>{orderData.orderNumber || id}</span>
          </div>

          <div style={infoPillStyle}>
            <span style={pillLabelStyle}>Est. Delivery</span>
            <span style={pillValueStyle}>{orderData.estimatedDelivery}</span>
          </div>

          <div style={infoPillStyle}>
            <span style={pillLabelStyle}>Total Paid</span>
            <span style={pillValueStyle}>₹{orderData.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonsRowStyle}>
          <button
            className="btn btn-rose btn-lg"
            onClick={() => navigate(`/orders`)}
          >
            View Order Details <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => navigate('/category/all')}
          >
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  maxWidth: '680px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-md)',
  padding: '48px 36px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const iconWrapperStyle = {
  marginBottom: '16px',
};

const tagStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: '#16a34a',
  backgroundColor: '#dcfce7',
  padding: '4px 12px',
  borderRadius: 'var(--radius-full)',
  marginBottom: '12px',
};

const titleStyle = {
  fontSize: '2.2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  marginBottom: '8px',
};

const subTitleStyle = {
  color: 'var(--text-muted)',
  fontSize: '1rem',
  maxWidth: '480px',
  marginBottom: '32px',
  lineHeight: 1.6,
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  width: '100%',
  marginBottom: '36px',
  flexWrap: 'wrap',
};

const infoPillStyle = {
  backgroundColor: 'var(--bg-primary)',
  padding: '12px 20px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '130px',
};

const pillLabelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  fontWeight: '600',
};

const pillValueStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
  color: 'var(--text-main)',
  marginTop: '2px',
};

const buttonsRowStyle = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};
