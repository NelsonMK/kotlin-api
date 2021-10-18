import { NextFunction, Request, Response } from 'express';
import logger from './logger';

const catchAsync =
	(fn: (arg0: any, arg1: any, arg2: any) => any) =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((error) => {
			logger.error(error);
			return next(error);
		});
	};

export default catchAsync;
