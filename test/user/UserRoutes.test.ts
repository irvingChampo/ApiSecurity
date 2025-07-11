// test/user/UserRoutes.test.ts

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from '../../src/user/interfaces/user/UserRoutes';

// Mock del controlador
jest.mock('../../src/user/interfaces/user/UserController', () => ({
  registerUser: (req: any, res: any) => {
    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  },
  loginUser: (req: any, res: any) => {
    return res.status(200).json({ token: 'fake-jwt-token' });
  }
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/user', userRoutes); // ruta base

describe('UserRoutes - Issue #22', () => {

  test('TS-USERROUTES-01: POST /register responde con 201 y mensaje', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({ email: 'test@example.com', password: '123456' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuario registrado correctamente');
  });

  test('TS-USERROUTES-02: POST /login responde con 200 y token', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'fake-jwt-token');
  });

});
