import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(username: string, password: string): Promise<User> {
    return this.usersRepository.create({ username, password });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByUsername(username);
    if (user && (await user.comparePassword(password))) return user;
    return null;
  }
}
