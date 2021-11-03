import httpStatus from 'http-status';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { AdminModel } from '../db/models/admin.model';
import { UserModel } from '../db/models/users.model';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import config from './config';
import tokenTypes from './tokens';

const jwtOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (
	payload: {
		type: string;
		sub: string | number | undefined;
	},
	done: (
		arg0: unknown,
		arg1: boolean | UserModel | AdminModel,
		arg3?: any
	) => void
) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
		}

		const user = await UserModel.query().findById(Number(payload.sub));

		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false, { message: 'Server error' });
	}
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
