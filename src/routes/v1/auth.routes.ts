import express from 'express';
import {
	forgotPassword,
	getUsers,
	loginUser,
	refreshTokens,
	registerUser,
	resetPassword,
} from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';
import {
	authForgotPassword,
	authLogin,
	authRefreshTokens,
	authRegister,
	authResetPassword,
} from '../../validations/auth.validation';

const router = express.Router();

router.get('/users', getUsers);

router.post('/register', validate(authRegister), registerUser);
router.post('/login', validate(authLogin), loginUser);
router.post('/refresh-tokens', validate(authRefreshTokens), refreshTokens);
router.post('/forgot-password', validate(authForgotPassword), forgotPassword);
router.post('/reset-password', validate(authResetPassword), resetPassword);

export { router as v1Routes };
