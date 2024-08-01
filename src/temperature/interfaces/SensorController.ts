import { Request, Response } from 'express';
import { SaveSensorDataUseCase } from '../application/SaveSensorDataUseCase';
import { GetLatestSensorDataUseCase } from '../application/GetLatestSensorDataUseCase';
import { Sensor } from '../domain/Sensor';

export class SensorController {
  constructor(private saveSensorDataUseCase: SaveSensorDataUseCase, private getLatestSensorDataUseCase: GetLatestSensorDataUseCase) {}

  async saveSensorData(req: Request, res: Response): Promise<void> {
    const { temperature, humidity } = req.body;
    const sensorData: Sensor = {
      id: '',
      temperature,
      humidity,
      timestamp: new Date(),
    };

    try {
      await this.saveSensorDataUseCase.execute(sensorData);
      res.status(201).json({ message: 'Sensor data saved successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to save sensor data', error: error.message });
    }
  }

  async getLatestSensorData(req: Request, res: Response): Promise<void> {
    try {
      const sensorData = await this.getLatestSensorDataUseCase.execute();
      res.status(200).json(sensorData);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve sensor data', error: error.message });
    }
  }
}
