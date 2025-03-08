import { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  category: string;
  price?: number;
  isDeleted: boolean;
  createdAt: Date;
}

export interface IProductRepository {
  countDocuments(filter?: any): Promise<number>;
  findOneAndUpdate(
    filter: any,
    update: any,
    options: any,
  ): Promise<Product | null>;

  findMany(
    filter?: any,
    options?: { sort?: any; limit?: number; skip?: number },
  ): Promise<Product[]>;
}
