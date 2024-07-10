// src/adapters/user/MongooseUserRepository.ts

import { User } from '../../domain/user/User';
import UserModel, { UserDocument } from '../../models/UserModel';
import { UserRepository } from '../../ports/user/UserRepository';

export class MongooseUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }) as UserDocument;
    return user ? { id: user.id, email: user.email, password: user.password } : null;
  }

  async save(user: User): Promise<void> {
    await UserModel.create({ email: user.email, password: user.password });
  }
}