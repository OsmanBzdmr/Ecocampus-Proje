import React, { useState, useEffect } from 'react';
import { fetchProducts as fetchProductsApi } from './services/api';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProductsApi();
      setProducts(res.data);
    } catch (err) {
      console.error('Ürün yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  if (!token) {
    return <LoginPage setToken={setToken} />;
  }

  return (
    <Dashboard 
      token={token}
      onLogout={handleLogout}
      products={products}
      loading={loading}
      onProductAdded={handleProductAdded}
      fetchProducts={fetchProducts}
    />
  );
}

export default App;