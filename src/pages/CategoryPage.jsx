import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const activeCategory = categoryName || 'all';

  // Map subcategories for each category
  const subcategoryMap = {
    women: ['Dresses', 'Tops', 'Jeans', 'Trousers', 'Skirts', 'Jackets', 'Ethnic Wear'],
    men: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Hoodies', 'Jackets', 'Ethnic Wear'],
    dresses: ['Casual Dresses', 'Party Dresses', 'Floral Dresses', 'Maxi Dresses', 'Mini Dresses', 'Formal Dresses'],
    tops: ['T-Shirts', 'Shirts', 'Blouses', 'Crop Tops', 'Sweaters'],
    bottoms: ['Jeans', 'Trousers', 'Shorts', 'Skirts', 'Cargo Pants'],
    shoes: ['Sneakers', 'Casual Shoes', 'Formal Shoes', 'Sandals', 'Boots'],
    accessories: ['Bags', 'Watches', 'Sunglasses', 'Belts', 'Jewelry'],
    all: [],
  };

  const subcategories = subcategoryMap[activeCategory.toLowerCase()] || [];

  // Reset filters on category change
  useEffect(() => {
    setSelectedSubcategory('');
    setPriceRange('');
    setSelectedSize('');
    setSelectedColor('');
    setMinRating('');
    setSortBy('recommended');
  }, [activeCategory]);

  // Fetch products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?sortBy=${sortBy}`;

        if (activeCategory !== 'all') {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        if (selectedSubcategory) {
          url += `&subcategory=${encodeURIComponent(selectedSubcategory)}`;
        }

        // Price range parsing
        if (priceRange === 'under500') {
          url += '&maxPrice=500';
        } else if (priceRange === '500-1000') {
          url += '&minPrice=500&maxPrice=1000';
        } else if (priceRange === '1000-2000') {
          url += '&minPrice=1000&maxPrice=2000';
        } else if (priceRange === 'above2000') {
          url += '&minPrice=2000';
        }

        if (selectedSize) {
          url += `&size=${encodeURIComponent(selectedSize)}`;
        }
        if (selectedColor) {
          url += `&color=${encodeURIComponent(selectedColor)}`;
        }
        if (minRating) {
          url += `&rating=${minRating}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeCategory, selectedSubcategory, priceRange, selectedSize, selectedColor, minRating, sortBy]);

  const handleResetFilters = () => {
    setSelectedSubcategory('');
    setPriceRange('');
    setSelectedSize('');
    setSelectedColor('');
    setMinRating('');
    setSortBy('recommended');
  };

  const categoryTitles = {
    women: 'Women Collection',
    men: 'Men Collection',
    dresses: 'Dresses & Gowns',
    tops: 'Tops & Shirts',
    bottoms: 'Jeans & Trousers',
    shoes: 'Footwear',
    accessories: 'Accessories & Bags',
    all: 'All Fashion Products',
  };

  const categoryBannerImg = {
    women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
    men: 'https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?auto=format&fit=crop&w=1600&q=80',
    dresses: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1600&q=80',
    tops: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1600&q=80',
    bottoms: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=80',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80',
    accessories: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80',
    all: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  };

  return (
    <div>
      {/* Category Banner */}
      <section style={bannerStyle(categoryBannerImg[activeCategory.toLowerCase()] || categoryBannerImg.all)}>
        <div style={bannerOverlayStyle} />
        <div className="container" style={bannerContentStyle}>
          <span style={bannerCategoryTagStyle}>TRENDY WEAR</span>
          <h1 style={bannerTitleStyle}>
            {categoryTitles[activeCategory.toLowerCase()] || `${activeCategory} Collection`}
          </h1>
          <p style={bannerSubTitleStyle}>
            Showing {products.length} curated fashion items
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
        {/* Subcategories Filter Chips */}
        {subcategories.length > 0 && (
          <div style={subcatChipsContainerStyle}>
            <button
              style={chipStyle(!selectedSubcategory)}
              onClick={() => setSelectedSubcategory('')}
            >
              All {activeCategory}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                style={chipStyle(selectedSubcategory === sub)}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Action Controls Bar */}
        <div style={controlsRowStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <strong>{products.length}</strong> products found
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={sortSelectStyle}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Main Section Layout: Filter Sidebar + Products Grid */}
        <div style={layoutGridStyle}>
          {/* Filter Sidebar */}
          <aside style={sidebarStyle(filterDrawerOpen)}>
            <div style={sidebarHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <Filter size={18} /> Filter Products
              </div>
              <button onClick={handleResetFilters} style={resetBtnStyle}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Price Filter */}
            <div style={filterGroupStyle}>
              <h4 style={filterTitleStyle}>Price Range</h4>
              <div style={optionsListStyle}>
                {[
                  { label: 'All Prices', value: '' },
                  { label: 'Under ₹500', value: 'under500' },
                  { label: '₹500 – ₹1,000', value: '500-1000' },
                  { label: '₹1,000 – ₹2,000', value: '1000-2000' },
                  { label: 'Above ₹2,000', value: 'above2000' },
                ].map((opt) => (
                  <label key={opt.value} style={labelRadioStyle}>
                    <input
                      type="radio"
                      name="price"
                      value={opt.value}
                      checked={priceRange === opt.value}
                      onChange={() => setPriceRange(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={filterGroupStyle}>
              <h4 style={filterTitleStyle}>Size</h4>
              <div style={sizeGridStyle}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    style={sizeBoxStyle(selectedSize === sz)}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div style={filterGroupStyle}>
              <h4 style={filterTitleStyle}>Color</h4>
              <div style={optionsListStyle}>
                {[
                  { name: 'All Colors', val: '' },
                  { name: 'White', val: 'White' },
                  { name: 'Black', val: 'Black' },
                  { name: 'Beige', val: 'Beige' },
                  { name: 'Pink', val: 'Pink' },
                  { name: 'Blue', val: 'Blue' },
                  { name: 'Soft Lavender', val: 'Soft Lavender' },
                ].map((col) => (
                  <label key={col.val} style={labelRadioStyle}>
                    <input
                      type="radio"
                      name="color"
                      value={col.val}
                      checked={selectedColor === col.val}
                      onChange={() => setSelectedColor(col.val)}
                    />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div style={filterGroupStyle}>
              <h4 style={filterTitleStyle}>Rating</h4>
              <div style={optionsListStyle}>
                {[
                  { label: 'All Ratings', val: '' },
                  { label: '4★ & above', val: '4.0' },
                  { label: '4.5★ & above', val: '4.5' },
                ].map((rt) => (
                  <label key={rt.val} style={labelRadioStyle}>
                    <input
                      type="radio"
                      name="rating"
                      value={rt.val}
                      checked={minRating === rt.val}
                      onChange={() => setMinRating(rt.val)}
                    />
                    <span>{rt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main style={{ flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                Filtering products...
              </div>
            ) : products.length === 0 ? (
              <div style={emptyGridStyle}>
                <h3>No products found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                  No items matched your current filter criteria. Try resetting filters.
                </p>
                <button className="btn btn-outline" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={productsGridStyle}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const bannerStyle = (imgUrl) => ({
  position: 'relative',
  height: '240px',
  backgroundImage: `url("${imgUrl}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
  overflow: 'hidden',
});

const bannerOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(20, 22, 25, 0.55)',
};

const bannerContentStyle = {
  position: 'relative',
  zIndex: 2,
  color: '#ffffff',
};

const bannerCategoryTagStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.2em',
  color: 'var(--primary-rose-light)',
  textTransform: 'uppercase',
};

const bannerTitleStyle = {
  fontSize: '2.5rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  color: '#ffffff',
  margin: '4px 0',
};

const bannerSubTitleStyle = {
  fontSize: '0.95rem',
  color: 'rgba(255, 255, 255, 0.85)',
};

const subcatChipsContainerStyle = {
  display: 'flex',
  gap: '10px',
  overflowX: 'auto',
  paddingBottom: '12px',
  marginBottom: '24px',
};

const chipStyle = (isActive) => ({
  whiteSpace: 'nowrap',
  padding: '8px 18px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.88rem',
  fontWeight: '600',
  backgroundColor: isActive ? 'var(--text-main)' : 'var(--bg-surface)',
  color: isActive ? '#ffffff' : 'var(--text-main)',
  border: isActive ? '1px solid var(--text-main)' : '1px solid var(--border-color)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const controlsRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '28px',
  paddingBottom: '16px',
  borderBottom: '1px solid var(--border-color)',
  flexWrap: 'wrap',
  gap: '16px',
};

const sortSelectStyle = {
  padding: '8px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  backgroundColor: '#ffffff',
  fontSize: '0.88rem',
  color: 'var(--text-main)',
  outline: 'none',
};

const layoutGridStyle = {
  display: 'flex',
  gap: '36px',
};

const sidebarStyle = (isOpen) => ({
  width: '260px',
  flexShrink: 0,
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  height: 'fit-content',
});

const sidebarHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid var(--border-color)',
};

const resetBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.78rem',
  color: 'var(--primary-rose)',
  fontWeight: '600',
};

const filterGroupStyle = {
  marginBottom: '24px',
};

const filterTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  marginBottom: '12px',
};

const optionsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const labelRadioStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.85rem',
  color: 'var(--text-main)',
  cursor: 'pointer',
};

const sizeGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
};

const sizeBoxStyle = (isSelected) => ({
  padding: '6px',
  borderRadius: '8px',
  border: isSelected ? '1.5px solid var(--primary-rose)' : '1px solid var(--border-color)',
  backgroundColor: isSelected ? 'var(--primary-rose-light)' : 'transparent',
  color: isSelected ? 'var(--primary-rose)' : 'var(--text-main)',
  fontWeight: '600',
  fontSize: '0.8rem',
  cursor: 'pointer',
});

const productsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '18px',
};


const emptyGridStyle = {
  textAlign: 'center',
  padding: '80px 20px',
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
};
