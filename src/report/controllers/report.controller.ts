import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ReportsService } from '../services/report.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @Get('non-deleted-percentage')
  async getNonDeletedPercentage(
    @Query('hasPrice') hasPrice: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const hasPriceBool = hasPrice === 'true';

    let start: Date | undefined;
    let end: Date | undefined;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
      }
    }

    return this.reportsService.getNonDeletedPercentage(
      hasPriceBool,
      start,
      end,
    );
  }

  @Get('top-expensive-products')
  async getTopExpensiveProducts() {
    return this.reportsService.getTopExpensiveProducts();
  }
}
