
import mongoose from 'mongoose';
import { connectDB } from '../../src/config/batabase';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('Configuración de base de datos - Issue #39', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => { throw new Error(`exit:${code}`); }) as never);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('TS-DB-01: Conexión exitosa a MongoDB', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(true);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected');
  });

  test('TS-DB-02: URI incorrecta (error de conexión)', async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Invalid URI'));

    try {
      await connectDB();
    } catch (e) {
      expect(e.message).toBe('exit:1');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to connect to MongoDB'),
        expect.any(Error)
      );
    }
  });

  test('TS-DB-03: MongoDB inactivo (fallo de conexión)', async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('ECONNREFUSED'));

    try {
      await connectDB();
    } catch (e) {
      expect(e.message).toBe('exit:1');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to connect to MongoDB'),
        expect.any(Error)
      );
    }
  });
});
