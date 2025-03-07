import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface UserPayload {
  username: string;
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: UserPayload): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    return { access_token };
  }
}
