
import mongoose from 'mongoose';
import SensorUltrasonicModel from '../../src/sensor/models/SensorUltrasonicModel';
import { MongooseSensorUltrasonicRepository } from '../../src/sensor/adapters/sensor/MongooseSensorUltrasonicRepository';

describe('Repositorio Sensor Ultrasónico - Issue #30', () => {
  const repo = new MongooseSensorUltrasonicRepository();

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
    await SensorUltrasonicModel.deleteMany({});
  });

  test('TS-USREPO-01: Guardado exitoso', async () => {
    const data = {
      distance: 120,
      motionDetected: true,
      timestamp: new Date()
    };

    const result = await repo.save(data);

    expect(result).toBeDefined();
    expect(result.distance).toBe(120);
    expect(result.motionDetected).toBe(true);
  });

  test('TS-USREPO-02: Consulta del último registro', async () => {
    const data1 = {
      distance: 90,
      motionDetected: false,
      timestamp: new Date(Date.now() - 1000)
    };

    const data2 = {
      distance: 150,
      motionDetected: true,
      timestamp: new Date()
    };

    await repo.save(data1);
    await repo.save(data2);

    const latest = await repo.findLatest();

    expect(latest).toBeDefined();
    expect(latest.distance).toBe(150);
  });

  test('TS-USREPO-03: Sin datos insertados', async () => {
    const result = await repo.findLatest();
    expect(result).toBeNull();
  });
});
