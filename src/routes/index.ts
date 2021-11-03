import express from 'express';
import { authRoutes } from './v1/auth.routes';
import { userRoutes } from './v1/user.routes';

const router = express.Router();

const defaultRoutes = [
	{
		path: '/api/v1/auth',
		route: authRoutes,
	},
	{
		path: '/api/v1/users',
		route: userRoutes,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
