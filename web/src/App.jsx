import React, { useState, useEffect } from 'react';
import { fetchProducts as fetchProductsApi } from './services/api';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
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
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginPage
        setToken={setToken}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
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
