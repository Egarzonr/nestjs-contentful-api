import { Module } from '@nestjs/common';
import { ContentfulTask } from './tasks/contentful.task';
import { ContentfulController } from './controllers/contentful.controller';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [ProductsModule],
  providers: [ContentfulTask],
  controllers: [ContentfulController],
})
export class ContentfulModule {}
