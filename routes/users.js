import { Router } from 'express';
import { getCurrentUser, updateProfile } from '../controllers/users.js';
import { userInfoValidator } from '../middlewares/validation.js';

const router = Router();

router.get('/me', getCurrentUser);

router.patch('/me', userInfoValidator, updateProfile);

export default router;
