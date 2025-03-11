import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findByUsername(
        registerUserDto.username,
      );
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
      return this.usersRepository.create(registerUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error creating user', error);
      throw new BadRequestException('Failed to create user');
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
