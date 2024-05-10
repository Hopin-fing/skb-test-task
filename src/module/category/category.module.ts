import { Module } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	providers: [CategoryService],
	controllers: [CategoryController],
})
export class CategoryModule {}
