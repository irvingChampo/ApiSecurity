import { SensorUltrasonicRepository } from '../../ports/sensor/SensorUltrasonicRepository';
import { SensorUltrasonic } from '../../domain/sensor/SensorUltrasonic';

export class GetLatestSensorUltrasonicDataUseCase {
  constructor(private sensorUltrasonicRepository: SensorUltrasonicRepository) {}

  async execute(): Promise<SensorUltrasonic | null> {
    return await this.sensorUltrasonicRepository.findLatest();
  }
}
