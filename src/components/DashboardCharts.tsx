
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Task } from './TaskCard';

interface DashboardChartsProps {
  tasks: Task[];
}

const DashboardCharts = ({ tasks }: DashboardChartsProps) => {
  const statusData = [
    { name: 'کرنا ہے', value: tasks.filter(t => t.status === 'todo').length, color: '#8884d8' },
    { name: 'جاری', value: tasks.filter(t => t.status === 'in-progress').length, color: '#82ca9d' },
    { name: 'جائزہ', value: tasks.filter(t => t.status === 'in-review').length, color: '#ffc658' },
    { name: 'مکمل', value: tasks.filter(t => t.status === 'completed').length, color: '#ff7300' }
  ];

  const priorityData = [
    { name: 'کم', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'درمیانہ', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'زیادہ', value: tasks.filter(t => t.priority === 'high').length }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <CardTitle dir="rtl" className="text-sm sm:text-base">حالت کے مطابق</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle dir="rtl" className="text-sm sm:text-base">ترجیح کے مطابق</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
