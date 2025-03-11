import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.createUser(registerUserDto);
  }
}
