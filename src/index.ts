import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
const { useTreblle } = require('treblle');
import router from './routes';
import logger from './utils/logger';
import config from './config/config';
import morgan from 'morgan';
import jwtStrategy from './config/passport';
import ApiError from './utils/ApiError';
import httpStatus from 'http-status';
import connectDB from './db/db';

const main = async () => {
	const app = express();

	connectDB();

	if (config.env === 'development') {
		app.use(morgan('dev'));
	}

	app.use(cors());

	app.use(passport.initialize());
	passport.use('jwt', jwtStrategy);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	/*useTreblle(app, {
		apiKey: 'MJFMU8h030K3gh0FpDiWaypRlbu7Lyun',
		projectId: 'wK5MpPM9XsLTpTwG',
	});*/

	app.use('/', router);

	app.use((req, res, next) => {
		next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
	});

	app.listen(config.port, () => {
		logger.info(
			`Server running in ${config.env} mode on port ${config.port}`
		);
	});
};

main().catch((error) => {
	logger.error(error);
});
