import { Router } from 'express';
import { PostController } from '../controllers/postController';
import verifyToken from '../middleware/verifyToken'; // Import the middleware

const router = Router();

router.post('/', verifyToken, PostController.createPost);
router.post('/like', verifyToken, PostController.likePost);
router.get('/:id', verifyToken, PostController.getPost);
router.delete('/:id', verifyToken, PostController.deletePost);
router.get('/', verifyToken, PostController.getAllPosts);

export default router;
