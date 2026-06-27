import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (!saved) return;
    try {
      const payload = JSON.parse(atob(saved.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return;
      }
      setToken(saved);
    } catch {
      localStorage.removeItem('token');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
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
    />
  );
}

export default App;
