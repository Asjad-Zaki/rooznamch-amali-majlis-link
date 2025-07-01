
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { User } from '@/components/UserManagement';
import { Notification } from '@/components/NotificationPanel';
import { Task } from '@/components/TaskCard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [viewMode, setViewMode] = useState<'admin' | 'member'>('member');

  // Initialize users from localStorage or default
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
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
    ];
  });

  // Initialize tasks from localStorage or default
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: '1',
        title: 'ویب سائٹ کی ڈیزائن',
        description: 'نئی ویب سائٹ کے لیے UI/UX ڈیزائن تیار کرنا',
        status: 'todo',
        priority: 'high',
        assignedTo: 'احمد علی',
        createdAt: '2024-01-01',
        dueDate: '2024-01-15',
        progress: 0,
        memberNotes: ''
      },
      {
        id: '2',
        title: 'ڈیٹابیس کا سیٹ اپ',
        description: 'پروجیکٹ کے لیے ڈیٹابیس کی تشکیل اور کنفیگریشن',
        status: 'inprogress',
        priority: 'medium',
        assignedTo: 'فاطمہ خان',
        createdAt: '2024-01-02',
        dueDate: '2024-01-20',
        progress: 30,
        memberNotes: 'ڈیٹابیس کی بنیادی ساخت مکمل ہو گئی'
      },
      {
        id: '3',
        title: 'ٹیسٹنگ اور ڈیبگنگ',
        description: 'سافٹ ویئر میں موجود مسائل کی تشخیص اور حل',
        status: 'review',
        priority: 'high',
        assignedTo: 'محمد حسن',
        createdAt: '2024-01-03',
        dueDate: '2024-01-18',
        progress: 80,
        memberNotes: 'اہم bugs حل ہو گئے، فائنل ٹیسٹنگ باقی ہے'
      },
      {
        id: '4',
        title: 'دستاویزات کی تیاری',
        description: 'پروجیکٹ کی مکمل دستاویزات اور رپورٹس',
        status: 'done',
        priority: 'low',
        assignedTo: 'عائشہ سلیم',
        createdAt: '2024-01-04',
        dueDate: '2024-01-10',
        progress: 100,
        memberNotes: 'دستاویزات مکمل اور جمع کر دیے گئے'
      }
    ];
  });

  // Initialize notifications from localStorage or default
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleLogin = (role: 'admin' | 'member', name: string, id: string) => {
    setUserRole(role);
    setUserName(name);
    setUserId(id);
    setViewMode(role);
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
    if (userRole === 'admin') {
      setViewMode(viewMode === 'admin' ? 'member' : 'admin');
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} users={users} />;
  }

  return (
    <Dashboard 
      userRole={viewMode}
      userName={userName}
      userId={userId}
      onLogout={handleLogout}
      onRoleSwitch={userRole === 'admin' ? handleRoleSwitch : undefined}
      users={users}
      onUpdateUsers={setUsers}
      notifications={notifications}
      onUpdateNotifications={setNotifications}
      tasks={tasks}
      onUpdateTasks={setTasks}
      viewMode={viewMode}
      actualRole={userRole}
    />
  );
};

export default Index;
