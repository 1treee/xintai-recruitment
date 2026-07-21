import { Router } from 'express';
import { getCategories, getPosts, getPost, createPost, getComments, createComment, likePost, likeComment } from '../controllers/forum';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/categories', getCategories);
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.post('/posts', authenticate, createPost);
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', authenticate, createComment);
router.post('/posts/:id/like', authenticate, likePost);
router.post('/comments/:id/like', authenticate, likeComment);

export default router;