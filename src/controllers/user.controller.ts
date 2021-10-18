import { Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { getUsersService } from '../services/user.service';
import catchAsync from '../utils/CatchAsync';

const getUsers = catchAsync(async (req: Request, res: Response) => {
	const users = await getUsersService();
	res.send(users);
});

export { getUsers };
