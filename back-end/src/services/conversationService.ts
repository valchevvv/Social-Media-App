import { Conversation, IConversation } from '../models/Conversation';
import { IMessage, Message } from '../models/Message';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IConversationWithLastMessage {
    _id: ObjectId;
    participants: Array<{
        _id: ObjectId;
        name: string;
        profilePicture: string;
    }>;
    lastMessage?: IMessage;
}

export class ConversationService {
    static async getAllConversations(userId: ObjectId): Promise<IConversationWithLastMessage[]> {
        try {
            const conversations = await Conversation.find({
                participants: { $in: [userId] }
            })
            .populate({
                path: 'participants',
                select: '_id name profilePicture'
            })
            .exec();

            const conversationsWithLastMessage: IConversationWithLastMessage[] = [];

            for (const conversation of conversations) {
                const populatedParticipants = (conversation.participants as any[]).map(p => ({
                    _id: p._id,
                    name: p.name,
                    profilePicture: p.profilePicture
                }));

                const lastMessage = await Message.findOne({
                    conversation: conversation._id
                })
                .sort({ date: -1 })
                .populate({
                    path: 'sender',
                    select: '_id name profilePicture'
                })
                .exec();

                const conversationWithLastMessage: IConversationWithLastMessage = {
                    _id: conversation._id as ObjectId,
                    participants: populatedParticipants,
                    lastMessage: lastMessage || undefined
                };

                conversationsWithLastMessage.push(conversationWithLastMessage);
            }

            return conversationsWithLastMessage;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    static async createConversation(participants: ObjectId[]): Promise<IConversation> {
        try {
            const conversation = new Conversation({ participants });
            await conversation.save();

            // Fetch the created conversation with populated participants
            const populatedConversation = await Conversation.findById(conversation._id)
                .populate({
                    path: 'participants',
                    select: '_id name profilePicture'
                })
                .exec();

            if (!populatedConversation) {
                throw new Error('Created conversation not found');
            }

            return populatedConversation as IConversation;
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
                select: '_id name profilePicture'
            })
            .sort({ date: -1 })
            .exec();

            return messages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    static async createMessage(conversationId: string, senderId: string, content: string, image?: string): Promise<IMessage | null> {
        try {
            const message = new Message({
                conversation: conversationId,
                sender: senderId,
                content,
                image
            });

            await message.save();

            return await Message.findById(message._id)
                .populate({
                    path: 'sender',
                    select: '_id name profilePicture'
                })
                .exec();
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
                    select: '_id'
                })
                .exec();

            return conversation?.participants.map(p => p._id) || [];
        } catch (error) {
            console.error('Error fetching participants:', error);
            throw error;
        }
    }
}
