import { mixin, Model } from 'objection';
import * as bcrypt from 'bcryptjs';
import moment from 'moment-timezone';
import path from 'path';
import * as visibilityPlugin from 'objection-visibility';
import { format } from 'timeago.js';

export class UserModel extends mixin(Model, visibilityPlugin.default) {
	id!: number;
	first_name!: string;
	last_name!: string;
	phone!: string;
	email!: string;
	password!: string;
	created_at!: any;
	updated_at!: any;

	static get tableName() {
		return 'users';
	}

	static get hidden() {
		return ['password'];
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
		const tokens = path.resolve('src', 'db', 'models', 'tokens.model.ts');
		return {
			tokens: {
				relation: Model.HasManyRelation,
				modelClass: tokens,
				join: {
					from: 'users.id',
					to: 'token.userId',
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
			this.updated_at = moment(new Date()).tz('Africa/Nairobi');
		}
	}
}
