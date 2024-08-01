"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseSensorUltrasonicRepository = void 0;
const SensorUltrasonicModel_1 = __importDefault(require("../../models/SensorUltrasonicModel"));
class MongooseSensorUltrasonicRepository {
    async save(sensorData) {
        await SensorUltrasonicModel_1.default.create(sensorData);
    }
    async findLatest() {
        const sensorData = await SensorUltrasonicModel_1.default.findOne().sort({ timestamp: -1 });
        return sensorData ? { id: sensorData.id, distance: sensorData.distance, timestamp: sensorData.timestamp } : null;
    }
}
exports.MongooseSensorUltrasonicRepository = MongooseSensorUltrasonicRepository;
//# sourceMappingURL=MongooseSensorUltrasonicRepository.js.map