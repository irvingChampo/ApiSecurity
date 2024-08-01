import { SensorUltrasonicRepository } from '../../ports/sensor/SensorUltrasonicRepository';
import { SensorUltrasonic } from '../../domain/sensor/SensorUltrasonic';

export class SaveSensorUltrasonicDataUseCase {
  constructor(private sensorUltrasonicRepository: SensorUltrasonicRepository) {}

  async execute(sensorData: SensorUltrasonic): Promise<void> {
    await this.sensorUltrasonicRepository.save(sensorData);
  }
}
