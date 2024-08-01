import express from 'express';
import { SensorController } from './SensorController';
import { MongooseSensorRepository } from '../adapters/MongooseSensorRepository';
import { SaveSensorDataUseCase } from '../application/SaveSensorDataUseCase';
import { GetLatestSensorDataUseCase } from '../application/GetLatestSensorDataUseCase';

const router = express.Router();
const sensorRepository = new MongooseSensorRepository();
const saveSensorDataUseCase = new SaveSensorDataUseCase(sensorRepository);
const getLatestSensorDataUseCase = new GetLatestSensorDataUseCase(sensorRepository);
const sensorController = new SensorController(saveSensorDataUseCase, getLatestSensorDataUseCase);

router.post('/sensor', sensorController.saveSensorData.bind(sensorController));
router.get('/sensor/latest', sensorController.getLatestSensorData.bind(sensorController));

export default router;
