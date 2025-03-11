import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      return this.usersRepository.create(registerUserDto);
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw new Error('Failed to create user');
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findByUsername(username);
      if (user && (await user.comparePassword(password))) return user;
      return null;
    } catch (error) {
      this.logger.error(`Error validating user ${username}`, error);
      throw new Error('Failed to validate user');
    }
  }
}
