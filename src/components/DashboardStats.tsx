
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from './TaskCard';

interface DashboardStatsProps {
  tasks: Task[];
  userRole: 'admin' | 'member';
  userName: string;
}

const DashboardStats = ({ tasks, userRole, userName }: DashboardStatsProps) => {
  const getFilteredTasks = () => {
    if (userRole === 'member') {
      return tasks.filter(t => t.assigned_to_name === userName);
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="glass-card hover-lift animate-fadeInUp rounded-xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" dir="rtl">
            {userRole === 'admin' ? 'کل ٹاسکس' : 'میرے ٹاسکس'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent animate-pulse">{filteredTasks.length}</div>
        </CardContent>
      </Card>
      <Card className="glass-card hover-lift animate-fadeInUp delay-100 rounded-xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" dir="rtl">مکمل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            {filteredTasks.filter(t => t.status === 'completed').length}
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card hover-lift animate-fadeInUp delay-200 rounded-xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" dir="rtl">جاری</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
            {filteredTasks.filter(t => t.status === 'in-progress').length}
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card hover-lift animate-fadeInUp delay-300 rounded-xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" dir="rtl">باقی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
            {filteredTasks.filter(t => t.status === 'todo').length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
