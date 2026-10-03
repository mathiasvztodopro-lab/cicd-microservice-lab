import request from 'supertest';
import { app } from '../src/index';
import { calculateMetrics } from '../src/app';

describe('API Service - Test Suite Automatizada', () => {
  describe('GET /health', () => {
    it('debe responder con status 200 y estructura de observabilidad valida', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service', 'api-service');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('GET /api/v1/info', () => {
    it('debe responder con metadata del microservicio y version 1.0.0', async () => {
      const response = await request(app).get('/api/v1/info');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'CI/CD Microservice Base');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('environment');
    });

    it('debe caer al valor por defecto "development" cuando NODE_ENV no esta definido', async () => {
      const original = process.env.NODE_ENV;
      delete process.env.NODE_ENV;
      try {
        const response = await request(app).get('/api/v1/info');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('environment', 'development');
      } finally {
        if (original === undefined) {
          delete process.env.NODE_ENV;
        } else {
          process.env.NODE_ENV = original;
        }
      }
    });
  });

  describe('Rutas inexistentes (404 Handling)', () => {
    it('debe responder con 404 ante rutas no registradas', async () => {
      const response = await request(app).get('/ruta-fantasma-inexistente');
      expect(response.status).toBe(404);
    });
  });

  describe('calculateMetrics() - cierre del Bloque E', () => {
    it('debe devolver el total y el promedio de un arreglo con datos', () => {
      expect(calculateMetrics([1, 2, 3, 4])).toEqual({ total: 10, average: 2.5 });
    });

    it('debe devolver ceros para un arreglo vacio', () => {
      expect(calculateMetrics([])).toEqual({ total: 0, average: 0 });
    });

    it('debe devolver ceros ante una entrada invalida (null)', () => {
      // @ts-expect-error: se prueba a proposito la guarda `!data`
      expect(calculateMetrics(null)).toEqual({ total: 0, average: 0 });
    });
  });
});