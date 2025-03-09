import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './report.service';
import { IProductRepository } from '../../product/repositories/product.repository';
import { Product } from '../../product/schemas/product.schema';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    productRepository = {
      countDocuments: jest.fn(),
      findMany: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: 'IProductRepository', useValue: productRepository },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
  });

  describe('getProductReport', () => {
    it('should return 0 if total products is 0', async () => {
      productRepository.countDocuments.mockResolvedValueOnce(0);
      const result = await reportsService.getProductReport({ isDeleted: true });
      expect(result).toBe(0);
    });

    it('should return correct percentage', async () => {
      productRepository.countDocuments
        .mockResolvedValueOnce(100) // total count
        .mockResolvedValueOnce(20); // matching filter count

      const result = await reportsService.getProductReport({ isDeleted: true });
      expect(result).toBe(20);
    });
  });

  describe('getDeletedPercentage', () => {
    it('should return the percentage of deleted products', async () => {
      productRepository.countDocuments
        .mockResolvedValueOnce(50) // total count
        .mockResolvedValueOnce(10); // deleted count

      const result = await reportsService.getDeletedPercentage();
      expect(result).toBe(20);
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return the percentage of non-deleted products', async () => {
      productRepository.countDocuments
        .mockResolvedValueOnce(100) // total count
        .mockResolvedValueOnce(80); // non-deleted count

      const result = await reportsService.getNonDeletedPercentage();
      expect(result).toBe(80);
    });

    it('should apply hasPrice filter', async () => {
      productRepository.countDocuments
        .mockResolvedValueOnce(100) // total count
        .mockResolvedValueOnce(40); // count with price

      const result = await reportsService.getNonDeletedPercentage(true);
      expect(result).toBe(40);
    });

    it('should apply date range filter', async () => {
      productRepository.countDocuments
        .mockResolvedValueOnce(100) // total count
        .mockResolvedValueOnce(30); // count in date range

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-02-01');
      const result = await reportsService.getNonDeletedPercentage(
        undefined,
        startDate,
        endDate,
      );
      expect(result).toBe(30);
    });
  });

  describe('getTopExpensiveProducts', () => {
    it('should return top 5 most expensive products', async () => {
      const mockProducts: Product[] = [
        {
          name: 'Product 1',
          price: 100,
          category: 'Category 1',
          isDeleted: false,
          createdAt: new Date(),
          _id: '1',
          // Add other required properties for Product type
        } as Product,
        {
          name: 'Product 2',
          price: 90,
          category: 'Category 2',
          isDeleted: false,
          createdAt: new Date(),
          _id: '2',
          // Add other required properties for Product type
        } as Product,
      ];

      productRepository.findMany.mockResolvedValueOnce(mockProducts);

      const result = await reportsService.getTopExpensiveProducts();
      expect(result).toEqual(mockProducts);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(
        {},
        { sort: { price: -1 }, limit: 5 },
      );
    });
  });
});
