import { Conversation, IConversation } from '../models/Conversation';
import { User } from '../models/User';
import { IMessage, Message } from '../models/Message';
import { ObjectId } from 'mongodb';

export class ConversationService {
    static async getAllConversations(userId: ObjectId): Promise<IConversation[]> {
        console.log('Fetching conversations for user:', userId);

        try {
            const conversations = await Conversation.find({
                participants: { $in: [userId] }
            })
            .populate({
                path: 'participants',
                select: '_id name profilePicture'
            })
            .populate({
                path: 'lastMessage',
                select: 'content sender',
                populate: {
                    path: 'sender',
                    select: '_id name profilePicture'
                }
            })
            .exec();

            return conversations;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    static async getMessages(conversationId: ObjectId): Promise<IMessage[]> {
        console.log('Fetching messages for conversation:', conversationId);
    
        try {
            const messages = await Message.find({
                conversation: conversationId
            })
            .populate({
                path: 'sender',
                select: '_id username name profilePicture'
            })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .exec();
    
            return messages;
    
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }
}