import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const { cart, cartCount, subtotal, totalDiscount, deliveryCharge, totalAmount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ marginTop: '60px', marginBottom: '80px' }}>
        <div style={emptyStateStyle}>
          <div style={emptyIconWrapperStyle}>
            <ShoppingBag size={48} color="var(--primary-rose)" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', marginTop: '16px' }}>
            Your cart is feeling a little empty.
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px 0 24px' }}>
            Explore TRENDY WEAR's latest arrivals and add your favorite fashion pieces to your shopping cart.
          </p>
          <button className="btn btn-rose btn-lg" onClick={() => navigate('/category/all')}>
            Start Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={titleStyle}>Shopping Cart ({cartCount} Items)</h1>

      <div style={layoutGridStyle}>
        {/* Cart Items List */}
        <div style={{ flex: 1 }}>
          <div style={itemsContainerStyle}>
            {cart.map((item) => (
              <div key={item.cart_item_id} style={cartItemRowStyle}>
                <img src={item.product.image} alt={item.product.name} style={itemImgStyle} />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    {item.product.category}
                  </div>
                  <h3
                    style={itemNameStyle}
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <div style={itemMetaStyle}>
                    <span>Size: <strong>{item.selected_size}</strong></span>
                    <span>•</span>
                    <span>Color: <strong>{item.selected_color}</strong></span>
                  </div>

                  <div style={priceQtyRowStyle}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>₹{item.product.price}</span>
                      {item.product.original_price > item.product.price && (
                        <span style={origPriceStyle}>₹{item.product.original_price}</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div style={qtyControlsStyle}>
                      <button
                        style={qtyBtnStyle}
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        style={qtyBtnStyle}
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  style={removeBtnStyle}
                  onClick={() => removeFromCart(item.cart_item_id)}
                  title="Remove Item"
                >
                  <Trash2 size={18} color="#dc2626" />
                </button>
              </div>
            ))}
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/category/all')}
            style={{ marginTop: '20px' }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <aside style={sidebarSummaryStyle}>
          <h3 style={summaryTitleStyle}>Order Summary</h3>

          <div style={summaryRowStyle}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          {totalDiscount > 0 && (
            <div style={summaryRowStyle}>
              <span>Discount</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>-₹{totalDiscount}</span>
            </div>
          )}

          <div style={summaryRowStyle}>
            <span>Delivery Fee</span>
            <span>{deliveryCharge === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${deliveryCharge}`}</span>
          </div>

          {subtotal <= 1499 && (
            <div style={freeDeliveryNoticeStyle}>
              Add ₹{1500 - subtotal} more for <strong>FREE Delivery</strong>
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

          <div style={{ ...summaryRowStyle, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            className="btn btn-rose btn-lg btn-full"
            style={{ marginTop: '24px' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={18} color="var(--primary-rose)" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </aside>
      </div>
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

const layoutGridStyle = {
  display: 'flex',
  gap: '36px',
};

const itemsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const cartItemRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
};

const itemImgStyle = {
  width: '90px',
  height: '110px',
  objectFit: 'cover',
  borderRadius: '12px',
  backgroundColor: 'var(--bg-accent)',
};

const itemNameStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  margin: '2px 0 6px',
  cursor: 'pointer',
};

const itemMetaStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-muted)',
  display: 'flex',
  gap: '8px',
  marginBottom: '12px',
};

const priceQtyRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
};

const origPriceStyle = {
  fontSize: '0.85rem',
  textDecoration: 'line-through',
  color: 'var(--text-light)',
};

const qtyControlsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '4px 10px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--bg-gray)',
};

const qtyBtnStyle = {
  color: 'var(--text-main)',
  padding: '2px',
};

const removeBtnStyle = {
  padding: '8px',
  color: 'var(--text-muted)',
};

const sidebarSummaryStyle = {
  width: '340px',
  flexShrink: 0,
  backgroundColor: '#ffffff',
  padding: '28px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  height: 'fit-content',
  boxShadow: 'var(--shadow-sm)',
};

const summaryTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid var(--border-color)',
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.95rem',
  marginBottom: '12px',
  color: 'var(--text-main)',
};

const freeDeliveryNoticeStyle = {
  fontSize: '0.78rem',
  color: 'var(--primary-rose)',
  backgroundColor: 'var(--primary-rose-light)',
  padding: '8px 12px',
  borderRadius: '8px',
  marginTop: '8px',
  textAlign: 'center',
};
