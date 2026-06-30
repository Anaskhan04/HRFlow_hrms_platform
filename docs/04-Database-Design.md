# Database Design

## Core Entities

- Organization
- Department
- Employee
- User
- Role
- Attendance
- Leave
- LeaveType
- Document
- Notification
- Invitation
- ActivityLog

---

## High Level Relationships

Organization
├── Departments
├── Employees
├── Leave Types
├── Documents
├── Notifications
└── Activity Logs

Department
└── Employees

Employee
├── Attendance
├── Leave Requests
├── Documents
└── Notifications                                                                                                                           