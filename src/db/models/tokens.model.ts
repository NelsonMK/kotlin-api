import { Model } from 'objection';
import BaseModel from './base.model';
import { UserModel } from './users.model';

export class TokenModel extends BaseModel {
	token!: string;
	type!: string;
	expires!: Date;
	blacklisted!: Boolean;
	user_id!: number;
	user!: UserModel;

	static get tableName() {
		return 'tokens';
	}

	static get relationMappings() {
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: 'users.model',
				join: {
					from: 'tokens.user_id',
					to: 'users.id',
				},
			},
		};
	}
}
