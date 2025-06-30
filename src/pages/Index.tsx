
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { User } from '@/components/UserManagement';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  // Initial demo users
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'منتظم',
      email: 'admin@example.com',
      role: 'admin',
      password: 'admin123',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '2',
      name: 'احمد علی',
      email: 'ahmed@example.com',
      role: 'member',
      password: 'member123',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '3',
      name: 'فاطمہ خان',
      email: 'fatima@example.com',
      role: 'member',
      password: 'member123',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '4',
      name: 'محمد حسن',
      email: 'hassan@example.com',
      role: 'member',
      password: 'member123',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '5',
      name: 'عائشہ سلیم',
      email: 'aisha@example.com',
      role: 'member',
      password: 'member123',
      createdAt: '2024-01-01',
      isActive: true
    }
  ]);

  const handleLogin = (role: 'admin' | 'member', name: string, id: string) => {
    setUserRole(role);
    setUserName(name);
    setUserId(id);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('member');
    setUserName('');
    setUserId('');
  };

  const handleRoleSwitch = () => {
    setUserRole(userRole === 'admin' ? 'member' : 'admin');
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} users={users} />;
  }

  return (
    <Dashboard 
      userRole={userRole}
      userName={userName}
      userId={userId}
      onLogout={handleLogout}
      onRoleSwitch={handleRoleSwitch}
      users={users}
      onUpdateUsers={setUsers}
    />
  );
};

export default Index;
