import httpStatus from 'http-status';
import * as bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError';
import { getUserByIdService, updatePasswordByIdService } from './user.service';
import logger from '../utils/logger';
import { generateAuthTokens, verifyToken } from './token.service';
import tokenTypes from '../config/tokens';
import { TokenModel } from '../db/models/tokens.model';
import { UserModel } from '../db/models/users.model';

/**
 * Login with email and password
 * @param email
 * @param password
 * @returns {Promise<User>}
 */
const login = async (email: string, password: string) => {
	const user = await UserModel.query()
		.findOne({ email: email })
		.catch((error) => {
			logger.error(error);
		});

	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email/password');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email/password1');
	}

	return user;
};

/**
 *
 * @param refreshToken
 */
const logout = async (refreshToken: string) => {
	const token = await TokenModel.query()
		.findOne({
			token: refreshToken,
			type: tokenTypes.REFRESH,
			blacklisted: false,
		})
		.catch((error) => {
			logger.error(error);
		});

	if (!token) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await token.$query().delete();
};

/**
 * Refresh auth tokens
 * @param refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string) => {
	try {
		const token = await verifyToken(refreshToken, tokenTypes.REFRESH);
		logger.info({ savedToken: token });
		const user = await getUserByIdService(token.userId);
		if (!user) {
			throw new Error();
		}
		await token
			.$query()
			.delete()
			.catch((error) => {
				logger.error(error);
			});
		return await generateAuthTokens(user);
	} catch (error) {
		logger.error(error);
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
	}
};

/**
 * Reset password
 * @param resetPasswordToken
 * @param newPassword
 */
const resetPassword = async (
	resetPasswordToken: string,
	newPassword: string
) => {
	try {
		const resetToken = await verifyToken(
			resetPasswordToken,
			tokenTypes.RESET_PASSWORD
		);
		const user = await getUserByIdService(resetToken.userId);

		if (!user) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				'This account doesn`t exist'
			);
		}

		const { id } = user;

		await updatePasswordByIdService(user.id, newPassword);
		const res = await TokenModel.query()
			.findOne({ userId: id, type: tokenTypes.RESET_PASSWORD })
			.delete()
			.catch((error) => {
				logger.error(error);
			});
		return res;
	} catch (error) {
		logger.error(error);
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
	}
};

export {
	login as loginService,
	logout as logoutService,
	refreshAuth as refreshAuthService,
	resetPassword as resetPasswordService,
};
