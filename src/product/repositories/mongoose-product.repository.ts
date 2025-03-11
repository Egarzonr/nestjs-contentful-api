import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { IProductRepository } from './product.repository';
import { Product } from '../schemas/product.schema';

@Injectable()
export class MongooseProductRepository implements IProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async countDocuments(filter: FilterQuery<Product> = {}): Promise<number> {
    return this.productModel.countDocuments(filter).exec();
  }

  async findOneAndUpdate(
    filter: FilterQuery<Product>,
    update: UpdateQuery<Product>,
    options: QueryOptions = {},
  ): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate(filter, update, { ...options, new: true })
      .lean()
      .exec();
  }

  async findMany(
    filter: FilterQuery<Product> = {},
    options: { sort?: any; limit?: number; skip?: number } = {},
  ): Promise<Product[]> {
    return this.productModel
      .find(filter)
      .sort(options.sort ?? { name: 1 })
      .limit(options.limit ?? 0)
      .skip(options.skip ?? 0)
      .exec();
  }
}
