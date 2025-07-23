
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <Card className="glass-card hover-lift animate-fadeInLeft rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle dir="rtl" className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">حالت کے مطابق</CardTitle>
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
                animationBegin={0}
                animationDuration={800}
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
      <Card className="glass-card hover-lift animate-fadeInRight rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle dir="rtl" className="text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">ترجیح کے مطابق</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={priorityData} animationBegin={0}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="url(#colorGradient)" animationDuration={800}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
