import { Module } from '@nestjs/common';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
