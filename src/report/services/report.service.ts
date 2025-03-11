import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { IProductRepository } from '../../product/repositories/product.repository';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  private async getProductReport(filter: Record<string, any>): Promise<number> {
    try {
      const total = await this.productRepository.countDocuments({});
      if (!total) return 0;

      const count = await this.productRepository.countDocuments(filter);
      return (count / total) * 100;
    } catch (error) {
      this.logger.error('Error calculating product report', error);
      throw error;
    }
  }

  async getDeletedPercentage(): Promise<number> {
    return this.getProductReport({ isDeleted: true });
  }

  async getNonDeletedPercentage(
    hasPrice: boolean,
    startDate?: string,
    endDate?: string,
  ): Promise<number> {
    try {
      const filter: Record<string, any> = { isDeleted: false };

      if (hasPrice !== undefined) {
        filter.price = { $exists: hasPrice };
      }

      if (startDate && endDate) {
        const start = this.validateAndConvertDate(startDate);
        const end = this.validateAndConvertDate(endDate);
        filter.createdAt = { $gte: start, $lte: end };
      }

      return await this.getProductReport(filter);
    } catch (error) {
      this.logger.error('Error calculating non-deleted percentage', error);
      throw error;
    }
  }

  async getTopExpensiveProducts(): Promise<any[]> {
    try {
      return await this.productRepository.findMany(
        {},
        { sort: { price: -1 }, limit: 5 },
      );
    } catch (error) {
      this.logger.error('Error fetching top expensive products', error);
      throw error;
    }
  }

  private validateAndConvertDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }
    return date;
  }
}
