import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { addToast } = useToast();

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && token) {
        try {
          const res = await fetch('/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setWishlist(data.wishlist);
          }
        } catch (err) {
          console.error('Error fetching DB wishlist:', err);
        }
      } else {
        const local = localStorage.getItem('tw_guest_wishlist');
        setWishlist(local ? JSON.parse(local) : []);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [user, token]);

  // Persist guest wishlist
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem('tw_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user, loading]);

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId || item.product_id === productId);
  };

  // Toggle Wishlist
  const toggleWishlist = async (product) => {
    const productId = product.id;

    if (user && token) {
      try {
        const res = await fetch('/api/wishlist/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.action === 'added') {
            setWishlist((prev) => [...prev, product]);
            addToast('Added to wishlist!');
          } else {
            setWishlist((prev) => prev.filter((p) => p.id !== productId && p.product_id !== productId));
            addToast('Removed from wishlist.');
          }
        }
      } catch (err) {
        addToast('Failed to update wishlist.', 'error');
      }
    } else {
      // Guest local state
      if (isInWishlist(productId)) {
        setWishlist((prev) => prev.filter((p) => p.id !== productId));
        addToast('Removed from wishlist.');
      } else {
        setWishlist((prev) => [...prev, product]);
        addToast('Added to wishlist!');
      }
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
