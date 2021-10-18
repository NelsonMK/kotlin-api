import * as Joi from 'joi';
import { password } from './custom.validation';
import { number, object, string } from 'zod';

const createUser = {
	body: Joi.object().keys({
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
	}),
};

const updateUser = object({
	body: object({
		first_name: string({
			required_error: 'First name is required',
			invalid_type_error: 'First name must be a string',
		}),
		last_name: string({
			required_error: 'Last name is required',
			invalid_type_error: 'Last name must be a string',
		}),
		phone: number({
			required_error: 'Phone number is required',
			invalid_type_error: 'Phone number must be an integer',
		}),
		email: string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		}).email({
			message: 'Invalid email address',
		}),
		password: string({})
			.min(5, 'Password cannot be less than 5 characters')
			.optional(),
	}),
});

export { createUser };
