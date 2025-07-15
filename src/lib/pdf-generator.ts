
import { Task } from '@/components/TaskCard';

export const generatePDFReport = (tasks: Task[], userName: string) => {
  try {
    console.log('Generating report with tasks:', tasks.length);
    
    if (tasks.length === 0) {
      throw new Error('رپورٹ بنانے کے لیے کم از کم ایک ٹاسک ہونا ضروری ہے');
    }

    const currentDate = new Date().toLocaleDateString('ur-PK');
    const currentTime = new Date().toLocaleTimeString('ur-PK');
    
    const statusLabels = {
      todo: 'کرنا ہے',
      inprogress: 'جاری',
      review: 'جائزہ',
      done: 'مکمل'
    };

    const priorityLabels = {
      high: 'زیادہ',
      medium: 'درمیانہ',
      low: 'کم'
    };

    const reportContent = `مجلس دعوۃ الحق - ٹاسک رپورٹ
============================================

تاریخ: ${currentDate}
وقت: ${currentTime}
رپورٹ تیار کردہ: ${userName}

خلاصہ:
========
کل ٹاسکس: ${tasks.length}
مکمل ہونے والے: ${tasks.filter(t => t.status === 'done').length}  
جاری: ${tasks.filter(t => t.status === 'inprogress').length}
جائزہ میں: ${tasks.filter(t => t.status === 'review').length}
باقی: ${tasks.filter(t => t.status === 'todo').length}

تفصیلی فہرست:
===============

${tasks.map((task, index) => `
${index + 1}. ٹاسک: ${task.title}
   تفصیل: ${task.description}
   ذمہ دار: ${task.assigned_to_name}
   حالت: ${statusLabels[task.status] || task.status}
   ترجیح: ${priorityLabels[task.priority] || task.priority}
   پیش قدمی: ${task.progress}%
   شروعاتی تاریخ: ${new Date(task.created_at).toLocaleDateString('ur-PK')}
   آخری تاریخ: ${new Date(task.due_date).toLocaleDateString('ur-PK')}
   رکن کی رپورٹ: ${task.member_notes || 'کوئی رپورٹ نہیں'}
   
-------------------------------------------
`).join('\n')}

رپورٹ مکمل ہونے کا وقت: ${new Date().toLocaleString('ur-PK')}
    `;

    // Create and download the report as a text file
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `majlis-task-report-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Report generated successfully with', tasks.length, 'tasks');
    return true;

  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};
