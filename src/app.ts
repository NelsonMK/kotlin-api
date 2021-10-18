import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config/config';
import connectDB from './db/db';
import logger from './utils/logger';
import { stream } from './utils/stream';
import helmet from 'helmet';
import compression from 'compression';
import router from './routes';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import httpStatus from 'http-status';
import passport from 'passport';
import jwtStrategy from './config/passport';

class App {
	public app: express.Application;
	public port: string | number;
	public env: string;

	constructor() {
		this.app = express();
		this.port = config.port;
		this.env = config.env;

		this.connectToDataBase();
		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () => {
			logger.info(
				`Server running in ${config.env} mode on port ${config.port}`
			);
		});
	}

	public getServer() {
		return this.app;
	}

	private async connectToDataBase() {
		await connectDB();
	}

	private initializeMiddlewares() {
		let format = 'dev';
		let origin = 'true';

		if (config.env !== 'development' || 'test') {
			format = 'combined';
			origin = 'https://zigocouriers.com';
		}

		this.app.use(morgan(format, { stream: stream }));

		// enable cors
		this.app.use(cors({ origin: origin, credentials: true }));

		// set security HTTP headers
		this.app.use(helmet());

		// gzip compression
		this.app.use(compression());

		// parse json request body
		this.app.use(express.json());

		// parse urlencoded request body
		this.app.use(express.urlencoded({ extended: true }));

		// jwt authentication
		this.app.use(passport.initialize());
		passport.use('jwt', jwtStrategy);
	}

	private initializeRoutes() {
		// v1 api routes
		this.app.use('/', router);
	}

	private initializeErrorHandling() {
		// send back a 404 error for any unknown api request
		this.app.use((req, res, next) => {
			next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
		});

		// convert error to ApiError, if needed
		this.app.use(errorConverter);

		// handle error
		this.app.use(errorHandler);
	}
}

export default App;
