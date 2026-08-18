import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/profile');
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={splitCardStyle}>
        {/* Left Side: Desktop Fashion Image Banner */}
        <div style={imageBannerSideStyle}>
          <div style={imageOverlayStyle} />
          <div style={bannerTextStyle}>
            <span style={bannerTagStyle}>
              <Sparkles size={14} /> EXCLUSIVE FASHION CLUB
            </span>
            <h2 style={bannerTitleStyle}>Discover Your Next Favorite Look</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem' }}>
              Sign in to manage your wishlist, track orders in real-time, and unlock tailored recommendations.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={formSideStyle}>
          <div style={{ maxWidth: '380px', margin: '0 auto', width: '100%' }}>
            <span style={welcomeTagStyle}>WELCOME BACK</span>
            <h1 style={titleStyle}>Welcome Back to TRENDY WEAR</h1>
            <p style={subTitleStyle}>Please enter your credentials to access your account.</p>

            <form onSubmit={handleSubmit} style={formStyle}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapperStyle}>
                  <Mail size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="email"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="demo@trendywear.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={labelStyle}>Password</label>
                  <a href="#forgot" style={{ fontSize: '0.8rem', color: 'var(--primary-rose)', fontWeight: '600' }}>
                    Forgot Password?
                  </a>
                </div>
                <div style={inputWrapperStyle}>
                  <Lock size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-rose btn-lg btn-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Login'} <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn btn-outline btn-full"
                onClick={() => {
                  setEmail('demo@trendywear.com');
                  setPassword('password123');
                }}
              >
                Use Demo Credentials
              </button>

              <div style={dividerRowStyle}>
                <hr style={dividerLineStyle} />
                <span style={dividerTextStyle}>OR</span>
                <hr style={dividerLineStyle} />
              </div>

              <button type="button" className="btn btn-secondary btn-full" style={{ gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </form>

            <div style={footerLinkStyle}>
              Don't have an account yet?{' '}
              <Link to="/signup" style={{ color: 'var(--primary-rose)', fontWeight: '700' }}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const splitCardStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  backgroundColor: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
  minHeight: '580px',
};

const imageBannerSideStyle = {
  position: 'relative',
  backgroundImage: 'url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '48px',
};

const imageOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(20, 22, 25, 0.8) 0%, rgba(20, 22, 25, 0.2) 60%, rgba(0,0,0,0) 100%)',
};

const bannerTextStyle = {
  position: 'relative',
  zIndex: 2,
  color: '#ffffff',
};

const bannerTagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.72rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  padding: '4px 12px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(8px)',
  marginBottom: '12px',
};

const bannerTitleStyle = {
  fontSize: '2rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  lineHeight: 1.2,
  marginBottom: '8px',
};

const formSideStyle = {
  padding: '48px',
  display: 'flex',
  alignItems: 'center',
};

const welcomeTagStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: 'var(--primary-rose)',
};

const titleStyle = {
  fontSize: '1.8rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  margin: '4px 0 8px',
};

const subTitleStyle = {
  fontSize: '0.88rem',
  color: 'var(--text-muted)',
  marginBottom: '24px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '6px',
};

const inputWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputIconStyle = {
  position: 'absolute',
  left: '14px',
};

const dividerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0',
};

const dividerLineStyle = {
  flex: 1,
  border: 'none',
  borderTop: '1px solid var(--border-color)',
};

const dividerTextStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  padding: '0 12px',
  fontWeight: '600',
};

const footerLinkStyle = {
  textAlign: 'center',
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  marginTop: '24px',
};
