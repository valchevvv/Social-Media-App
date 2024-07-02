import { Router } from 'express';
import { PostController } from '../controllers/postController';
import verifyToken from '../middleware/verifyToken'; // Import the middleware

const router = Router();

router.post('/', verifyToken, PostController.createPost);
router.get('/:id', verifyToken, PostController.getPost);
router.put('/:id', verifyToken, PostController.updatePost);
router.delete('/:id', verifyToken, PostController.deletePost);
router.get('/', verifyToken, PostController.getAllPosts);

export default router;
