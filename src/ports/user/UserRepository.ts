// src/ports/user/UserRepository.ts

import { User } from '../../domain/user/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
