import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@IsNotEmpty()
	slug: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	description?: string;

	@IsBoolean()
	@IsNotEmpty()
	active: boolean;
}
