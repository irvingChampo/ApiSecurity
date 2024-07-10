"use strict";
// src/application/user/LoginUserUseCase.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (user && user.password === password) {
            const token = generateToken(user.id, user.email);
            return token;
        }
        return null;
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
function generateToken(userId, email) {
    return `JWT ${userId}:${email}`;
}
//# sourceMappingURL=LoginUserUseCase.js.map