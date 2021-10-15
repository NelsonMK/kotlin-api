import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import tokenTypes from '../config/tokens';
import { User } from './User';

//*Add more fields like ip address
@Entity()
export class Token extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'varchar', width: 1000 })
	token!: string;

	@Column({ type: 'enum', enum: tokenTypes })
	type!: string;

	@Column()
	expires!: Date;

	@Column({ type: 'boolean', default: false })
	blacklisted!: Boolean;

	@ManyToOne(() => User, (user) => user.id)
	user!: number;

	@Column({ type: 'timestamptz' })
	@CreateDateColumn()
	created_at!: Date;

	@Column({ type: 'timestamptz' })
	@UpdateDateColumn()
	updated_at!: Date;
}
