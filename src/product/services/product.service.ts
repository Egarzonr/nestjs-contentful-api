import { Injectable, Inject, Logger } from '@nestjs/common';
import { IProductRepository } from '../repositories/product.repository';
import { PaginationDto } from '../dto/pagination.dto';
import { ProductFilterDto } from '../dto/product-filter.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(filters: ProductFilterDto, pagination: PaginationDto) {
    const { name, category, minPrice, maxPrice } = filters;
    const { page = 1, limit = 5 } = pagination;

    const query: Record<string, any> = { isDeleted: false };

    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {
        ...(minPrice && { $gte: minPrice }),
        ...(maxPrice && { $lte: maxPrice }),
      };
    }

    try {
      const products = await this.productRepository.findMany(query, {
        skip: (page - 1) * limit,
        limit,
      });

      this.logger.log(`Found ${products.length} products`);
      return products;
    } catch (error) {
      this.logger.error(`Error fetching products: ${error}`);
      throw new Error('Failed to fetch products');
    }
  }

  async delete(id: string) {
    try {
      const result = await this.productRepository.findOneAndUpdate(
        { _id: id },
        { isDeleted: true },
        {},
      );
      return result;
    } catch (error) {
      this.logger.error(`Error deleting product with id ${id}`, error);
      throw new Error('Failed to delete product');
    }
  }
}
