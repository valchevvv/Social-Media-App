import mongoose from 'mongoose';
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
        for (let i = 0; i < 100; i++) {
            if(i === 0) {
                usersData.push({
                    username: `valchevvv`,
                    email: `dvalchevvv@gmail.com`,
                    password: '$2a$10$vT6yqvOQ51L8PY7V7fa9y.A5LY29H0QdEzv.m9/8RuRQ6EgFb55yW', // hashed password
                    name: `Daniel Valchev`,
                    isAdmin: true,
                    profilePicture: 'https://res.cloudinary.com/djrpo8a5y/image/upload/v1721982378/ybd5bgckkx5rmtcqoqge.png'
                });
            }
            usersData.push({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: '$2a$10$OnLPOQpsT/5a68jFl4rwcuI8Xt3vce1kL9Kq/owWrpZBZMddV2CVC', // hashed password
                name: `User ${i}`,
                isAdmin: false
            });
        }
        const users = await User.insertMany(usersData);

        // Create dummy posts
        const postsData: Partial<IPost>[] = [];

        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < 100; j++) { // Create 2 posts per user
                const post = {
                    author: users[i]._id,
                    content: `Post ${j + 1} from user${i}`,
                    image: 'https://i.imgur.com/RwzdsYi.jpeg',
                    likes: [],
                    createdAt: new Date()
                } as Partial<IPost>;

                postsData.push(post);
            }
        }
        const posts = await Post.insertMany(postsData);

        // Create dummy comments
        const commentsData: Partial<IComment>[] = [];

        for (let i = 0; i < posts.length; i++) {
            for (let k = 0; k < 3; k++) { // Create 3 comments per post
                const comment = {
                    author: users[(i + k + 1) % users.length]._id,
                    post: posts[i]._id,
                    content: `Comment ${k + 1} on post ${posts[i]._id} by user ${(i + k + 1) % users.length}`,
                    createdAt: new Date()
                } as Partial<IComment>;

                commentsData.push(comment);
            }
        }
        await Comment.insertMany(commentsData);

        // Create dummy notifications
        const notificationsData: Partial<INotification>[] = [];
        for (let i = 0; i < users.length; i++) {
            notificationsData.push({
                user: new mongoose.Types.ObjectId(users[i]!._id!.toString()),
                type: 'like',
                message: `Notification ${i + 1}`,
                isRead: false,
                createdAt: new Date()
            });
        }
        await Notification.insertMany(notificationsData);

        // Create conversations and messages
        const conversationsData: Partial<IConversation>[] = [];
        const messagesData: Partial<IMessage>[] = [];

        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                const conversation = {
                    participants: [users[i]._id, users[j]._id],
                    createdAt: new Date()
                } as Partial<IConversation>;

                const newConversation = await Conversation.create(conversation);
                conversationsData.push(newConversation);

                for (let k = 0; k < 5; k++) {
                    messagesData.push({
                        conversation: new mongoose.Types.ObjectId(newConversation!.id!.toString()),
                        sender: new mongoose.Types.ObjectId(users[i]!._id!.toString()),
                        content: `Message ${k + 1} from user${i} to user${j}`,
                        date: new Date()
                    });

                    messagesData.push({
                        conversation: new mongoose.Types.ObjectId(newConversation!.id!.toString()),
                        sender: new mongoose.Types.ObjectId(users[j]!._id!.toString()),
                        content: `Message ${k + 1} from user${j} to user${i}`,
                        date: new Date()
                    });
                }
            }
        }
        await Message.insertMany(messagesData);

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

export default seedDatabase;
