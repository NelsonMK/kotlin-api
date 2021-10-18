import knex from 'knex';
import { development } from './knexfile';
import { Model } from 'objection';
import logger from '../utils/logger';
import config from '../config/config';
import { createConnection } from 'typeorm';
import { User } from '../entity/User';
import { Tokens } from '../entity/Token';

const connectDB = async () => {
	try {
		let db = null;

		if (config.env === 'development') {
			db = knex(development);
		}

		Model.knex(db);

		await createConnection({
			type: 'postgres',
			url: config.pg,
			entities: [User, Tokens],
			synchronize: true,
			logging: false,
		})
			.then(() => {})
			.catch((error) => {
				logger.error(error);
			});
	} catch (error) {
		logger.error(`Unable to connect to db due to ${error}`);
	}
};

export default connectDB;
