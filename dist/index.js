"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const batabase_1 = __importDefault(require("./config/batabase"));
const UserController_1 = require("./interfaces/user/UserController");
const MongooseUserRepository_1 = require("./adapters/user/MongooseUserRepository");
const RegisterUserUseCase_1 = require("./application/user/RegisterUserUseCase");
const LoginUserUseCase_1 = require("./application/user/LoginUserUseCase");
// Initialize Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, batabase_1.default)();
// Repositories
const userRepository = new MongooseUserRepository_1.MongooseUserRepository();
// Use Cases
const registerUserUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
// Controllers
const userController = new UserController_1.UserController(registerUserUseCase, loginUserUseCase);
// Routes
app.post('/api/register', (req, res) => userController.register(req, res));
app.post('/api/login', (req, res) => userController.login(req, res));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map