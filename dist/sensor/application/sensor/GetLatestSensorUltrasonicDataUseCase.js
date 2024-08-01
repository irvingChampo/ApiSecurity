"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLatestSensorUltrasonicDataUseCase = void 0;
class GetLatestSensorUltrasonicDataUseCase {
    constructor(sensorUltrasonicRepository) {
        this.sensorUltrasonicRepository = sensorUltrasonicRepository;
    }
    async execute() {
        return await this.sensorUltrasonicRepository.findLatest();
    }
}
exports.GetLatestSensorUltrasonicDataUseCase = GetLatestSensorUltrasonicDataUseCase;
//# sourceMappingURL=GetLatestSensorUltrasonicDataUseCase.js.map