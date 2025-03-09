import { Module } from '@nestjs/common';
import { ReportsService } from './services/report.service';
import { ReportsController } from './controllers/report.controller';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [ProductsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
