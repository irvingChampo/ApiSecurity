
import mongoose from 'mongoose';
import SensorModel from '../../src/temperature/models/SensorModel';
import { MongooseSensorRepository } from '../../src/temperature/adapters/MongooseSensorRepository';

describe('Repositorio Sensor Ambiente - Issue #29', () => {
  const repo = new MongooseSensorRepository();

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await SensorModel.deleteMany({});
  });

  test('TS-SENSORREPO-01: Guardar sensor ambiental', async () => {
    const data = {
      temperature: 22.4,
      humidity: 55,
      timestamp: new Date()
    };

    const result = await repo.save(data);

    expect(result).toBeDefined();
    expect(result.temperature).toBe(22.4);
    expect(result.humidity).toBe(55);
  });

  test('TS-SENSORREPO-02: Obtener último dato', async () => {
    const oldData = {
      temperature: 20,
      humidity: 40,
      timestamp: new Date(Date.now() - 2000)
    };

    const latestData = {
      temperature: 26,
      humidity: 50,
      timestamp: new Date()
    };

    await repo.save(oldData);
    await repo.save(latestData);

    const result = await repo.findLatest();

    expect(result).toBeDefined();
    expect(result.temperature).toBe(26);
  });

  test('TS-SENSORREPO-03: Base de datos vacía', async () => {
    const result = await repo.findLatest();
    expect(result).toBeNull();
  });
});
