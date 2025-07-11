
import mongoose from 'mongoose';
import SensorUltrasonicModel from '../../src/sensor/models/SensorUltrasonicModel';

describe('SensorUltrasonicModel - Validación de esquema (Issue #36)', () => {

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('TS-SCHEMA-US-01: Documento válido debe pasar validación', async () => {
    const validData = {
      distance: 20,
      timestamp: new Date()
    };

    const doc = new SensorUltrasonicModel(validData);
    await expect(doc.validate()).resolves.toBeUndefined(); // no debe lanzar error
  });

  test('TS-SCHEMA-US-02: Documento sin distance debe fallar', async () => {
    const invalidData = {
      timestamp: new Date()
    };

    const doc = new SensorUltrasonicModel(invalidData);
    await expect(doc.validate()).rejects.toThrow(mongoose.Error.ValidationError);
  });

});
