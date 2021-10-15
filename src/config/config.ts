import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
require('dotenv').config();

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test'),
		PORT: Joi.number().default(3001),
		PG_CONNECTION_STRING: Joi.string().required(),
		JWT_SECRET: Joi.string().required(),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: 'key' } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export default {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	pg: envVars.PG_CONNECTION_STRING,
	jwt: {
		secret: envVars.JWT_SECRET,
	},
};
