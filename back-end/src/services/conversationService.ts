import { Conversation, IConversation } from '../models/Conversation';
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

    static async getMessages(conversationId: string): Promise<IMessage[]> {
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

            console.log('Fetched messages:', messages);
    
            return messages;
    
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    static async createMessage(conversationId: string, senderId: string, content: string): Promise<IMessage | null> {
        console.log('Creating message:', content);

        try {
            console.log(conversationId, senderId, content);
            const message = new Message({
                conversation: conversationId,
                sender: senderId,
                content
            });

            await message.save();
            console.log('Message created:', message);

            // Fetch the message to ensure it's saved properly
            const savedMessage = await Message.findById(message._id)
                .populate({
                    path: 'sender',
                    select: '_id username name profilePicture'
                })
                .exec();

            console.log('Saved message:', savedMessage);

            return savedMessage;

        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }

    static async getParticipants(conversationId: ObjectId): Promise<ObjectId[]> {
        console.log('Fetching participants for conversation:', conversationId);
    
        try {
            const conversation = await Conversation.findById(conversationId)
                .populate({
                    path: 'participants',
                    select: '_id username email name profilePicture' // Select the fields you need
                })
                .exec();
    
            return conversation?.participants || [];
        } catch (error) {
            console.error('Error fetching participants:', error);
            throw error;
        }
    }
}
