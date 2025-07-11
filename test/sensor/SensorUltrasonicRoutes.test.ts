
import express from 'express';
import request from 'supertest';
import sensorUltrasonicRoutes from '../../src/sensor/interfaces/sensor/SensorUltrasonicRoutes';

const app = express();
app.use(express.json());
app.use('/api', sensorUltrasonicRoutes);

describe('Rutas Sensor Ultrasónico – Issue #25', () => {
  test('TS-USROUTES-01: POST /sensor/ultrasonic responde correctamente', async () => {
    const res = await request(app).post('/api/sensor/ultrasonic').send({
      distance: 123,
      motionDetected: true
    });

    expect(res.status).toBe(201);
    expect(res.body.message || res.text).toBeDefined();
  });

  test('TS-USROUTES-02: GET /sensor/ultrasonic/latest retorna datos', async () => {
    await request(app).post('/api/sensor/ultrasonic').send({
      distance: 150,
      motionDetected: false
    });

    const res = await request(app).get('/api/sensor/ultrasonic/latest');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('distance');
    expect(res.body).toHaveProperty('motionDetected');
  });
});
