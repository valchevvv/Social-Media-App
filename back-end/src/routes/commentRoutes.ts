import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post('/', verifyToken, CommentController.createComment);
router.get('/:id', verifyToken, CommentController.getComment);
router.delete('/:id', verifyToken, CommentController.deleteComment);
router.get('/post/:postId', verifyToken, CommentController.getCommentsByPost);

export default router;
