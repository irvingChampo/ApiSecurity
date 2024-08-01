"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveSensorDataUseCase = void 0;
class SaveSensorDataUseCase {
    constructor(sensorRepository) {
        this.sensorRepository = sensorRepository;
    }
    async execute(sensorData) {
        await this.sensorRepository.save(sensorData);
    }
}
exports.SaveSensorDataUseCase = SaveSensorDataUseCase;
//# sourceMappingURL=SaveSensorDataUseCase.js.map