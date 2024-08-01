import { SensorRepository } from '../ports/SensorRepository';
import { Sensor } from '../domain/Sensor';

export class GetLatestSensorDataUseCase {
  constructor(private sensorRepository: SensorRepository) {}

  async execute(): Promise<Sensor | null> {
    return await this.sensorRepository.findLatest();
  }
}
