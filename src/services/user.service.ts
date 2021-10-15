import * as httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import { UserModel } from '../db/models/users.model';

/**
 * Create a new user
 * @param data
 * @returns {Promise<User>}
 */
const createUser = async (data: any) => {
	const userExists = await UserModel.query()
		.findOne({ email: data.email })
		.catch((error) => {
			logger.error(error);
		});
	if (userExists) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	const savedUser = await UserModel.query()
		.insertAndFetch({
			first_name: data.first_name,
			last_name: data.last_name,
			phone: data.phone,
			email: data.email,
			password: data.password,
		})
		.then((user) => {
			return user;
		});

	return savedUser;
};

/**
 * Get user by id
 * @param id
 * @returns {Promise<User>}
 */
const getUserById = async (userId: number) => {
	return await UserModel.query()
		.findById(userId)
		.then((user) => {
			return user;
		})
		.catch((error) => {
			logger.error(error);
		});
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string) => {
	const user = await UserModel.query()
		.findOne({ email: email })
		.catch((error) => {
			logger.error(error);
		});
	return user;
};

/**
 * Get all users
 * @returns {Promise<User[]>, number}
 */
const getUsers = async () => {
	const users = await UserModel.query()
		//.allowGraph('tokens')
		//.withGraphFetched('tokens')
		.catch((error) => {
			logger.error(error);
		});

	return users;
};

/**
 * Update user by id
 * @param userId
 * @param updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: number, updateBody: any) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	const savedUser = await UserModel.query()
		.where('email', updateBody.email)
		.whereNot('id', userId);

	if (updateBody.email && savedUser) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	Object.assign(user, updateBody);
	await user.$query().update();
	return user;
};

/**
 *
 * @param userId
 * @param password
 * @returns {Promise<User>}
 */
const updatePasswordById = async (userId: number, password: string) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	Object.assign(user, password);
	await user
		.$query()
		.patchAndFetch({ password: password })
		.catch((error) => {
			logger.error(error);
		});
	return user;
};

/**
 * Delete user by id
 * @param userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: number) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user
		.$query()
		.delete()
		.catch((error) => {
			logger.error(error);
		});
	return user;
};

export {
	createUser as createUserService,
	getUserById as getUserByIdService,
	getUserByEmail as getUserByEmailService,
	getUsers as getUsersService,
	updateUserById as updateUserByIdService,
	updatePasswordById as updatePasswordByIdService,
	deleteUserById as deleteUserByIdService,
};
