import { Request, Response } from 'express';
import { SaveSensorUltrasonicDataUseCase } from '../../application/sensor/SaveSensorUltrasonicDataUseCase';
import { GetLatestSensorUltrasonicDataUseCase } from '../../application/sensor/GetLatestSensorUltrasonicDataUseCase';

export class SensorUltrasonicController {
  constructor(
    private saveSensorUltrasonicDataUseCase: SaveSensorUltrasonicDataUseCase,
    private getLatestSensorUltrasonicDataUseCase: GetLatestSensorUltrasonicDataUseCase
  ) {}

  async saveSensorUltrasonicData(req: Request, res: Response): Promise<void> {
    const { distance, motionDetected } = req.body; 

    try {
      await this.saveSensorUltrasonicDataUseCase.execute({
        id: '',
        distance,
        timestamp: new Date(),
        motionDetected, 
      });
      res.status(201).json({ message: 'Sensor ultrasonic data saved successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to save sensor ultrasonic data', error: error.message });
    }
  }

  async getLatestSensorUltrasonicData(req: Request, res: Response): Promise<void> {
    try {
      const sensorData = await this.getLatestSensorUltrasonicDataUseCase.execute();
      if (sensorData) {
        res.status(200).json(sensorData);
      } else {
        res.status(404).json({ message: 'No sensor ultrasonic data found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve sensor ultrasonic data', error: error.message });
    }
  }
}
