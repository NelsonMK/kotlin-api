import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as _ from 'lodash';
import {
	loginService,
	refreshAuthService,
	resetPasswordService,
} from '../services/auth.service';
import {
	generateAuthTokens,
	generateResetPasswordToken,
} from '../services/token.service';
import { createUserService, getUsersService } from '../services/user.service';
import catchAsync from '../utils/CatchAsync';

const register = catchAsync(async (req: Request, res: Response) => {
	const user = await createUserService(req.body);
	const tokens = await generateAuthTokens(user);

	res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await loginService(email, password);
	const tokens = await generateAuthTokens(user);
	res.json({ user, tokens });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
	const tokens = await refreshAuthService(req.body.refreshToken);
	res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	console.log(req.body.email);
	const resetPasswordToken = await generateResetPasswordToken(req.body.email);
	res.status(httpStatus.CREATED).send(resetPasswordToken);
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const response = await resetPasswordService(
		req.body.token,
		req.body.password
	);
	res.status(httpStatus.CREATED).send({ affected: response });
});

const users = catchAsync(async (req: Request, res: Response) => {
	const response = await getUsersService();
	res.send(response);
});

export {
	register as registerUser,
	login as loginUser,
	refreshTokens,
	forgotPassword,
	resetPassword,
	users as getUsers,
};
