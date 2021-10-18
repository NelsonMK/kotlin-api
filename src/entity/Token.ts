import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import tokenTypes from '../config/tokens';
import { User } from './User';

@Entity()
export class Tokens extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'varchar', width: 1000 })
	token!: string;

	@Column({ type: 'enum', enum: tokenTypes })
	type!: string;

	@Column({ type: 'timestamptz', nullable: false })
	expires!: Date;

	@Column({ type: 'boolean', default: false })
	blacklisted!: Boolean;

	@Column({ type: 'varchar', nullable: true })
	ip_address!: string;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	user!: number;

	@Column({ type: 'timestamptz', nullable: true })
	created_at!: Date;

	@Column({ type: 'timestamptz', nullable: true })
	updated_at!: Date;
}
