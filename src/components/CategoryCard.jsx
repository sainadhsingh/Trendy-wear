import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCard = ({ title, image, tag, categoryKey }) => {
  const navigate = useNavigate();

  return (
    <div
      style={cardStyle}
      onClick={() => navigate(`/category/${categoryKey || title.toLowerCase()}`)}
    >
      <img src={image} alt={title} style={imageStyle} className="category-img" />
      <div style={overlayStyle} />
      <div style={contentStyle}>
        <div>
          {tag && <span style={tagStyle}>{tag}</span>}
          <h3 style={titleStyle}>{title}</h3>
        </div>
        <button style={buttonStyle} aria-label={`Shop ${title}`}>
          <span>Shop Now</span>
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

const cardStyle = {
  position: 'relative',
  height: '320px',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-md)',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.6s ease',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
};

const contentStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 2,
};

const tagStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(8px)',
  padding: '4px 10px',
  borderRadius: 'var(--radius-full)',
  display: 'inline-block',
  marginBottom: '8px',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#ffffff',
  margin: 0,
};

const buttonStyle = {
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 18px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: '#ffffff',
  color: 'var(--text-main)',
  fontSize: '0.85rem',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
};
