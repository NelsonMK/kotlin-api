import { mixin, Model } from 'objection';
import * as visibilityPlugin from 'objection-visibility';
import moment from 'moment-timezone';

export default class BaseModel extends mixin(Model, visibilityPlugin.default) {
	id!: number;
	created_at!: any;
	updated_at!: any;

	static get modelPaths() {
		return [__dirname];
	}

	$beforeInsert() {
		this.created_at = moment(new Date()).tz('Africa/Nairobi');
	}

	$beforeUpdate() {
		this.updated_at = moment(new Date()).tz('Africa/Nairobi');
	}
}
