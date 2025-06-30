
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');

  const handleLogin = (role: 'admin' | 'member', name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('member');
    setUserName('');
  };

  const handleRoleSwitch = () => {
    setUserRole(userRole === 'admin' ? 'member' : 'admin');
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      userRole={userRole}
      userName={userName}
      onLogout={handleLogout}
      onRoleSwitch={handleRoleSwitch}
    />
  );
};

export default Index;
