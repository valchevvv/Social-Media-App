import { Router } from 'express';
import { UserController } from '../controllers/userController';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post('/register', UserController.createUser);
router.get('/login', UserController.loginUser);
router.get('/:username', verifyToken, UserController.getUser);

// Add other user-related routes

export default router;
