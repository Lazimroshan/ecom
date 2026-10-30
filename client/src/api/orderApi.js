import axios from 'axios';

const BASE = '/api/orders';

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const placeOrder = async (token, data) => {
  const res = await axios.post(BASE, data, authHeader(token));
  return res.data;
};

export const getMyOrders = async (token) => {
  const res = await axios.get(`${BASE}/mine`, authHeader(token));
  return res.data;
};

export const getAllOrders = async (token) => {
  const res = await axios.get(BASE, authHeader(token));
  return res.data;
};

export const updateOrderStatus = async (token, id, status) => {
  const res = await axios.put(`${BASE}/${id}`, { status }, authHeader(token));
  return res.data;
};
