import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>> & {
  find?: jest.Mock;
  findByIdAndUpdate?: jest.Mock;
  save?: jest.Mock;
  create?: jest.Mock;
  exec?: jest.Mock;
  skip?: jest.Mock;
  limit?: jest.Mock;
};

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productModel: MockModel;

  beforeEach(async () => {
    productModel = {
      find: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([{ id: '1', name: 'Product 1' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: productModel,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];

      const result = await productsService.findAll({ isDeleted: false }, 1, 5);
      expect(result).toEqual(mockProducts);
      expect(productModel.find).toHaveBeenCalledWith({ isDeleted: false });
      expect(productModel.skip).toHaveBeenCalledWith(0);
      expect(productModel.limit).toHaveBeenCalledWith(5);
      expect(productModel.exec).toHaveBeenCalled();
    });
  });
});
