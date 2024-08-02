import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/user/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/user/LoginUserUseCase';

export class UserController {
  constructor(private registerUserUseCase: RegisterUserUseCase, private loginUserUseCase: LoginUserUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    const { email, password, role } = req.body;

    try {
      await this.registerUserUseCase.execute(email, password);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const token = await this.loginUserUseCase.execute(email, password);
      if (token) {
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to log in', error: error.message });
    }
  }
}
