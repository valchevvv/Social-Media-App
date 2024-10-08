import { Router } from 'express';
import { UserController } from '../controllers/userController';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post('/register', UserController.createUser);
router.post('/update', verifyToken, UserController.updateUser);
router.get('/login', UserController.loginUser);
router.get('/people-you-know', verifyToken, UserController.getPeopleYouKnow);
router.get('/followers/:username', verifyToken, UserController.getFollowers);
router.get('/following/:username', verifyToken, UserController.getFollowing);
router.get('/contacts', verifyToken, UserController.getContacts);
// router.post('/follow', verifyToken, UserController.followUser);
router.get('/:username', verifyToken, UserController.getUser);

// Add other user-related routes

export default router;
