import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './report.service';
import { IProductRepository } from '../../product/repositories/product.repository';
import { BadRequestException } from '@nestjs/common';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let productRepository: IProductRepository;

  const mockProductRepository = {
    countDocuments: jest.fn(),
    findMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
    productRepository = module.get<IProductRepository>('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reportsService).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return the deleted percentage', async () => {
      mockProductRepository.countDocuments.mockResolvedValueOnce(100);
      mockProductRepository.countDocuments.mockResolvedValueOnce(20);

      const result = await reportsService.getDeletedPercentage();

      expect(result).toBe(20);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.countDocuments).toHaveBeenCalledWith({});
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.countDocuments).toHaveBeenCalledWith({
        isDeleted: true,
      });
    });

    it('should return 0 if no products exist', async () => {
      mockProductRepository.countDocuments.mockResolvedValueOnce(0);

      const result = await reportsService.getDeletedPercentage();

      expect(result).toBe(0);
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return the non-deleted percentage with price filter', async () => {
      mockProductRepository.countDocuments.mockResolvedValueOnce(100);
      mockProductRepository.countDocuments.mockResolvedValueOnce(80);

      const result = await reportsService.getNonDeletedPercentage(true);

      expect(result).toBe(80);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.countDocuments).toHaveBeenCalledWith({});
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.countDocuments).toHaveBeenCalledWith({
        isDeleted: false,
        price: { $exists: true },
      });
    });

    it('should return the non-deleted percentage with date filter', async () => {
      mockProductRepository.countDocuments.mockResolvedValueOnce(100);
      mockProductRepository.countDocuments.mockResolvedValueOnce(50);

      const startDate = '2023-01-01';
      const endDate = '2023-01-31';

      const result = await reportsService.getNonDeletedPercentage(
        false,
        startDate,
        endDate,
      );

      expect(result).toBe(50);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.countDocuments).toHaveBeenCalledWith({});
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.countDocuments).toHaveBeenCalledWith({
        isDeleted: false,
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        price: { $exists: false }, // Agregamos la expectativa para el filtro de precio
      });
    });

    it('should throw BadRequestException for invalid date format', async () => {
      const startDate = 'invalid-date';
      const endDate = '2023-01-31';

      await expect(
        reportsService.getNonDeletedPercentage(false, startDate, endDate),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTopExpensiveProducts', () => {
    it('should return the top expensive products', async () => {
      const products = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 90 },
      ];
      mockProductRepository.findMany.mockResolvedValue(products);

      const result = await reportsService.getTopExpensiveProducts();

      expect(result).toEqual(products);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(
        {},
        { sort: { price: -1 }, limit: 5 },
      );
    });
  });
});
