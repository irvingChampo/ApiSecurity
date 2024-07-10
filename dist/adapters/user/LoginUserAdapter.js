"use strict";
// src/adapters/user/LoginUserAdapter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserAdapter = void 0;
class LoginUserAdapter {
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
exports.LoginUserAdapter = LoginUserAdapter;
function generateToken(userId, email) {
    return `JWT ${userId}:${email}`;
}
//# sourceMappingURL=LoginUserAdapter.js.map