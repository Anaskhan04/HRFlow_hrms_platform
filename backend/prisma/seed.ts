import {
  PrismaClient,
  Role,
  EmployeeStatus,
  LeaveStatus,
  AttendanceStatus,
  PayrollStatus,
} from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting HRFlow production database seed...\n");

  // 1. Idempotency: Clean up existing database records in reverse order of dependencies
  console.log("🧹 Cleaning up existing database records...");
  await prisma.payroll.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();
  console.log("✅ Existing records cleaned up.\n");

  // 2. Create Organization
  console.log("🏢 Creating global organization...");
  const organization = await prisma.organization.create({
    data: {
      name: "HRFlow Global Technologies",
      slug: "hrflow-global",
      email: "contact@hrflow.com",
      phone: "+1-800-555-0199",
      website: "https://www.hrflow.com",
      address: "100 Enterprise Parkway, Suite 500, Tech City, CA 94016",
      country: "United States",
      timezone: "America/Los_Angeles",
      industry: "Information Technology & Services",
      description: "Leading enterprise workforce, payroll, and HR management SaaS provider.",
      isActive: true,
    },
  });
  console.log(`   -> Organization created: ${organization.name} (${organization.id})`);

  // 3. Create Departments
  console.log("\n📁 Creating corporate departments...");
  const departmentNames = [
    { name: "Human Resources", description: "Talent acquisition, employee relations, and welfare" },
    { name: "Information Technology", description: "Software engineering, infrastructure, and cybersecurity" },
    { name: "Finance", description: "Accounting, financial planning, and payroll processing" },
    { name: "Sales", description: "Global account management and new business development" },
    { name: "Marketing", description: "Brand strategy, digital marketing, and corporate communications" },
  ];

  const createdDepartments: Record<string, string> = {};
  for (const dept of departmentNames) {
    const created = await prisma.department.create({
      data: {
        name: dept.name,
        description: dept.description,
        organizationId: organization.id,
      },
    });
    createdDepartments[dept.name] = created.id;
    console.log(`   -> Department created: ${created.name}`);
  }

  // 4. Create Leave Types
  console.log("\n🌴 Creating standard leave types...");
  const leaveTypesData = [
    { name: "Annual Leave", description: "Paid statutory annual vacation allowance" },
    { name: "Sick Leave", description: "Medical leave for illness or healthcare appointments" },
    { name: "Casual Leave", description: "Short-term personal time off for urgent matters" },
    { name: "Maternity / Paternity Leave", description: "Parental leave for childbirth or adoption" },
  ];

  const createdLeaveTypes: Record<string, string> = {};
  for (const lt of leaveTypesData) {
    const created = await prisma.leaveType.create({
      data: {
        name: lt.name,
        description: lt.description,
        organizationId: organization.id,
      },
    });
    createdLeaveTypes[lt.name] = created.id;
    console.log(`   -> Leave Type created: ${created.name}`);
  }

  // 5. Create 20 Realistic Employees
  console.log("\n👥 Onboarding 20 staff members across departments...");
  const employeeProfiles = [
    // Specifically mapped for login users (Admin and HR)
    {
      code: "EMP-1001",
      firstName: "System",
      lastName: "Admin",
      email: "admin@hrflow.com",
      phone: "+1 (555) 010-1001",
      designation: "Chief Technology Officer",
      dept: "Information Technology",
      salary: 160000,
      joiningDaysAgo: 1095, // ~3 years ago
    },
    {
      code: "EMP-1002",
      firstName: "Sarah",
      lastName: "Jenkins",
      email: "hr@hrflow.com",
      phone: "+1 (555) 010-1002",
      designation: "Human Resources Director",
      dept: "Human Resources",
      salary: 135000,
      joiningDaysAgo: 800,
    },
    // Remaining 18 employees distributed across departments
    {
      code: "EMP-1003",
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@hrflow.com",
      phone: "+1 (555) 010-1003",
      designation: "Principal Software Architect",
      dept: "Information Technology",
      salary: 145000,
      joiningDaysAgo: 700,
    },
    {
      code: "EMP-1004",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "e.rodriguez@hrflow.com",
      phone: "+1 (555) 010-1004",
      designation: "Senior Frontend Engineer",
      dept: "Information Technology",
      salary: 115000,
      joiningDaysAgo: 500,
    },
    {
      code: "EMP-1005",
      firstName: "David",
      lastName: "Kim",
      email: "d.kim@hrflow.com",
      phone: "+1 (555) 010-1005",
      designation: "Lead Backend Engineer",
      dept: "Information Technology",
      salary: 125000,
      joiningDaysAgo: 450,
    },
    {
      code: "EMP-1006",
      firstName: "Jessica",
      lastName: "Taylor",
      email: "j.taylor@hrflow.com",
      phone: "+1 (555) 010-1006",
      designation: "Cloud Infrastructure Specialist",
      dept: "Information Technology",
      salary: 118000,
      joiningDaysAgo: 380,
    },
    {
      code: "EMP-1007",
      firstName: "James",
      lastName: "Wilson",
      email: "j.wilson@hrflow.com",
      phone: "+1 (555) 010-1007",
      designation: "QA Automation Lead",
      dept: "Information Technology",
      salary: 98000,
      joiningDaysAgo: 320,
    },
    {
      code: "EMP-1008",
      firstName: "Amanda",
      lastName: "Martinez",
      email: "a.martinez@hrflow.com",
      phone: "+1 (555) 010-1008",
      designation: "Senior HR Business Partner",
      dept: "Human Resources",
      salary: 95000,
      joiningDaysAgo: 600,
    },
    {
      code: "EMP-1009",
      firstName: "Robert",
      lastName: "Anderson",
      email: "r.anderson@hrflow.com",
      phone: "+1 (555) 010-1009",
      designation: "Global Talent Acquisition Manager",
      dept: "Human Resources",
      salary: 92000,
      joiningDaysAgo: 400,
    },
    {
      code: "EMP-1010",
      firstName: "Laura",
      lastName: "Thomas",
      email: "l.thomas@hrflow.com",
      phone: "+1 (555) 010-1010",
      designation: "Compensation & Benefits Analyst",
      dept: "Human Resources",
      salary: 84000,
      joiningDaysAgo: 250,
    },
    {
      code: "EMP-1011",
      firstName: "Daniel",
      lastName: "Jackson",
      email: "d.jackson@hrflow.com",
      phone: "+1 (555) 010-1011",
      designation: "Chief Financial Officer",
      dept: "Finance",
      salary: 155000,
      joiningDaysAgo: 900,
    },
    {
      code: "EMP-1012",
      firstName: "Sophia",
      lastName: "White",
      email: "s.white@hrflow.com",
      phone: "+1 (555) 010-1012",
      designation: "Senior Corporate Controller",
      dept: "Finance",
      salary: 110000,
      joiningDaysAgo: 550,
    },
    {
      code: "EMP-1013",
      firstName: "William",
      lastName: "Harris",
      email: "w.harris@hrflow.com",
      phone: "+1 (555) 010-1013",
      designation: "Lead Payroll Accountant",
      dept: "Finance",
      salary: 88000,
      joiningDaysAgo: 420,
    },
    {
      code: "EMP-1014",
      firstName: "Olivia",
      lastName: "Martin",
      email: "o.martin@hrflow.com",
      phone: "+1 (555) 010-1014",
      designation: "Internal Audit Specialist",
      dept: "Finance",
      salary: 92000,
      joiningDaysAgo: 290,
    },
    {
      code: "EMP-1015",
      firstName: "Alexander",
      lastName: "Thompson",
      email: "a.thompson@hrflow.com",
      phone: "+1 (555) 010-1015",
      designation: "VP of Global Sales",
      dept: "Sales",
      salary: 150000,
      joiningDaysAgo: 750,
    },
    {
      code: "EMP-1016",
      firstName: "Chloe",
      lastName: "Garcia",
      email: "c.garcia@hrflow.com",
      phone: "+1 (555) 010-1016",
      designation: "Enterprise Account Executive",
      dept: "Sales",
      salary: 105000,
      joiningDaysAgo: 480,
    },
    {
      code: "EMP-1017",
      firstName: "Benjamin",
      lastName: "Martinez",
      email: "b.martinez@hrflow.com",
      phone: "+1 (555) 010-1017",
      designation: "Sales Development Lead",
      dept: "Sales",
      salary: 78000,
      joiningDaysAgo: 210,
    },
    {
      code: "EMP-1018",
      firstName: "Samantha",
      lastName: "Robinson",
      email: "s.robinson@hrflow.com",
      phone: "+1 (555) 010-1018",
      designation: "Chief Marketing Officer",
      dept: "Marketing",
      salary: 140000,
      joiningDaysAgo: 850,
    },
    {
      code: "EMP-1019",
      firstName: "Christopher",
      lastName: "Clark",
      email: "c.clark@hrflow.com",
      phone: "+1 (555) 010-1019",
      designation: "Senior Content & Brand Manager",
      dept: "Marketing",
      salary: 88000,
      joiningDaysAgo: 360,
    },
    {
      code: "EMP-1020",
      firstName: "Megan",
      lastName: "Lewis",
      email: "m.lewis@hrflow.com",
      phone: "+1 (555) 010-1020",
      designation: "Digital Marketing & Growth Specialist",
      dept: "Marketing",
      salary: 82000,
      joiningDaysAgo: 180,
    },
  ];

  const createdEmployees = [];
  for (const prof of employeeProfiles) {
    const joiningDate = new Date();
    joiningDate.setDate(joiningDate.getDate() - prof.joiningDaysAgo);

    const emp = await prisma.employee.create({
      data: {
        employeeCode: prof.code,
        firstName: prof.firstName,
        lastName: prof.lastName,
        email: prof.email,
        phone: prof.phone,
        designation: prof.designation,
        joiningDate: joiningDate,
        salary: prof.salary,
        organizationId: organization.id,
        departmentId: createdDepartments[prof.dept],
        status: EmployeeStatus.ACTIVE,
      },
    });
    createdEmployees.push(emp);
  }
  console.log(`   -> Successfully created ${createdEmployees.length} employee records.`);

  // 6. Create Two Login Users (Admin and HR)
  console.log("\n🔐 Setting up authenticated system credentials...");
  const adminEmployee = createdEmployees.find((e) => e.email === "admin@hrflow.com")!;
  const hrEmployee = createdEmployees.find((e) => e.email === "hr@hrflow.com")!;

  const hashedAdminPassword = await hashPassword("Admin@123");
  const hashedHrPassword = await hashPassword("Hr@123");

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@hrflow.com",
      password: hashedAdminPassword,
      role: Role.ADMIN,
      employeeId: adminEmployee.id,
      isActive: true,
    },
  });
  console.log(`   -> Admin User created: ${adminUser.email} (Role: ${adminUser.role})`);

  const hrUser = await prisma.user.create({
    data: {
      email: "hr@hrflow.com",
      password: hashedHrPassword,
      role: Role.HR,
      employeeId: hrEmployee.id,
      isActive: true,
    },
  });
  console.log(`   -> HR User created: ${hrUser.email} (Role: ${hrUser.role})`);

  // 7. Create Attendance Records for all employees over the last 5 days
  console.log("\n📅 Generating realistic attendance logs for the past 5 workdays...");
  let attendanceCount = 0;
  for (const emp of createdEmployees) {
    for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - dayOffset);
      targetDate.setHours(0, 0, 0, 0); // Midnight UTC normalized for @@unique([employeeId, date])

      // Realistic check-in around 9:00 AM and check-out around 5:30 PM
      const checkIn = new Date(targetDate);
      checkIn.setHours(9, Math.floor(Math.random() * 20), 0, 0);

      const checkOut = new Date(targetDate);
      checkOut.setHours(17, 30 + Math.floor(Math.random() * 20), 0, 0);

      const workingHours = parseFloat(
        ((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(2)
      );

      // Randomize statuses slightly for realism
      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      if (dayOffset === 3 && emp.employeeCode === "EMP-1007") status = AttendanceStatus.LATE;
      if (dayOffset === 4 && emp.employeeCode === "EMP-1014") status = AttendanceStatus.HALF_DAY;

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          date: targetDate,
          checkIn: checkIn,
          checkOut: checkOut,
          workingHours: workingHours,
          status: status,
          remarks: status === AttendanceStatus.PRESENT ? "Regular working hours" : `Marked as ${status}`,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`   -> Successfully logged ${attendanceCount} attendance records.`);

  // 8. Create Leave Records
  console.log("\n🏖️ Generating employee leave requests...");
  const leaveRequestsData = [
    {
      empCode: "EMP-1004", // Emily Rodriguez
      type: "Annual Leave",
      startOffset: 10,
      endOffset: 15,
      reason: "Family summer vacation and travel",
      status: LeaveStatus.APPROVED,
      approvedBy: hrEmployee.id,
    },
    {
      empCode: "EMP-1006", // Jessica Taylor
      type: "Sick Leave",
      startOffset: -3,
      endOffset: -2,
      reason: "Severe flu and recovery",
      status: LeaveStatus.APPROVED,
      approvedBy: hrEmployee.id,
    },
    {
      empCode: "EMP-1010", // Laura Thomas
      type: "Casual Leave",
      startOffset: 5,
      endOffset: 5,
      reason: "Personal banking and home repairs",
      status: LeaveStatus.PENDING,
      approvedBy: null,
    },
    {
      empCode: "EMP-1016", // Chloe Garcia
      type: "Annual Leave",
      startOffset: 20,
      endOffset: 24,
      reason: "Attending destination wedding",
      status: LeaveStatus.APPROVED,
      approvedBy: hrEmployee.id,
    },
    {
      empCode: "EMP-1017", // Benjamin Martinez
      type: "Casual Leave",
      startOffset: -1,
      endOffset: -1,
      reason: "Emergency vehicular maintenance",
      status: LeaveStatus.REJECTED,
      approvedBy: hrEmployee.id,
    },
    {
      empCode: "EMP-1012", // Sophia White
      type: "Maternity / Paternity Leave",
      startOffset: 30,
      endOffset: 90,
      reason: "Statutory parental leave",
      status: LeaveStatus.APPROVED,
      approvedBy: adminEmployee.id,
    },
  ];

  for (const lr of leaveRequestsData) {
    const emp = createdEmployees.find((e) => e.employeeCode === lr.empCode)!;
    const leaveTypeId = createdLeaveTypes[lr.type];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + lr.startOffset);
    startDate.setHours(9, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + lr.endOffset);
    endDate.setHours(17, 0, 0, 0);

    await prisma.leaveRequest.create({
      data: {
        employeeId: emp.id,
        leaveTypeId: leaveTypeId,
        startDate: startDate,
        endDate: endDate,
        reason: lr.reason,
        status: lr.status,
        approvedBy: lr.approvedBy,
      },
    });
  }
  console.log(`   -> Successfully created ${leaveRequestsData.length} leave requests.`);

  // 9. Create Payroll Records for all 20 employees (Previous Month: PAID, Current Month: GENERATED/PENDING)
  console.log("\n💰 Generating salary slips and payroll history...");
  const now = new Date();
  const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let payrollCount = 0;
  for (const emp of createdEmployees) {
    const annualSalary = emp.salary || 60000;
    const basicSalary = Math.round((annualSalary / 12) * 100) / 100;
    const allowances = Math.round((basicSalary * 0.15) * 100) / 100; // 15% allowance
    const deductions = Math.round((basicSalary * 0.08) * 100) / 100; // 8% deduction (tax/benefits)
    const netSalary = Math.round((basicSalary + allowances - deductions) * 100) / 100;

    // Previous month (PAID)
    const prevGeneratedDate = new Date(prevYear, prevMonth - 1, 25);
    const prevPaidDate = new Date(prevYear, prevMonth - 1, 28);
    await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        month: prevMonth,
        year: prevYear,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        netSalary: netSalary,
        status: PayrollStatus.PAID,
        generatedAt: prevGeneratedDate,
        paidAt: prevPaidDate,
      },
    });
    payrollCount++;

    // Current month (GENERATED)
    const currGeneratedDate = new Date(currentYear, currentMonth - 1, 25);
    await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        month: currentMonth,
        year: currentYear,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        netSalary: netSalary,
        status: PayrollStatus.GENERATED,
        generatedAt: currGeneratedDate,
        paidAt: null,
      },
    });
    payrollCount++;
  }
  console.log(`   -> Successfully generated ${payrollCount} monthly payroll records.`);

  console.log("\n✨ Database seed completed successfully! All enterprise modules populated.");
  console.log("-----------------------------------------------------------------------");
  console.log("🔑 LOGIN CREDENTIALS AVAILABLE:");
  console.log("   👑 ADMIN -> Email: admin@hrflow.com | Password: Admin@123");
  console.log("   👔 HR    -> Email: hr@hrflow.com    | Password: Hr@123");
  console.log("-----------------------------------------------------------------------\n");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
