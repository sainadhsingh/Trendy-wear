import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { addToast } = useToast();

  // Load Cart
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        try {
          const res = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCart(data.cart);
          }
        } catch (err) {
          console.error('Error loading DB cart:', err);
        }
      } else {
        // Guest mode fallback via localStorage
        const localCart = localStorage.getItem('tw_guest_cart');
        setCart(localCart ? JSON.parse(localCart) : []);
      }
      setLoading(false);
    };

    fetchCart();
  }, [user, token]);

  // Save guest cart to localStorage when not logged in
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem('tw_guest_cart', JSON.stringify(cart));
    }
  }, [cart, user, loading]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'M';
    const color = selectedColor || (product.colors && product.colors[0]) || 'Default';

    if (user && token) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            selectedSize: size,
            selectedColor: color,
          }),
        });

        if (res.ok) {
          // Refresh cart from server
          const cartRes = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cartData = await cartRes.json();
          setCart(cartData.cart);
          addToast('Added to cart successfully!');
        }
      } catch (err) {
        addToast('Failed to add to cart.', 'error');
      }
    } else {
      // Guest local state update
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selected_size === size &&
            item.selected_color === color
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              cart_item_id: `guest_${Date.now()}_${Math.random()}`,
              quantity,
              selected_size: size,
              selected_color: color,
              product,
            },
          ];
        }
      });
      addToast('Added to cart successfully!');
    }
  };

  // Update Quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }

    if (user && token) {
      try {
        const res = await fetch(`/api/cart/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });

        if (res.ok) {
          setCart((prev) =>
            prev.map((item) =>
              item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      } catch (err) {
        addToast('Failed to update quantity.', 'error');
      }
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove Item
  const removeFromCart = async (cartItemId) => {
    if (user && token) {
      try {
        await fetch(`/api/cart/${cartItemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
        addToast('Item removed from cart.');
      } catch (err) {
        addToast('Failed to remove item.', 'error');
      }
    } else {
      setCart((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
      addToast('Item removed from cart.');
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (user && token) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    }
    setCart([]);
    localStorage.removeItem('tw_guest_cart');
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalDiscount = cart.reduce((total, item) => {
    const origPrice = item.product.original_price || item.product.price;
    return total + (origPrice - item.product.price) * item.quantity;
  }, 0);

  const deliveryCharge = subtotal > 1499 || cart.length === 0 ? 0 : 99;

  const totalAmount = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        totalDiscount,
        deliveryCharge,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
