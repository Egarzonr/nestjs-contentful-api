import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { PaginationDto } from '../dto/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    return this.productsService.findAll({ isDeleted: false }, page, limit);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.productsService.delete(id);
  }
}
