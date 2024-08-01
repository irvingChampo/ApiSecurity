"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SensorController_1 = require("./SensorController");
const MongooseSensorRepository_1 = require("../adapters/MongooseSensorRepository");
const SaveSensorDataUseCase_1 = require("../application/SaveSensorDataUseCase");
const GetLatestSensorDataUseCase_1 = require("../application/GetLatestSensorDataUseCase");
const router = express_1.default.Router();
const sensorRepository = new MongooseSensorRepository_1.MongooseSensorRepository();
const saveSensorDataUseCase = new SaveSensorDataUseCase_1.SaveSensorDataUseCase(sensorRepository);
const getLatestSensorDataUseCase = new GetLatestSensorDataUseCase_1.GetLatestSensorDataUseCase(sensorRepository);
const sensorController = new SensorController_1.SensorController(saveSensorDataUseCase, getLatestSensorDataUseCase);
router.post('/sensor', sensorController.saveSensorData.bind(sensorController));
router.get('/sensor/latest', sensorController.getLatestSensorData.bind(sensorController));
exports.default = router;
//# sourceMappingURL=SensorRoutes.js.map