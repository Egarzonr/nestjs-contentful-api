import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseBoolPipe,
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
    @Query('hasPrice', ParseBoolPipe) hasPrice: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getNonDeletedPercentage(
      hasPrice,
      startDate,
      endDate,
    );
  }

  @Get('top-expensive-products')
  async getTopExpensiveProducts() {
    return this.reportsService.getTopExpensiveProducts();
  }
}
