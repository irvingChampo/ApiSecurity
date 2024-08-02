"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserAdapter = void 0;
class RegisterUserAdapter {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const newUser = { email, password, id: '' };
        await this.userRepository.save(newUser);
    }
}
exports.RegisterUserAdapter = RegisterUserAdapter;
//# sourceMappingURL=RegisterUserAdapter.js.map