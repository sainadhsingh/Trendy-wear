import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'medium', light = false }) => {
  const isLarge = size === 'large';
  const logoHeight = isLarge ? 42 : 32;

  return (
    <Link to="/" style={logoContainerStyle}>
      <svg
        width={logoHeight}
        height={logoHeight}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Hanger & Monogram Hybrid Icon */}
        <circle cx="24" cy="24" r="23" fill={light ? '#ffffff' : '#f3e8eb'} stroke={light ? '#ffffff' : '#c87588'} strokeWidth="1.5" />
        {/* Hanger Hook */}
        <path
          d="M24 13C25.6569 13 27 14.3431 27 16C27 17.6569 25.6569 19 24 19C22.3431 19 21 17.6569 21 16"
          stroke="#c87588"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Hanger Body */}
        <path
          d="M24 19L14 27C13 27.8 13.5 29 14.8 29H33.2C34.5 29 35 27.8 34 27L24 19Z"
          stroke="#1a1d20"
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Stylized TW Monogram Accent Line */}
        <path
          d="M18 34H30"
          stroke="#c87588"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: isLarge ? '1.5rem' : '1.25rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            color: light ? '#ffffff' : 'var(--text-main)',
            lineHeight: 1.1,
          }}
        >
          TRENDY <span style={{ color: 'var(--primary-rose)', fontWeight: '400' }}>WEAR</span>
        </span>
        <span
          style={{
            fontSize: '0.55rem',
            fontWeight: '600',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: light ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
            marginTop: '1px',
          }}
        >
          PARIS • MUMBAI
        </span>
      </div>
    </Link>
  );
};

const logoContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  userSelect: 'none',
};
