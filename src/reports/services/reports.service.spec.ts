import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { IProductRepository } from '../../products/repositories/product.repository';
// import { BadRequestException } from '@nestjs/common';
import { Product } from 'src/products/schemas/product.schema';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    productRepository = {
      countDocuments: jest.fn(),
      findMany: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: 'IProductRepository', useValue: productRepository },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
  });

  describe('getDeletedPercentage', () => {
    it('should return 0 if there are no products', async () => {
      productRepository.countDocuments.mockResolvedValue(0);
      expect(await reportsService.getDeletedPercentage()).toBe(0);
    });

    it('should return the percentage of deleted products', async () => {
      productRepository.countDocuments.mockResolvedValueOnce(100);
      productRepository.countDocuments.mockResolvedValueOnce(20);
      expect(await reportsService.getDeletedPercentage()).toBe(20);
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return 0 if no non-deleted products exist', async () => {
      productRepository.countDocuments.mockResolvedValue(0);
      expect(await reportsService.getNonDeletedPercentage()).toBe(0);
    });

    it('should return the percentage of non-deleted products with filters', async () => {
      productRepository.countDocuments.mockResolvedValueOnce(80);
      productRepository.countDocuments.mockResolvedValueOnce(40);
      expect(await reportsService.getNonDeletedPercentage(true)).toBe(50);
    });

    // it('should throw BadRequestException if only one date is provided', async () => {
    //   await expect(
    //     reportsService.getNonDeletedPercentage(
    //       undefined,
    //       new Date(),
    //       undefined,
    //     ),
    //   ).rejects.toThrow(BadRequestException);
    // });
  });

  describe('getTopExpensiveProducts', () => {
    it('should return the top 5 most expensive products', async () => {
      const mockProducts = [
        {
          name: 'Product 1',
          price: 100,
          category: 'Category 1',
          isDeleted: false,
          createdAt: new Date(),
          _id: '1',
        },
        {
          name: 'Product 2',
          price: 90,
          category: 'Category 2',
          isDeleted: false,
          createdAt: new Date(),
          _id: '2',
        },
      ];
      productRepository.findMany.mockResolvedValue(
        mockProducts as unknown as Product[],
      );
      expect(await reportsService.getTopExpensiveProducts()).toEqual(
        mockProducts,
      );
    });
  });
});
