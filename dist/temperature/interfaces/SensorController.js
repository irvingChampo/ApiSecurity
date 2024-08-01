"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorController = void 0;
class SensorController {
    constructor(saveSensorDataUseCase, getLatestSensorDataUseCase) {
        this.saveSensorDataUseCase = saveSensorDataUseCase;
        this.getLatestSensorDataUseCase = getLatestSensorDataUseCase;
    }
    async saveSensorData(req, res) {
        const { temperature, humidity } = req.body;
        const sensorData = {
            id: '',
            temperature,
            humidity,
            timestamp: new Date(),
        };
        try {
            await this.saveSensorDataUseCase.execute(sensorData);
            res.status(201).json({ message: 'Sensor data saved successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to save sensor data', error: error.message });
        }
    }
    async getLatestSensorData(req, res) {
        try {
            const sensorData = await this.getLatestSensorDataUseCase.execute();
            res.status(200).json(sensorData);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to retrieve sensor data', error: error.message });
        }
    }
}
exports.SensorController = SensorController;
//# sourceMappingURL=SensorController.js.map