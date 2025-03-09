import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../../product/repositories/product.repository';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async getProductReport(filter: Record<string, any>): Promise<number> {
    const total = await this.productRepository.countDocuments();
    if (!total) return 0;

    const count = await this.productRepository.countDocuments(filter);
    return (count / total) * 100;
  }

  async getDeletedPercentage(): Promise<number> {
    return this.getProductReport({ isDeleted: true });
  }

  async getNonDeletedPercentage(
    hasPrice?: boolean,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const filter: Record<string, any> = { isDeleted: false };

    if (hasPrice !== undefined) {
      filter.price = { $exists: hasPrice };
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    return this.getProductReport(filter);
  }

  async getTopExpensiveProducts(): Promise<any[]> {
    return this.productRepository.findMany(
      {},
      { sort: { price: -1 }, limit: 5 },
    );
  }
}
