import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Compass } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';

export const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/products/trending');
        if (res.ok) {
          const data = await res.json();
          setTrendingProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching trending products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const categories = [
    {
      title: 'Women',
      tag: 'New Collection',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'women',
    },
    {
      title: 'Men',
      tag: 'Urban Style',
      image: 'https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'men',
    },
    {
      title: 'Dresses',
      tag: 'Evening & Party',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'dresses',
    },
    {
      title: 'Tops',
      tag: 'Casual & Shirts',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'tops',
    },
    {
      title: 'Bottoms',
      tag: 'Jeans & Trousers',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'bottoms',
    },
    {
      title: 'Shoes',
      tag: 'Sneakers & Heels',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'shoes',
    },
    {
      title: 'Accessories',
      tag: 'Bags & Jewelry',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      categoryKey: 'accessories',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroOverlayStyle} />
        <div className="container" style={heroContentStyle}>
          <div style={{ maxWidth: '640px' }}>
            <div style={heroTagStyle}>
              <Sparkles size={16} /> AUTUMN / WINTER 2026 EDITION
            </div>
            <h1 style={heroTitleStyle}>
              Style That <br />
              Speaks For You
            </h1>
            <p style={heroSubTitleStyle}>
              Discover your next favorite look with TRENDY WEAR. Curated fashion essentials designed for effortless elegance.
            </p>
            <div style={heroButtonsRowStyle}>
              <button
                className="btn btn-rose btn-lg"
                onClick={() => navigate('/category/women')}
              >
                Shop Women <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-outline btn-lg"
                onClick={() => navigate('/category/men')}
                style={{ borderColor: '#ffffff', color: '#ffffff' }}
              >
                Shop Men
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="container" style={{ marginTop: '70px', marginBottom: '70px' }}>
        <div style={sectionHeaderStyle}>
          <div>
            <div style={sectionSubHeaderStyle}>
              <Compass size={16} color="var(--primary-rose)" /> EXPLORE CATEGORIES
            </div>
            <h2 style={sectionTitleStyle}>Shop By Category</h2>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/category/all')}
          >
            View All Categories <ArrowRight size={14} />
          </button>
        </div>

        <div style={categoryGridStyle}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.title}
              title={cat.title}
              tag={cat.tag}
              image={cat.image}
              categoryKey={cat.categoryKey}
            />
          ))}
        </div>
      </section>

      {/* Promo Highlight Banner */}
      <section className="container" style={{ marginBottom: '70px' }}>
        <div style={promoBannerStyle}>
          <div style={{ maxWidth: '480px', zIndex: 2 }}>
            <span style={promoTagStyle}>EXCLUSIVE OFFER</span>
            <h2 style={promoTitleStyle}>Up To 40% Off New Season Arrivals</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Upgrade your wardrobe with premium silks, organic cottons, and tailored fits.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/category/all')}
            >
              Explore Collection
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
            alt="Fashion Promo"
            style={promoImgStyle}
          />
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={sectionHeaderStyle}>
          <div>
            <div style={sectionSubHeaderStyle}>
              <TrendingUp size={16} color="var(--primary-rose)" /> POPULAR SELECTIONS
            </div>
            <h2 style={sectionTitleStyle}>Trending Now</h2>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/category/all')}
          >
            See All Products <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading TRENDY WEAR collection...
          </div>
        ) : (
          <div style={productGridStyle}>
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const heroSectionStyle = {
  position: 'relative',
  height: '82vh',
  minHeight: '520px',
  backgroundImage: 'url("https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center 30%',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
  overflow: 'hidden',
};

const heroOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(90deg, rgba(20, 22, 25, 0.72) 0%, rgba(20, 22, 25, 0.4) 60%, rgba(0,0,0,0) 100%)',
};

const heroContentStyle = {
  position: 'relative',
  zIndex: 2,
  color: '#ffffff',
};

const heroTagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.78rem',
  fontWeight: '700',
  letterSpacing: '0.18em',
  padding: '6px 14px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(8px)',
  marginBottom: '20px',
};

const heroTitleStyle = {
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  fontWeight: '700',
  lineHeight: 1.1,
  color: '#ffffff',
  marginBottom: '16px',
};

const heroSubTitleStyle = {
  fontSize: '1.1rem',
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: '32px',
  lineHeight: 1.6,
};

const heroButtonsRowStyle = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '32px',
  flexWrap: 'wrap',
  gap: '16px',
};

const sectionSubHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: 'var(--primary-rose)',
  marginBottom: '6px',
};

const sectionTitleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: 'var(--text-main)',
};

const categoryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px',
};

const promoBannerStyle = {
  position: 'relative',
  backgroundColor: 'var(--bg-accent)',
  borderRadius: 'var(--radius-lg)',
  padding: '60px 48px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid var(--border-color)',
};

const promoTagStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: 'var(--primary-rose)',
  display: 'block',
  marginBottom: '8px',
};

const promoTitleStyle = {
  fontSize: '2.2rem',
  fontWeight: '700',
  fontFamily: 'var(--font-serif)',
  lineHeight: 1.2,
  marginBottom: '12px',
};

const promoImgStyle = {
  position: 'absolute',
  right: '-40px',
  top: '-20px',
  height: '130%',
  width: '50%',
  objectFit: 'cover',
  maskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
};

const productGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
  gap: '20px',
};

