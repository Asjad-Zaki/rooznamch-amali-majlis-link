
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { User } from '@/components/UserManagement';
import { Notification } from '@/components/NotificationPanel';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [viewMode, setViewMode] = useState<'admin' | 'member'>('member'); // New state for view mode

  // Updated demo users with secret numbers
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'منتظم',
      email: 'admin@example.com',
      role: 'admin',
      password: 'admin123',
      secretNumber: '000000',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '2',
      name: 'احمد علی',
      email: 'ahmed@example.com',
      role: 'member',
      password: 'member123',
      secretNumber: '123456',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '3',
      name: 'فاطمہ خان',
      email: 'fatima@example.com',
      role: 'member',
      password: 'member123',
      secretNumber: '234567',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '4',
      name: 'محمد حسن',
      email: 'hassan@example.com',
      role: 'member',
      password: 'member123',
      secretNumber: '345678',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: '5',
      name: 'عائشہ سلیم',
      email: 'aisha@example.com',
      role: 'member',
      password: 'member123',
      secretNumber: '456789',
      createdAt: '2024-01-01',
      isActive: true
    }
  ]);

  // Shared notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLogin = (role: 'admin' | 'member', name: string, id: string) => {
    setUserRole(role);
    setUserName(name);
    setUserId(id);
    setViewMode(role); // Set initial view mode to user's role
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('member');
    setUserName('');
    setUserId('');
    setViewMode('member');
  };

  const handleRoleSwitch = () => {
    // Only admin can switch views
    if (userRole === 'admin') {
      setViewMode(viewMode === 'admin' ? 'member' : 'admin');
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} users={users} />;
  }

  return (
    <Dashboard 
      userRole={viewMode} // Pass view mode as userRole for UI
      userName={userName}
      userId={userId}
      onLogout={handleLogout}
      onRoleSwitch={userRole === 'admin' ? handleRoleSwitch : undefined}
      users={users}
      onUpdateUsers={setUsers}
      notifications={notifications}
      onUpdateNotifications={setNotifications}
      viewMode={viewMode} // Pass view mode separately
      actualRole={userRole} // Pass actual role for permissions
    />
  );
};

export default Index;
