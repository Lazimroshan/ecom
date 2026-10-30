import axios from 'axios';

const API_BASE = 'https://dummyjson.com/products';

// Map DummyJSON product shape to our app's expected shape
const mapDummyProduct = (p) => ({
  _id: String(p.id),
  name: p.title || 'Product',
  description: p.description || '',
  price: p.price || 0,
  category: p.category || 'General',
  image: p.thumbnail || 'https://placehold.co/400x300/1a1a2e/7C3AED?text=Product',
  stock: p.stock || 10,
  rating: p.rating || 0,
  numReviews: p.reviews ? p.reviews.length : 0,
});

export const fetchProducts = async (search = '', category = '') => {
  const res = await axios.get(`${API_BASE}?limit=100`);
  let products = res.data.products || [];

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }

  if (category && category !== 'All') {
    products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  return products.map(mapDummyProduct);
};

export const fetchProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return mapDummyProduct(res.data);
};

export const createProduct = async (token, data) => {
  const res = await axios.post(`${API_BASE}/add`, data);
  return mapDummyProduct(res.data);
};

export const updateProduct = async (token, id, data) => {
  const res = await axios.put(`${API_BASE}/${id}`, data);
  return mapDummyProduct(res.data);
};

export const deleteProduct = async (token, id) => {
  await axios.delete(`${API_BASE}/${id}`);
  return { message: 'Product deleted successfully' };
};
