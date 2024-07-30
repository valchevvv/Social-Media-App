import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ConversationService } from '../services/conversationService';

export class ConversationController {
    static async getConversations(req: Request, res: Response) {
        try {
            const response = await ConversationService.getAllConversations(req.user?._id as ObjectId);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getMessages(req: Request, res: Response) {
        try {

            const conversationId = req.params.conversationId;

            if(!conversationId) {
                throw new Error('Conversation ID is required');
            }
            const response = await ConversationService.getMessages(conversationId);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }
}
