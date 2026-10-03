import express, { Request, Response } from 'express';

export const app = express();

app.use(express.json());

// Endpoint de observabilidad para el ciclo de vida CI/CD
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'api-service',
  });
});

app.get('/api/v1/info', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'CI/CD Microservice Base',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});