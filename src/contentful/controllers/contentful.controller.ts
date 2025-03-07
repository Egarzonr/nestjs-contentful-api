import { Controller, Post } from '@nestjs/common';
import { ContentfulTask } from '../tasks/contentful.task';

@Controller('contentful')
export class ContentfulController {
  constructor(private readonly contentfulTask: ContentfulTask) {}

  @Post('fetch-products')
  async fetchProducts() {
    await this.contentfulTask._fetchAndInsertProducts();
    return { message: 'Productos actualizados desde Contentful.' };
  }
}
