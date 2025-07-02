
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { RealtimeProvider } from '@/contexts/RealtimeContext';
import { User } from '@/components/UserManagement';
import { Notification } from '@/components/NotificationPanel';
import { Task } from '@/components/TaskCard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [viewMode, setViewMode] = useState<'admin' | 'member'>('member');

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
      email: 'fazlurrahman@example.com',
      role: 'member',
      password: 'member123',
      secretNumber: '567891',
      createdAt: '2024-01-01',
      isActive: true
    }
  ]);

  // Complete initial tasks data with all tasks
  const initialTasks: Task[] = [
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
    },
    {
      id: '6',
      title: 'رپورٹس کا جائزہ',
      description: 'ماہانہ رپورٹس کی تیاری اور جائزہ',
      status: 'todo',
      priority: 'high',
      assignedTo: 'مولوی سہیل صاحب',
      createdAt: '2024-01-06',
      dueDate: '2024-01-25',
      progress: 0,
      memberNotes: 'رپورٹس کے لیے ڈیٹا اکٹھا کیا جا رہا ہے'
    },
    {
      id: '7',
      title: 'اجلاس کی تیاری',
      description: 'اگلے ہفتے کے اجلاس کے ایجنڈے کی تیاری',
      status: 'inprogress',
      priority: 'medium',
      assignedTo: 'مولوی امجد صاحب',
      createdAt: '2024-01-07',
      dueDate: '2024-01-22',
      progress: 40,
      memberNotes: 'ایجنڈے کے نکات تیار کیے جا رہے ہیں'
    },
    {
      id: '8',
      title: 'تعلیمی مواد کی تیاری',
      description: 'طلبہ کے لیے تعلیمی مواد تیار کرنا',
      status: 'todo',
      priority: 'high',
      assignedTo: 'حافظ شفاعت صاحب',
      createdAt: '2024-01-08',
      dueDate: '2024-01-28',
      progress: 0,
      memberNotes: 'مواد کے موضوعات پر مشاورت جاری ہے'
    },
    {
      id: '9',
      title: 'حاضری کا ریکارڈ',
      description: 'حاضری کے ریکارڈ کی جانچ اور اپڈیٹ',
      status: 'inprogress',
      priority: 'low',
      assignedTo: 'حافظ ایاز صاحب',
      createdAt: '2024-01-09',
      dueDate: '2024-01-18',
      progress: 60,
      memberNotes: 'ریکارڈ اپڈیٹ کیا جا رہا ہے'
    },
    {
      id: '10',
      title: 'مالی امور کی نگرانی',
      description: 'مالی ریکارڈز اور اخراجات کی نگرانی',
      status: 'todo',
      priority: 'high',
      assignedTo: 'مولوی احمد صاحب',
      createdAt: '2024-01-10',
      dueDate: '2024-01-30',
      progress: 0,
      memberNotes: 'مالی ڈیٹا اکٹھا کیا جا رہا ہے'
    },
    {
      id: '11',
      title: 'کمیٹی ممبران کی فہرست',
      description: 'کمیٹی ممبران کی تازہ فہرست تیار کرنا',
      status: 'done',
      priority: 'medium',
      assignedTo: 'مولوی طفیل صاحب',
      createdAt: '2024-01-11',
      dueDate: '2024-01-15',
      progress: 100,
      memberNotes: 'فہرست مکمل اور جمع کرا دی گئی'
    },
    {
      id: '12',
      title: 'نئے ممبران کی رجسٹریشن',
      description: 'نئے ممبران کی رجسٹریشن کا عمل',
      status: 'inprogress',
      priority: 'medium',
      assignedTo: 'مولوی امتیاز صاحب',
      createdAt: '2024-01-12',
      dueDate: '2024-01-27',
      progress: 50,
      memberNotes: 'کچھ ممبران کا ڈیٹا باقی ہے'
    },
    {
      id: '13',
      title: 'تعلیمی ورکشاپ',
      description: 'ورکشاپ کے انتظامات اور دعوت نامے',
      status: 'todo',
      priority: 'low',
      assignedTo: 'مولوی بلال صاحب',
      createdAt: '2024-01-13',
      dueDate: '2024-01-29',
      progress: 0,
      memberNotes: 'ورکشاپ کی تاریخ طے ہونا باقی ہے'
    },
    {
      id: '14',
      title: 'سالانہ رپورٹ',
      description: 'سالانہ رپورٹ کی تیاری اور جمع',
      status: 'todo',
      priority: 'high',
      assignedTo: 'مولوی ذاکر صاحب',
      createdAt: '2024-01-14',
      dueDate: '2024-01-31',
      progress: 0,
      memberNotes: 'ڈیٹا اکٹھا کیا جا رہا ہے'
    },
    {
      id: '15',
      title: 'اجتماعی پروگرام',
      description: 'اجتماعی پروگرام کے انتظامات',
      status: 'inprogress',
      priority: 'medium',
      assignedTo: 'مولوی فضل الرحمن صاحب',
      createdAt: '2024-01-15',
      dueDate: '2024-01-28',
      progress: 20,
      memberNotes: 'پروگرام کی جگہ اور تاریخ زیر غور ہیں'
    }
  ];

  // Shared notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    <RealtimeProvider 
      initialTasks={initialTasks}
      initialNotifications={notifications}
      initialUsers={users}
    >
      <Dashboard 
        userRole={viewMode}
        userName={userName}
        userId={userId}
        onLogout={handleLogout}
        onRoleSwitch={userRole === 'admin' ? handleRoleSwitch : undefined}
        users={users}
        onUpdateUsers={setUsers}
        viewMode={viewMode}
        actualRole={userRole}
      />
    </RealtimeProvider>
  );
};

export default Index;
