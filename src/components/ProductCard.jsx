import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isLiked = isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div style={cardStyle} className="product-card" onClick={handleCardClick}>
      {/* Image Container */}
      <div style={imageContainerStyle}>
        <img
          src={product.image}
          alt={product.name}
          style={imageStyle}
          className="product-img"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div style={discountBadgeStyle}>
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          style={wishlistBtnStyle(isLiked)}
          onClick={handleWishlistClick}
          aria-label="Toggle Wishlist"
        >
          <Heart
            size={18}
            fill={isLiked ? 'var(--primary-rose)' : 'none'}
            color={isLiked ? 'var(--primary-rose)' : '#444444'}
          />
        </button>

        {/* Overlay Quick Add Button */}
        <button
          style={quickAddBtnStyle}
          onClick={handleAddToCartClick}
          className="quick-add-btn"
        >
          <ShoppingBag size={16} /> Quick Add
        </button>
      </div>

      {/* Product Information */}
      <div style={infoContainerStyle}>
        <div style={metaRowStyle}>
          <span style={categoryStyle}>{product.category}</span>
          <div style={ratingStyle}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: '600', marginLeft: '3px' }}>{product.rating}</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginLeft: '2px' }}>
              ({product.review_count})
            </span>
          </div>
        </div>

        <h3 style={titleStyle}>{product.name}</h3>

        <div style={priceRowStyle}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={currentPriceStyle}>₹{product.price}</span>
            {product.original_price > product.price && (
              <span style={originalPriceStyle}>₹{product.original_price}</span>
            )}
          </div>

          <button
            style={cartIconBtnStyle}
            onClick={handleAddToCartClick}
            aria-label="Add to Cart"
            title="Add to Cart"
          >
            <ShoppingBag size={18} color="var(--text-main)" />
          </button>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

const imageContainerStyle = {
  position: 'relative',
  width: '100%',
  paddingTop: '110%',
  overflow: 'hidden',
  backgroundColor: 'var(--bg-accent)',
};

const imageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
};

const discountBadgeStyle = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  backgroundColor: 'var(--primary-rose)',
  color: '#ffffff',
  fontSize: '0.68rem',
  fontWeight: '700',
  padding: '3px 8px',
  borderRadius: 'var(--radius-full)',
  letterSpacing: '0.04em',
  zIndex: 2,
};

const wishlistBtnStyle = (isLiked) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: isLiked ? 'var(--bg-pink)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  zIndex: 2,
  transition: 'transform 0.2s ease',
});

const quickAddBtnStyle = {
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  right: '8px',
  padding: '8px 12px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  color: 'var(--text-main)',
  fontSize: '0.78rem',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
  opacity: 0,
  transform: 'translateY(8px)',
  transition: 'all 0.3s ease',
  zIndex: 2,
};

const infoContainerStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'space-between',
};

const metaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
};

const categoryStyle = {
  fontSize: '0.7rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const ratingStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
};

const titleStyle = {
  fontSize: '0.88rem',
  fontWeight: '600',
  color: 'var(--text-main)',
  marginBottom: '8px',
  lineHeight: 1.3,
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const priceRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
};

const currentPriceStyle = {
  fontSize: '0.98rem',
  fontWeight: '700',
  color: 'var(--text-main)',
};

const originalPriceStyle = {
  fontSize: '0.78rem',
  textDecoration: 'line-through',
  color: 'var(--text-light)',
};

const cartIconBtnStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--bg-subtle)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',
};

