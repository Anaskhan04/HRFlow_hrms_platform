import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import organizationRoutes from "./routes/organization.routes";
import employeeRoutes from "./routes/employee.routes";
import departmentRoutes from "./routes/department.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'HRFlow API is running',
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/departments", departmentRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
    return;
  }

  const statusCode = err.status || (err.message?.includes('not found') ? 404 : 400);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
