import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { ObjectID } from 'typeorm';
import { User } from '../entity/User';
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
		sub: string | number | Date | ObjectID | undefined;
	},
	done: (arg0: unknown, arg1: boolean | User) => void
) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new Error('Invalid token type');
		}
		const user = await User.findOne(payload.sub)
			.then((user) => {
				return user;
			})
			.catch((error) => {
				logger.error(error);
				done(error, false);
			});
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
