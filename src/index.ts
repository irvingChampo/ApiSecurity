import express from 'express';
const cors = require('cors');
import connectDB from './config/batabase';
import { UserController } from './user/interfaces/user/UserController';
import { MongooseUserRepository } from './user/adapters/user/MongooseUserRepository';
import { RegisterUserUseCase } from './user/application/user/RegisterUserUseCase';
import { LoginUserUseCase } from './user/application/user/LoginUserUseCase';
import { SensorController } from './temperature/interfaces/SensorController';
import { MongooseSensorRepository } from './temperature/adapters/MongooseSensorRepository';
import { SaveSensorDataUseCase } from './temperature/application/SaveSensorDataUseCase';
import { GetLatestSensorDataUseCase } from './temperature/application/GetLatestSensorDataUseCase';
import { SensorUltrasonicController } from './sensor/interfaces/sensor/SensorUltrasonicController';
import { MongooseSensorUltrasonicRepository } from './sensor/adapters/sensor/MongooseSensorUltrasonicRepository';
import { SaveSensorUltrasonicDataUseCase } from './sensor/application/sensor/SaveSensorUltrasonicDataUseCase';
import { GetLatestSensorUltrasonicDataUseCase } from './sensor/application/sensor/GetLatestSensorUltrasonicDataUseCase';
import RabbitMQService from './temperature/services/RabbitMQService';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

connectDB();

const userRepository = new MongooseUserRepository();
const sensorRepository = new MongooseSensorRepository();
const sensorUltrasonicRepository = new MongooseSensorUltrasonicRepository();

const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const saveSensorDataUseCase = new SaveSensorDataUseCase(sensorRepository);
const getLatestSensorDataUseCase = new GetLatestSensorDataUseCase(sensorRepository);
const saveSensorUltrasonicDataUseCase = new SaveSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const getLatestSensorUltrasonicDataUseCase = new GetLatestSensorUltrasonicDataUseCase(sensorUltrasonicRepository);

const userController = new UserController(registerUserUseCase, loginUserUseCase);
const sensorController = new SensorController(saveSensorDataUseCase, getLatestSensorDataUseCase);
const sensorUltrasonicController = new SensorUltrasonicController(saveSensorUltrasonicDataUseCase, getLatestSensorUltrasonicDataUseCase);

app.post('/api/register', (req, res) => userController.register(req, res));
app.post('/api/login', (req, res) => userController.login(req, res));
app.post('/api/sensor', (req, res) => sensorController.saveSensorData(req, res));
app.get('/api/sensor/latest', (req, res) => sensorController.getLatestSensorData(req, res));
app.post('/api/sensor/ultrasonic', (req, res) => sensorUltrasonicController.saveSensorUltrasonicData(req, res));
app.get('/api/sensor/ultrasonic/latest', (req, res) => sensorUltrasonicController.getLatestSensorUltrasonicData(req, res));

const rabbitMQService = new RabbitMQService(saveSensorDataUseCase, saveSensorUltrasonicDataUseCase);
rabbitMQService.consumeMessages();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
