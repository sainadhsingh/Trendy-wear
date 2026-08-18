import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Package, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Women', path: '/category/women' },
    { name: 'Men', path: '/category/men' },
    { name: 'Dresses', path: '/category/dresses' },
    { name: 'Tops', path: '/category/tops' },
    { name: 'Bottoms', path: '/category/bottoms' },
    { name: 'Shoes', path: '/category/shoes' },
    { name: 'Accessories', path: '/category/accessories' },
  ];

  return (
    <header style={headerStyle(isScrolled)}>
      <div className="container" style={navbarContainerStyle}>
        {/* Mobile Hamburger Button */}
        <button
          style={mobileToggleBtnStyle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Logo size="medium" />

        {/* Desktop Navigation Links */}
        <nav style={desktopNavStyle}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.name} to={link.path} style={navLinkStyle(isActive)}>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions Header */}
        <div style={rightActionsStyle}>
          {/* Search Trigger */}
          <button style={actionIconBtnStyle} onClick={onOpenSearch} title="Search Catalog">
            <Search size={20} />
          </button>

          {/* Wishlist Link & Counter Badge */}
          <Link to="/wishlist" style={actionIconBtnStyle} title="Wishlist">
            <Heart size={20} color={wishlistCount > 0 ? 'var(--primary-rose)' : 'currentColor'} fill={wishlistCount > 0 ? 'var(--primary-rose)' : 'none'} />
            {wishlistCount > 0 && <span style={badgeCountStyle}>{wishlistCount}</span>}
          </Link>

          {/* Cart Link & Counter Badge */}
          <Link to="/cart" style={actionCartBtnStyle} title="Shopping Cart">
            <ShoppingBag size={20} />
            <span style={cartTextLabelStyle}>Cart</span>
            <span style={cartBadgePillStyle}>{cartCount}</span>
          </Link>

          {/* User Account / Login */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <button
                style={userAvatarBtnStyle}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                title="Account Menu"
              >
                <User size={18} />
                <span style={userNameNavStyle}>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <Link to="/login" style={loginBtnStyle}>
                Login
              </Link>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && user && (
              <div style={dropdownMenuStyle} onClick={() => setProfileDropdownOpen(false)}>
                <div style={dropdownUserHeaderStyle}>
                  <div style={{ fontWeight: '700' }}>{user.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />
                <Link to="/profile" style={dropdownItemStyle}>
                  <User size={16} /> My Profile
                </Link>
                <Link to="/orders" style={dropdownItemStyle}>
                  <Package size={16} /> My Orders
                </Link>
                <Link to="/wishlist" style={dropdownItemStyle}>
                  <Heart size={16} /> Wishlist ({wishlistCount})
                </Link>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />
                <button
                  style={{ ...dropdownItemStyle, color: '#dc2626', width: '100%', textAlign: 'left' }}
                  onClick={logout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={mobileDrawerOverlayStyle} onClick={() => setMobileMenuOpen(false)}>
          <div style={mobileDrawerStyle} onClick={(e) => e.stopPropagation()}>
            <div style={mobileDrawerHeaderStyle}>
              <Logo size="medium" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ margin: '16px 0' }}>
              <button
                style={mobileSearchBoxStyle}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
              >
                <Search size={18} color="var(--text-muted)" />
                <span>Search TRENDY WEAR...</span>
              </button>
            </div>

            <div style={mobileNavLinksListStyle}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={mobileNavLinkStyle(location.pathname === link.path)}
                >
                  {link.name}
                </Link>
              ))}

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

              <Link to="/wishlist" style={mobileNavLinkStyle(false)}>
                ♡ Wishlist ({wishlistCount})
              </Link>
              <Link to="/cart" style={mobileNavLinkStyle(false)}>
                🛒 Shopping Cart ({cartCount})
              </Link>
              <Link to="/orders" style={mobileNavLinkStyle(false)}>
                📦 My Orders
              </Link>

              {user ? (
                <>
                  <Link to="/profile" style={mobileNavLinkStyle(false)}>
                    👤 Account Profile ({user.name})
                  </Link>
                  <button
                    style={{ ...mobileNavLinkStyle(false), color: '#dc2626', textAlign: 'left', width: '100%' }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ marginTop: '16px' }}>
                  <Link to="/login" className="btn btn-primary btn-full" style={{ marginBottom: '8px' }}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-outline btn-full">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const headerStyle = (isScrolled) => ({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-primary)',
  backdropFilter: isScrolled ? 'blur(12px)' : 'none',
  borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
  transition: 'all 0.3s ease',
});

const navbarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '76px',
};

const mobileToggleBtnStyle = {
  display: 'none',
  padding: '6px',
  color: 'var(--text-main)',
  '@media (max-width: 992px)': {
    display: 'block',
  },
};

const desktopNavStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const navLinkStyle = (isActive) => ({
  fontSize: '0.92rem',
  fontWeight: isActive ? '700' : '500',
  color: isActive ? 'var(--primary-rose)' : 'var(--text-main)',
  position: 'relative',
  padding: '6px 0',
  transition: 'color 0.2s ease',
});

const rightActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
};

const actionIconBtnStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  color: 'var(--text-main)',
  transition: 'background-color 0.2s ease',
};

const badgeCountStyle = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: 'var(--primary-rose)',
  color: '#ffffff',
  fontSize: '0.7rem',
  fontWeight: '700',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const actionCartBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--text-main)',
  color: '#ffffff',
  fontSize: '0.88rem',
  fontWeight: '600',
  transition: 'transform 0.2s ease',
};

const cartTextLabelStyle = {
  display: 'inline',
};

const cartBadgePillStyle = {
  backgroundColor: 'var(--primary-rose)',
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: '700',
  padding: '2px 8px',
  borderRadius: 'var(--radius-full)',
};

const loginBtnStyle = {
  padding: '8px 18px',
  borderRadius: 'var(--radius-full)',
  border: '1.5px solid var(--text-main)',
  color: 'var(--text-main)',
  fontWeight: '600',
  fontSize: '0.88rem',
};

const userAvatarBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-main)',
  fontWeight: '600',
  fontSize: '0.88rem',
};

const userNameNavStyle = {
  maxWidth: '90px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '48px',
  right: 0,
  width: '220px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  border: '1px solid var(--border-color)',
  padding: '8px',
  zIndex: 200,
};

const dropdownUserHeaderStyle = {
  padding: '8px 12px',
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  fontSize: '0.88rem',
  color: 'var(--text-main)',
  fontWeight: '500',
  borderRadius: '8px',
  transition: 'background-color 0.2s ease',
};

const mobileDrawerOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
  zIndex: 999,
};

const mobileDrawerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '80%',
  maxWidth: '320px',
  height: '100vh',
  backgroundColor: '#ffffff',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

const mobileDrawerHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const mobileSearchBoxStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-gray)',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
};

const mobileNavLinksListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const mobileNavLinkStyle = (isActive) => ({
  fontSize: '1rem',
  fontWeight: isActive ? '700' : '500',
  color: isActive ? 'var(--primary-rose)' : 'var(--text-main)',
  padding: '4px 0',
});
