import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const validate =
	(schema: any) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validate({
				body: req.body,
				query: req.query,
				params: req.params,
				headers: req.headers,
			});
			return next();
		} catch (err: any) {
			//return next(err);
			return res
				.status(httpStatus.BAD_REQUEST)
				.json({ type: err.name, message: err.message });
		}
	};

export { validate as validateYup };
