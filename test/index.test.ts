
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from '../src/user/interfaces/user/UserRoutes';
import temperatureRoutes from '../src/temperature/interfaces/SensorRoutes';
import ultrasonicRoutes from '../src/sensor/interfaces/sensor/SensorUltrasonicRoutes';


jest.mock('../src/user/interfaces/user/UserController', () => ({
  registerUser: (req: any, res: any) => res.status(201).json({ message: 'Registro exitoso' }),
  loginUser: (req: any, res: any) => res.status(200).json({ token: 'mocked-token' })
}));

jest.mock('../src/temperature/interfaces/SensorController', () => ({
  saveSensorData: (req: any, res: any) => res.status(201).json({ message: 'Sensor guardado' }),
  getLatestSensorData: (req: any, res: any) => res.status(200).json({ temperature: 25, humidity: 60 })
}));

jest.mock('../src/sensor/interfaces/sensor/SensorUltrasonicController', () => ({
  saveUltrasonicData: (req: any, res: any) => res.status(201).json({ message: 'Ultrasonido guardado' })
}));

const app = express();
app.use(bodyParser.json());
app.use('/api', userRoutes);
app.use('/api/sensor', temperatureRoutes);
app.use('/api/sensor/ultrasonic', ultrasonicRoutes);

describe('index.ts - Enrutamiento general (Issue #40)', () => {

  test('TS-ROUTES-01: POST /api/register responde con 201 y mensaje', async () => {
    const res = await request(app).post('/api/register').send({
      email: 'test@example.com',
      password: '123456'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Registro exitoso');
  });

  test('TS-ROUTES-02: POST /api/login responde con 200 y token', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: '123456'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'mocked-token');
  });

  test('TS-ROUTES-03: POST /api/sensor responde con 201', async () => {
    const res = await request(app).post('/api/sensor').send({
      temperature: 25,
      humidity: 60
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Sensor guardado');
  });

  test('TS-ROUTES-04: GET /api/sensor/latest responde con datos de sensor', async () => {
    const res = await request(app).get('/api/sensor/latest');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      temperature: 25,
      humidity: 60
    });
  });

  test('TS-ROUTES-05: POST /api/sensor/ultrasonic responde con 201', async () => {
    const res = await request(app).post('/api/sensor/ultrasonic').send({
      distance: 12,
      motionDetected: true
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Ultrasonido guardado');
  });

});
