import express from 'express';
import { getUsers, updateUser } from '../../controllers/user.controller';
import auth from '../../middlewares/auth';
import {
	createUser,
	updateUserSchema,
} from '../../validations/user.validation';
import { registerUser } from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';
import { validateYup } from '../../middlewares/validates';

const router = express.Router();

router.get('/getUsers', auth('getUsers'), getUsers);
router.post('/createUser', validate(createUser), registerUser);
router.post(
	'/update',
	validateYup(updateUserSchema),
	auth('updateUser'),
	updateUser
);

export { router as userRoutes };
