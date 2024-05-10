import { Controller, Post, Body, BadRequestException, Get, Query, Delete, Param, Put, Patch } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('find')
	async getSingleCategory(@Query() query: FindCategoryDto): Promise<CategoryEntity> {
		const { id, slug } = query;

		if (!id && !slug) {
			throw new BadRequestException('Отсутствуют атрибуты slug и id');
		}

		return await this.categoryService.findByIdOrSlug(query);
	}

	@Post('create')
	async create(@Body() dto: CreateCategoryDto): Promise<CategoryEntity> {
		return await this.categoryService.create(dto);
	}

	@Get('search')
	async search(@Query() query: FilterCategoryDto): Promise<any> {
		return await this.categoryService.search(query);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
		return this.categoryService.update(id, dto);
	}

	@Patch(':id/update-slug')
	async updateSlug(@Param('id') id: string, @Body() { slug }: UpdateCategoryDto) {
		return this.categoryService.update(id, { slug });
	}

	@Patch(':id/update-name')
	async updateName(@Param('id') id: string, @Body() { name }: UpdateCategoryDto) {
		return this.categoryService.update(id, { name });
	}

	@Patch(':id/update-description')
	async updateDescription(@Param('id') id: string, @Body() { description }: UpdateCategoryDto) {
		return this.categoryService.update(id, { description });
	}

	@Patch(':id/update-active')
	async updateActive(@Param('id') id: string, @Body() { active }: UpdateCategoryDto) {
		return this.categoryService.update(id, { active });
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(id);
	}
}
