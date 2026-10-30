import axios from 'axios';

const BASE = '/api/auth';

export const registerUser = async (data) => {
  const res = await axios.post(`${BASE}/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${BASE}/login`, data);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
