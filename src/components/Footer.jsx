import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Instagram, Facebook, Twitter, ShieldCheck, Truck, RefreshCw, Headset } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={footerStyle}>
      {/* Brand Value Features Banner */}
      <div style={featuresBannerStyle}>
        <div className="container" style={featuresGridStyle}>
          <div style={featureItemStyle}>
            <Truck size={28} color="var(--primary-rose)" />
            <div>
              <div style={featureTitleStyle}>Free Premium Shipping</div>
              <div style={featureSubStyle}>On all orders above ₹1,499</div>
            </div>
          </div>

          <div style={featureItemStyle}>
            <RefreshCw size={28} color="var(--primary-rose)" />
            <div>
              <div style={featureTitleStyle}>Hassle-Free Returns</div>
              <div style={featureSubStyle}>15-day complimentary exchange</div>
            </div>
          </div>

          <div style={featureItemStyle}>
            <ShieldCheck size={28} color="var(--primary-rose)" />
            <div>
              <div style={featureTitleStyle}>100% Authentic Quality</div>
              <div style={featureSubStyle}>Curated luxury fabrics</div>
            </div>
          </div>

          <div style={featureItemStyle}>
            <Headset size={28} color="var(--primary-rose)" />
            <div>
              <div style={featureTitleStyle}>Dedicated Concierge</div>
              <div style={featureSubStyle}>24/7 fashion support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={mainFooterContentStyle}>
        <div style={footerGridStyle}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Logo size="large" />
            <p style={brandDescStyle}>
              Elevating everyday fashion with modern silhouettes, premium fabrics, and timeless design aesthetics.
            </p>
            <div style={socialRowStyle}>
              <a href="#instagram" style={socialIconStyle} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#facebook" style={socialIconStyle} aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#twitter" style={socialIconStyle} aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 style={footerHeadingStyle}>Shop</h4>
            <div style={linkListStyle}>
              <Link to="/category/women">Women</Link>
              <Link to="/category/men">Men</Link>
              <Link to="/category/dresses">Dresses</Link>
              <Link to="/category/tops">Tops</Link>
              <Link to="/category/bottoms">Bottoms</Link>
              <Link to="/category/shoes">Shoes</Link>
              <Link to="/category/accessories">Accessories</Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={footerHeadingStyle}>Customer Service</h4>
            <div style={linkListStyle}>
              <a href="#contact">Contact Us</a>
              <a href="#faq">FAQ</a>
              <a href="#shipping">Shipping & Handling</a>
              <a href="#returns">Returns & Exchanges</a>
              <Link to="/orders">Order Tracking</Link>
            </div>
          </div>

          {/* Account & Quick Links */}
          <div>
            <h4 style={footerHeadingStyle}>Account</h4>
            <div style={linkListStyle}>
              <Link to="/login">Login / Register</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">Shopping Cart</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/profile">My Profile</Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div style={copyrightRowStyle}>
          <div>© 2026 TRENDY WEAR. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid var(--border-color)',
  marginTop: '80px',
};

const featuresBannerStyle = {
  backgroundColor: 'var(--bg-accent)',
  borderBottom: '1px solid var(--border-color)',
  padding: '36px 0',
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const featureTitleStyle = {
  fontSize: '0.92rem',
  fontWeight: '700',
  color: 'var(--text-main)',
};

const featureSubStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
};

const mainFooterContentStyle = {
  paddingTop: '60px',
  paddingBottom: '30px',
};

const footerGridStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr',
  gap: '40px',
  marginBottom: '60px',
};

const brandDescStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
  lineHeight: 1.6,
  maxWidth: '340px',
};

const socialRowStyle = {
  display: 'flex',
  gap: '12px',
  marginTop: '8px',
};

const socialIconStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-main)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};

const footerHeadingStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  marginBottom: '20px',
  color: 'var(--text-main)',
};

const linkListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
};

const copyrightRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '24px',
  borderTop: '1px solid var(--border-color)',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  flexWrap: 'wrap',
  gap: '12px',
};
