import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          const p = data.product;
          setProduct(p);
          setSelectedImage(p.image);
          if (p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
          if (p.colors && p.colors.length > 0) setSelectedColor(p.colors[0]);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/category/all')}>
          Browse All Products
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const thumbnails = [product.image, ...(product.additional_images || [])];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={detailsGridStyle}>
        {/* Left Side Gallery */}
        <div style={galleryContainerStyle}>
          {/* Main Large Image */}
          <div style={mainImgWrapperStyle}>
            <img src={selectedImage} alt={product.name} style={mainImgStyle} />
            <button
              style={wishlistFloatingBtnStyle(isLiked)}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={20} fill={isLiked ? 'var(--primary-rose)' : 'none'} color={isLiked ? 'var(--primary-rose)' : '#444'} />
            </button>
          </div>

          {/* Thumbnails */}
          <div style={thumbnailsRowStyle}>
            {thumbnails.map((img, idx) => (
              <button
                key={idx}
                style={thumbnailBtnStyle(selectedImage === img)}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt="" style={thumbnailImgStyle} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Info */}
        <div style={infoWrapperStyle}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-category">{product.category}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {product.subcategory}</span>
          </div>

          <h1 style={titleStyle}>{product.name}</h1>

          {/* Ratings */}
          <div style={ratingRowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-light)' }}>|</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {product.review_count} Customer Reviews
            </span>
          </div>

          {/* Pricing */}
          <div style={priceContainerStyle}>
            <span style={currentPriceStyle}>₹{product.price}</span>
            {product.original_price > product.price && (
              <span style={originalPriceStyle}>₹{product.original_price}</span>
            )}
            {product.discount > 0 && (
              <span className="badge badge-discount">{product.discount}% OFF</span>
            )}
          </div>

          <p style={descriptionStyle}>{product.description}</p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={sectionSelectorStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={selectorTitleStyle}>Select Size</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-rose)', cursor: 'pointer', fontWeight: '600' }}>
                  Size Guide
                </span>
              </div>
              <div style={optionsFlexStyle}>
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    style={sizePillStyle(selectedSize === sz)}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div style={sectionSelectorStyle}>
              <span style={selectorTitleStyle}>Select Color: <strong>{selectedColor}</strong></span>
              <div style={optionsFlexStyle}>
                {product.colors.map((col) => (
                  <button
                    key={col}
                    style={colorChipStyle(selectedColor === col)}
                    onClick={() => setSelectedColor(col)}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={sectionSelectorStyle}>
            <span style={selectorTitleStyle}>Quantity</span>
            <div style={qtyBoxStyle}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={qtyBtnStyle}>
                <Minus size={16} />
              </button>
              <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={qtyBtnStyle}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={actionButtonsRowStyle}>
            <button className="btn btn-rose btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={guaranteesBoxStyle}>
            <div style={guaranteeItemStyle}>
              <Truck size={20} color="var(--primary-rose)" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Free Express Delivery</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated delivery in 3–5 business days</div>
              </div>
            </div>
            <div style={guaranteeItemStyle}>
              <RefreshCw size={20} color="var(--primary-rose)" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Easy 15-Day Exchange</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hassle-free doorstep pickup</div>
              </div>
            </div>
            <div style={guaranteeItemStyle}>
              <ShieldCheck size={20} color="var(--primary-rose)" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Secure Checkout</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Protected payments via UPI & Cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const detailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '48px',
};

const galleryContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const mainImgWrapperStyle = {
  position: 'relative',
  width: '100%',
  paddingTop: '125%',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  backgroundColor: 'var(--bg-accent)',
};

const mainImgStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const wishlistFloatingBtnStyle = (isLiked) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  backgroundColor: isLiked ? 'var(--bg-pink)' : '#ffffff',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const thumbnailsRowStyle = {
  display: 'flex',
  gap: '12px',
};

const thumbnailBtnStyle = (isActive) => ({
  width: '74px',
  height: '90px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: isActive ? '2px solid var(--primary-rose)' : '1px solid var(--border-color)',
  cursor: 'pointer',
});

const thumbnailImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const infoWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle = {
  fontSize: '2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  margin: '12px 0 8px',
};

const ratingRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
};

const priceContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
};

const currentPriceStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'var(--text-main)',
};

const originalPriceStyle = {
  fontSize: '1.2rem',
  textDecoration: 'line-through',
  color: 'var(--text-light)',
};

const descriptionStyle = {
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  fontSize: '0.95rem',
};

const sectionSelectorStyle = {
  marginBottom: '20px',
};

const selectorTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  display: 'block',
  marginBottom: '8px',
};

const optionsFlexStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

const sizePillStyle = (isSelected) => ({
  padding: '8px 18px',
  borderRadius: 'var(--radius-md)',
  border: isSelected ? '2px solid var(--primary-rose)' : '1px solid var(--border-color)',
  backgroundColor: isSelected ? 'var(--primary-rose-light)' : '#ffffff',
  color: isSelected ? 'var(--primary-rose)' : 'var(--text-main)',
  fontWeight: '700',
  fontSize: '0.9rem',
  cursor: 'pointer',
});

const colorChipStyle = (isSelected) => ({
  padding: '8px 16px',
  borderRadius: 'var(--radius-full)',
  border: isSelected ? '2px solid var(--primary-rose)' : '1px solid var(--border-color)',
  backgroundColor: isSelected ? 'var(--bg-subtle)' : '#ffffff',
  color: 'var(--text-main)',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
});

const qtyBoxStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '16px',
  padding: '6px 14px',
  borderRadius: 'var(--radius-full)',
  border: '1px solid var(--border-color)',
  backgroundColor: '#ffffff',
};

const qtyBtnStyle = {
  color: 'var(--text-main)',
  padding: '4px',
};

const actionButtonsRowStyle = {
  display: 'flex',
  gap: '16px',
  marginTop: '24px',
  marginBottom: '32px',
};

const guaranteesBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-accent)',
  border: '1px solid var(--border-color)',
};

const guaranteeItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};
