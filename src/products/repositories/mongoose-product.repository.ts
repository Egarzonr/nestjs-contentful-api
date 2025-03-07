import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProductRepository } from './product.repository';
import { Product } from '../schemas/product.schema';

@Injectable()
export class MongooseProductRepository implements IProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async countDocuments(filter: any = {}): Promise<number> {
    return this.productModel.countDocuments(filter).exec();
  }

  async findOneAndUpdate(
    filter: any,
    update: any,
    options: any,
  ): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate(filter, update, { ...options, new: true })
      .lean()
      .exec();
  }
}
