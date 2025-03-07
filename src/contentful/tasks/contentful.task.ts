import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createClient } from 'contentful';
import { ConfigService } from '@nestjs/config';
import { IProductRepository } from '../../products/repositories/product.repository';

@Injectable()
export class ContentfulTask {
  private client: ReturnType<typeof createClient>;

  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository, // Inyecta el repositorio
    private configService: ConfigService,
  ) {
    this.client = createClient({
      space: this.configService.get<string>('CONTENTFUL_SPACE_ID') || '',
      accessToken:
        this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN') || '',
      environment: this.configService.get<string>('CONTENTFUL_ENVIRONMENT'),
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async fetchAndInsertProducts() {
    await this._fetchAndInsertProducts();
  }
  async _fetchAndInsertProducts() {
    try {
      const entries = await this.client.getEntries<{
        fields: { name: string; category: string; price: number };
        contentTypeId: string;
      }>({
        content_type:
          this.configService.get<string>('CONTENTFUL_CONTENT_TYPE') || '',
      });

      for (const entry of entries.items) {
        const product = {
          name: entry.fields.name,
          category: entry.fields.category,
          price: entry.fields.price,
        };
        await this.productRepository.findOneAndUpdate(
          { name: product.name },
          product,
          { upsert: true },
        );
      }

      console.log('Products updated from Contentful.');
    } catch (error) {
      console.error('Error obtaining products from Contentful:', error);
    }
  }
}
