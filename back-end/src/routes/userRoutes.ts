import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

router.post('/', UserController.createUser);
router.get('/:id', UserController.getUser);

// Add other user-related routes

export default router;
