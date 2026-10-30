import axios from 'axios';

const BASE = '/api/cart';

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getCart = async (token) => {
  const res = await axios.get(BASE, authHeader(token));
  return res.data;
};

export const addToCart = async (token, product, quantity = 1) => {
  const res = await axios.post(BASE, {
    productId: product._id,
    quantity,
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
  }, authHeader(token));
  return res.data;
};

export const updateCartItem = async (token, itemId, quantity) => {
  const res = await axios.put(`${BASE}/${itemId}`, { quantity }, authHeader(token));
  return res.data;
};

export const removeFromCart = async (token, itemId) => {
  const res = await axios.delete(`${BASE}/${itemId}`, authHeader(token));
  return res.data;
};

export const clearCart = async (token) => {
  const res = await axios.delete(`${BASE}/clear`, authHeader(token));
  return res.data;
};
