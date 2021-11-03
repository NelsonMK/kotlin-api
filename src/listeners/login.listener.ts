import events from 'events';
import tokenTypes from '../config/tokens';
import { TokenModel } from '../db/models/tokens.model';

const emitter = new events.EventEmitter();

emitter.on('loggedIn', async (data: any) => {
	await TokenModel.query()
		.where({ user_id: data.id, type: tokenTypes.REFRESH })
		.delete();
	//console.log(data);
});

export { emitter as loginEmitter };
