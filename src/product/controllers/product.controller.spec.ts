import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './product.controller';
import { ProductsService } from '../services/product.service';
import { Product } from '../schemas/product.schema';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      jest
        .spyOn(productsService, 'findAll')
        .mockResolvedValue(mockProducts as Product[]);

      const result = await productsController.findAll(1, 5);
      expect(result).toEqual(mockProducts);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productsService.findAll).toHaveBeenCalledWith(
        { isDeleted: false },
        1,
        5,
      );
    });
  });

  describe('delete', () => {
    it('should delete a product and return the result', async () => {
      const mockResponse = {
        id: '1',
        name: 'Deleted Product',
        isDeleted: true,
      } as Product;
      jest.spyOn(productsService, 'delete').mockResolvedValue(mockResponse);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await productsController.delete('1');
      expect(result).toEqual(mockResponse);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(productsService.delete).toHaveBeenCalledWith('1');
    });
  });
});
