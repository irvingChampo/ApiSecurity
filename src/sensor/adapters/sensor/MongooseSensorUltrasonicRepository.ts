import { SensorUltrasonicRepository } from '../../ports/sensor/SensorUltrasonicRepository';
import SensorUltrasonicModel, { SensorUltrasonicDocument } from '../../models/SensorUltrasonicModel';
import { SensorUltrasonic } from '../../domain/sensor/SensorUltrasonic';

export class MongooseSensorUltrasonicRepository implements SensorUltrasonicRepository {
  async save(sensorData: SensorUltrasonic): Promise<void> {
    await SensorUltrasonicModel.create(sensorData);
  }

  async findLatest(): Promise<SensorUltrasonic | null> {
    const sensorData = await SensorUltrasonicModel.findOne().sort({ timestamp: -1 }) as SensorUltrasonicDocument;
    return sensorData ? { id: sensorData.id, distance: sensorData.distance, timestamp: sensorData.timestamp } : null;
  }
}
