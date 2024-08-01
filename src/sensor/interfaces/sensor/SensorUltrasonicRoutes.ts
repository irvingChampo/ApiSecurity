import express from 'express';
import { SaveSensorUltrasonicDataUseCase } from '../../application/sensor/SaveSensorUltrasonicDataUseCase';
import { GetLatestSensorUltrasonicDataUseCase } from '../../application/sensor/GetLatestSensorUltrasonicDataUseCase';
import { SensorUltrasonicController } from './SensorUltrasonicController';
import { MongooseSensorUltrasonicRepository } from '../../adapters/sensor/MongooseSensorUltrasonicRepository';

const router = express.Router();
const sensorUltrasonicRepository = new MongooseSensorUltrasonicRepository();
const saveSensorUltrasonicDataUseCase = new SaveSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const getLatestSensorUltrasonicDataUseCase = new GetLatestSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const sensorUltrasonicController = new SensorUltrasonicController(saveSensorUltrasonicDataUseCase,getLatestSensorUltrasonicDataUseCase);

router.post('/ultrasonic', sensorUltrasonicController.saveSensorUltrasonicData.bind(sensorUltrasonicController));
router.get('/ultrasonic/latest', sensorUltrasonicController.getLatestSensorUltrasonicData.bind(sensorUltrasonicController));

export default router;
