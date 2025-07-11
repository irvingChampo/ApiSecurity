
import mongoose from 'mongoose';
import UserModel from '../../src/user/models/UserModel';
import { LoginUserAdapter } from '../../src/user/adapters/user/LoginUserAdapter';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'JWT_FAKE_TOKEN')
}));

describe('Adaptador LoginUserAdapter – Issue #27', () => {
  const adapter = new LoginUserAdapter();

  const validEmail = `test${Date.now()}@mail.com`;
  const validPassword = 'Secure1234';
  let hashedPassword: string;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);

    hashedPassword = await bcrypt.hash(validPassword, 10);
    await UserModel.create({ email: validEmail, password: hashedPassword });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('TS-LOGINAD-01: Autenticación exitosa', async () => {
    const result = await adapter.execute(validEmail, validPassword);
    expect(result).toBe('JWT_FAKE_TOKEN');
  });

  test('TS-LOGINAD-02: Contraseña incorrecta', async () => {
    const result = await adapter.execute(validEmail, 'wrongPassword');
    expect(result).toBeNull();
  });

  test('TS-LOGINAD-03: Usuario no existe', async () => {
    const result = await adapter.execute('nonexistent@mail.com', 'anyPass');
    expect(result).toBeNull();
  });
});
