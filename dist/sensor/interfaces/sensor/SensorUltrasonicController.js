"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorUltrasonicController = void 0;
class SensorUltrasonicController {
    constructor(saveSensorUltrasonicDataUseCase, getLatestSensorUltrasonicDataUseCase) {
        this.saveSensorUltrasonicDataUseCase = saveSensorUltrasonicDataUseCase;
        this.getLatestSensorUltrasonicDataUseCase = getLatestSensorUltrasonicDataUseCase;
    }
    async saveSensorUltrasonicData(req, res) {
        const { distance, motionDetected } = req.body;
        try {
            await this.saveSensorUltrasonicDataUseCase.execute({
                id: '',
                distance,
                timestamp: new Date(),
                motionDetected,
            });
            res.status(201).json({ message: 'Sensor ultrasonic data saved successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to save sensor ultrasonic data', error: error.message });
        }
    }
    async getLatestSensorUltrasonicData(req, res) {
        try {
            const sensorData = await this.getLatestSensorUltrasonicDataUseCase.execute();
            if (sensorData) {
                res.status(200).json(sensorData);
            }
            else {
                res.status(404).json({ message: 'No sensor ultrasonic data found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to retrieve sensor ultrasonic data', error: error.message });
        }
    }
}
exports.SensorUltrasonicController = SensorUltrasonicController;
//# sourceMappingURL=SensorUltrasonicController.js.map