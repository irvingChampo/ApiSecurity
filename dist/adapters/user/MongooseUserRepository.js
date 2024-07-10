"use strict";
// src/adapters/user/MongooseUserRepository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseUserRepository = void 0;
const UserModel_1 = __importDefault(require("../../models/UserModel"));
class MongooseUserRepository {
    async findByEmail(email) {
        const user = await UserModel_1.default.findOne({ email });
        return user ? { id: user.id, email: user.email, password: user.password } : null;
    }
    async save(user) {
        await UserModel_1.default.create({ email: user.email, password: user.password });
    }
}
exports.MongooseUserRepository = MongooseUserRepository;
//# sourceMappingURL=MongooseUserRepository.js.map