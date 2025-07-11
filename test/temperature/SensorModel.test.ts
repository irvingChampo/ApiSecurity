// test/temperature/SensorModel.test.ts

import mongoose from 'mongoose';
import SensorModel from '../../src/temperature/models/SensorModel';

describe('SensorModel (Mongoose) - Issue #35', () => {

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('TS-SCHEMA-SENSOR-01: Documento válido pasa validación', async () => {
    const validData = {
      temperature: 25,
      humidity: 60,
      timestamp: new Date()
    };

    const doc = new SensorModel(validData);
    await expect(doc.validate()).resolves.toBeUndefined(); // No lanza error
  });

  test('TS-SCHEMA-SENSOR-02: Falta temperature, debe fallar', async () => {
    const invalidData = {
      humidity: 60,
      timestamp: new Date()
    };

    const doc = new SensorModel(invalidData);
    await expect(doc.validate()).rejects.toThrow(mongoose.Error.ValidationError);
  });

});
