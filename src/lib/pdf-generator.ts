import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Task } from '@/components/TaskCard';

export const generateTasksReportPdf = (tasks: Task[], userName: string) => {
  const doc = new jsPDF({
    orientation: 'landscape', // Use landscape for wider tables
    unit: 'pt',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16 // for more precise positioning
  });

  // Set RTL for the entire document
  doc.setRTLTextDirection(true);

  // Add a title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ٹاسک رپورٹ', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' }); // Centered title

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`رپورٹ تیار کردہ: ${userName}`, doc.internal.pageSize.getWidth() - 40, 60, { align: 'right' });
  doc.text(`تاریخ: ${new Date().toLocaleDateString('ur-PK')}`, doc.internal.pageSize.getWidth() - 40, 75, { align: 'right' });

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
    startY: 100,
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