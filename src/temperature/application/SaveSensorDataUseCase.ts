import { SensorRepository } from '../ports/SensorRepository';
import { Sensor } from '../domain/Sensor';

export class SaveSensorDataUseCase {
  constructor(private sensorRepository: SensorRepository) {}

  async execute(sensorData: Sensor): Promise<void> {
    await this.sensorRepository.save(sensorData);
  }
}
