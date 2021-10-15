import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import Joi from 'joi';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const validate =
	(schema: object) => (req: Request, res: Response, next: NextFunction) => {
		const validSchema = _.pick(schema, ['params', 'query', 'body']);
		const object = _.pick(req, Object.keys(validSchema));

		const { value, error } = Joi.compile(validSchema)
			.prefs({ errors: { label: 'key' } })
			.validate(object);

		if (error) {
			const errorMessage = error.details
				.map((details) => details.message)
				.join(', ');
			return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
		}

		Object.assign(req, value);
		return next();
	};

export default validate;
