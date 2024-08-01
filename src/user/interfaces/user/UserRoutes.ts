// src/interfaces/user/UserRoutes.ts

import express from 'express';
import { RegisterUserUseCase } from '../../application/user/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/user/LoginUserUseCase';
import { UserController } from './UserController';
import { MongooseUserRepository } from '../../adapters/user/MongooseUserRepository';

const router = express.Router();
const userRepository = new MongooseUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const userController = new UserController(registerUserUseCase, loginUserUseCase);

router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

export default router;
