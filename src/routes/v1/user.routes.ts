import express from 'express';
import { getUsers } from '../../controllers/user.controller';
import auth from '../../middlewares/auth';
import { createUser } from '../../validations/user.validation';
import { registerUser } from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';

const router = express.Router();

router.get('/getUsers', auth('getUsers'), getUsers);
router.post('/createUser', validate(createUser), registerUser);

export { router as userRoutes };
