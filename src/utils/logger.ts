import winston from 'winston';
import path from 'path';
import fs from 'fs';
import winstonDaily from 'winston-daily-rotate-file';
import config from '../config/config';

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

// const logger = winston.createLogger({
// 	level: config.env === 'development' ? 'debug' : 'info',
// 	format: winston.format.combine(
// 		enumerateErrorFormat(),
// 		config.env === 'development'
// 			? winston.format.colorize()
// 			: winston.format.uncolorize(),
// 		//winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
// 		winston.format.splat(),
// 		winston.format.printf(({ level, message }) => `${level}: ${message}`)
// 	),
// 	transports: [
// 		new winston.transports.Console({
// 			stderrLevels: ['error'],
// 		}),
// 		/*new winston.transports.File({
// 			filename: '',
// 		}),*/
// 	],
// });

const logDir: string = path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const logFormat = winston.format.printf(
	({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const logger = winston.createLogger({
	level: config.env === 'development' ? 'debug' : 'info',
	format: winston.format.combine(
		enumerateErrorFormat(),
		config.env === 'development'
			? winston.format.colorize()
			: winston.format.uncolorize(),
		winston.format.timestamp({
			format: 'YYYY-MM-DD hh:mm:ss',
		}),
		logFormat
	),
	transports: [
		//debug log setting
		new winstonDaily({
			level: 'debug',
			datePattern: 'YYYY-MM-DD',
			dirname: logDir + '/debug',
			filename: `%DATE%.log`,
			maxFiles: 30,
			json: false,
			zippedArchive: true,
		}),

		// error log setting
		new winstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: logDir + '/error',
			filename: `%DATE%.log`,
			maxFiles: 30,
			handleExceptions: true,
			json: false,
			zippedArchive: true,
		}),
	],
});

logger.add(
	new winston.transports.Console({
		format: winston.format.combine(
			winston.format.splat(),
			winston.format.colorize()
		),
	})
);

export default logger;
