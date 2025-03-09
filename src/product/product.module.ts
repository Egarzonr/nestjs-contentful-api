import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './services/product.service';
import { ProductsController } from './controllers/product.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MongooseProductRepository } from './repositories/mongoose-product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ScheduleModule.forRoot(),
    ConfigModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'IProductRepository',
      useClass: MongooseProductRepository,
    },
  ],
  exports: [ProductsService, 'IProductRepository'],
})
export class ProductsModule {}
