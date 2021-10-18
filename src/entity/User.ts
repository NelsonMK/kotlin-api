import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { Tokens } from './Token';
import { roles } from '../config/roles';

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'text', width: 200 })
	first_name!: string;

	@Column({ type: 'text', width: 200 })
	last_name!: string;

	@Column({ type: 'varchar', width: 10, unique: true })
	phone!: string;

	@Column({ type: 'varchar', width: 250, unique: true })
	email!: string;

	@Column({ select: false })
	password!: string;

	@OneToMany(() => Tokens, (token) => token.user)
	tokens!: Tokens[];

	@Column({ type: 'enum', enum: roles, nullable: true })
	role!: string;

	@Column({ type: 'timestamptz', nullable: true })
	created_at!: Date;

	@Column({ type: 'timestamptz', nullable: true })
	updated_at!: Date;
}
