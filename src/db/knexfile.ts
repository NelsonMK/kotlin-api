import config from '../config/config';
import logger from '../utils/logger';

const development = {
	client: 'pg',
	debug: true,
	connection: config.pg,
	/*connection: {
		host: 'localhost',
		user: 'nelson',
		password: 'nelson',
		database: 'kotlin',
	},*/
	pool: {
		min: 2,
		max: 10,
		afterCreate: (conn: any, done: any) => {
			conn.query('SET timezone="UTC";', (err: any) => {
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

export { development };
