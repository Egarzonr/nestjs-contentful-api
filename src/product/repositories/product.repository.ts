import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { Product } from '../schemas/product.schema';

export interface IProductRepository {
  countDocuments(filter?: FilterQuery<Product>): Promise<number>;
  findOneAndUpdate(
    filter: FilterQuery<Product>,
    update: UpdateQuery<Product>,
    options?: QueryOptions,
  ): Promise<Product | null>;
  findMany(
    filter?: FilterQuery<Product>,
    options?: { sort?: any; limit?: number; skip?: number },
  ): Promise<Product[]>;
}
