import BaseModel from './base.model';
import * as bcrypt from 'bcryptjs';
import moment from 'moment-timezone';

export class AdminModel extends BaseModel {
	first_name!: string;
	last_name!: string;
	phone!: string;
	email!: string;
	password!: string;

	static get tableName() {
		return 'admin';
	}

	static get hidden() {
		return ['id', 'password'];
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
}
