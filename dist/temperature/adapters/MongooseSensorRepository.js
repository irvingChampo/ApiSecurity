"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseSensorRepository = void 0;
const SensorModel_1 = __importDefault(require("../models/SensorModel"));
class MongooseSensorRepository {
    async save(sensorData) {
        await SensorModel_1.default.create(sensorData);
    }
    async findLatest() {
        const sensor = await SensorModel_1.default.findOne().sort({ timestamp: -1 });
        return sensor ? { id: sensor.id, temperature: sensor.temperature, humidity: sensor.humidity, timestamp: sensor.timestamp } : null;
    }
}
exports.MongooseSensorRepository = MongooseSensorRepository;
//# sourceMappingURL=MongooseSensorRepository.js.map