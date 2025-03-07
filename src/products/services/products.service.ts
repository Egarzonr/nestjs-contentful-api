import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from '../../products/dto/create-products.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async findAll(
    filter: RootFilterQuery<Product>,
    page: number,
    limit: number,
  ): Promise<Product[]> {
    return this.productModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async delete(id: string): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
