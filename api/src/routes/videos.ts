import { Router } from 'express';
import { getVideos, getVideo, createVideo, likeVideo, getRecommendedVideos } from '../controllers/videos';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getVideos);
router.get('/:id', getVideo);
router.post('/', authenticate, createVideo);
router.post('/like', authenticate, likeVideo);
router.get('/recommended', authenticate, getRecommendedVideos);

export default router;