"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLatestSensorDataUseCase = void 0;
class GetLatestSensorDataUseCase {
    constructor(sensorRepository) {
        this.sensorRepository = sensorRepository;
    }
    async execute() {
        return await this.sensorRepository.findLatest();
    }
}
exports.GetLatestSensorDataUseCase = GetLatestSensorDataUseCase;
//# sourceMappingURL=GetLatestSensorDataUseCase.js.map