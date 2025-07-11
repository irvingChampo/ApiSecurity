
import express from 'express';
import request from 'supertest';
import sensorRoutes from '../../src/temperature/interfaces/SensorRoutes';

const app = express();
app.use(express.json());
app.use('/api', sensorRoutes);

describe('Rutas Sensor Temperatura/Humedad – Issue #24', () => {
  test('TS-SENSORROUTE-01: POST /sensor responde con éxito', async () => {
    const res = await request(app).post('/api/sensor').send({
      temperature: 25.5,
      humidity: 60
    });

    expect(res.status).toBe(201);
    expect(res.body.message || res.text).toBeDefined();
  });

  test('TS-SENSORROUTE-02: GET /sensor/latest devuelve datos', async () => {
    await request(app).post('/api/sensor').send({
      temperature: 22.3,
      humidity: 50
    });

    const res = await request(app).get('/api/sensor/latest');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
  });
});
