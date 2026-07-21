import { Router } from 'express';
import { getResumes, getResume, createResume, updateResume, deleteResume, setDefaultResume } from '../controllers/resumes';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getResumes);
router.get('/:id', authenticate, getResume);
router.post('/', authenticate, createResume);
router.put('/:id', authenticate, updateResume);
router.delete('/:id', authenticate, deleteResume);
router.post('/:id/default', authenticate, setDefaultResume);

export default router;