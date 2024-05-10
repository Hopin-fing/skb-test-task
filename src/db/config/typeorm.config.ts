import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CategoryEntity } from 'src/module/category/entities/category.entity';

dotenvConfig({ path: './.env' });
const config = {
	type: 'postgres',
	host: `${process.env.DATABASE_HOST}`,
	port: `${process.env.DATABASE_PORT}`,
	username: `${process.env.DATABASE_USERNAME}`,
	password: `${process.env.DATABASE_PASSWORD}`,
	database: `${process.env.DATABASE_NAME}`,
	entities: [CategoryEntity],
	synchronize: true,
	migrations: ['src/migrations/**/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);