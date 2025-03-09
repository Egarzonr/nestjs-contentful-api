import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(
    filter: Partial<Record<string, unknown>>,
    page: number,
    limit: number,
  ) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 10);

    return this.productRepository.findMany(filter, {
      skip: (safePage - 1) * safeLimit,
      limit: safeLimit,
    });
  }

  async delete(id: string) {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      {},
    );
  }
}
