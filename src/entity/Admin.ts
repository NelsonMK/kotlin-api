import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'text' })
	first_name!: string;

	@Column({ type: 'text' })
	last_name!: string;

	@Column({ type: 'varchar', unique: true, length: 10 })
	phone!: string;

	@Column({ type: 'varchar', unique: true })
	email!: string;

	@Column({ type: 'varchar' })
	password!: string;

	@Column({ type: 'timestamptz', nullable: true })
	created_at!: Date;

	@Column({ type: 'timestamptz', nullable: true })
	updated_at!: Date;
}
