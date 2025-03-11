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
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {
        ...(filters.minPrice !== undefined && { $gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { $lte: filters.maxPrice }),
      };
    }

    try {
      const products = await this.productRepository.findMany(query, {
        skip: ((pagination.page ?? 1) - 1) * (pagination.limit ?? 5),
        limit: pagination.limit ?? 5,
      });

      this.logger.log(`Found ${products.length} products`);
      return products;
    } catch (error) {
      this.logger.error('Error fetching products', error);
      throw new Error('Failed to fetch products');
    }
  }

  async delete(id: string) {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      {},
    );
  }
}
