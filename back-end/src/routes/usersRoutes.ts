import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

router.post('/register', UserController.createUser);
router.get('/login', UserController.loginUser);
router.get('/:id', UserController.getUser);

// Add other user-related routes

export default router;
