import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.productsService.findAll({ isDeleted: false }, page, limit);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<any> {
    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.productsService.delete(id);
  }
}
