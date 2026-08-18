import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={containerStyle}>
        {toasts.map((toast) => (
          <div key={toast.id} style={getToastStyle(toast.type)}>
            <span>{toast.message}</span>
            <button style={closeBtnStyle} onClick={() => removeToast(toast.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const containerStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  pointerEvents: 'none',
};

const getToastStyle = (type) => ({
  pointerEvents: 'auto',
  minWidth: '260px',
  padding: '12px 18px',
  borderRadius: '12px',
  backgroundColor: type === 'error' ? '#2c1518' : '#1e242b',
  color: '#ffffff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  fontWeight: '500',
  animation: 'slideIn 0.3s ease-out',
});

const closeBtnStyle = {
  color: 'rgba(255,255,255,0.6)',
  marginLeft: '12px',
  fontSize: '0.9rem',
  cursor: 'pointer',
};
