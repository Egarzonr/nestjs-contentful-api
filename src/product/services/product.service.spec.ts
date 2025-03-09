import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { IProductRepository } from '../repositories/product.repository';
import { Product } from '../schemas/product.schema';

describe('ProductsService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    productRepository = {
      findMany: jest.fn(),
      findOneAndUpdate: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: 'IProductRepository', useValue: productRepository },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { name: 'Product 1', category: 'Category A', price: 100 },
        { name: 'Product 2', category: 'Category B', price: 200 },
      ];
      productRepository.findMany.mockResolvedValueOnce(
        mockProducts as Product[],
      );

      const result = await productService.findAll({}, 1, 10);
      expect(result).toEqual(mockProducts);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(
        {},
        { skip: 0, limit: 10 },
      );
    });
  });

  describe('delete', () => {
    it('should mark a product as deleted', async () => {
      const mockProduct = { _id: '123', name: 'Product 1', isDeleted: true };
      productRepository.findOneAndUpdate.mockResolvedValueOnce(
        mockProduct as Product,
      );

      const result = await productService.delete('123');
      expect(result).toEqual(mockProduct);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123' },
        { isDeleted: true },
        {},
      );
    });
  });
});
