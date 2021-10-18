import { Knex } from 'knex';
import { roles } from '../config/roles';
import logger from '../utils/logger';

const initializeDB = async (db: any) => {
	try {
		await db.schema
			.withSchema('public')
			.createTableIfNotExists('users', (table: any) => {
				table.increments('id').primary();
				table.text('first_name').notNullable();
				table.text('last_name').notNullable();
				table.string('phone', 10).notNullable().unique();
				table.string('email', 50).notNullable().unique();
				table.enum('role', roles).defaultTo('admin');
				table.string('password', 250).notNullable();
				table.text('created_at', 'timestamptz').nullable();
				table.text('updated_at', 'timestamptz').nullable();
			})
			.then((info: any) => {
				console.log(info);
			})
			.catch((error: any) => {
				console.log(error);
			});

		await db.schema
			.withSchema('public')
			.createTableIfNotExists('tokens', (table: any) => {
				table.increments('id').primary();
				table.string('token').notNullable();
				table
					.enum('type', ['access', 'refresh', 'resetPassword'])
					.notNullable();
				table.text('expires', 'timestamptz').notNullable();
				table.boolean('blacklisted').defaultTo(false);
				table.string('ip_address').nullable();
				table.text('created_at', 'timestamptz').nullable();
				table.text('updated_at', 'timestamptz').nullable();
				table
					.integer('user_id')
					.unsigned()
					.references('id')
					.inTable('users');
			})
			.then((info: any) => {
				console.log(info);
			})
			.catch((error: any) => {
				console.log(error);
			});
	} catch (error) {
		logger.error(error);
	}
};

export default initializeDB;
