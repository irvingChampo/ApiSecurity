import { UserRepository } from '../../ports/user/UserRepository';

export class RegisterUserAdapter {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = { email, password, id: '' };
    await this.userRepository.save(newUser);
  }
}