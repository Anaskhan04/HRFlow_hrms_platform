import ExcelJS from "exceljs";


class ExportService {
  private createWorkbook(sheetName: string, columns: Partial<ExcelJS.Column>[]): { workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet } {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HRFlow System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns;

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" }
    };

    return { workbook, worksheet };
  }

  async exportEmployees(employees: any[]): Promise<Buffer> {
    const { workbook, worksheet } = this.createWorkbook("Employees", [
      { header: "Employee Code", key: "employeeCode", width: 15 },
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Last Name", key: "lastName", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Designation", key: "designation", width: 25 },
      { header: "Department", key: "department", width: 25 },
      { header: "Joining Date", key: "joiningDate", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ]);

    employees.forEach(emp => {
      worksheet.addRow({
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        designation: emp.designation,
        department: emp.department?.name || "N/A",
        joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "",
        status: emp.status,
      });
    });

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  async exportAttendance(attendances: any[]): Promise<Buffer> {
    const { workbook, worksheet } = this.createWorkbook("Attendance", [
      { header: "Employee Name", key: "employeeName", width: 30 },
      { header: "Employee Code", key: "employeeCode", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Check In", key: "checkIn", width: 15 },
      { header: "Check Out", key: "checkOut", width: 15 },
      { header: "Working Hours", key: "workingHours", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Remarks", key: "remarks", width: 30 },
    ]);

    attendances.forEach(att => {
      worksheet.addRow({
        employeeName: `${att.employee?.firstName || ""} ${att.employee?.lastName || ""}`,
        employeeCode: att.employee?.employeeCode || "",
        date: att.date ? new Date(att.date).toLocaleDateString() : "",
        checkIn: att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : "",
        checkOut: att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : "",
        workingHours: att.workingHours ? att.workingHours.toFixed(2) : "",
        status: att.status,
        remarks: att.remarks || "",
      });
    });

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  async exportLeaves(leaves: any[]): Promise<Buffer> {
    const { workbook, worksheet } = this.createWorkbook("Leave Requests", [
      { header: "Employee Name", key: "employeeName", width: 30 },
      { header: "Employee Code", key: "employeeCode", width: 15 },
      { header: "Leave Type", key: "leaveType", width: 20 },
      { header: "Start Date", key: "startDate", width: 15 },
      { header: "End Date", key: "endDate", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Reason", key: "reason", width: 30 },
    ]);

    leaves.forEach(leave => {
      worksheet.addRow({
        employeeName: `${leave.employee?.firstName || ""} ${leave.employee?.lastName || ""}`,
        employeeCode: leave.employee?.employeeCode || "",
        leaveType: leave.leaveType?.name || "",
        startDate: leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "",
        endDate: leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "",
        status: leave.status,
        reason: leave.reason || "",
      });
    });

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  async exportPayrolls(payrolls: any[]): Promise<Buffer> {
    const { workbook, worksheet } = this.createWorkbook("Payroll", [
      { header: "Employee Name", key: "employeeName", width: 30 },
      { header: "Employee Code", key: "employeeCode", width: 15 },
      { header: "Month", key: "month", width: 10 },
      { header: "Year", key: "year", width: 10 },
      { header: "Basic Salary", key: "basicSalary", width: 15 },
      { header: "Allowances", key: "allowances", width: 15 },
      { header: "Deductions", key: "deductions", width: 15 },
      { header: "Net Salary", key: "netSalary", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Generated At", key: "generatedAt", width: 20 },
      { header: "Paid At", key: "paidAt", width: 20 },
    ]);

    payrolls.forEach(payroll => {
      worksheet.addRow({
        employeeName: `${payroll.employee?.firstName || ""} ${payroll.employee?.lastName || ""}`,
        employeeCode: payroll.employee?.employeeCode || "",
        month: payroll.month,
        year: payroll.year,
        basicSalary: payroll.basicSalary,
        allowances: payroll.allowances,
        deductions: payroll.deductions,
        netSalary: payroll.netSalary,
        status: payroll.status,
        generatedAt: payroll.generatedAt ? new Date(payroll.generatedAt).toLocaleString() : "",
        paidAt: payroll.paidAt ? new Date(payroll.paidAt).toLocaleString() : "",
      });
    });

    return await workbook.xlsx.writeBuffer() as Buffer;
  }
}

export default new ExportService();
