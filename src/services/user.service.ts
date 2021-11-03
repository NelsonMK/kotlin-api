import * as httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { UserModel } from '../db/models/users.model';
import { raw } from 'objection';

/**
 * Create a new user
 * @param data
 * @returns {Promise<User>}
 */
const createUser = async (data: any) => {
	if (await getUserByPhone(data.phone)) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'Phone number already taken'
		);
	}

	if (await getUserByEmail(data.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	const savedUser = await UserModel.query().insertAndFetch({
		first_name: data.first_name,
		last_name: data.last_name,
		phone: data.phone,
		email: data.email,
		password: data.password,
	});

	return savedUser;
};

/**
 * Get user by id
 * @param id
 * @returns {Promise<User>}
 */
const getUserById = async (userId: number) => {
	return await UserModel.query().findById(userId);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<UserModel>}
 */
const getUserByEmail = async (email: string) => {
	return await UserModel.query().findOne({ email });
};

/**
 *
 * @param phone
 * @returns {Promise<UserModel>}
 */
const getUserByPhone = async (phone: number) => {
	return await UserModel.query().findOne({ phone });
};

/**
 * Get all users
 * @returns {Promise<UserModel[]>, number}
 */
const getUsers = async () => {
	return await UserModel.query();
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

	const userPhone = await UserModel.query()
		.where(raw('id != ?', userId))
		.where('phone', updateBody.phone);

	console.log(userPhone);

	const isPhoneTaken = !!userPhone;

	console.log(isPhoneTaken);

	if (updateBody.phone && userPhone) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'Phone number already taken'
		);
	}

	if (
		updateBody.email &&
		(await !!UserModel.query()
			.where(raw('id != ?', userId))
			.where('email', updateBody.email))
	) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	Object.assign(user, updateBody);
	user.$omit('password');
	console.log(user);
	await user.$query().update();
	return user;
};

/**
 * Delete user by id
 * @param userId
 * @returns {Promise<Number>}
 */
const deleteUserById = async (userId: number) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	const affected = await user.$query().delete();
	return affected;
};

export {
	createUser as createUserService,
	getUserById as getUserByIdService,
	getUserByEmail as getUserByEmailService,
	getUsers as getUsersService,
	updateUserById as updateUserByIdService,
	deleteUserById as deleteUserByIdService,
};
