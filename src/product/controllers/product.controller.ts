import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { PaginationDto } from '../dto/pagination.dto';
import { ValidateObjectIdPipe } from '../pipes/validate-objectid.pipe';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(
      { isDeleted: false },
      paginationDto.page ?? 1,
      paginationDto.limit ?? 5,
    );
  }

  @Delete(':id')
  async delete(@Param('id', ValidateObjectIdPipe) id: string): Promise<any> {
    return this.productsService.delete(id);
  }
}
