import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.userService.validateUser(
      body.username,
      body.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return await this.authService.login(user);
  }
}
