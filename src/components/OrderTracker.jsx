import React from 'react';
import { Check, Clock, Truck, Package, Home } from 'lucide-react';

export const OrderTracker = ({ status }) => {
  const steps = [
    { label: 'Order Placed', icon: Clock },
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', icon: Home },
  ];

  const getStatusIndex = (currStatus) => {
    switch (currStatus) {
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      case 'Order Placed':
      default:
        return 0;
    }
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div style={trackerContainerStyle}>
      <div style={progressLineBackgroundStyle}>
        <div
          style={{
            ...progressLineActiveStyle,
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      <div style={stepsRowStyle}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.label} style={stepColumnStyle}>
              <div style={circleNodeStyle(isCompleted, isCurrent)}>
                {isCompleted ? (
                  <Check size={16} color="#ffffff" strokeWidth={3} />
                ) : (
                  <StepIcon size={16} color={isCurrent ? '#ffffff' : 'var(--text-muted)'} />
                )}
              </div>
              <span style={labelStyle(isCompleted || isCurrent)}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const trackerContainerStyle = {
  position: 'relative',
  padding: '24px 12px 10px',
  width: '100%',
};

const progressLineBackgroundStyle = {
  position: 'absolute',
  top: '40px',
  left: '40px',
  right: '40px',
  height: '4px',
  backgroundColor: 'var(--bg-subtle)',
  zIndex: 1,
};

const progressLineActiveStyle = {
  height: '100%',
  backgroundColor: 'var(--primary-rose)',
  transition: 'width 0.5s ease',
};

const stepsRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 2,
};

const stepColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const circleNodeStyle = (isCompleted, isCurrent) => ({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: isCompleted
    ? 'var(--primary-rose)'
    : isCurrent
    ? 'var(--text-main)'
    : '#ffffff',
  border: isCompleted || isCurrent ? 'none' : '2px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: isCurrent ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  transition: 'all 0.3s ease',
});

const labelStyle = (isActive) => ({
  fontSize: '0.82rem',
  fontWeight: isActive ? '700' : '500',
  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
  textAlign: 'center',
});
