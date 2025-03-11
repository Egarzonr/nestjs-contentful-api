import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { IProductRepository } from '../repositories/product.repository';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: IProductRepository;

  const mockProductRepository: Partial<IProductRepository> = {
    findMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: 'IProductRepository', useValue: mockProductRepository },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<IProductRepository>('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call findMany with filters and paging', async () => {
      const filters: ProductFilterDto = {
        name: 'Test',
        category: 'Electronics',
      };
      const pagination: PaginationDto = { page: 2, limit: 5 };

      const expectedQuery = {
        isDeleted: false,
        name: { $regex: filters.name, $options: 'i' },
        category: filters.category,
      };

      const expectedOptions = {
        skip: ((pagination.page ?? 1) - 1) * (pagination.limit ?? 5),
        limit: pagination.limit,
      };

      (productRepository.findMany as jest.Mock).mockResolvedValue([]);

      await productService.findAll(filters, pagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(
        expectedQuery,
        expectedOptions,
      );
    });

    it('should correctly handle minPrice and maxPrice', async () => {
      const filters: ProductFilterDto = { minPrice: 10, maxPrice: 50 };
      const pagination: PaginationDto = { page: 1, limit: 5 };

      const expectedQuery = {
        isDeleted: false,
        price: { $gte: 10, $lte: 50 },
      };

      (productRepository.findMany as jest.Mock).mockResolvedValue([]);

      await productService.findAll(filters, pagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(expectedQuery, {
        skip: 0,
        limit: 5,
      });
    });

    it('should handle the case where minPrice is defined but maxPrice is not.', async () => {
      const filters: ProductFilterDto = { minPrice: 20 };
      const pagination: PaginationDto = { page: 1, limit: 5 };

      const expectedQuery = {
        isDeleted: false,
        price: { $gte: 20 },
      };

      (productRepository.findMany as jest.Mock).mockResolvedValue([]);

      await productService.findAll(filters, pagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(expectedQuery, {
        skip: 0,
        limit: 5,
      });
    });

    it('should handle the case where maxPrice is defined but minPrice is not.', async () => {
      const filters: ProductFilterDto = { maxPrice: 100 };
      const pagination: PaginationDto = { page: 1, limit: 5 };

      const expectedQuery = {
        isDeleted: false,
        price: { $lte: 100 },
      };

      (productRepository.findMany as jest.Mock).mockResolvedValue([]);

      await productService.findAll(filters, pagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(expectedQuery, {
        skip: 0,
        limit: 5,
      });
    });

    it('should throw an error if findMany fails', async () => {
      const filters: ProductFilterDto = {};
      const pagination: PaginationDto = {};

      (productRepository.findMany as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch products'),
      );

      await expect(productService.findAll(filters, pagination)).rejects.toThrow(
        'Failed to fetch products',
      );
    });
  });

  describe('delete', () => {
    it('should mark a product as deleted', async () => {
      const productId = '123';

      (productRepository.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: productId,
        isDeleted: true,
      });

      const result = await productService.delete(productId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: productId },
        { isDeleted: true },
        {},
      );
      expect(result).toEqual({ _id: productId, isDeleted: true });
    });

    it('should throw NotFoundException if product is not found', async () => {
      const productId = '123';

      (productRepository.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(productService.delete(productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if findOneAndUpdate fails', async () => {
      const productId = '123';

      (productRepository.findOneAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Failed to delete product'),
      );

      await expect(productService.delete(productId)).rejects.toThrow(
        'Failed to delete product',
      );
    });
  });
});
