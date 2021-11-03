import express from 'express';
import {
	forgotPassword,
	getUsers,
	loginUser,
	refreshAccessToken,
	refreshTokens,
	registerUser,
	resetPassword,
} from '../../controllers/auth.controller';
import { authLimiter } from '../../middlewares/rateLimiter';
import validate from '../../middlewares/validate';
import {
	authForgotPassword,
	authLogin,
	authRefreshAccessToken,
	authRefreshTokens,
	authRegister,
	authResetPassword,
} from '../../validations/auth.validation';

const router = express.Router();

router.use(authLimiter);

router.get('/users', getUsers);

router.post('/register', validate(authRegister), registerUser);
router.post('/login', validate(authLogin), loginUser);
router.post('/refresh-tokens', validate(authRefreshTokens), refreshTokens);
router.post(
	'/refresh-access-token',
	validate(authRefreshAccessToken),
	refreshAccessToken
);
router.post('/forgot-password', validate(authForgotPassword), forgotPassword);
router.post('/reset-password', validate(authResetPassword), resetPassword);

export { router as authRoutes };
