import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'category' })
export class CategoryEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: 'varchar', length: 150, unique: true })
	slug: string;

	@Column({ type: 'varchar', length: 150 })
	name: string;

	@Column({ type: 'varchar', length: 150, nullable: true })
	description?: string;

	@CreateDateColumn({ name: 'createddate' })
	createdDate: Date;

	@Column({ type: 'boolean' })
	active: boolean;
}
