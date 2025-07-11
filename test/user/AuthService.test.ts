
import { LoginUserUseCase } from '../../src/user/application/user/LoginUserUseCase';
import { User } from '../../src/user/domain/user/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const mockUser: User = {
  id: 'user123',
  email: 'valid@example.com',
  password: '$2a$10$hashedPassword'
};

const mockRepository = {
  findByEmail: jest.fn()
};

// Mock bcrypt y JWT
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('AuthService - Login (Issue #11)', () => {
  const useCase = new LoginUserUseCase(mockRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TS-Login-01: Login exitoso con credenciales válidas', async () => {
    mockRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

    const result = await useCase.execute('valid@example.com', '123456');

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('valid@example.com');
    expect(result).toEqual({ token: 'mocked-token' });
  });

  test('TS-Login-02: Contraseña incorrecta', async () => {
    mockRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(useCase.execute('valid@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
  });

  test('TS-Login-03: Email no registrado', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute('notfound@example.com', 'any')).rejects.toThrow('User not found');
  });
});
