import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from '../services/reports.service';
import { AuthGuard } from '@nestjs/passport';

describe('ReportsController', () => {
  let reportsController: ReportsController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let reportsService: ReportsService;

  const mockReportsService = {
    getDeletedPercentage: jest.fn(),
    getNonDeletedPercentage: jest.fn(),
    getTopExpensiveProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    reportsController = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(reportsController).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return the deleted percentage', async () => {
      mockReportsService.getDeletedPercentage.mockResolvedValue(42);
      const result = await reportsController.getDeletedPercentage();
      expect(result).toBe(42);
      expect(mockReportsService.getDeletedPercentage).toHaveBeenCalled();
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return the non-deleted percentage with filters', async () => {
      mockReportsService.getNonDeletedPercentage.mockResolvedValue(58);
      const result = await reportsController.getNonDeletedPercentage(
        'true',
        '2024-01-01',
        '2024-02-01',
      );
      expect(result).toBe(58);
      expect(mockReportsService.getNonDeletedPercentage).toHaveBeenCalledWith(
        true,
        new Date('2024-01-01'),
        new Date('2024-02-01'),
      );
    });

    it('should throw BadRequestException for invalid dates', async () => {
      await expect(
        reportsController.getNonDeletedPercentage('true', 'invalid', 'invalid'),
      ).rejects.toThrow('Invalid date format. Use YYYY-MM-DD.');
    });
  });

  describe('getTopExpensiveProducts', () => {
    it('should return the top 5 expensive products', async () => {
      const mockProducts = [{ name: 'Product 1', price: 100 }];
      mockReportsService.getTopExpensiveProducts.mockResolvedValue(
        mockProducts,
      );
      const result = await reportsController.getTopExpensiveProducts();
      expect(result).toEqual(mockProducts);
      expect(mockReportsService.getTopExpensiveProducts).toHaveBeenCalled();
    });
  });
});
