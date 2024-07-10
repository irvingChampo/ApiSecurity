"use strict";
// src/application/user/RegisterUserUseCase.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const newUser = {
            id: '',
            email,
            password,
        };
        await this.userRepository.save(newUser);
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=RegisterUserUseCase.js.map