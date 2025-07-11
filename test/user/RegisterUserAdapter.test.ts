
import mongoose from 'mongoose';
import UserModel from '../../src/user/models/UserModel';
import { RegisterUserAdapter } from '../../src/user/adapters/user/RegisterUserAdapter';

describe('Adaptador RegisterUserAdapter – Issue #26', () => {
  const adapter = new RegisterUserAdapter();

  const uniqueEmail = `register${Date.now()}@mail.com`;
  const password = 'Test1234';

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('TS-REGISTERAD-01: Registro exitoso', async () => {
    await expect(adapter.execute(uniqueEmail, password)).resolves.toBeUndefined();

    const user = await UserModel.findOne({ email: uniqueEmail });
    expect(user).toBeDefined();
    expect(user?.email).toBe(uniqueEmail);
  });

  test('TS-REGISTERAD-02: Error por email duplicado', async () => {
    await expect(adapter.execute(uniqueEmail, password)).rejects.toThrow('Email already exists');
  });
});
