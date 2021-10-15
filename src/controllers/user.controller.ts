import { Request, Response } from 'express';
import * as httpStatus from 'http-status';
import userService from '../services';
import catchAsync from '../utils/CatchAsync';

const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await userService.createUser(req.body);
	res.status(httpStatus.CREATED).send(user);
});

export { createUser };
