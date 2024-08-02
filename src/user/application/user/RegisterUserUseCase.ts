import { UserRepository } from '../../ports/user/UserRepository';
import { User } from '../../domain/user/User';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: '',
      email,
      password,
    };

    await this.userRepository.save(newUser);
  }
}
