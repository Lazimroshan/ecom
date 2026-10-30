import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      setCartLoading(true);
      const data = await getCart(user.token);
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (product, quantity = 1) => {
    try {
      const data = await addToCart(user.token, product, quantity);
      setCart(data);
    } catch (error) {
      console.error('addToCart error:', error);
      throw error;
    }
  };

  const updateItem = async (itemId, quantity) => {
    const data = await updateCartItem(user.token, itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const data = await removeFromCart(user.token, itemId);
    setCart(data);
  };

  const clearLocalCart = () => setCart({ items: [] });

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  ) || 0;

  return (
    <CartContext.Provider value={{
      cart, cartItems: cart.items, cartCount, cartTotal, cartLoading,
      addItem, updateItem, removeItem, fetchCart, clearLocalCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
