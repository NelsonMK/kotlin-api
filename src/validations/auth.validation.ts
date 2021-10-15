import * as Joi from 'joi';
import { password } from './custom.validation';

const register = {
	body: Joi.object().keys({
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
	}),
};

const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
	}),
};

const resetPassword = {
	body: Joi.object().keys({
		token: Joi.string().required(),
		password: Joi.string().required().custom(password),
	}),
};

export {
	register as authRegister,
	login as authLogin,
	refreshTokens as authRefreshTokens,
	forgotPassword as authForgotPassword,
	resetPassword as authResetPassword,
};
