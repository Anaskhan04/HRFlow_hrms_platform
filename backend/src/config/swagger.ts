import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRFlow API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive REST API documentation for the HRFlow HRMS backend modules: Authentication, Organization, Department, Employee, Leave, Attendance, Payroll, and Dashboard.",
      contact: {
        name: "HRFlow API Support",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API V1 Base Server URL",
      },
      {
        url: "http://localhost:5000/api/v1",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token received from login or registration.",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message details" },
            stack: { type: "string", description: "Stack trace (development only)" },
          },
        },
        AuthRegisterInput: {
          type: "object",
          required: ["email", "password", "firstName", "lastName", "employeeCode", "designation", "joiningDate", "organizationId"],
          properties: {
            email: { type: "string", format: "email", example: "john.doe@example.com" },
            password: { type: "string", format: "password", example: "Secret123!" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            employeeCode: { type: "string", example: "EMP-001" },
            phone: { type: "string", example: "+1234567890" },
            designation: { type: "string", example: "Software Engineer" },
            joiningDate: { type: "string", format: "date-time", example: "2026-01-15T00:00:00.000Z" },
            salary: { type: "number", example: 75000 },
            organizationId: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
            departmentId: { type: "string", format: "uuid", example: "660e8400-e29b-41d4-a716-446655440000" },
            role: { type: "string", enum: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"], example: "EMPLOYEE" },
          },
        },
        AuthLoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john.doe@example.com" },
            password: { type: "string", format: "password", example: "Secret123!" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful." },
            data: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    email: { type: "string" },
                    role: { type: "string" },
                    employeeId: { type: "string" },
                  },
                },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
        },
        Organization: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Acme Corp" },
            slug: { type: "string", example: "acme-corp" },
            email: { type: "string", example: "contact@acmecorp.com" },
            phone: { type: "string", example: "+1987654321" },
            country: { type: "string", example: "USA" },
            timezone: { type: "string", example: "America/New_York" },
            isActive: { type: "boolean", example: true },
          },
        },
        OrganizationCreateInput: {
          type: "object",
          required: ["name", "slug", "email", "country", "timezone"],
          properties: {
            name: { type: "string", example: "Acme Corp" },
            slug: { type: "string", example: "acme-corp" },
            email: { type: "string", format: "email", example: "contact@acmecorp.com" },
            phone: { type: "string", example: "+1987654321" },
            website: { type: "string", example: "https://acmecorp.com" },
            country: { type: "string", example: "USA" },
            timezone: { type: "string", example: "America/New_York" },
            industry: { type: "string", example: "Technology" },
          },
        },
        Department: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Engineering" },
            description: { type: "string", example: "Software development and infrastructure" },
            organizationId: { type: "string", format: "uuid" },
          },
        },
        DepartmentCreateInput: {
          type: "object",
          required: ["name", "organizationId"],
          properties: {
            name: { type: "string", example: "Engineering" },
            description: { type: "string", example: "Software development and infrastructure" },
            organizationId: { type: "string", format: "uuid" },
          },
        },
        Employee: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            employeeCode: { type: "string", example: "EMP-001" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            designation: { type: "string", example: "Software Engineer" },
            joiningDate: { type: "string", format: "date-time" },
            salary: { type: "number", example: 75000 },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"], example: "ACTIVE" },
          },
        },
        PaginatedEmployees: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            employees: {
              type: "array",
              items: { $ref: "#/components/schemas/Employee" },
            },
            pagination: {
              type: "object",
              properties: {
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                total: { type: "number", example: 42 },
                totalPages: { type: "number", example: 5 },
              },
            },
          },
        },
        LeaveApplyInput: {
          type: "object",
          required: ["leaveTypeId", "startDate", "endDate", "reason"],
          properties: {
            leaveTypeId: { type: "string", format: "uuid" },
            startDate: { type: "string", format: "date-time", example: "2026-07-10T00:00:00.000Z" },
            endDate: { type: "string", format: "date-time", example: "2026-07-15T00:00:00.000Z" },
            reason: { type: "string", example: "Annual vacation" },
          },
        },
        AttendanceCheckInInput: {
          type: "object",
          properties: {
            employeeId: { type: "string", format: "uuid", description: "Optional override if admin/HR checking in for employee" },
            remarks: { type: "string", example: "Arrived on time" },
          },
        },
        AttendanceCheckOutInput: {
          type: "object",
          properties: {
            employeeId: { type: "string", format: "uuid" },
            remarks: { type: "string", example: "Completed tasks" },
          },
        },
        PayrollGenerateInput: {
          type: "object",
          required: ["employeeId", "month", "year"],
          properties: {
            employeeId: { type: "string", format: "uuid" },
            month: { type: "integer", minimum: 1, maximum: 12, example: 7 },
            year: { type: "integer", example: 2026 },
            basicSalary: { type: "number", example: 60000 },
            allowances: { type: "number", example: 10000 },
            deductions: { type: "number", example: 5000 },
          },
        },
        DashboardSummary: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            totalEmployees: { type: "number", example: 42 },
            activeEmployees: { type: "number", example: 40 },
            departments: { type: "number", example: 5 },
            todayPresent: { type: "number", example: 38 },
            todayOnLeave: { type: "number", example: 2 },
            pendingLeaveRequests: { type: "number", example: 3 },
            monthlyPayroll: { type: "number", example: 125000 },
          },
        },
      },
    },
    tags: [
      { name: "Authentication", description: "User registration and login workflows" },
      { name: "Organization", description: "Organization setup and management" },
      { name: "Department", description: "Department hierarchy and operations" },
      { name: "Employee", description: "Employee management with pagination, filtering, searching, and sorting" },
      { name: "Leave", description: "Leave applications and approval workflows" },
      { name: "Attendance", description: "Daily employee check-in, check-out, and attendance logs" },
      { name: "Payroll", description: "Monthly payroll calculation and payment processing" },
      { name: "Dashboard", description: "Aggregated HR analytics and summary metrics" },
    ],
    paths: {
      "/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user and employee record",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthRegisterInput" },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully.",
              content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
            },
            400: { description: "Validation error or code/email already exists.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Authenticate user and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthLoginInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful.",
              content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
            },
            401: { description: "Invalid email or password.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/organizations": {
        post: {
          tags: ["Organization"],
          summary: "Create a new organization",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationCreateInput" } } },
          },
          responses: {
            201: { description: "Organization created.", content: { "application/json": { schema: { $ref: "#/components/schemas/Organization" } } } },
          },
        },
        get: {
          tags: ["Organization"],
          summary: "Get all organizations",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of organizations.", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Organization" } } } } },
          },
        },
      },
      "/organizations/{id}": {
        get: {
          tags: ["Organization"],
          summary: "Get organization by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Organization details.", content: { "application/json": { schema: { $ref: "#/components/schemas/Organization" } } } },
            404: { description: "Organization not found." },
          },
        },
      },
      "/departments": {
        post: {
          tags: ["Department"],
          summary: "Create a department",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/DepartmentCreateInput" } } },
          },
          responses: {
            201: { description: "Department created.", content: { "application/json": { schema: { $ref: "#/components/schemas/Department" } } } },
          },
        },
        get: {
          tags: ["Department"],
          summary: "Get all departments",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of departments.", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Department" } } } } },
          },
        },
      },
      "/departments/{id}": {
        get: {
          tags: ["Department"],
          summary: "Get department by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Department details.", content: { "application/json": { schema: { $ref: "#/components/schemas/Department" } } } },
          },
        },
        patch: {
          tags: ["Department"],
          summary: "Update department",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/DepartmentCreateInput" } } } },
          responses: {
            200: { description: "Department updated." },
          },
        },
        delete: {
          tags: ["Department"],
          summary: "Delete department",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Department deleted." },
          },
        },
      },
      "/employees": {
        post: {
          tags: ["Employee"],
          summary: "Create a new employee",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/Employee" } } },
          },
          responses: {
            201: { description: "Employee created." },
          },
        },
        get: {
          tags: ["Employee"],
          summary: "Get paginated list of employees with search, sorting, and filtering",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
            { name: "search", in: "query", schema: { type: "string" }, description: "Search across firstName, lastName, email, employeeCode" },
            { name: "department", in: "query", schema: { type: "string" }, description: "Filter by department ID or name" },
            { name: "status", in: "query", schema: { type: "string" }, description: "Filter by status (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)" },
            { name: "sort", in: "query", schema: { type: "string", enum: ["joiningDate", "firstName", "createdAt"], default: "createdAt" }, description: "Sort field" },
            { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" }, description: "Sort order" },
          ],
          responses: {
            200: { description: "Paginated employee list.", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedEmployees" } } } },
          },
        },
      },
      "/employees/{id}": {
        get: {
          tags: ["Employee"],
          summary: "Get employee by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Employee details.", content: { "application/json": { schema: { $ref: "#/components/schemas/Employee" } } } },
          },
        },
        patch: {
          tags: ["Employee"],
          summary: "Update employee details",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Employee" } } } },
          responses: {
            200: { description: "Employee updated." },
          },
        },
        delete: {
          tags: ["Employee"],
          summary: "Delete employee",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Employee deleted." },
          },
        },
      },
      "/leaves/apply": {
        post: {
          tags: ["Leave"],
          summary: "Apply for a new leave request",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LeaveApplyInput" } } },
          },
          responses: {
            201: { description: "Leave applied successfully." },
          },
        },
      },
      "/leaves/my-leaves": {
        get: {
          tags: ["Leave"],
          summary: "Get current employee's leave requests",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of leave requests." },
          },
        },
      },
      "/leaves/{id}/approve": {
        patch: {
          tags: ["Leave"],
          summary: "Approve a pending leave request",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Leave approved." },
          },
        },
      },
      "/leaves/{id}/reject": {
        patch: {
          tags: ["Leave"],
          summary: "Reject a pending leave request",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Leave rejected." },
          },
        },
      },
      "/leaves/{id}/cancel": {
        patch: {
          tags: ["Leave"],
          summary: "Cancel a pending leave request (employee only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Leave cancelled." },
          },
        },
      },
      "/attendance/check-in": {
        post: {
          tags: ["Attendance"],
          summary: "Check in for the current day",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/AttendanceCheckInInput" } } },
          },
          responses: {
            201: { description: "Checked in successfully." },
          },
        },
      },
      "/attendance/check-out": {
        patch: {
          tags: ["Attendance"],
          summary: "Check out and calculate working hours",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/AttendanceCheckOutInput" } } },
          },
          responses: {
            200: { description: "Checked out successfully." },
          },
        },
      },
      "/attendance/today": {
        get: {
          tags: ["Attendance"],
          summary: "Get current employee's attendance record for today",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Today's attendance record." },
          },
        },
      },
      "/attendance/history": {
        get: {
          tags: ["Attendance"],
          summary: "Get employee attendance history",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of historical attendance records." },
          },
        },
      },
      "/payroll/generate": {
        post: {
          tags: ["Payroll"],
          summary: "Generate monthly payroll for an employee",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/PayrollGenerateInput" } } },
          },
          responses: {
            201: { description: "Payroll generated successfully." },
          },
        },
      },
      "/payroll": {
        get: {
          tags: ["Payroll"],
          summary: "Get all generated payroll records",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of payroll records." },
          },
        },
      },
      "/payroll/{id}": {
        get: {
          tags: ["Payroll"],
          summary: "Get payroll record by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Payroll details." },
          },
        },
      },
      "/payroll/{id}/pay": {
        patch: {
          tags: ["Payroll"],
          summary: "Mark payroll record as PAID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Payroll marked as PAID." },
          },
        },
      },
      "/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get aggregated HR analytics and summary statistics",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Dashboard summary statistics.", content: { "application/json": { schema: { $ref: "#/components/schemas/DashboardSummary" } } } },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
