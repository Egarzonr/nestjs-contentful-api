import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { PaginationDto } from '../dto/pagination.dto';
import { ValidateObjectIdPipe } from '../pipes/validate-objectid.pipe';
import { ProductFilterDto } from '../dto/product-filter.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async findAll(
    @Query() filters: ProductFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.productsService.findAll(filters, pagination);
  }

  @Delete(':id')
  async delete(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productsService.delete(id);
  }
}
