"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveSensorUltrasonicDataUseCase = void 0;
class SaveSensorUltrasonicDataUseCase {
    constructor(sensorUltrasonicRepository) {
        this.sensorUltrasonicRepository = sensorUltrasonicRepository;
    }
    async execute(sensorData) {
        await this.sensorUltrasonicRepository.save(sensorData);
    }
}
exports.SaveSensorUltrasonicDataUseCase = SaveSensorUltrasonicDataUseCase;
//# sourceMappingURL=SaveSensorUltrasonicDataUseCase.js.map