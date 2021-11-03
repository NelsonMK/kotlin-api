import * as Joi from 'joi';
import * as Yup from 'yup';
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

// const updateUser = {
// 	headers: Joi.object()
// 		.keys({
// 			authorization: Joi.string()
// 				.required()
// 				.label('Authorization is required'),
// 		})
// 		.options({ allowUnknown: true }),
// 	body: Joi.object().keys({
// 		first_name: Joi.string().optional(),
// 		last_name: Joi.string().optional(),
// 		phone: Joi.string().optional(),
// 		email: Joi.string().optional().email(),
// 		//password: Joi.string().optional().custom(password),
// 	}),
// };

const updateUser = Yup.object({
	headers: Yup.object({
		authorization: Yup.string().required('Authorization is required'),
	}),
	body: Yup.object({
		first_name: Yup.string().required('First name is required'),
		last_name: Yup.string().required('Last name is required'),
		phone: Yup.string().optional(),
		email: Yup.string().email().optional(),
	})
		.noUnknown(true)
		.strict(true),
});

export { createUser, updateUser as updateUserSchema };
