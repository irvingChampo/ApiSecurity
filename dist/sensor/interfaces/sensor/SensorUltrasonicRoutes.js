"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SaveSensorUltrasonicDataUseCase_1 = require("../../application/sensor/SaveSensorUltrasonicDataUseCase");
const GetLatestSensorUltrasonicDataUseCase_1 = require("../../application/sensor/GetLatestSensorUltrasonicDataUseCase");
const SensorUltrasonicController_1 = require("./SensorUltrasonicController");
const MongooseSensorUltrasonicRepository_1 = require("../../adapters/sensor/MongooseSensorUltrasonicRepository");
const router = express_1.default.Router();
const sensorUltrasonicRepository = new MongooseSensorUltrasonicRepository_1.MongooseSensorUltrasonicRepository();
const saveSensorUltrasonicDataUseCase = new SaveSensorUltrasonicDataUseCase_1.SaveSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const getLatestSensorUltrasonicDataUseCase = new GetLatestSensorUltrasonicDataUseCase_1.GetLatestSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
const sensorUltrasonicController = new SensorUltrasonicController_1.SensorUltrasonicController(saveSensorUltrasonicDataUseCase, getLatestSensorUltrasonicDataUseCase);
router.post('/ultrasonic', sensorUltrasonicController.saveSensorUltrasonicData.bind(sensorUltrasonicController));
router.get('/ultrasonic/latest', sensorUltrasonicController.getLatestSensorUltrasonicData.bind(sensorUltrasonicController));
exports.default = router;
//# sourceMappingURL=SensorUltrasonicRoutes.js.map