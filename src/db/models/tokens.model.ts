import moment from 'moment-timezone';
import { Model } from 'objection';
import path from 'path';

export class TokenModel extends Model {
	id!: number;
	token!: string;
	type!: string;
	expires!: Date;
	blacklisted!: Boolean;
	userId!: number;
	created_at!: any;
	updated_at!: any;

	static get tableName() {
		return 'token';
	}

	/*static get relationMappings() {
		const user = path.resolve('src', 'db', 'models', 'tokens.model.ts');
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: user,
				join: {
					from: 'token.userId',
					to: 'users.id',
				},
			},
		};
	}*/

	async $beforeInsert() {
		this.created_at = moment(new Date()).tz('Africa/Nairobi');
	}

	async $beforeUpdate() {
		this.updated_at = moment(new Date()).tz('Africa/Nairobi');
	}
}
