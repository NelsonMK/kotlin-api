import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { roleRights } from '../config/roles';
import ApiError from '../utils/ApiError';

//*Add user rights in the db for easier auth
const verifyCallback =
	(req: Request, resolve: any, reject: any, requiredRights: any) =>
	(err: any, user: any, info: any) => {
		console.log({ err, info });
		if (err || info || !user) {
			return reject(
				new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access')
			);
		}

		req.user = user;

		if (requiredRights.length) {
			const userRights = roleRights.get(user.role);
			const hasRequiredRights = requiredRights.every(
				(requiredRight: any) => userRights.includes(requiredRight)
			);
			if (!hasRequiredRights) {
				return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
			}
		}

		resolve();
	};

const auth =
	(...requiredRights: any) =>
	(req: Request, res: Response, next: NextFunction) => {
		return new Promise((resolve, reject) => {
			passport.authenticate(
				'jwt',
				{ session: false },
				verifyCallback(req, resolve, reject, requiredRights)
			)(req, res, next);
		})
			.then(() => {
				return next();
			})
			.catch((err) => {
				return next(err);
			});
	};

export default auth;
