import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable'; // Changed import to ensure side effects are applied
import { Task } from '@/components/TaskCard';

export const generateTasksReportPdf = (tasks: Task[], userName: string) => {
  const doc = new jsPDF({
    orientation: 'landscape', // Use landscape for wider tables
    unit: 'pt',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16 // for more precise positioning
  });

  let yPos = 40;

  // Add a title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ٹاسک رپورٹ', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' }); // Centered title
  yPos += 25;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`رپورٹ تیار کردہ: ${userName}`, doc.internal.pageSize.getWidth() - 40, yPos, { align: 'right' });
  yPos += 15;
  doc.text(`تاریخ: ${new Date().toLocaleDateString('ur-PK')}`, doc.internal.pageSize.getWidth() - 40, yPos, { align: 'right' });
  yPos += 30; // Space before summary

  // --- Summary Section ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('خلاصہ', doc.internal.pageSize.getWidth() - 40, yPos, { align: 'right' });
  yPos += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;

  const priorityCounts = {
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length,
  };

  const summaryData = [
    ['کل ٹاسکس:', totalTasks],
    ['مکمل:', completedTasks],
    ['جاری:', inProgressTasks],
    ['کرنا ہے:', todoTasks],
    ['جائزہ:', reviewTasks],
    ['ترجیح کم:', priorityCounts.low],
    ['ترجیح درمیانہ:', priorityCounts.medium],
    ['ترجیح زیادہ:', priorityCounts.high],
  ];

  (doc as any).autoTable({
    startY: yPos,
    head: [['تفصیل', 'تعداد']],
    body: summaryData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 4,
      halign: 'right',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [59, 130, 246], // Tailwind blue-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'right',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 100 }, // Description column
      1: { cellWidth: 50, halign: 'center' }, // Count column
    },
    margin: { right: doc.internal.pageSize.getWidth() - 200 }, // Align summary table to the right
    rtl: true,
  });

  yPos = (doc as any).autoTable.previous.finalY + 30; // Update yPos after summary table

  // --- Detailed Tasks Section ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('تفصیلی ٹاسکس', doc.internal.pageSize.getWidth() - 40, yPos, { align: 'right' });
  yPos += 20;

  // Prepare table data
  const tableColumn = [
    { header: 'ٹاسک کا نام', dataKey: 'title' },
    { header: 'تفصیل', dataKey: 'description' },
    { header: 'حالت', dataKey: 'status' },
    { header: 'ترجیح', dataKey: 'priority' },
    { header: 'ذمہ دار', dataKey: 'assigned_to_name' },
    { header: 'آخری تاریخ', dataKey: 'due_date' },
    { header: 'پیش قدمی (%)', dataKey: 'progress' },
    { header: 'رکن کی رپورٹ', dataKey: 'member_notes' },
  ];

  const tableRows = tasks.map(task => ({
    title: task.title,
    description: task.description,
    status: getStatusLabel(task.status),
    priority: getPriorityLabel(task.priority),
    assigned_to_name: task.assigned_to_name,
    due_date: new Date(task.due_date).toLocaleDateString('ur-PK'),
    progress: task.progress,
    member_notes: task.member_notes,
  }));

  (doc as any).autoTable({
    head: [tableColumn.map(col => col.header)],
    body: tableRows.map(row => Object.values(row)),
    startY: yPos,
    theme: 'striped',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
      halign: 'right', // Align text to right for RTL
      overflow: 'linebreak',
      cellWidth: 'wrap',
    },
    headStyles: {
      fillColor: [59, 130, 246], // Tailwind blue-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'right',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240], // Light gray for alternate rows
    },
    columnStyles: {
      // Specific column styles if needed
      0: { cellWidth: 'auto' }, // Title
      1: { cellWidth: 'auto' }, // Description
      2: { cellWidth: 60 }, // Status
      3: { cellWidth: 60 }, // Priority
      4: { cellWidth: 80 }, // Assigned To
      5: { cellWidth: 70 }, // Due Date
      6: { cellWidth: 60 }, // Progress
      7: { cellWidth: 'auto' }, // Member Notes
    },
    didDrawPage: (data: any) => {
      // Footer
      let str = 'صفحہ ' + doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(str, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    },
    // Enable RTL mode for autoTable
    rtl: true,
  });

  doc.save('tasks_report.pdf');
};

// Helper functions for labels
const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'todo': return 'کرنا ہے';
    case 'inprogress': return 'جاری';
    case 'review': return 'جائزہ';
    case 'done': return 'مکمل';
    default: return status;
  }
};

const getPriorityLabel = (priority: Task['priority']) => {
  switch (priority) {
    case 'low': return 'کم';
    case 'medium': return 'درمیانہ';
    case 'high': return 'زیادہ';
    default: return priority;
  }
};