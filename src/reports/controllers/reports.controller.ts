import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
@UseGuards(AuthGuard('jwt')) // Protegido con JWT
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @Get('non-deleted-percentage')
  async getNonDeletedPercentage(
    @Query('hasPrice') hasPrice: string, // Llega como string (true/false)
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

  // 3️⃣ Top 5 productos más caros
  @Get('top-expensive-products')
  async getTopExpensiveProducts() {
    return this.reportsService.getTopExpensiveProducts();
  }
}
