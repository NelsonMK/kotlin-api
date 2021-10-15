import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config/config';
import tokenTypes from '../config/tokens';
import { TokenModel } from '../db/models/tokens.model';
import { UserModel } from '../db/models/users.model';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';

/**
 * Generate token
 * @param userId
 * @param expires
 * @param type
 * @returns {string}
 */
const generateToken = (
	userId: number,
	expires: any,
	type: string,
	secret = config.jwt.secret
) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};

	return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param token
 * @param userId
 * @param expires
 * @param type
 * @param blacklisted
 * @returns {Promise<Token>}
 */
const saveToken = async (
	token: string,
	userId: number,
	expires: any,
	type: string,
	blacklisted = false
) => {
	return await TokenModel.query().insert({
		token,
		expires,
		type,
		blacklisted,
		userId,
	});
};

/**
 * Verify token and return saved token
 * @param token
 * @param type
 * @returns {Promise<Token>}
 */
//*Add extra validations
const verifyToken = async (token: string, type: string) => {
	const payload = jwt.verify(token, config.jwt.secret);

	const savedToken = await TokenModel.query()
		.findOne({ token, type, userId: payload.sub, blacklisted: false })
		.catch((error) => {
			logger.error(error);
		});

	if (!savedToken) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Request another token');
	}
	return savedToken;
};

/**
 * Generate auth tokens
 * @param user
 * @returns {object}
 */
const generateAuthTokens = async (user: UserModel) => {
	const accessTokenExpires = moment().add(30, 'minutes');
	const accessToken = generateToken(
		user.id,
		accessTokenExpires,
		tokenTypes.ACCESS
	);

	const refreshTokenExpires = moment().add(10, 'days');
	const refreshToken = generateToken(
		user.id,
		refreshTokenExpires,
		tokenTypes.REFRESH
	);
	await saveToken(
		refreshToken,
		user.id,
		refreshTokenExpires,
		tokenTypes.REFRESH
	);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

/**
 * Generate reset password token
 * @param email
 * @returns {string}
 */
const generateResetPasswordToken = async (email: string) => {
	const user = await UserModel.query()
		.findOne({ email: email })
		.catch((error) => {
			logger.error(error);
		});

	if (!user) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			'No user found with this email'
		);
	}

	const expires = moment().add(10, 'minutes');
	const resetPasswordToken = generateToken(
		user.id,
		expires,
		tokenTypes.RESET_PASSWORD
	);
	await saveToken(
		resetPasswordToken,
		user.id,
		expires,
		tokenTypes.RESET_PASSWORD
	);
	return resetPasswordToken;
};
export { verifyToken, generateAuthTokens, generateResetPasswordToken };
