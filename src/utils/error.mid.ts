import { Request, Response, NextFunction } from 'express';
import ApiError from './ApiError';

export const errorHandler = (
	error: ApiError,
	request: Request,
	response: Response,
	next: NextFunction
) => {
	const status = error.statusCode || 500;

	response.status(status).json(error);
};
