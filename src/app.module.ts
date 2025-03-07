import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentfulTask } from './contentful/tasks/contentful.task';
import { AuthModule } from './auth/auth.module';
import { ContentfulModule } from './contentful/contentful.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // Configura ConfigModule como global
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          process.env.NODE_ENV === 'docker'
            ? configService.get<string>('MONGO_URI_DOCKER') // URI Docker
            : configService.get<string>('MONGO_URI_LOCAL'), // URI local
      }),
    }),
    ProductsModule,
    ReportsModule,
    AuthModule,
    ContentfulModule,
    UsersModule,
  ],
})
export class AppModule {
  ContentfulTask: ContentfulTask;
}
