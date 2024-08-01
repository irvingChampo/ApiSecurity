"use strict";
// src/interfaces/user/UserController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }
    async register(req, res) {
        const { email, password, role } = req.body;
        try {
            await this.registerUserUseCase.execute(email, password);
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to register user', error: error.message });
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const token = await this.loginUserUseCase.execute(email, password);
            if (token) {
                res.status(200).json({ token });
            }
            else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to log in', error: error.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map