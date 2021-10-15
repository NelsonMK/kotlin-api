import express from 'express';
import { v1Routes } from './v1/auth.routes';
import { userRoutes } from './v1/user.routes';

const router = express.Router();

const defaultRoutes = [
	{
		path: '/v1/auth',
		route: v1Routes,
	},
	{
		path: '/v1/users',
		route: userRoutes,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
