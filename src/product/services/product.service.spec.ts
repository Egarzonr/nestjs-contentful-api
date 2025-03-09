import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { IProductRepository } from '../repositories/product.repository';
import { Product } from '../schemas/product.schema';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    productRepository = {
      findMany: jest.fn(),
      findOneAndUpdate: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: 'IProductRepository', useValue: productRepository },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
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

      const result = await productsService.findAll({}, 1, 5);
      expect(result).toEqual(mockProducts);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productRepository.findMany).toHaveBeenCalledWith(
        {},
        { skip: 0, limit: 5 },
      );
    });
  });

  describe('delete', () => {
    it('should mark a product as deleted', async () => {
      const mockProduct = { _id: '123', name: 'Product 1', isDeleted: true };
      productRepository.findOneAndUpdate.mockResolvedValueOnce(
        mockProduct as Product,
      );

      const result = await productsService.delete('123');
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
