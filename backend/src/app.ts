import express from 'express';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import organizationRoutes from "./routes/organization.routes";


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use("/api/v1/organizations", organizationRoutes);
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'HRFlow API is running',
  });
});

export default app;
