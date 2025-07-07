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
      email: 'admin@gmail.com',
      role: 'admin',
      password: '1111',
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
    },
  {
  id: '6',
  name: 'مولوی سہیل صاحب',
  email: 'suhail@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '567890',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '7',
  name: 'مولوی امجد صاحب',
  email: 'amjad@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '678901',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '8',
  name: 'حافظ شفاعت صاحب',
  email: 'shafat@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '789012',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '9',
  name: 'حافظ ایاز صاحب',
  email: 'ayaz@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '890123',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '10',
  name: 'مولوی احمد صاحب',
  email: 'ahmed@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '901234',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '11',
  name: 'مولوی طفیل صاحب',
  email: 'thufail@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '123457',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '12',
  name: 'مولوی امتیاز صاحب',
  email: 'imtiyaz@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '234568',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '13',
  name: 'مولوی بلال صاحب',
  email: 'bilal@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '345679',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '14',
  name: 'مولوی ذاکر صاحب',
  email: 'zakir@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '456780',
  createdAt: '2024-01-01',
  isActive: true
},
{
  id: '15',
  name: 'مولوی فضل الرحمن صاحب',
  email: 'zakir@example.com',
  role: 'member',
  password: 'member123',
  secretNumber: '456780',
  createdAt: '2024-01-01',
  isActive: true
}

// ...existing code...
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
