import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);
  const [authView, setAuthView] = useState('login');

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
