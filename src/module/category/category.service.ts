import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { TSortOption } from './category.type';
import { SearchActiveValue, SearchFieldValue } from './constants/search-active.type';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(CategoryEntity)
		private readonly categoryRepository: Repository<CategoryEntity>,
	) {}

	async create({ slug, name, description, active }: CreateCategoryDto): Promise<CategoryEntity> {
		const category = new CategoryEntity();

		await this.slugChecking(slug);
		this.mainLangChecking([name, description]);

		category.slug = slug;
		category.name = name;
		if (description) category.description = description;
		category.active = active;

		const newCategory = await this.categoryRepository.save(category);

		return newCategory;
	}

	async findByIdOrSlug(dto: FindCategoryDto) {
		const result = await this.categoryRepository.findOne({
			where: { ...dto },
		});

		if (!result) {
			throw new BadRequestException('Категории с такими данными не существует');
		}

		return result;
	}

	async search({ name, description, active, search, pageSize = 2, page = 1, sort = '-createdDate' }: FilterCategoryDto) {
		page = page > 1 ? Math.round(pageSize * (page - 1)) : 0;
		pageSize = pageSize >= 1 && pageSize <= 9 ? pageSize : 2;

		[name, description, active, search] = [name, description, active, search].map(el => {
			if (el) return el.trim();
		});

		const sortOption: TSortOption = sort.includes('-') ? 'DESC' : 'ASC',
			isBigRequest = name || description || active || search;

		if (!SearchFieldValue.includes(sort)) {
			sort = '-createdDate';
		}

		sort = sort.replace('-', '');

		if (isBigRequest) return await this.searchBigRequest({ name, description, active, search, pageSize, page, sort }, sortOption);

		const result = await this.categoryRepository
			.createQueryBuilder()
			.skip(page)
			.where('active = :active', { active: 'true' })
			.take(pageSize)
			.orderBy(sort, sortOption)
			.getMany();

		return result;
	}

	async searchBigRequest({ name, description, active, search, pageSize, page, sort }: FilterCategoryDto, sortOption: TSortOption) {
		if (active && !SearchActiveValue.includes(active)) {
			throw new BadRequestException('Неверно указан active');
		}

		const parametersWhere = {};
		let stringWhere: string | string[] = [];
		if (!!active) {
			parametersWhere['active'] = active;
			stringWhere.push('active = :active');
		}
		if (!!search) {
			parametersWhere['search'] = this.replaceRegexSymbol(search);
			stringWhere.push('(name ~* :search OR description ~* :search)');
		}
		if (!search && !!name) {
			parametersWhere['name'] = this.replaceRegexSymbol(name);
			stringWhere.push('name ~* :name');
		}
		if (!search && !!description) {
			parametersWhere['description'] = this.replaceRegexSymbol(description);
			stringWhere.push('description ~* :description');
		}

		stringWhere = stringWhere.join(' AND ');

		const result = await this.categoryRepository
			.createQueryBuilder()
			.skip(page)
			.where(stringWhere, parametersWhere)
			.take(pageSize)
			.orderBy(sort, sortOption)
			.getMany();

		return result;
	}

	async update(id: string, dto: Partial<CreateCategoryDto>): Promise<CategoryEntity> {
		if (dto.slug) await this.slugChecking(dto.slug);
		if (dto.name || dto.description) this.mainLangChecking([dto.name, dto.description]);

		const toUpdate = await this.findByIdOrSlug({ id });
		const updated = Object.assign(toUpdate, dto);
		const result = await this.categoryRepository.save(updated);

		return result;
	}

	async delete(id: string) {
		const result = await this.categoryRepository.delete({ id });

		return result;
	}

	async isUnique(key: string, value: string) {
		const isExist = await this.categoryRepository.findOne({
			where: { [key]: value },
		});

		if (isExist) {
			throw new BadRequestException(`Атрибут ${key} должен быть уникальным`);
		}
	}

	async slugChecking(string: string) {
		const regex = /(^[a-z0-9 ]*$)/i;
		const isEngSymbols = regex.test(string);

		if (!isEngSymbols) {
			throw new BadRequestException('Атрибут slug должен содержать только латинские буквы');
		}

		await this.isUnique('slug', string);
	}

	replaceRegexSymbol(data: string) {
		return data.replace(/[е]/gi, '[е|ё]');
	}

	mainLangChecking(arrValues: string[]) {
		const regex = /(^[а-яёa-z0-9 ]*$)/i;

		arrValues.forEach(el => {
			const isMainSymbols = regex.test(el);

			if (!isMainSymbols) {
				throw new BadRequestException('Атрибуты name и description должены содержать только латинские и кириллические буквы');
			}
		});
	}
}
