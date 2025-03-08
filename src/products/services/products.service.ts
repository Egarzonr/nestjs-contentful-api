import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(filter: any, page: number, limit: number) {
    return this.productRepository.findMany(filter, {
      skip: (page - 1) * limit,
      limit,
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
