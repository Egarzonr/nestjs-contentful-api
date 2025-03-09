import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

interface UserPayload {
  username: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: User): Promise<{ access_token: string }> {
    if (!user || !user._id) {
      throw new Error('Invalid user data');
    }
    const payload: UserPayload = {
      username: user.username,
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      sub: user._id.toString(),
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
