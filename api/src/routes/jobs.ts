import { Router } from 'express';
import { getJobs, getJob, createJob, getCompanyJobs, applyJob, getUserApplications } from '../controllers/jobs';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', authenticate, requireRole('company'), createJob);
router.get('/company/list', authenticate, requireRole('company'), getCompanyJobs);
router.post('/:id/apply', authenticate, applyJob);
router.get('/applications', authenticate, getUserApplications);

export default router;