import knex from 'knex';
import { development, production } from './knexfile';
import { Model } from 'objection';
import logger from '../utils/logger';
import config from '../config/config';
import { createConnection } from 'typeorm';
import { User } from '../entity/User';
import { Tokens } from '../entity/Token';
import { Admin } from '../entity/Admin';

const connectDB = async () => {
	try {
		let db = null;

		if (config.env === 'development') {
			db = knex(development);
		} else if (config.env === 'production') {
			db = knex(production);
		}

		Model.knex(db);

		await createConnection({
			type: 'postgres',
			url: config.pg,
			entities: [User, Tokens, Admin],
			synchronize: true,
			logging: false,
		})
			.then(() => {
				logger.info(`Successfully connected to db - typeorm`);
			})
			.catch((error) => {
				logger.error(error);
			});
	} catch (error) {
		logger.error(`Unable to connect to db due to ${error}`);
	}
};

export default connectDB;
