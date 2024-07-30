import { Router } from 'express';
import { ConversationController } from '../controllers/conversationController';
import verifyToken from '../middleware/verifyToken'; // Import the middleware

const router = Router();

router.get('/', verifyToken, ConversationController.getConversations);
router.get('/:conversationId', verifyToken, ConversationController.getMessages);

export default router;
