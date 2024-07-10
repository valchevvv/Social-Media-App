import mongoose from 'mongoose';
import { User, IUser } from './models/User';
import { Post, IPost } from './models/Post';
import { Comment, IComment } from './models/Comment';
import { Message, IMessage } from './models/Message';
import { Notification, INotification } from './models/Notification';

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Post.deleteMany({}),
            Comment.deleteMany({}),
            Message.deleteMany({}),
            Notification.deleteMany({})
        ]);

        // Create dummy users
        const usersData: Partial<IUser>[] = [];
        for (let i = 0; i < 20; i++) {
            const isAdmin = i === 0 ? true : false; // Make only the first user admin
            usersData.push({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: '$2a$10$OnLPOQpsT/5a68jFl4rwcuI8Xt3vce1kL9Kq/owWrpZBZMddV2CVC', // hashed password
                name: `User ${i}`,
                isAdmin: isAdmin
            });
        }
        const users = await User.insertMany(usersData);

        // Create dummy posts
        const postsData: Partial<IPost>[] = [];
        for (let i = 0; i < 50; i++) {
            const postAuthor = users[i % users.length];
            const likes: mongoose.Types.ObjectId[] = []; // Assuming you have logic to populate this
            const comments = []; // This will now be populated after the post is created

            // Create the post first to get a post ID
            const post = await Post.create({
                author: postAuthor._id as mongoose.Types.ObjectId,
                content: `This is post number ${i}`,
                image: 'https://i.imgur.com/OBB7tLg.gif',
                likes: likes as mongoose.Types.ObjectId[],
                // Initially, do not include comments
            });

            // Simulate random comments on the post
            const numOfComments = Math.floor(Math.random() * 10); // Random number of comments
            for (let k = 0; k < numOfComments; k++) {
                const commentAuthor = users[k % users.length];
                const comment = await Comment.create({
                    author: commentAuthor._id,
                    post: post._id, // Use the post ID here
                    content: `Comment ${k + 1} on post ${i}`
                });
                comments.push(comment._id);
            }

            // Now that comments are created with the post ID, you can optionally update the post to include these comment IDs
            // This step is optional and depends on if your Post schema requires it
            await Post.findByIdAndUpdate(post._id, { $set: { comments: comments } });

            postsData.push({
                author: postAuthor._id as mongoose.Types.ObjectId,
                content: `This is post number ${i}`,
                image: 'https://i.imgur.com/OBB7tLg.gif',
                likes: likes as mongoose.Types.ObjectId[],
                comments: comments as mongoose.Types.ObjectId[]
            });
        }
        const posts = await Post.insertMany(postsData);

        // Update comments to associate them with their respective posts
        for (let i = 0; i < posts.length; i++) {
            const postId = posts[i]._id;
            const postComments = postsData[i].comments as mongoose.Types.ObjectId[];
            await Comment.updateMany({ _id: { $in: postComments } }, { post: postId });
        }

        // Create dummy messages
        const messagesData: Partial<IMessage>[] = [];
        for (let i = 0; i < 100; i++) {
            messagesData.push({
                sender: users[i % users.length]._id as mongoose.Types.ObjectId,
                receiver: users[(i + 1) % users.length]._id as mongoose.Types.ObjectId,
                content: `This is message number ${i}`
            });
        }
        const messages = await Message.insertMany(messagesData);

        // Create dummy notifications
        const notificationsData: Partial<INotification>[] = [];
        for (let i = 0; i < 100; i++) {
            notificationsData.push({
                user: users[i % users.length]._id as mongoose.Types.ObjectId,
                type: 'message',
                message: `Notification number ${i}`,
                isRead: false
            });
        }
        const notifications = await Notification.insertMany(notificationsData);

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

export default seedDatabase;