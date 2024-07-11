import mongoose, { mongo } from 'mongoose';
import { User, IUser } from './models/User';
import { Post, IPost } from './models/Post';
import { Comment, IComment } from './models/Comment';
import { Message, IMessage } from './models/Message';
import { Notification, INotification } from './models/Notification';
import { Conversation, IConversation } from './models/Conversation';

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Post.deleteMany({}),
            Comment.deleteMany({}),
            Message.deleteMany({}),
            Notification.deleteMany({}),
            Conversation.deleteMany({})
        ]);

        // Create dummy users
        const usersData: Partial<IUser>[] = [];
        for (let i = 0; i < 20; i++) {
            const isAdmin = i === 0; // Make only the first user admin
            usersData.push({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: '$2a$10$OnLPOQpsT/5a68jFl4rwcuI8Xt3vce1kL9Kq/owWrpZBZMddV2CVC', // hashed password
                name: `User ${i}`,
                isAdmin: isAdmin,
                isDeleted: false
            });
        }
        const users = await User.insertMany(usersData);

        // Create conversations and messages
        const conversationsData: Partial<IConversation>[] = [];
        const messagesData: Partial<IMessage>[] = [];

        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                // Create a conversation
                const conversation = await Conversation.create({
                    participants: [users[i]._id, users[j]._id]
                });
                conversationsData.push(conversation);

                // Create messages for the conversation
                for (let k = 0; k < 5; k++) {
                    messagesData.push({
                        conversationId: new mongoose.Types.ObjectId(conversation!._id!.toString()),
                        sender: new mongoose.Types.ObjectId(users[i]!._id!.toString()),
                        content: `Message ${k + 1} from user${i} to user${j}`,
                        date: new Date()
                    });

                    messagesData.push({
                        conversationId: new mongoose.Types.ObjectId(conversation!._id!.toString()),
                        sender: new mongoose.Types.ObjectId(users[j]!._id!.toString()),
                        content: `Message ${k + 1} from user${j} to user${i}`,
                        date: new Date()
                    });
                }
            }
        }

        // Insert conversations and messages
        await Conversation.insertMany(conversationsData);
        const messages = await Message.insertMany(messagesData);

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

export default seedDatabase;
