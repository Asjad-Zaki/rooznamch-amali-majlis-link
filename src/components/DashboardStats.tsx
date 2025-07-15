
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600" dir="rtl">
            {userRole === 'admin' ? 'کل ٹاسکس' : 'میرے ٹاسکس'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{filteredTasks.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600" dir="rtl">مکمل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            {filteredTasks.filter(t => t.status === 'done').length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600" dir="rtl">جاری</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-blue-600">
            {filteredTasks.filter(t => t.status === 'inprogress').length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600" dir="rtl">باقی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-orange-600">
            {filteredTasks.filter(t => t.status === 'todo').length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
