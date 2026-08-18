import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>My Wishlist</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Saved items you love ({wishlist.length})
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div style={emptyStateContainerStyle}>
          <div style={emptyIconWrapperStyle}>
            <Heart size={48} color="var(--primary-rose)" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginTop: '16px' }}>
            Your wishlist is waiting for something beautiful.
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '8px 0 24px' }}>
            Save your favorite dresses, shirts, accessories, and shoes to keep track of items you love.
          </p>
          <button className="btn btn-rose btn-lg" onClick={() => navigate('/category/all')}>
            Explore Products <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {wishlist.map((item) => (
            <div key={item.id} style={cardStyle}>
              {/* Product Image */}
              <div style={imageWrapperStyle} onClick={() => navigate(`/product/${item.id}`)}>
                <img src={item.image} alt={item.name} style={imgStyle} />
                <button
                  style={removeBtnStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} color="#dc2626" />
                </button>
              </div>

              {/* Card Details */}
              <div style={detailsStyle}>
                <span style={categoryTagStyle}>{item.category}</span>
                <h3 style={itemTitleStyle} onClick={() => navigate(`/product/${item.id}`)}>
                  {item.name}
                </h3>

                <div style={priceRowStyle}>
                  <span style={priceStyle}>₹{item.price}</span>
                  {item.original_price > item.price && (
                    <span style={origPriceStyle}>₹{item.original_price}</span>
                  )}
                </div>

                <button
                  className="btn btn-primary btn-full btn-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => handleMoveToCart(item)}
                >
                  <ShoppingBag size={16} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const headerRowStyle = {
  marginBottom: '32px',
};

const titleStyle = {
  fontSize: '2.2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
};

const emptyStateContainerStyle = {
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '24px',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
};

const imageWrapperStyle = {
  position: 'relative',
  paddingTop: '120%',
  backgroundColor: 'var(--bg-accent)',
  cursor: 'pointer',
};

const imgStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const removeBtnStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const detailsStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const categoryTagStyle = {
  fontSize: '0.72rem',
  fontWeight: '700',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
};

const itemTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  margin: '4px 0 8px',
  cursor: 'pointer',
};

const priceRowStyle = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginTop: 'auto',
};

const priceStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
};

const origPriceStyle = {
  fontSize: '0.82rem',
  textDecoration: 'line-through',
  color: 'var(--text-light)',
};
