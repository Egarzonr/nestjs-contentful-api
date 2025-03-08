import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUsersRepository = {
    create: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const mockUser = { id: '1', username: 'testuser' } as User;
      mockUsersRepository.create.mockResolvedValue(mockUser);

      const result = await usersService.createUser('testuser', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValue(true),
      } as unknown as User;

      mockUsersRepository.findByUsername.mockResolvedValue(mockUser);

      const result = await usersService.validateUser('testuser', 'password123');
      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    });

    it('should return null if credentials are invalid', async () => {
      mockUsersRepository.findByUsername.mockResolvedValue(null);
      const result = await usersService.validateUser(
        'testuser',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });
});
