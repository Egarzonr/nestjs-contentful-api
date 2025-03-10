import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './product/product.module';
import { ReportsModule } from './report/report.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentfulTask } from './contentful/tasks/contentful.task';
import { AuthModule } from './auth/auth.module';
import { ContentfulModule } from './contentful/contentful.module';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:configService.get<string>('MONGO_URI') 
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
