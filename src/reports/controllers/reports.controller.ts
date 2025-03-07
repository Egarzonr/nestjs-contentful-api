import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
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
    @Query('hasPrice') hasPrice: boolean,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.reportsService.getNonDeletedPercentage(
      hasPrice,
      startDate,
      endDate,
    );
  }
}
