// src/index.ts
import express from 'express';
import connectDB from './config/batabase';
import { UserController } from './interfaces/user/UserController';
import { MongooseUserRepository } from './adapters/user/MongooseUserRepository';
import { RegisterUserUseCase } from './application/user/RegisterUserUseCase';
import { LoginUserUseCase } from './application/user/LoginUserUseCase';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Repositories
const userRepository = new MongooseUserRepository();

// Use Cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

// Controllers
const userController = new UserController(registerUserUseCase, loginUserUseCase);

// Routes
app.post('/api/register', (req, res) => userController.register(req, res));
app.post('/api/login', (req, res) => userController.login(req, res));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});