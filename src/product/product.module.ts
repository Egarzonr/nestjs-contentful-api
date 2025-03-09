import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
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
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: MongooseProductRepository,
    },
  ],
  exports: [ProductService, 'IProductRepository'],
})
export class ProductsModule {}
