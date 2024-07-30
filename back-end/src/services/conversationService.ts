import { Conversation, IConversation } from '../models/Conversation';
import { IMessage, Message } from '../models/Message';
import { ObjectId } from 'mongodb';

export class ConversationService {
    static async getAllConversations(userId: ObjectId): Promise<IConversation[]> {
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

    static async createConversation(participants: ObjectId[]): Promise<IConversation> {
        try {
            const conversation = new Conversation({
            participants
            });
    
            await conversation.save();
            return conversation.populate({
                path: 'participants',
                select: '_id name profilePicture'
            });
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    static async getMessages(conversationId: string): Promise<IMessage[]> {
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

    static async createMessage(conversationId: string, senderId: string, content: string): Promise<IMessage | null> {
        try {
            const message = new Message({
                conversation: conversationId,
                sender: senderId,
                content
            });

            await message.save();

            const savedMessage = await Message.findById(message._id)
                .populate({
                    path: 'sender',
                    select: '_id username name profilePicture'
                })
                .exec();

            return savedMessage;

        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }

    static async getParticipants(conversationId: ObjectId): Promise<ObjectId[]> {
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
