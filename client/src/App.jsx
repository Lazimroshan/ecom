import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
            </Route>

            {/* Admin Route */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            theme="dark"
            toastStyle={{
              background: 'rgba(17, 17, 32, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#F1F5F9',
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
