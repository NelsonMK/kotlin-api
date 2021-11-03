import { Request, Response } from 'express';
import * as httpStatus from 'http-status';
import {
	getUsersService,
	updateUserByIdService,
} from '../services/user.service';
import catchAsync from '../utils/CatchAsync';
import { UserModel } from '../db/models/users.model';

const getUsers = catchAsync(async (req: Request, res: Response) => {
	const users = await getUsersService();
	res.send(users);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
	const user: UserModel | any = req.user;
	const updatedUser = await updateUserByIdService(user.id, req.body);
	res.send(updatedUser);
});

export { getUsers, updateUser };
