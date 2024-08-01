import { Sensor } from '../domain/Sensor';

export interface SensorRepository {
  save(sensorData: Sensor): Promise<void>;
  findLatest(): Promise<Sensor | null>;
}
