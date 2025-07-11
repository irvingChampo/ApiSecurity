// test/user/UserRoutes1.test.ts

import request from 'supertest';
import express from 'express';
import userRoutes from '../../src/user/interfaces/user/UserRoutes';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('Rutas de Usuario – UserRoutes.ts (Issue #23)', () => {
  const testEmail = `user${Date.now()}@test.com`;
  const testPassword = 'Test1234';

  test('TS-USERROUTES-01: /register responde correctamente', async () => {
    const res = await request(app).post('/api/register').send({
      email: testEmail,
      password: testPassword
    });

    expect(res.status).toBe(201);
    expect(res.body.message || res.text).toBeDefined();
  });

  test('TS-USERROUTES-02: /login responde con token', async () => {
    await request(app).post('/api/register').send({
      email: testEmail,
      password: testPassword
    });

    const res = await request(app).post('/api/login').send({
      email: testEmail,
      password: testPassword
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
