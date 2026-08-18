import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleProductClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header Search Bar */}
        <div style={headerStyle}>
          <Search size={22} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search dresses, shirts, jeans, shoes, bags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            style={searchInputStyle}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={iconBtnStyle}>
              <X size={18} />
            </button>
          )}
          <button onClick={onClose} style={closeBtnStyle}>
            Cancel
          </button>
        </div>

        {/* Popular Tags */}
        <div style={tagsContainerStyle}>
          <span style={tagsLabelStyle}>Popular Searches:</span>
          {['Floral Dress', 'Jeans', 'Oversized Shirt', 'Sneakers', 'Trousers', 'Handbag', 'Hoodie'].map(
            (tag) => (
              <button key={tag} onClick={() => handleTagClick(tag)} style={tagChipStyle}>
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results Area */}
        <div style={resultsContainerStyle}>
          {loading ? (
            <div style={messageStyle}>Searching TRENDY WEAR catalog...</div>
          ) : searchTerm && results.length === 0 ? (
            <div style={emptyStateStyle}>
              <ShoppingBag size={48} color="var(--text-light)" strokeWidth={1.5} />
              <h3 style={{ marginTop: '12px', fontSize: '1.1rem' }}>No products found matching "{searchTerm}"</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Try checking for spelling errors or search another category like dresses, jeans or shoes.
              </p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  onClose();
                  navigate('/category/all');
                }}
              >
                Browse All Products <ArrowRight size={16} />
              </button>
            </div>
          ) : results.length > 0 ? (
            <div style={resultsGridStyle}>
              {results.map((product) => (
                <div
                  key={product.id}
                  style={resultCardStyle}
                  onClick={() => handleProductClick(product.id)}
                >
                  <img src={product.image} alt={product.name} style={resultImgStyle} />
                  <div style={{ flex: 1 }}>
                    <div style={resultCategoryStyle}>{product.category} • {product.subcategory}</div>
                    <div style={resultNameStyle}>{product.name}</div>
                    <div style={priceContainerStyle}>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹{product.price}</span>
                      {product.original_price > product.price && (
                        <span style={origPriceStyle}>₹{product.original_price}</span>
                      )}
                      {product.discount > 0 && (
                        <span className="badge badge-discount">{product.discount}% OFF</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={messageStyle}>Type to search across Women, Men, Accessories, and more.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(6px)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '60px',
};

const modalStyle = {
  backgroundColor: '#ffffff',
  width: '100%',
  maxWidth: '750px',
  maxHeight: '80vh',
  borderRadius: '20px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 24px',
  borderBottom: '1px solid var(--border-color)',
  gap: '12px',
};

const searchInputStyle = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '1.05rem',
  color: 'var(--text-main)',
};

const iconBtnStyle = {
  color: 'var(--text-muted)',
  padding: '4px',
};

const closeBtnStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: 'var(--primary-rose)',
};

const tagsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 24px',
  backgroundColor: 'var(--bg-primary)',
  borderBottom: '1px solid var(--border-color)',
};

const tagsLabelStyle = {
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
};

const tagChipStyle = {
  fontSize: '0.78rem',
  padding: '4px 12px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: '#ffffff',
  border: '1px solid var(--border-color)',
  color: 'var(--text-main)',
  cursor: 'pointer',
};

const resultsContainerStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px',
};

const messageStyle = {
  textAlign: 'center',
  color: 'var(--text-muted)',
  padding: '40px 0',
  fontSize: '0.95rem',
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '40px 20px',
};

const resultsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
};

const resultCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '10px',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const resultImgStyle = {
  width: '64px',
  height: '74px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const resultCategoryStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  fontWeight: '600',
};

const resultNameStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: 'var(--text-main)',
  marginBottom: '4px',
};

const priceContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.85rem',
};

const origPriceStyle = {
  textDecoration: 'line-through',
  color: 'var(--text-light)',
  fontSize: '0.8rem',
};
