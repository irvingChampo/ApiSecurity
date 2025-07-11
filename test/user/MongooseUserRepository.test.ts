
import { MongooseUserRepository } from '../../src/user/adapters/user/MongooseUserRepository';
import { User } from '../../src/user/domain/user/User';

jest.mock('../../src/user/models/UserModel', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

import UserModel from '../../src/user/models/UserModel';

describe('MongooseUserRepository - Issue #28', () => {
  const repo = new MongooseUserRepository();

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TS-USERREPO-01: Guardar nuevo usuario', async () => {
    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

    await expect(repo.save(mockUser)).resolves.not.toThrow();
    expect(UserModel.create).toHaveBeenCalledWith(mockUser);
  });

  test('TS-USERREPO-02: Buscar usuario existente por email', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await repo.findByEmail('test@example.com');
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result?.email).toBe('test@example.com');
  });

  test('TS-USERREPO-03: Buscar usuario inexistente', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await repo.findByEmail('notfound@example.com');
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
    expect(result).toBeNull();
  });
});
