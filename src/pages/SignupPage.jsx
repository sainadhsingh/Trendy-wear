import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    const success = await register({ name, email, phone, password });
    setLoading(false);

    if (success) {
      navigate('/profile');
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={splitCardStyle}>
        {/* Left Side Banner */}
        <div style={imageBannerSideStyle}>
          <div style={imageOverlayStyle} />
          <div style={bannerTextStyle}>
            <span style={bannerTagStyle}>
              <Sparkles size={14} /> JOIN TRENDY WEAR
            </span>
            <h2 style={bannerTitleStyle}>Become a Member Today</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem' }}>
              Enjoy exclusive birthday discounts, early access to new seasonal collections, and express checkout.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div style={formSideStyle}>
          <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <span style={welcomeTagStyle}>CREATE ACCOUNT</span>
            <h1 style={titleStyle}>Create Your TRENDY WEAR Account</h1>
            <p style={subTitleStyle}>Fill in your details to get started.</p>

            <form onSubmit={handleSubmit} style={formStyle}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <div style={inputWrapperStyle}>
                  <User size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Sophia Loren"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email Address *</label>
                <div style={inputWrapperStyle}>
                  <Mail size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="email"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="sophia@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={inputWrapperStyle}>
                  <Phone size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="tel"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Password *</label>
                <div style={inputWrapperStyle}>
                  <Lock size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password *</label>
                <div style={inputWrapperStyle}>
                  <Lock size={18} color="var(--text-muted)" style={inputIconStyle} />
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-rose btn-lg btn-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </form>

            <div style={footerLinkStyle}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary-rose)', fontWeight: '700' }}>
                Login
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
  minHeight: '620px',
};

const imageBannerSideStyle = {
  position: 'relative',
  backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80")',
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
  padding: '40px 48px',
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
  fontSize: '1.65rem',
  fontFamily: 'var(--font-serif)',
  fontWeight: '700',
  margin: '4px 0 6px',
};

const subTitleStyle = {
  fontSize: '0.88rem',
  color: 'var(--text-muted)',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '600',
  marginBottom: '4px',
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

const footerLinkStyle = {
  textAlign: 'center',
  fontSize: '0.88rem',
  color: 'var(--text-muted)',
  marginTop: '20px',
};
