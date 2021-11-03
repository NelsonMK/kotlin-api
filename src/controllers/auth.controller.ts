import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import {
	loginService,
	refreshAccessTokenService,
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

	res.status(httpStatus.CREATED).send({
		error: false,
		message: 'Registration successful',
		data: { user },
	});
});

const login = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await loginService(email, password);
	const tokens = await generateAuthTokens(user);

	res.json({
		error: false,
		message: 'Login successful',
		data: { user, tokens },
	});
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
	const tokens = await refreshAuthService(req.body.refreshToken);
	res.send({ ...tokens });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
	const token = await refreshAccessTokenService(req.body.refreshToken);
	res.send({ token });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const resetPasswordToken = await generateResetPasswordToken(req.body.email);
	res.status(httpStatus.CREATED).send(resetPasswordToken);
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const authHeader: string | any = req.headers['authorization'];
	const token = authHeader.split(' ')[1];
	const response = await resetPasswordService(token, req.body.password);

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
	refreshAccessToken,
	forgotPassword,
	resetPassword,
	users as getUsers,
};
