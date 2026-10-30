import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiUsers,
  FiSettings,
  FiBarChart,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiCreditCard,
} from 'react-icons/fi';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/productApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Beauty',
  'Toys',
  'Other',
];

const NAV_ITEMS = [
  { id: 'products', label: 'Products', icon: <FiPackage size={18} /> },
  { id: 'orders', label: 'Orders', icon: <FiShoppingCart size={18} /> },
  { id: 'customers', label: 'Customers', icon: <FiUsers size={18} /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings size={18} /> },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: '',
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || 'https://placehold.co/400x300?text=Product',
        stock: parseInt(formData.stock, 10),
      };

      if (editingId) {
        await updateProduct(user.token, editingId, productData);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(user.token, productData);
        toast.success('Product created successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        image: '',
        stock: '',
      });
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await deleteProduct(user.token, id);
      toast.success('Product deleted successfully!');
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      image: '',
      stock: '',
    });
    setShowForm(true);
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: 0,
    lowStock: products.filter((p) => p.stock < 5).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  if (!user?.isAdmin) {
    return (
      <div className="page-wrapper admin-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3>Access Denied</h3>
            <p>Admin access required.</p>
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper admin-wrapper">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-mark">SV</div>
          <span className="sidebar-brand">ShopVerse <span className="sidebar-brand-sub">Admin</span></span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon.type;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-item">
            <FiPackage size={16} /> View Store
          </Link>
          <button className="sidebar-item text-danger" onClick={() => {}}>
            <FiCreditCard size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <div className="admin-brand">
            <FiSettings size={24} className="brand-icon" />
            <h1 className="brand-title">Admin Dashboard</h1>
          </div>
          <div className="admin-actions">
            {activeTab === 'products' && (
              <button className="btn btn-primary btn-sm" onClick={handleCreate}>
                <FiPlus size={16} /> Add Product
              </button>
            )}
            <Link to="/" className="btn btn-outline btn-sm">
              View Store
            </Link>
          </div>
        </div>

        <div className="admin-body">
          <div className="stats-grid">
            <div className="stat-card glass-card trend-up">
              <div className="stat-icon">
                <FiBarChart size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalProducts}</div>
                <div className="stat-label">Total Products</div>
                <div className="stat-trend">+12% vs last month</div>
              </div>
            </div>
            <div className="stat-card glass-card trend-neutral">
              <div className="stat-icon">
                <FiPackage size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
                <div className="stat-trend">--</div>
              </div>
            </div>
            <div className="stat-card glass-card trend-warning">
              <div className="stat-icon">
                <FiEdit size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.lowStock}</div>
                <div className="stat-label">Low Stock</div>
                <div className="stat-trend">Needs attention</div>
              </div>
            </div>
            <div className="stat-card glass-card trend-error">
              <div className="stat-icon">
                <FiTrash2 size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.outOfStock}</div>
                <div className="stat-label">Out of Stock</div>
                <div className="stat-trend">Restock needed</div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="form-card glass-card animate-fade-up">
              <div className="form-header">
                <h2 className="form-title">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Wireless Headphones"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Describe the product..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-input"
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="products-table-card glass-card">
            <div className="table-header">
              <h2 className="table-title">Manage Products</h2>
            </div>
            <div className="table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="loading-cell">
                        <div className="spinner-wrap"><div className="spinner" /></div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-cell">No products found</td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id} className="table-row">
                        <td className="cell-image">
                          <img
                            src={p.image || 'https://placehold.co/50x50/1a1a2e/8b5cf6?text=Product'}
                            alt={p.name}
                            className="table-image"
                            onError={(e) => { e.target.src = 'https://placehold.co/50x50/1a1a2e/8b5cf6?text=Product'; }}
                          />
                        </td>
                        <td className="cell-name">{p.name}</td>
                        <td className="cell-category">
                          <span className="badge badge-primary">{p.category}</span>
                        </td>
                        <td className="cell-price">₹{p.price.toLocaleString()}</td>
                        <td className="cell-stock">
                          {p.stock === 0 ? (
                            <span className="stock-badge stock-out">Out of Stock</span>
                          ) : p.stock < 5 ? (
                            <span className="stock-badge stock-low">Low Stock ({p.stock})</span>
                          ) : (
                            <span className="stock-badge stock-ok">In Stock ({p.stock})</span>
                          )}
                        </td>
                        <td className="cell-actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(p)}
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            title="Delete"
                          >
                            {deletingId === p._id ? (
                              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
