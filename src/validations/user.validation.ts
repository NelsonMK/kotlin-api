import * as Joi from 'joi';
import { password } from './custom.validation';

const createUser = {
	body: Joi.object().keys({
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
	}),
};

export { createUser };
