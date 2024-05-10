import { Module } from '@nestjs/common';
import { CategoryModule } from './module/category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './db/config/typeorm.config';

@Module({
	imports: [
		CategoryModule,
		ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => configService.get('typeorm'),
			inject: [ConfigService],
		}),
	],
	providers: [],
})
export class AppModule {}
