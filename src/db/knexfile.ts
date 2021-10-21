import config from '../config/config';
import logger from '../utils/logger';
import fs from 'fs';

const development = {
	client: 'pg',
	debug: true,
	connection: {
		connectionString: config.pg,
		ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('prod-ca-2021.crt').toString(),
		},
	},
	pool: {
		min: 2,
		max: 10,
		afterCreate: (conn: any, done: any) => {
			conn.query('SET timezone="GMT+3";', (err: any) => {
				if (err) {
					logger.error(err);
					done(err, conn);
				}
				logger.info(
					`Successfully connected to ${conn.database} database on host ${conn.host}`
				);
				done(err, conn);
			});
		},
	},
	migrations: {
		tableName: 'knex_migrations',
	},
};

const production = {
	client: 'pg',
	connection: {
		connectionString: config.pg,
		ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('prod-ca-2021.crt').toString(),
		},
	},
	pool: {
		min: 2,
		max: 10,
		afterCreate: (conn: any, done: any) => {
			conn.query('SET timezone="GMT+3";', (err: any) => {
				if (err) {
					logger.error(err);
					done(err, conn);
				}
				logger.info(
					`Successfully connected to ${conn.database} database on host ${conn.host}`
				);
				done(err, conn);
			});
		},
	},
};

export { development, production };
