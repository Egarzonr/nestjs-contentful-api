import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    it('should create a user and return the result', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      mockUsersService.createUser.mockResolvedValue(mockUser);

      const result = await usersController.register({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        'testuser',
        'password123',
      );
    });
  });
});
