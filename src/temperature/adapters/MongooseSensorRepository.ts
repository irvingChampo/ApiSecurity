import { Sensor } from '../domain/Sensor';
import SensorModel, { SensorDocument } from '../models/SensorModel';
import { SensorRepository } from '../ports/SensorRepository';

export class MongooseSensorRepository implements SensorRepository {
  async save(sensorData: Sensor): Promise<void> {
    await SensorModel.create(sensorData);
  }

  async findLatest(): Promise<Sensor | null> {
    const sensor = await SensorModel.findOne().sort({ timestamp: -1 }) as SensorDocument;
    return sensor ? { id: sensor.id, temperature: sensor.temperature, humidity: sensor.humidity, timestamp: sensor.timestamp } : null;
  }
}
