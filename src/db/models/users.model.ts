import { Model, raw } from 'objection';
import * as bcrypt from 'bcryptjs';
import { format } from 'timeago.js';
import BaseModel from './base.model';
import moment from 'moment-timezone';
export class UserModel extends BaseModel {
	first_name!: string;
	last_name!: string;
	phone!: string;
	email!: string;
	password!: string;

	static get tableName() {
		return 'users';
	}

	static get hidden() {
		return ['password', 'id'];
	}

	static get visible() {
		return [
			'first_name',
			'last_name',
			'phone',
			'email',
			'created_at',
			'updated_at',
			'fullName',
			'joined',
			'tokens',
		];
	}

	static get virtualAttributes() {
		return ['fullName', 'joined'];
	}

	fullName() {
		return `${this.first_name} ${this.last_name}`;
	}

	joined() {
		return format(this.created_at);
	}

	static get relationMappings() {
		return {
			tokens: {
				relation: Model.HasManyRelation,
				modelClass: 'tokens.model',
				join: {
					from: 'users.id',
					to: 'tokens.user_id',
				},
			},
		};
	}

	async $beforeInsert() {
		const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
		this.created_at = moment(new Date()).tz('Africa/Nairobi');
	}

	async $beforeUpdate() {
		const salt = await bcrypt.genSalt(12);
		if (this.password) {
			this.password = await bcrypt.hash(this.password, salt);
		}
		this.updated_at = moment(new Date()).tz('Africa/Nairobi');
	}

	async isPhoneTaken(
		phoneNumber: string,
		excludeUserId?: number
	): Promise<Boolean> {
		const user = await this.$query().where({ phone: phoneNumber });
		return !!user;
	}

	async isEmailTaken(
		email: string,
		excludeUserId?: number
	): Promise<Boolean> {
		const user = await this.$query().where({ email: email });
		return !!user;
	}

	async isPasswordMatch(password: string): Promise<Boolean> {
		const user = this;
		return await bcrypt.compare(password, user.password);
	}
}
