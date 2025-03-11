import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from '../services/user.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../schemas/user.schema';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('register', () => {
    it('should call usersService.createUser with the provided data', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const createdUser: User = {
        username: 'testuser',
        password: 'hashedPassword',
      } as User;

      mockUsersService.createUser.mockResolvedValue(createdUser);

      const result = await usersController.register(registerUserDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.createUser).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(createdUser);
    });
  });
});
