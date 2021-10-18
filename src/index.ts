import 'reflect-metadata';
import 'newrelic';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
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
import { errorConverter, errorHandler } from './middlewares/error';

const main = async () => {
	const app = express();

	connectDB();

	if (config.env === 'development') {
		app.use(morgan('dev'));
	}

	// set security HTTP headers
	app.use(helmet());

	// parse json request body
	app.use(express.json({ limit: '50mb' }));

	// parse urlencoded request body
	app.use(express.urlencoded({ extended: true, limit: '50mb' }));

	// gzip compression
	app.use(compression());

	// enable cors
	app.use(cors());

	// jwt authentication
	app.use(passport.initialize());
	passport.use('jwt', jwtStrategy);

	useTreblle(app, {
		apiKey: 'MJFMU8h030K3gh0FpDiWaypRlbu7Lyun',
		projectId: 'wK5MpPM9XsLTpTwG',
	});

	// v1 api routes
	app.use('/', router);

	// send back a 404 error for any unknown api request
	app.use((req, res, next) => {
		next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
	});

	// convert error to ApiError, if needed
	app.use(errorConverter);

	// handle error
	app.use(errorHandler);

	app.listen(config.port, () => {
		logger.info(
			`Server running in ${config.env} mode on port ${config.port}`
		);
	});
};

main().catch((error) => {
	logger.error(error);
});
