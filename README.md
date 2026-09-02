# HRFlow

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=0B0F19)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/status-active%20development-0F766E)](#future-enhancements)

HRFlow is a full-stack, enterprise-style Human Resource Management System (HRMS) built for small and mid-sized organizations. It centralizes employee records, departments, attendance, leave management, payroll operations, and executive dashboards into a single web platform with secure authentication and role-based access control.

This project is structured to reflect production-minded software engineering practices and is suitable for portfolio presentation, technical interviews, open-source collaboration, and recruiter review.

## Project Overview

HRFlow addresses common HR pain points found in growing organizations, including disconnected spreadsheets, manual attendance tracking, informal leave approvals, and fragmented payroll workflows. The platform combines a React frontend, a TypeScript/Express backend, Prisma ORM, PostgreSQL, and Swagger-based API documentation into a cohesive enterprise application.

### Why HRFlow?

- Centralizes core HR workflows in a single application
- Demonstrates end-to-end full-stack engineering skills
- Uses modern TypeScript-first architecture across client and server
- Includes role-aware authentication, data validation, and API documentation
- Supports local development and containerized deployment

## Features

| Module | Capabilities |
| --- | --- |
| Authentication | JWT-based login, protected routes, profile access, password change |
| Organization Management | Create and view organization details, maintain company profile |
| Employee Management | Add, edit, list, search, filter, and manage employee records |
| Department Management | Create, update, delete, and organize departments |
| Attendance | Employee check-in, check-out, daily attendance, history tracking |
| Leave Management | Leave application, approval, rejection, cancellation, leave balances, leave types |
| Payroll | Generate payroll, track salary components, mark payroll as paid, download payslips |
| Dashboard & Analytics | Workforce summary, attendance insights, leave metrics, department and payroll charts |
| API Experience | Swagger UI documentation for core backend modules |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, React Query, Tailwind CSS, Axios, Recharts |
| Backend | Node.js, Express 5, TypeScript, Zod, JWT, Helmet, CORS, Morgan |
| Database | PostgreSQL |
| ORM | Prisma |
| API Documentation | Swagger UI, swagger-jsdoc |
| Dev Tooling | npm, tsx, TypeScript compiler, Docker, Docker Compose |

## Folder Structure

```text
HRFlow/
├── .github/                 # GitHub workflows and repository automation
├── backend/                 # Express API, Prisma schema, services, controllers
│   ├── prisma/              # Prisma schema, migrations, seed script
│   └── src/
│       ├── config/          # Swagger and application configuration
│       ├── controllers/     # Route handlers
│       ├── middleware/      # Auth and error middleware
│       ├── repositories/    # Data access layer
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic
│       ├── utils/           # Helpers such as JWT and password utilities
│       └── validators/      # Zod request validation schemas
├── docs/                    # PRD, functional requirements, design, API notes
├── frontend/                # React application
│   └── src/
│       ├── components/      # Reusable UI and feature components
│       ├── contexts/        # Auth and theme context providers
│       ├── hooks/           # React Query and app hooks
│       ├── layouts/         # App and dashboard layouts
│       ├── pages/           # Route-level pages
│       ├── routes/          # Client-side routing and protection
│       ├── services/        # API client and feature services
│       ├── types/           # Shared frontend TypeScript types
│       └── utils/           # Utility helpers
├── shared/                  # Reserved space for shared artifacts
├── docker-compose.yml       # Multi-service local or deployment orchestration
└── README.md                # Project documentation
```

## Installation

### Prerequisites

| Requirement | Recommended Version |
| --- | --- |
| Node.js | 22.x |
| npm | 10.x or later |
| PostgreSQL | 14+ |
| Docker | Optional |
| Docker Compose | Optional |

### Clone the Repository

```bash
git clone <your-repository-url>
cd Zidiodevlopment-HRFlow
```

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

### Backend Environment Variables

Create `backend/.env`:

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | Prisma pooled PostgreSQL connection string | `postgresql://user:password@localhost:5432/hrflow?schema=public` |
| `DATABASE_URL_UNPOOLED` | Yes | Prisma direct PostgreSQL connection string | `postgresql://user:password@localhost:5432/hrflow?schema=public` |
| `JWT_SECRET` | Yes | Secret key used to sign JWT tokens | `replace-with-a-secure-secret` |
| `JWT_EXPIRES_IN` | No | JWT expiration window | `7d` |
| `PORT` | No | Backend application port | `5000` |

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrflow?schema=public"
DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5432/hrflow?schema=public"
JWT_SECRET="replace-with-a-secure-secret-key-at-least-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### Frontend Environment Variables

Create `frontend/.env`:

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL for the backend API | `http://localhost:5000/api/v1` |

Example:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Docker Compose Environment Variables

The repository also includes a root `.env.example` for Docker-based execution.

| Variable | Description | Default |
| --- | --- | --- |
| `BACKEND_PORT` | Host port mapped to backend container | `5000` |
| `FRONTEND_PORT` | Host port mapped to frontend container | `80` |
| `DATABASE_URL` | Backend pooled PostgreSQL connection | Provided in `docker-compose.yml` |
| `DATABASE_URL_UNPOOLED` | Backend direct PostgreSQL connection | Provided in `docker-compose.yml` |
| `JWT_SECRET` | JWT signing secret | `REDACTED_JWT_SECRET` |
| `JWT_EXPIRES_IN` | JWT expiration window | `7d` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:5000/api/v1` |

## Backend Setup

From the project root:

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### Backend Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start backend in watch mode using `tsx` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |

### Backend Runtime

- Base URL: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/v1/health`
- Swagger UI: `http://localhost:5000/api-docs`

## Frontend Setup

From the project root:

```bash
cd frontend
npm install
npm run dev
```

### Frontend Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and build production assets |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run lint checks |

### Frontend Runtime

- Local App: `http://localhost:5173`
- The frontend expects the backend API at `VITE_API_URL`

## Database Setup

### 1. Create a PostgreSQL Database

Create a database named `hrflow` or use your preferred database name and update the backend environment variables accordingly.

### 2. Run Prisma Migrations

```bash
cd backend
npx prisma migrate deploy
```

For a local development database where you want Prisma to create and apply migration state interactively, you can also use:

```bash
npx prisma migrate dev
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Seed Sample Data

```bash
npx prisma db seed
```

The seed script provisions:

- 1 organization
- 5 departments
- 20 employees
- Admin and HR user accounts
- Attendance history
- Leave records
- Payroll records for previous and current month

## API Documentation

Swagger documentation is available after the backend is running:

- Swagger UI: `http://localhost:5000/api-docs`
- API Base URL: `http://localhost:5000/api/v1`

### Primary API Modules

| Module | Base Route |
| --- | --- |
| Authentication | `/auth` |
| Dashboard | `/dashboard` |
| Organizations | `/organizations` |
| Employees | `/employees` |
| Departments | `/departments` |
| Leaves | `/leaves` |
| Attendance | `/attendance` |
| Payroll | `/payroll` |

## Authentication

HRFlow uses JWT-based authentication for API access and protected frontend routes.

### Auth Flow

1. User logs in with email and password.
2. Backend returns a signed JWT token and user payload.
3. Frontend stores the token in local storage.
4. Axios injects the token into the `Authorization` header for authenticated requests.
5. Protected routes and role checks enforce access rules.

### Role Model

| Role | Access Pattern |
| --- | --- |
| `ADMIN` | Full administrative access |
| `HR` | HR operations including employee, department, and payroll management |
| `MANAGER` | Reserved for managerial workflows |
| `EMPLOYEE` | Personal attendance, profile, and leave actions |

### Seeded Login Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hrflow.com` | `Admin@123` |
| HR | `hr@hrflow.com` | `Hr@123` |

## Screenshots

> Replace the placeholders below with actual project screenshots or GIFs before publishing publicly.

### Login Screen

`[Insert screenshot here]`

### Dashboard Overview

`[Insert screenshot here]`

### Employee Management

`[Insert screenshot here]`

### Attendance Tracking

`[Insert screenshot here]`

### Leave Management

`[Insert screenshot here]`

### Payroll Module

`[Insert screenshot here]`

## Future Enhancements

- Manager-specific workflows and approvals
- Employee document management
- Notification center and activity timeline
- Invitation-based onboarding
- Advanced reporting and exports
- Performance review module
- Multi-organization administration improvements
- Audit logging and compliance tooling
- AI-assisted HR insights and automation

## License

This repository currently does not include a license file.

If you intend to publish HRFlow as an open-source project, add a license such as `MIT`, `Apache-2.0`, or `GPL-3.0` before public distribution.
