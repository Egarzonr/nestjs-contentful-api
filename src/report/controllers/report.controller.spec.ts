import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './report.controller';
import { ReportsService } from '../services/report.service';

describe('ReportsController', () => {
  let reportsController: ReportsController;
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
    }).compile();

    reportsController = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(reportsController).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should call reportsService.getDeletedPercentage', async () => {
      mockReportsService.getDeletedPercentage.mockResolvedValue(20);

      const result = await reportsController.getDeletedPercentage();

      expect(result).toBe(20);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(reportsService.getDeletedPercentage).toHaveBeenCalled();
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should call reportsService.getNonDeletedPercentage', async () => {
      mockReportsService.getNonDeletedPercentage.mockResolvedValue(80);

      const hasPrice = true;
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';

      const result = await reportsController.getNonDeletedPercentage(
        hasPrice,
        startDate,
        endDate,
      );

      expect(result).toBe(80);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(reportsService.getNonDeletedPercentage).toHaveBeenCalledWith(
        hasPrice,
        startDate,
        endDate,
      );
    });
  });

  describe('getTopExpensiveProducts', () => {
    it('should call reportsService.getTopExpensiveProducts', async () => {
      const products = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 90 },
      ];
      mockReportsService.getTopExpensiveProducts.mockResolvedValue(products);

      const result = await reportsController.getTopExpensiveProducts();

      expect(result).toEqual(products);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(reportsService.getTopExpensiveProducts).toHaveBeenCalled();
    });
  });
});
