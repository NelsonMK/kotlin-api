import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import {
	generateAccessToken,
	generateAuthTokens,
	verifyToken,
} from './token.service';
import tokenTypes from '../config/tokens';
import { TokenModel } from '../db/models/tokens.model';
import { UserModel } from '../db/models/users.model';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { loginEmitter } from '../listeners/login.listener';

/**
 * Login with email and password
 * @param email
 * @param password
 * @returns {Promise<User>}
 */
const login = async (email: string, password: string): Promise<UserModel> => {
	const user = await UserModel.query().findOne({ email: email });

	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email/password');
	}

	const isMatch = await user.isPasswordMatch(password);

	if (!isMatch) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email/password1');
	}

	loginEmitter.emit('loggedIn', user);

	return user;
};

/**
 * Logout user
 * @param refreshToken
 */
const logout = async (refreshToken: string) => {
	const token = await TokenModel.query().findOne({
		token: refreshToken,
		type: tokenTypes.REFRESH,
		blacklisted: false,
	});

	if (!token) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invalid token');
	}
	await token.$query().delete();
};

/**
 * Refresh auth tokens
 * @param refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string) => {
	const token = await verifyToken(refreshToken, tokenTypes.REFRESH);

	if (!token.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
	}

	await token.$query().delete();

	return await generateAuthTokens(token.user);
};

/**
 * Refresh access token
 * @param refreshToken
 * @returns {Promise<Object>}
 */
const refreshAccessToken = async (refreshToken: string) => {
	const token = await verifyToken(refreshToken, tokenTypes.REFRESH);

	if (!token.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
	}

	return await generateAccessToken(token.user);
};

/**
 * Reset password
 * @param resetPasswordToken
 * @param newPassword
 */
const resetPassword = async (resetPasswordToken: string, password: string) => {
	try {
		const resetToken = await verifyToken(
			resetPasswordToken,
			tokenTypes.RESET_PASSWORD
		);
		const user = resetToken.user;

		if (!user) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				'This account does not exist'
			);
		}

		await user.$query().update({ password: password });

		const res = await TokenModel.query()
			.findOne({ user_id: user.id, type: tokenTypes.RESET_PASSWORD })
			.delete();

		return res;
	} catch (error) {
		console.log(error);
		if (error instanceof TokenExpiredError) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Token expired'); //should come back to this
		} else if (error instanceof JsonWebTokenError) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
		} else {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				'Password reset failed'
			);
		}
	}
};

export {
	login as loginService,
	logout as logoutService,
	refreshAuth as refreshAuthService,
	refreshAccessToken as refreshAccessTokenService,
	resetPassword as resetPasswordService,
};
