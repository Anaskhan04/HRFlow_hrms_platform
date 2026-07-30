import type { PayrollRecord } from "../types";

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatCurrency = (amount: number) => CURRENCY_FORMATTER.format(amount || 0);

const formatDate = (value?: string | null) => {
  if (!value) return DATE_FORMATTER.format(new Date());

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return DATE_FORMATTER.format(date);
};

const getEmployeeName = (payroll: PayrollRecord) =>
  payroll.employee
    ? `${payroll.employee.firstName} ${payroll.employee.lastName}`.trim()
    : "Unknown Employee";

const getEmployeeCode = (payroll: PayrollRecord) =>
  payroll.employee?.employeeCode || payroll.employeeId;

const getPayrollMonth = (month: number, year: number) =>
  `${MONTH_NAMES[month] || month} ${year}`;

const getStatusLabel = (status: PayrollRecord["status"]) => {
  switch (status) {
    case "PAID":
      return "Paid";
    case "GENERATED":
      return "Generated";
    default:
      return "Pending";
  }
};

const sanitizeFileSegment = (value: string) =>
  value
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

interface DownloadPayrollPayslipInput {
  payroll: PayrollRecord;
  companyName: string;
}

export const downloadPayrollPayslip = async ({
  payroll,
  companyName,
}: DownloadPayrollPayslipInput) => {
  const [{ jsPDF }] = await Promise.all([
    import("jspdf"),
    new Promise<void>((resolve) => window.setTimeout(resolve, 0)),
  ]);

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const employeeName = getEmployeeName(payroll);
  const employeeCode = getEmployeeCode(payroll);
  const payrollMonth = getPayrollMonth(payroll.month, payroll.year);
  const payrollGeneratedDate = formatDate(payroll.generatedAt || payroll.createdAt);
  const exportedDate = formatDate(new Date().toISOString());

  const detailsRows: Array<[string, string]> = [
    ["Company Name", companyName],
    ["Employee Name", employeeName],
    ["Employee ID", employeeCode],
    ["Payroll Month", payrollMonth],
    ["Payment Status", getStatusLabel(payroll.status)],
    ["Generated Date", payrollGeneratedDate],
  ];

  const salaryRows: Array<[string, string]> = [
    ["Basic Salary", formatCurrency(payroll.basicSalary)],
    ["Allowances", formatCurrency(payroll.allowances)],
    ["Deductions", formatCurrency(payroll.deductions)],
    ["Net Salary", formatCurrency(payroll.netSalary)],
  ];

  const drawSectionTitle = (title: string, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);
  };

  const drawTable = (
    rows: Array<[string, string]>,
    startY: number,
    options?: {
      emphasizeLastRow?: boolean;
    }
  ) => {
    let y = startY;
    const rowHeight = 11;

    rows.forEach(([label, value], index) => {
      const isLastRow = index === rows.length - 1;
      const isEmphasized = options?.emphasizeLastRow && isLastRow;

      doc.setDrawColor(226, 232, 240);
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.roundedRect(margin, y - 6.5, contentWidth, rowHeight, 2, 2, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(isEmphasized ? 11 : 10);
      doc.setTextColor(71, 85, 105);
      doc.text(label, margin + 4, y);

      doc.setFont("helvetica", isEmphasized ? "bold" : "normal");
      doc.setTextColor(isEmphasized ? 15 : 30, isEmphasized ? 23 : 41, isEmphasized ? 42 : 59);
      doc.text(value, pageWidth - margin - 4, y, { align: "right" });

      y += rowHeight + 1.5;
    });

    return y;
  };

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, 14, contentWidth, 34, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(companyName, margin + 6, 27, {
    maxWidth: contentWidth - 52,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(191, 219, 254);
  doc.text("Employee Payslip", margin + 6, 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(payrollMonth, pageWidth - margin - 6, 27, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(191, 219, 254);
  doc.text(`Status: ${getStatusLabel(payroll.status)}`, pageWidth - margin - 6, 34, {
    align: "right",
  });

  let currentY = 59;
  drawSectionTitle("Payroll Details", currentY);
  currentY = drawTable(detailsRows, currentY + 9);

  currentY += 5;
  drawSectionTitle("Compensation Summary", currentY);
  currentY = drawTable(salaryRows, currentY + 9, {
    emphasizeLastRow: true,
  });

  currentY += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This is a system-generated payslip for payroll reference and employee records.",
    margin,
    currentY + 8,
    { maxWidth: contentWidth }
  );
  doc.text(`Exported on ${exportedDate}`, margin, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "HRFlow Payroll Module",
    pageWidth - margin,
    pageHeight - 8,
    { align: "right" }
  );

  doc.setProperties({
    title: `${employeeName} Payslip ${payrollMonth}`,
    subject: "Payroll payslip",
    author: companyName,
    creator: "HRFlow",
    keywords: "payroll,payslip,salary,hr",
  });

  const fileName = [
    sanitizeFileSegment(employeeCode || employeeName || "employee"),
    "payslip",
    sanitizeFileSegment(payrollMonth),
  ]
    .filter(Boolean)
    .join("-");

  doc.save(`${fileName}.pdf`);
};
