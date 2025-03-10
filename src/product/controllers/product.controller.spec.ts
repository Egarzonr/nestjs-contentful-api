import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { PaginationDto } from '../dto/pagination.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call productService.findAll with filters and pagination', async () => {
      const filters: ProductFilterDto = {
        name: 'Test',
        category: 'Electronics',
      };
      const pagination: PaginationDto = { page: 1, limit: 5 };
      const mockResponse = {
        total: 10,
        page: 1,
        limit: 5,
        products: [],
      };

      (productService.findAll as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productController.findAll(filters, pagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productService.findAll).toHaveBeenCalledWith(filters, pagination);
      expect(result).toEqual(mockResponse);
    });

    it('should call productService.findAll with empty filters and default pagination when none provided', async () => {
      const mockResponse = {
        total: 10,
        page: 1,
        limit: 5,
        products: [],
      };

      (productService.findAll as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productController.findAll({}, {} as PaginationDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productService.findAll).toHaveBeenCalledWith(
        {},
        {} as PaginationDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should call productService.delete with a valid ID', async () => {
      const productId = '60af924b1c4ae4a3b8e92c3f';
      const mockResponse = { _id: productId, isDeleted: true };

      (productService.delete as jest.Mock).mockResolvedValue(mockResponse);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await productController.delete(productId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productService.delete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if productService.delete fails', async () => {
      const productId = 'invalid-id';
      (productService.delete as jest.Mock).mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(productController.delete(productId)).rejects.toThrow(
        'Product not found',
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productService.delete).toHaveBeenCalledWith(productId);
    });
  });
});
