"use strict";
// src/interfaces/user/UserRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RegisterUserUseCase_1 = require("../../application/user/RegisterUserUseCase");
const LoginUserUseCase_1 = require("../../application/user/LoginUserUseCase");
const UserController_1 = require("./UserController");
const MongooseUserRepository_1 = require("../../adapters/user/MongooseUserRepository");
const router = express_1.default.Router();
const userRepository = new MongooseUserRepository_1.MongooseUserRepository();
const registerUserUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
const userController = new UserController_1.UserController(registerUserUseCase, loginUserUseCase);
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map