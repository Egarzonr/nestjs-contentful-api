import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { UsersRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';
import { RegisterUserDto } from '../dto/register-user.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

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
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'testuser',
        password: 'password123',
        roles: ['admin'],
      };
      const createdUser: User = {
        username: 'testuser',
        password: 'hashedPassword',
        roles: ['admin'],
      } as unknown as User;

      mockUsersRepository.findByUsername.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(createdUser);

      const result = await usersService.createUser(registerUserDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.findByUsername).toHaveBeenCalledWith(
        registerUserDto.username,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.create).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if username already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const existingUser: User = {
        username: 'testuser',
        password: 'hashedPassword',
      } as User;

      mockUsersRepository.findByUsername.mockResolvedValue(existingUser);

      await expect(usersService.createUser(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if user creation fails', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockUsersRepository.findByUsername.mockResolvedValue(null);
      mockUsersRepository.create.mockRejectedValue(
        new BadRequestException('Failed to create user'),
      );

      await expect(usersService.createUser(registerUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      const username = 'testuser';
      const password = 'password123';
      const user: User = {
        username: 'testuser',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
      } as unknown as User;

      mockUsersRepository.findByUsername.mockResolvedValue(user);

      const result = await usersService.validateUser(username, password);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(user.comparePassword).toHaveBeenCalledWith(password);
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const username = 'testuser';
      const password = 'password123';

      mockUsersRepository.findByUsername.mockResolvedValue(null);

      const result = await usersService.validateUser(username, password);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const username = 'testuser';
      const password = 'password123';
      const user: User = {
        username: 'testuser',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false),
      } as unknown as User;

      mockUsersRepository.findByUsername.mockResolvedValue(user);

      const result = await usersService.validateUser(username, password);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(user.comparePassword).toHaveBeenCalledWith(password);
      expect(result).toBeNull();
    });

    it('should throw BadRequestException if validation fails', async () => {
      const username = 'testuser';
      const password = 'password123';

      mockUsersRepository.findByUsername.mockRejectedValue(
        new Error('Failed to validate user'),
      );

      await expect(
        usersService.validateUser(username, password),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
