import { SensorUltrasonic } from '../../domain/sensor/SensorUltrasonic';

export interface SensorUltrasonicRepository {
  save(sensorData: SensorUltrasonic): Promise<void>;
  findLatest(): Promise<SensorUltrasonic | null>;
}
