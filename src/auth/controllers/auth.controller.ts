import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    // Aquí puedes validar el usuario y la contraseña
    const user = { username: body.username, userId: 1 }; // Ejemplo de usuario
    return await this.authService.login(user);
  }
}
