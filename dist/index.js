"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const batabase_1 = __importDefault(require("./config/batabase"));
const UserController_1 = require("./user/interfaces/user/UserController");
const MongooseUserRepository_1 = require("./user/adapters/user/MongooseUserRepository");
const RegisterUserUseCase_1 = require("./user/application/user/RegisterUserUseCase");
const LoginUserUseCase_1 = require("./user/application/user/LoginUserUseCase");
const SensorController_1 = require("./temperature/interfaces/SensorController");
const MongooseSensorRepository_1 = require("./temperature/adapters/MongooseSensorRepository");
const SaveSensorDataUseCase_1 = require("./temperature/application/SaveSensorDataUseCase");
const GetLatestSensorDataUseCase_1 = require("./temperature/application/GetLatestSensorDataUseCase");
const SensorUltrasonicController_1 = require("./sensor/interfaces/sensor/SensorUltrasonicController");
const MongooseSensorUltrasonicRepository_1 = require("./sensor/adapters/sensor/MongooseSensorUltrasonicRepository");
const SaveSensorUltrasonicDataUseCase_1 = require("./sensor/application/sensor/SaveSensorUltrasonicDataUseCase");
const GetLatestSensorUltrasonicDataUseCase_1 = require("./sensor/application/sensor/GetLatestSensorUltrasonicDataUseCase");
const RabbitMQService_1 = __importDefault(require("./temperature/services/RabbitMQService"));
const app = (0, express_1.default)();
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express_1.default.json());
(0, batabase_1.default)();
const userRepository = new MongooseUserRepository_1.MongooseUserRepository();
const sensorRepository = new MongooseSensorRepository_1.MongooseSensorRepository();
const sensorUltrasonicRepository = new MongooseSensorUltrasonicRepository_1.MongooseSensorUltrasonicRepository();
const registerUserUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
const saveSensorDataUseCase = new SaveSensorDataUseCase_1.SaveSensorDataUseCase(sensorRepository);
const getLatestSensorDataUseCase = new GetLatestSensorDataUseCase_1.GetLatestSensorDataUseCase(sensorRepository);
const saveSensorUltrasonicDataUseCase = new SaveSensorUltrasonicDataUseCase_1.SaveSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const getLatestSensorUltrasonicDataUseCase = new GetLatestSensorUltrasonicDataUseCase_1.GetLatestSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const userController = new UserController_1.UserController(registerUserUseCase, loginUserUseCase);
const sensorController = new SensorController_1.SensorController(saveSensorDataUseCase, getLatestSensorDataUseCase);
const sensorUltrasonicController = new SensorUltrasonicController_1.SensorUltrasonicController(saveSensorUltrasonicDataUseCase, getLatestSensorUltrasonicDataUseCase);
app.post('/api/register', (req, res) => userController.register(req, res));
app.post('/api/login', (req, res) => userController.login(req, res));
app.post('/api/sensor', (req, res) => sensorController.saveSensorData(req, res));
app.get('/api/sensor/latest', (req, res) => sensorController.getLatestSensorData(req, res));
app.post('/api/sensor/ultrasonic', (req, res) => sensorUltrasonicController.saveSensorUltrasonicData(req, res));
app.get('/api/sensor/ultrasonic/latest', (req, res) => sensorUltrasonicController.getLatestSensorUltrasonicData(req, res));
const rabbitMQService = new RabbitMQService_1.default(saveSensorDataUseCase, saveSensorUltrasonicDataUseCase);
rabbitMQService.consumeMessages();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map