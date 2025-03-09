import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../user/services/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/schemas/user.schema';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { login: jest.fn() },
        },
        {
          provide: UsersService,
          useValue: { validateUser: jest.fn() },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const mockUser = { id: '1', username: 'testuser' } as User;
      const mockToken = { access_token: 'jwt-token' };

      jest.spyOn(userService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await authController.login({
        username: 'testuser',
        password: 'password',
      });
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(userService, 'validateUser').mockResolvedValue(null);

      await expect(
        authController.login({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
