import knex from 'knex';
import { development } from './knexfile';
import { Model } from 'objection';
import logger from '../utils/logger';
import config from '../config/config';

const connectDB = () => {
	try {
		let db = null;

		if (config.env === 'development') {
			db = knex(development);
		}

		Model.knex(db);
	} catch (error) {
		logger.error(`Unable to connect to db due to ${error}`);
	}
};

export default connectDB;
