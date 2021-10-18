import logger from './logger';

const stream = {
	write: (message: string) => {
		logger.info(message.substring(0, message.lastIndexOf('\n')));
	},
};

export { stream };
