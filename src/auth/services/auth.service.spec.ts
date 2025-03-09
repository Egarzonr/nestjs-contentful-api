import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/schemas/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      const mockUser: User = { _id: '123', username: 'testuser' } as User;
      const mockToken = 'jwt-token';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'testuser',
        sub: '123',
      });
    });

    it('should throw an error if user data is invalid', async () => {
      await expect(authService.login(null as unknown as User)).rejects.toThrow(
        'Invalid user data',
      );
      await expect(authService.login({} as User)).rejects.toThrow(
        'Invalid user data',
      );
    });
  });
});
