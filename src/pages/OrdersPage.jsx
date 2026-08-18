import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowRight, Eye, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OrdersPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && token) {
        try {
          const res = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
        }
      } else {
        const localOrders = localStorage.getItem('tw_guest_orders');
        setOrders(localOrders ? JSON.parse(localOrders) : []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, token]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return { backgroundColor: '#dcfce7', color: '#15803d' };
      case 'Out for Delivery':
      case 'Shipped':
        return { backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'Processing':
        return { backgroundColor: '#fef3c7', color: '#b45309' };
      case 'Order Placed':
      default:
        return { backgroundColor: 'var(--primary-rose-light)', color: 'var(--primary-rose)' };
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={titleStyle}>My Orders ({orders.length})</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyIconWrapperStyle}>
            <Package size={48} color="var(--primary-rose)" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginTop: '16px' }}>
            You haven't placed any orders yet.
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px 0 24px' }}>
            When you purchase items from TRENDY WEAR, your order history and live delivery tracking will appear here.
          </p>
          <button className="btn btn-rose btn-lg" onClick={() => navigate('/category/all')}>
            Start Shopping <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={ordersListStyle}>
          {orders.map((order) => {
            const firstItem = order.items && order.items[0];
            return (
              <div key={order.id || order.orderNumber} style={orderCardStyle}>
                {/* Header Info */}
                <div style={orderHeaderStyle}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Order ID
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                      {order.order_number || order.orderNumber}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ ...statusBadgeStyle, ...getStatusBadgeStyle(order.order_status || order.orderStatus || 'Order Placed') }}>
                      {order.order_status || order.orderStatus || 'Order Placed'}
                    </span>
                    <Link
                      to={`/order/${order.id || order.orderNumber}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Eye size={14} /> View Details
                    </Link>
                  </div>
                </div>

                {/* Items Summary Row */}
                <div style={orderBodyStyle}>
                  {firstItem && (
                    <div style={itemPreviewRowStyle}>
                      <img
                        src={firstItem.product_image || firstItem.product?.image}
                        alt=""
                        style={itemImgStyle}
                      />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                          {firstItem.product_name || firstItem.product?.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Qty: {firstItem.quantity} | Size: {firstItem.selected_size}
                        </div>
                        {order.items.length > 1 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary-rose)', fontWeight: '600', marginTop: '2px' }}>
                            + {order.items.length - 1} more items in this order
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={orderMetaRightStyle}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Total Amount
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      ₹{order.total_amount || order.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const titleStyle = {
  fontSize: '2.2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  marginBottom: '32px',
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '80px 20px',
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
};

const emptyIconWrapperStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary-rose-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const ordersListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const orderCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
};

const orderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: 'var(--bg-primary)',
  borderBottom: '1px solid var(--border-color)',
  flexWrap: 'wrap',
  gap: '12px',
};

const statusBadgeStyle = {
  padding: '4px 12px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.78rem',
  fontWeight: '700',
};

const orderBodyStyle = {
  padding: '20px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
};

const itemPreviewRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const itemImgStyle = {
  width: '64px',
  height: '76px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const orderMetaRightStyle = {
  textAlign: 'right',
};
