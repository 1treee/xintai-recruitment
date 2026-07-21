import { Router } from 'express';
import { getUserProfile, updateUserProfile, getUserPoints } from '../controllers/users';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/points', authenticate, getUserPoints);

export default router;