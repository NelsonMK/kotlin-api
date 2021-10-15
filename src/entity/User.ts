import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	BeforeUpdate,
	OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import { Token } from './Token';

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

	@Exclude({ toPlainOnly: true })
	@Column({ select: false })
	password!: string;

	@OneToMany(() => Token, (token) => token.user)
	tokens!: Token[];

	@Column({ type: 'timestamptz' })
	@CreateDateColumn()
	created_at!: Date;

	@Column({ type: 'timestamptz' })
	@UpdateDateColumn()
	updated_at!: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword(password: string) {
		if (this.password) {
			try {
				const salt = await bcrypt.genSalt();
				this.password = await bcrypt.hash(
					password || this.password,
					salt
				);
			} catch (error) {
				logger.error(error);
			}
		}
	}

	@Expose({ name: 'fullName' })
	getFullName() {
		return this.first_name + ' ' + this.last_name;
	}
}
