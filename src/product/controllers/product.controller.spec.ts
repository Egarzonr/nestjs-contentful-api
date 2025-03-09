import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { PaginationDto } from '../dto/pagination.dto';

describe('ProductsController', () => {
  let controller: ProductController;

  const mockProductsService = {
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should get paginated products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const paginationDto: PaginationDto = { page: 1, limit: 5 };
      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockProducts);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(
        { isDeleted: false },
        1,
        5,
      );
    });
  });

  describe('delete', () => {
    it('should delete a product by ID', async () => {
      const mockResponse = { success: true };
      mockProductsService.delete.mockResolvedValue(mockResponse);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await controller.delete('123');

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.delete).toHaveBeenCalledWith('123');
    });
  });
});
