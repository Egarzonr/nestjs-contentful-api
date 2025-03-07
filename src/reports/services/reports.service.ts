import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../../products/repositories/product.repository';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async getDeletedPercentage(): Promise<number> {
    const total = await this.productRepository.countDocuments();
    if (!total) return 0;

    const deleted = await this.productRepository.countDocuments({
      isDeleted: true,
    });
    return (deleted / total) * 100;
  }

  async getNonDeletedPercentage(
    hasPrice?: boolean,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const totalNonDeleted = await this.productRepository.countDocuments({
      isDeleted: false,
    });
    if (!totalNonDeleted) return 0;

    const filter: Record<string, any> = { isDeleted: false };
    if (hasPrice !== undefined) filter.price = { $exists: hasPrice };
    if (startDate && endDate)
      filter.createdAt = { $gte: startDate, $lte: endDate };

    const count = await this.productRepository.countDocuments(filter);
    return (count / totalNonDeleted) * 100;
  }
}
