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
        for (let i = 0; i < 10; i++) {
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

        // Create dummy posts and comments
        const postsData: Partial<IPost>[] = [];
        const commentsData: Partial<IComment>[] = [];

        // Create posts and comments for each user
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < 2; j++) { // Create 5 posts per user
                const post = await Post.create({
                    author: users[i]._id,
                    content: `Post ${j + 1} from user${i}`,
                    image: 'https://via.placeholder.com/150',
                    likes: [],
                    comments: []
                });
                postsData.push(post);

                // Create comments for the post
                for (let k = 0; k < 3; k++) { // Create 3 comments per post
                    const comment = await Comment.create({
                        author: users[(i + k + 1) % users.length]._id,
                        post: post._id,
                        content: `Comment ${k + 1} on post ${post._id} by user ${(i + k + 1) % users.length}`
                    });
                    commentsData.push(comment);

                    // Update post with comments
                    post.comments.push(new mongoose.Types.ObjectId(comment!._id!.toString()));
                    await post.save();
                }
            }
        }

        // Create dummy notifications
        const notificationsData: Partial<INotification>[] = [];
        for (let i = 0; i < users.length; i++) {
            notificationsData.push({
                user: new mongoose.Types.ObjectId(users[i]!._id!.toString()),
                type: 'like',
                message: `Notification ${i + 1}`,
                isRead: false
            });
        }
        const notifications = await Notification.insertMany(notificationsData);

        // Create conversations and messages
        const conversationsData: Partial<IConversation>[] = [];
        const messagesData: Partial<IMessage>[] = [];

        // Create conversations and messages between users
        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                const conversation = await Conversation.create({
                    participants: [users[i]._id, users[j]._id]
                });
                conversationsData.push(conversation);

                // Create messages for the conversation
                for (let k = 0; k < 5; k++) {
                    messagesData.push({
                        conversation: new mongoose.Types.ObjectId(conversation!._id!.toString()),
                        sender: new mongoose.Types.ObjectId(users[i]!._id!.toString()),
                        content: `Message ${k + 1} from user${i} to user${j}`,
                        date: new Date()
                    });

                    messagesData.push({
                        conversation: new mongoose.Types.ObjectId(conversation!._id!.toString()),
                        sender: new mongoose.Types.ObjectId(users[j]!._id!.toString()),
                        content: `Message ${k + 1} from user${j} to user${i}`,
                        date: new Date()
                    });
                }
            }
        }

        // Insert posts, comments, conversations, and messages
        await Post.insertMany(postsData);
        await Comment.insertMany(commentsData);
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
